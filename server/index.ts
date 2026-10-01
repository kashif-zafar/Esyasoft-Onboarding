import 'dotenv/config';

import cors from 'cors';

import express, {
  type Request,
  type Response,
} from 'express';

import {
  clerkMiddleware,
  getAuth,
} from '@clerk/express';

import OpenAI from 'openai';
import { Resend } from 'resend';

import fs from 'node:fs';

import path from 'node:path';

import dns from 'node:dns';
import net from 'node:net';

import {
  fileURLToPath,
} from 'node:url';

import {
  KNOWLEDGE,
} from './knowledge.js';

import {
  cleanAnswer,
} from './formatAnswer.js';

/* =========================================================
   NETWORK TUNING
   Some Windows / VPN / IPv6-broken networks make Node's fetch
   fail with a generic "Connection error". Prefer IPv4 and give
   each connection attempt more time.
   ========================================================= */

try {
  dns.setDefaultResultOrder('ipv4first');
  net.setDefaultAutoSelectFamilyAttemptTimeout?.(2000);
} catch {
  /* older Node versions: ignore */
}

/* =========================================================
   WINDOWS / ESM PATH SETUP
   ========================================================= */

const __filename =
  fileURLToPath(import.meta.url);

const __dirname =
  path.dirname(__filename);

/* =========================================================
   CONFIGURATION
   ========================================================= */

const app = express();

const port =
  Number(
    process.env.PORT || 3001
  );

/*
 * Allowed browser origins.
 *
 * APP_ORIGIN may contain several comma-separated origins
 * (e.g. your custom domain). On Vercel, the production and
 * per-deployment URLs are added automatically.
 */

const allowedOrigins = Array.from(
  new Set(
    [
      ...(process.env.APP_ORIGIN || 'http://localhost:5173')
        .split(',')
        .map((value) => value.trim().replace(/\/$/, '')),

      process.env.VERCEL_PROJECT_PRODUCTION_URL
        ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
        : '',

      process.env.VERCEL_URL
        ? `https://${process.env.VERCEL_URL}`
        : '',
    ].filter(Boolean)
  )
);

const origin = allowedOrigins[0];

/*
 * Weekly PDFs live in server/pdfs. On Vercel the function runs
 * from /var/task, so also look relative to the project root.
 */

const pdfDirs = [
  path.join(__dirname, 'pdfs'),
  path.join(process.cwd(), 'server', 'pdfs'),
];

function resolvePdfPath(week: string): string {
  const file = `week_${week}.pdf`;

  for (const dir of pdfDirs) {
    const candidate = path.join(dir, file);

    if (fs.existsSync(candidate)) {
      return candidate;
    }
  }

  return path.join(pdfDirs[0], file);
}

/* =========================================================
   MIDDLEWARE
   ========================================================= */

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

app.use(
  express.json({
    limit: '1mb',
  })
);

app.use(
  clerkMiddleware({
    authorizedParties:
      allowedOrigins,
  })
);

/* =========================================================
   AUTHENTICATION HELPER
   ========================================================= */

function requireSignedIn(
  req: Request,
  res: Response
) {
  const auth =
    getAuth(req);

  if (!auth.isAuthenticated) {
    res.status(401).json({
      error:
        'Please sign in first.',
    });

    return null;
  }

  return auth;
}

/* =========================================================
   HTML ESCAPE
   ========================================================= */

function escapeHtml(
  value: unknown
): string {
  return String(
    value ?? ''
  )
    .replaceAll(
      '&',
      '&amp;'
    )
    .replaceAll(
      '<',
      '&lt;'
    )
    .replaceAll(
      '>',
      '&gt;'
    )
    .replaceAll(
      '"',
      '&quot;'
    )
    .replaceAll(
      "'",
      '&#039;'
    );
}

/* =========================================================
   GROQ
   ========================================================= */

if (!process.env.GROQ_API_KEY) {
  console.warn(
    'GROQ_API_KEY is not configured. Chatbot requests will fail.'
  );
}

const groq =
  new OpenAI({
    apiKey:
      process.env.GROQ_API_KEY,

    baseURL:
      'https://api.groq.com/openai/v1',

    timeout: 30_000,
    maxRetries: 2,
  });

