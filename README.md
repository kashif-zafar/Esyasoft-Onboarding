# Esyasoft 90-Day Onboarding Portal

A React + TypeScript + Vite onboarding portal with:

- Clerk authentication
- Any successfully authenticated Clerk account accepted
- Protected learning PDF route
- OpenAI-powered onboarding assistant
- Resend-powered feedback email
- Green-energy comic-inspired interface
- Local progress and notes

## 1. Requirements

Install Node.js LTS.

On Windows PowerShell, if `npm` is blocked by the execution policy, use `npm.cmd` in every command below.

## 2. Install

Open this folder in VS Code and run:

```powershell
npm.cmd install
```

## 3. Create `.env`

Copy `.env.example` to a new file named exactly `.env`.

Fill in these values:

```env
VITE_CLERK_PUBLISHABLE_KEY=pk_test_your_key
CLERK_PUBLISHABLE_KEY=pk_test_your_key
CLERK_SECRET_KEY=sk_test_your_key

GROQ_API_KEY=gsk_your_key
GROQ_MODEL=openai/gpt-oss-20b

RESEND_API_KEY=re_your_key
FEEDBACK_TO=your-personal-email@gmail.com
FEEDBACK_FROM=Esyasoft Onboarding <onboarding@resend.dev>

PORT=3001
APP_ORIGIN=http://localhost:5173
```

Never expose `CLERK_SECRET_KEY`, `GROQ_API_KEY`, or `RESEND_API_KEY` in frontend files.

## 4. Clerk

Create/open your Clerk application and copy the Publishable Key and Secret Key into `.env`.

Enable the sign-in methods you want in Clerk. The portal does not restrict users to `@esyasoft.com`; any account that Clerk successfully authenticates can enter protected areas.

The React app uses Clerk's modal sign-in flow, so you do not use VS Code Live Server and do not configure a `127.0.0.1:5500` redirect.

## 5. OpenAI

Create an OpenAI API key and place it in `OPENAI_API_KEY`.

The chatbot calls OpenAI only from `server/index.ts`. The key is never sent to the browser.

The assistant is grounded in `server/knowledge.ts` and is instructed to understand onboarding questions semantically rather than through keyword matching.

## 6. Resend feedback email

Create a Resend API key and place it in `RESEND_API_KEY`.

Set `FEEDBACK_TO` to the personal email address where you want to receive feedback.

For initial Resend testing, `onboarding@resend.dev` can be kept as `FEEDBACK_FROM`. Resend may restrict which recipients can receive mail from its testing domain. For unrestricted/production delivery, verify a domain in Resend and replace `FEEDBACK_FROM` with an address on that verified domain.

No Microsoft/Office 365 SMTP credentials are used in this project.

## 7. Run

```powershell
npm.cmd run dev
```

Open only:

```text
http://localhost:5173
```

Do not click **Go Live** in VS Code.

The development command runs both:

- Vite frontend: `http://localhost:5173`
- Express API: `http://localhost:3001`

Vite proxies `/api/*` calls to the Express server.

## 8. Test order

1. Open `http://localhost:5173`.
2. Sign in using any Clerk-enabled authentication method.
3. Confirm the Clerk profile button appears.
4. Open the learning resource from a week.
5. Open the assistant and ask: `Tell me about onboarding.`
6. Ask: `What database will I learn?`
7. Submit feedback and check `FEEDBACK_TO`.

## 9. Important files

```text
src/App.tsx             Main React UI
src/styles.css          Green-energy comic UI
src/data.ts             13-week roadmap
server/index.ts         Clerk-protected API, OpenAI and Resend
server/knowledge.ts     Onboarding knowledge for the AI assistant
server/pdfs/             Protected PDF resource
.env.example            Environment variable template
vite.config.ts          Vite dev server and API proxy
```

## 10. Commands

```powershell
npm.cmd install
npm.cmd run dev
npm.cmd run typecheck
npm.cmd run build
```

If `npm.cmd install` has not completed successfully, TypeScript/build commands will report missing packages. Install dependencies first.

## Training timeline update
- The portal now contains 13 weeks and 52 ordered sessions based on the supplied training plan.
- Sessions must be completed in sequence. Unchecking a completed session resets later sessions so progression remains ordered.
- Each week has its own generated introductory PDF learning pack under `server/pdfs/week_01.pdf` through `week_13.pdf`.
- The contents (sessions) of every week can be viewed at any time, even at 0% progress. A week's PDF learning pack opens only after all sessions of that week are complete (and the user is signed in with Clerk).
- PDFs are served by the authenticated `/api/pdf/week_:week` route and are available only after Clerk sign-in.
- `src/vite-env.d.ts` is included for Vite TypeScript types.
- `@types/cors` is included in devDependencies.


## 8. Deploy on Vercel

The project is already configured for Vercel: the React app is built by Vite, and the Express server runs as a serverless function (`api/index.ts` -> `server/index.ts`). `vercel.json` routes `/api/*` to that function and bundles `server/pdfs`.

1. Push this folder to GitHub (`.env` is git-ignored, never commit it).
2. In Vercel: **Add New > Project**, import the repo. Framework is detected as Vite; keep the defaults.
3. Before deploying, add these **Environment Variables** (Settings > Environment Variables), using the values from `.env.example`:
   - `VITE_CLERK_PUBLISHABLE_KEY`, `CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY`
   - `GROQ_API_KEY`, `GROQ_MODEL`
   - `RESEND_API_KEY`, `FEEDBACK_TO`, `FEEDBACK_FROM`
   - `APP_ORIGIN` only if you use a custom domain, e.g. `https://onboarding.yourcompany.com` (the `*.vercel.app` URLs are allowed automatically)
4. Deploy. `VITE_*` variables are read at build time, so redeploy after changing them.
5. In the Clerk dashboard, add your Vercel domain (and custom domain, if any). For a public launch use a Clerk **production** instance with `pk_live_` / `sk_live_` keys.
6. For real feedback delivery, verify a domain in Resend and set `FEEDBACK_FROM` to an address on it.

Check `https://<your-app>.vercel.app/api/health` after deploying; it should return `{"ok":true,...}`.