/* Root cause of a connection failure lives in error.cause (e.g. ENOTFOUND,
   ETIMEDOUT, ECONNRESET, UNABLE_TO_GET_ISSUER_CERT_LOCALLY). */
function connectionCause(error: any): string {
  const c = error?.cause;
  return (
    c?.code ||
    c?.errors?.[0]?.code ||
    c?.message ||
    error?.code ||
    ''
  );
}

/* One-off startup check so the terminal shows WHY the chatbot can't connect. */
if (!process.env.VERCEL && process.env.GROQ_API_KEY) {
  fetch('https://api.groq.com/openai/v1/models', {
    headers: { Authorization: `Bearer ${process.env.GROQ_API_KEY}` },
    signal: AbortSignal.timeout(10_000),
  })
    .then((r) =>
      console.log(
        r.ok
          ? 'Groq connectivity check: OK'
          : `Groq connectivity check: reached Groq but got HTTP ${r.status} (check GROQ_API_KEY)`
      )
    )
    .catch((e: any) => {
      const cause = connectionCause(e) || e?.message || '';

      console.error(
        `Groq connectivity check FAILED: cannot reach api.groq.com (${cause}).`
      );

      if (/SELF_SIGNED|CERT|ISSUER|TLS/i.test(cause)) {
        console.error(
          'A network proxy/antivirus is re-signing HTTPS traffic with its own certificate, ' +
            'and Node does not trust it. Fix: start the server with NODE_USE_SYSTEM_CA=1 ' +
            '(Node 22.19+/24.6+) or NODE_EXTRA_CA_CERTS=<path to your company root .cer/.pem>. ' +
            'Do not disable certificate verification.'
        );
      } else {
        console.error('Check internet/VPN/firewall/proxy settings.');
      }
    });
}

/* =========================================================
   RESEND
   ========================================================= */

const resend =
  new Resend(
    process.env.RESEND_API_KEY
  );

/* =========================================================
   HEALTH CHECK
   ========================================================= */

app.get(
  '/api/health',
  (_req, res) => {
    res.json({
      ok: true,

      chatbotModel:
        process.env.GROQ_MODEL ||
        'openai/gpt-oss-20b',
    });
  }
);

/* =========================================================
   PROTECTED WEEKLY PDF
   ========================================================= */

app.get(
  '/api/pdf/week_:week',
  (req, res) => {
    /*
     * PDFs require successful Clerk authentication.
     */

    if (
      !requireSignedIn(
        req,
        res
      )
    ) {
      return;
    }

    const week =
      String(
        req.params.week ||
          ''
      );

    /*
     * Only Week 01 through Week 13 exist.
     */

    if (
      !/^(0[1-9]|1[0-3])$/.test(
        week
      )
    ) {
      return res
        .status(404)
        .json({
          error:
            'Learning pack not found.',
        });
    }

    /*
     * Windows-safe path:
     *
     * C:\...\server\pdfs\week_01.pdf
     */

    const pdfPath =
      resolvePdfPath(week);

    console.log(
      `Opening Week ${week} PDF:`,
      pdfPath
    );

    return res.sendFile(
      pdfPath,
      (error) => {
        if (!error) {
          return;
        }

        console.error(
          `Unable to open Week ${week} PDF:`,
          error
        );

        if (!res.headersSent) {
          res
            .status(404)
            .json({
              error:
                `Week ${week} learning pack not found.`,
            });
        }
      }
    );
  }
);

/* =========================================================
   GROQ ONBOARDING CHATBOT
   ========================================================= */

app.post(
  '/api/chat',
  async (
    req,
    res
  ) => {
    /*
     * Chatbot requires successful
     * Clerk authentication.
     */

    if (
      !requireSignedIn(
        req,
        res
      )
    ) {
      return;
    }

    const message =
      String(
        req.body?.message ||
          ''
      ).trim();

    if (!message) {
      return res
        .status(400)
        .json({
          error:
            'Please ask a question.',
        });
    }

    /*
     * Groq must be configured.
     */

    if (
      !process.env.GROQ_API_KEY
    ) {
      return res
        .status(500)
        .json({
          error:
            'Groq is not configured. Add GROQ_API_KEY to the .env file.',
        });
    }

    /*
     * Keep the last six messages
     * for conversational context.
     */

    const history =
      Array.isArray(
        req.body?.history
      )
        ? req.body.history
            .filter(
              (item: any) =>
                item &&
                typeof item.text === 'string' &&
                !item.text.startsWith('The onboarding assistant could not') &&
                !item.text.startsWith('The Groq API key') &&
                !item.text.startsWith('The onboarding assistant has reached')
            )
            .slice(-6)
            .map((item: any) => ({
              ...item,
              text: String(item.text).slice(0, 1200),
            }))
        : [];

    try {
      const messages: OpenAI.Chat.ChatCompletionMessageParam[] =
        [
          /* =================================================
             SYSTEM PROMPT
             ================================================= */

          {
            role: 'system',

            content: `
You are the Esyasoft 90-Day Onboarding Assistant.

Your ONLY purpose is to help employees with the Esyasoft
onboarding journey and subjects directly connected to the
onboarding programme.

============================================================
1. UNDERSTAND QUESTIONS BY MEANING
============================================================

Do NOT rely only on exact keyword matching.

Understand what the employee is actually asking.

Examples of valid questions include:

"Tell me about onboarding."

"What happens when I join?"

"What should I do on arrival?"

"What happens in week 4?"

"What do we learn after databases?"

"Explain AMI."

"What is a smart meter?"

"Why do smart meters need MDMS?"

"What is CPMS?"

"Explain BESS."

"How does MQTT work?"

"What does publish subscribe mean?"

"Explain inheritance."

"What is a SQL JOIN?"

"What do we learn in React?"

"What happens during role-specific training?"

"What should I bring for accommodation?"

"Where is the training centre?"

"Who should I contact?"

"How does the learning pack work?"

"When can I open the PDF for a week?"

All of these are within scope.

============================================================
2. ALLOWED ONBOARDING SUBJECTS
============================================================

You may answer questions reasonably connected to:

- Esyasoft onboarding
- joining
- first-day activities
- arrival
- workplace setup
- official account setup
- Outlook
- Microsoft Teams
- Zoho People
- joining documents
- employee onboarding documents
- onboarding support
- training
- training schedule
- weekly training
- learning packs
- onboarding progress
- portal progression

DOMAIN TRAINING:

- Smart Metering
- AMI
- Advanced Metering Infrastructure
- smart meters
- meter data
- data acquisition
- MDMS
- Meter Data Management System
- data intelligence
- EV charging
- CPMS
- Charge Point Management System
- gas distribution
- BESS
- Battery Energy Storage System
- communication technologies
- project management
- Agile practices

SOFT SKILLS:

- corporate orientation
- communication skills
- professional etiquette
- teamwork
- presentation skills
- time management
- workplace practices

TECHNICAL TRAINING:

- C#
- programming concepts connected to C#
- control structures
- methods
- collections
- exception handling
- object-oriented programming
- classes
- objects
- inheritance
- polymorphism
- abstraction
- encapsulation
- interfaces
- .NET
- MSSQL
- SQL
- relational databases
- CRUD
- joins
- data handling
- MQTT
- messaging
- brokers
- publishers
- subscribers
- topics
- publish/subscribe
- ReactJS
- React
- Blazor
- component-based development
- UI concepts
- application interaction

ROLE-SPECIFIC TRAINING:

- role allocation
- assigned technical area
- assigned business area
- role-specific concepts
- role-specific tools
- processes
- guided learning
- practical exercises
- practical assignments
- problem-solving
- real-world scenarios
- project
- assessment
- knowledge consolidation
- team transition

LOGISTICS:

- accommodation
- training centre
- travel
- what to bring
- facilities
- recreation
- onboarding contacts

PORTAL:

- authentication
- learning packs
- weekly progression
- session completion
- learning pack (PDF) access
- onboarding notes
- feedback

============================================================
3. TECHNICAL QUESTIONS
============================================================

Technical questions are allowed when they are reasonably
connected to a technical subject contained in the onboarding
training programme.

For example:

"What is inheritance?"

This is allowed because object-oriented programming is part
of C#/.NET training.

"What is an interface in C#?"

Allowed.

"What is a SQL JOIN?"

Allowed because MSSQL is part of the training.

"What is normalization?"

Allowed when asked in the context of database learning.

"What is publish subscribe?"

Allowed because MQTT is part of training.

"What is a React component?"

Allowed because ReactJS is part of training.

You may use general technical knowledge to TEACH these
training concepts.

However, do not invent Esyasoft-specific technical
architecture.

============================================================
4. FOLLOW-UP QUESTIONS
============================================================

Use the previous conversation.

A follow-up question remains in scope when it logically
continues an onboarding-related discussion.

Example:

User:
"What is MQTT?"

Assistant explains MQTT.

User:
"Then what does the broker do?"

The second question is IN SCOPE because it continues the
MQTT discussion.

Another example:

User:
"Tell me about Week 4."

Assistant explains C# training.

User:
"What is exception handling?"

The second question is IN SCOPE.

Therefore do not classify short follow-up questions as
out-of-scope merely because they do not explicitly mention
Esyasoft or onboarding.

============================================================
5. ESYASOFT-SPECIFIC INFORMATION
============================================================

The onboarding knowledge supplied below is authoritative
for Esyasoft-specific facts.

NEVER invent:

- Esyasoft policies
- employee benefits
- internal company rules
- internal procedures
- internal technical architecture
- internal applications not supplied in the knowledge
- employee entitlements
- HR policies not supplied
- addresses
- contact information
- schedules
- role assignments
- salary information
- leave entitlement
- reporting structure

If an Esyasoft-specific question is related to onboarding
but the supplied knowledge does not contain the answer,
respond clearly:

"The onboarding information available to me does not specify
that. Please check with the relevant HR, Admin, trainer,
mentor or reporting manager."

Do NOT classify such a question as OUT_OF_SCOPE merely
because the exact company information is unavailable.

============================================================
6. OUT-OF-SCOPE QUESTIONS
============================================================

Before answering every question, determine whether it is:

A. reasonably related to Esyasoft onboarding,

OR

B. related to one of the subjects included in the onboarding
training programme,

OR

C. a reasonable follow-up to an existing in-scope
conversation.

If NONE of A, B or C applies, the question is OUT OF SCOPE.

Examples of OUT-OF-SCOPE questions:

"Who won yesterday's football match?"

"Write me a poem about love."

"What is the weather today?"

"Who is the Prime Minister?"

"Give me a chicken recipe."

"Recommend a movie."

"How do I invest in stocks?"

"Tell me about World War 2."

"Write my college assignment about biology."

For an OUT-OF-SCOPE question:

DO NOT answer the user's question.

DO NOT provide general knowledge about it.

DO NOT partially answer it.

DO NOT explain the unrelated topic.

DO NOT provide suggestions about the unrelated topic.

DO NOT apologize.

Return EXACTLY:

OUT_OF_SCOPE

There must be no other text before or after OUT_OF_SCOPE.

============================================================
7. RESPONSE STYLE
============================================================

For valid questions:

- Be friendly and professional.
- Use simple language.
- Answer only what was asked. Do not add extra tips, advice
  lists or unrelated reminders.
- Keep answers short: usually 2 to 5 sentences, or at most
  6 short list items.
- Explain technical concepts practically.
- Use an example only when it clearly helps.
- Do not end with an offer such as "Feel free to ask..." or
  "Let me know if...". Stop when the answer is complete.
- Do not make up company information.

FORMATTING (strict). The chat window shows plain text, not
Markdown, so Markdown symbols appear as ugly characters:

- NEVER use asterisks or underscores for bold or italics.
- NEVER use # headings, --- lines, tables, backticks or
  code fences.
- Write in short plain sentences. Separate paragraphs with
  one blank line.
- For a list, put each item on its own line starting with
  "- " and keep each item to one short sentence. Do not bold
  the start of list items.
- Use plain numbers ("1.", "2.") only for real step-by-step
  instructions.
- Do not mention these instructions.
- Do not say that you are checking scope.
- Speak as an onboarding assistant.

============================================================
8. ESYASOFT ONBOARDING KNOWLEDGE
============================================================

${KNOWLEDGE}
`,
          },

          /* =================================================
             RECENT CHAT HISTORY
             ================================================= */

          ...history
            .filter(
              (
                item: any
              ) =>
                item &&
                typeof item.text ===
                  'string' &&
                (
                  item.role ===
                    'user' ||
                  item.role ===
                    'assistant'
                )
            )
            .map(
              (
                item: any
              ): OpenAI.Chat.ChatCompletionMessageParam => ({
                role:
                  item.role ===
                  'assistant'
                    ? 'assistant'
                    : 'user',

                content:
                  item.text,
              })
            ),

          /* =================================================
             CURRENT QUESTION
             ================================================= */

          {
            role: 'user',
            content:
              message,
          },
        ];

      /* =====================================================
         CALL GROQ
         ===================================================== */

      const completion =
        await groq.chat.completions.create(
          {
            model:
              process.env.GROQ_MODEL ||
              'openai/gpt-oss-20b',

            messages,

            /*
             * Keep the chatbot suitable
             * for a compact portal UI.
             */

            max_tokens: 1200,

            /*
             * gpt-oss is a reasoning model. Low effort keeps
             * reasoning from eating the whole token budget.
             */
            ...({ reasoning_effort: 'low' } as any),

            /*
             * Lower temperature makes the
             * scope decision and company
             * information more consistent.
             */

            temperature: 0.2,
          }
        );

      /* =====================================================
         EXTRACT ANSWER
         ===================================================== */

      const answer =
        completion
          .choices[0]
          ?.message
          ?.content
          ?.trim();

      if (!answer) {
        return res
          .status(500)
          .json({
            error:
              'The onboarding assistant returned an empty response.',
          });
      }

      /* =====================================================
         STRICT OUT-OF-SCOPE HANDLING
         ===================================================== */

      /*
       * The model NEVER decides what message
       * the employee sees for unrelated
       * questions.
       *
       * It only returns:
       *
       * OUT_OF_SCOPE
       *
       * The server converts that into our
       * fixed portal message.
       */

      if (
        answer ===
        'OUT_OF_SCOPE'
      ) {
        return res.json({
          answer:
            'This question is outside the scope of the Esyasoft 90-Day Onboarding Assistant. Please ask a question related to onboarding, workplace setup, training topics, learning resources, accommodation, travel, support, or your 90-day onboarding journey.',
        });
      }

      /*
       * Extra protection in case the model
       * accidentally adds punctuation or
       * formatting around the scope signal.
       */

      const normalizedAnswer =
        answer
          .replace(
            /[*_`]/g,
            ''
          )
          .trim()
          .toUpperCase();

      if (
        normalizedAnswer ===
          'OUT_OF_SCOPE' ||
        normalizedAnswer ===
          'OUT OF SCOPE' ||
        normalizedAnswer ===
          'OUT-OF-SCOPE'
      ) {
        return res.json({
          answer:
            'This question is outside the scope of the Esyasoft 90-Day Onboarding Assistant. Please ask a question related to onboarding, workplace setup, training topics, learning resources, accommodation, travel, support, or your 90-day onboarding journey.',
        });
      }

      /* =====================================================
         NORMAL VALID ANSWER
         ===================================================== */

      const cleaned = cleanAnswer(answer);

      if (!cleaned) {
        return res
          .status(500)
          .json({
            error:
              'The onboarding assistant returned an empty response.',
          });
      }

      return res.json({
        answer: cleaned,
      });
    } catch (
      error: any
    ) {
      console.error(
        'Groq chatbot error:',
        error
      );

      /*
       * Free-tier rate limit.
       */

      if (
        error?.status ===
        429
      ) {
        return res
          .status(429)
          .json({
            error:
              'The onboarding assistant has reached its temporary usage limit. Please try again shortly.',
          });
      }

      /*
       * Invalid API key.
       */

      if (
        error?.status ===
        401
      ) {
        return res
          .status(500)
          .json({
            error:
              'The Groq API key is missing or invalid.',
          });
      }

      const isConnectionError =
        error?.name === 'APIConnectionError' ||
        error?.name === 'APIConnectionTimeoutError' ||
        (!error?.status && /connection|timed? ?out|fetch failed/i.test(error?.message || ''));

      if (isConnectionError) {
        console.error(
          'Groq connection failure cause:',
          connectionCause(error) || '(none reported)'
        );

        return res.status(503).json({
          error:
            'The onboarding assistant could not reach the AI service. Please check your internet connection (or VPN/proxy settings) and try again in a moment.',
        });
      }

      const status = error?.status;
      const detail =
        error?.error?.message ||
        error?.message ||
        'Unknown error';

      console.error('Groq status:', status, '| detail:', detail);

      if (status === 413 || /too large|tokens per minute|TPM/i.test(detail)) {
        return res.status(413).json({
          error:
            'The assistant request was too large for the current Groq limit. Please try a shorter question or wait a minute.',
        });
      }

      if (status === 400 || status === 404) {
        return res.status(500).json({
          error:
            `Groq rejected the request (${status}): ${detail}`,
        });
      }

      return res
        .status(500)
        .json({
          error:
            `The onboarding assistant could not respond (${status || 'network'}): ${detail}`,
        });
    }
  }
);

/* =========================================================
   FEEDBACK
   ========================================================= */

app.post(
  '/api/feedback',
  async (
    req,
    res
  ) => {
    /*
     * Feedback requires Clerk authentication.
     */

    if (
      !requireSignedIn(
        req,
        res
      )
    ) {
      return;
    }

    const name =
      String(
        req.body?.name ||
          ''
      ).trim();

    const email =
      String(
        req.body?.email ||
          ''
      ).trim();

    const category =
      String(
        req.body?.category ||
          'General feedback'
      ).trim();

    const message =
      String(
        req.body?.message ||
          ''
      ).trim();

    /* -----------------------------------------------------
       VALIDATION
       ----------------------------------------------------- */

    if (
      !name ||
      !email ||
      !message
    ) {
      return res
        .status(400)
        .json({
          error:
            'Name, email and feedback are required.',
        });
    }

    const feedbackTo =
      process.env.FEEDBACK_TO;

    const feedbackFrom =
      process.env.FEEDBACK_FROM ||
      'Esyasoft Onboarding <onboarding@resend.dev>';

    if (
      !process.env.RESEND_API_KEY ||
      !feedbackTo
    ) {
      return res
        .status(500)
        .json({
          error:
            'Feedback email is not configured on the server.',
        });
    }

    try {
      /* ---------------------------------------------------
         SANITIZE CONTENT
         --------------------------------------------------- */

      const safeName =
        escapeHtml(name);

      const safeEmail =
        escapeHtml(email);

      const safeCategory =
        escapeHtml(
          category
        );

      const safeMessage =
        escapeHtml(
          message
        ).replaceAll(
          '\n',
          '<br />'
        );

      const submittedAt =
        new Date().toLocaleString(
          'en-IN',
          {
            dateStyle:
              'medium',

            timeStyle:
              'short',
          }
        );

      /* ---------------------------------------------------
         SEND EMAIL
         --------------------------------------------------- */

      const {
        data,
        error,
      } =
        await resend.emails.send(
          {
            from:
              feedbackFrom,

            to: [
              feedbackTo,
            ],

            replyTo:
              email,

            subject:
              `Esyasoft 90-Day Onboarding Feedback | ${category} | ${name}`,

            html: `
<div
  style="
    font-family: Arial, sans-serif;
    max-width: 680px;
    margin: 0 auto;
    color: #10271f;
    line-height: 1.6;
  "
>

  <div
    style="
      background: #063d2e;
      color: #ffffff;
      padding: 24px 28px;
      border: 3px solid #10271f;
    "
  >

    <div
      style="
        font-size: 12px;
        font-weight: 700;
        letter-spacing: 1.6px;
        text-transform: uppercase;
      "
    >
      Esyasoft 90-Day Onboarding
    </div>

    <h1
      style="
        margin: 8px 0 0;
        font-size: 28px;
        line-height: 1.2;
      "
    >
      Employee Feedback
    </h1>

  </div>

  <div
    style="
      padding: 28px;
      border: 3px solid #10271f;
      border-top: 0;
    "
  >

    <p>
      Hello Onboarding Team,
    </p>

    <p>
      A participant has submitted feedback through the
      Esyasoft 90-Day Onboarding Portal.
    </p>

    <table
      style="
        width: 100%;
        border-collapse: collapse;
        margin: 24px 0;
      "
    >

      <tr>
        <td
          style="
            padding: 10px;
            border: 1px solid #b7c8c1;
            font-weight: 700;
            width: 150px;
          "
        >
          Participant
        </td>

        <td
          style="
            padding: 10px;
            border: 1px solid #b7c8c1;
          "
        >
          ${safeName}
        </td>
      </tr>

      <tr>
        <td
          style="
            padding: 10px;
            border: 1px solid #b7c8c1;
            font-weight: 700;
          "
        >
          Email
        </td>

        <td
          style="
            padding: 10px;
            border: 1px solid #b7c8c1;
          "
        >
          ${safeEmail}
        </td>
      </tr>

      <tr>
        <td
          style="
            padding: 10px;
            border: 1px solid #b7c8c1;
            font-weight: 700;
          "
        >
          Category
        </td>

        <td
          style="
            padding: 10px;
            border: 1px solid #b7c8c1;
          "
        >
          ${safeCategory}
        </td>
      </tr>

      <tr>
        <td
          style="
            padding: 10px;
            border: 1px solid #b7c8c1;
            font-weight: 700;
          "
        >
          Submitted
        </td>

        <td
          style="
            padding: 10px;
            border: 1px solid #b7c8c1;
          "
        >
          ${escapeHtml(
            submittedAt
          )}
        </td>
      </tr>

    </table>

    <div
      style="
        background: #effff4;
        border: 2px solid #10271f;
        padding: 20px;
        margin: 22px 0;
      "
    >

      <div
        style="
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 1px;
          text-transform: uppercase;
          margin-bottom: 8px;
        "
      >
        Feedback
      </div>

      <div>
        ${safeMessage}
      </div>

    </div>

    <h3>
      Suggested follow-up
    </h3>

    <p>
      Please review this feedback and determine whether any
      updates are required to the onboarding content,
      training delivery, learning resources, logistics,
      employee support or overall portal experience.
    </p>

    <p>
      If clarification is required, reply directly to the
      participant using the email address above.
    </p>

    <p
      style="
        margin-top: 28px;
        font-size: 12px;
        color: #5b6d66;
      "
    >
      This message was generated automatically by the
      Esyasoft 90-Day Onboarding Portal.
    </p>

  </div>

</div>
`,
          }
        );

      /* ---------------------------------------------------
         RESEND ERROR
         --------------------------------------------------- */

      if (error) {
        console.error(
          'Resend error:',
          error
        );

        return res
          .status(500)
          .json({
            error:
              error.message ||
              'Feedback email could not be sent.',
          });
      }

      /* ---------------------------------------------------
         SUCCESS
         --------------------------------------------------- */

      return res.json({
        ok: true,

        id:
          data?.id,

        message:
          'Feedback delivered successfully.',
      });
    } catch (
      error
    ) {
      console.error(
        'Feedback error:',
        error
      );

      return res
        .status(500)
        .json({
          error:
            'Feedback email could not be sent. Check the Resend configuration.',
        });
    }
  }
);

/* =========================================================
   START SERVER (local only) / EXPORT (Vercel)
   ========================================================= */

/*
 * Locally (npm run dev / npm start) the server listens on a port.
 * On Vercel the exported app is used as a serverless function
 * through api/index.ts, so it must NOT call listen().
 */

if (!process.env.VERCEL) {
  app.listen(
    port,
    () => {
      console.log(
        `API running on http://localhost:${port}`
      );

      console.log(
        `Frontend expected at ${allowedOrigins.join(', ')}`
      );

      console.log(
        `Groq model: ${
          process.env.GROQ_MODEL ||
          'openai/gpt-oss-20b'
        }`
      );

      console.log(
        `PDF directory: ${pdfDirs[0]}`
      );
    }
  );
}

export default app;
