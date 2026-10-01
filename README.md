# Esyasoft 90-Day Onboarding Portal

A full-stack onboarding portal that guides new joiners through a 13-week (90-day) programme, with sign-in, weekly learning packs and an AI assistant that answers onboarding questions.

![React](https://img.shields.io/badge/React-TypeScript-61DAFB?logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-build-646CFF?logo=vite&logoColor=white)
![Express](https://img.shields.io/badge/Express-API-000000?logo=express&logoColor=white)
![Clerk](https://img.shields.io/badge/Auth-Clerk-6C47FF)
![Vercel](https://img.shields.io/badge/Deploy-Vercel-000000?logo=vercel&logoColor=white)

**Live demo:** https://your-app.vercel.app

<!-- Add screenshots here, e.g. ![Home](docs/home.png) -->

## Features

- **13-week learning journey:** week-by-week plan covering corporate orientation, domain training (smart metering, EV charging, BESS and more), technical training (C#/.NET, MSSQL, MQTT, React/Blazor) and role-specific training.
- **Protected learning packs:** weekly PDFs are served only to signed-in users.
- **AI onboarding assistant:** a chatbot grounded in a written knowledge base. It keeps to onboarding topics, understands follow-up questions and replies in plain text.
- **Company overview:** global presence, the four business areas, core values, and EGP vs normal-hire training.
- **Feedback form:** submissions are emailed to a configured inbox.
- **Progress and notes:** saved in the user's browser.
- **Themed UI:** green-energy, comic-style interface.

## Tech stack

| Area | Tools |
| --- | --- |
| Frontend | React, TypeScript, Vite |
| Backend | Node.js, Express |
| Authentication | Clerk |
| AI assistant | Groq API (via the OpenAI SDK) |
| Email | Resend |
| Hosting | Vercel (static frontend + serverless API) |

## How it works

```
Browser (React + Clerk)
   │  Bearer token
   ▼
/api/*  ── Express app (server/index.ts)
   ├─ /api/chat      → Groq, using server/knowledge.ts as context
   ├─ /api/pdf/week_NN → protected PDFs from server/pdfs
   ├─ /api/feedback  → Resend email
   └─ /api/health
```

Every API route except `/api/health` checks the Clerk session. API keys stay on the server and are never sent to the browser. Locally, Vite proxies `/api` to the Express server; on Vercel the same Express app runs as a serverless function.

## Project structure

```
api/index.ts        Vercel serverless entry
server/
  index.ts          Express app (auth, chat, PDFs, feedback)
  knowledge.ts      Knowledge base for the assistant
  formatAnswer.ts   Cleans model replies to plain text
  pdfs/             Weekly learning packs
src/
  App.tsx           Main application
  components/       Page sections
  content.ts, data.ts  Portal content
public/             Static assets
vercel.json         Routing and function settings
```

## Run locally

Requires Node.js 20 or newer.

```bash
npm install
cp .env.example .env   # then fill in your keys
npm run dev
```

The app runs at http://localhost:5173 and the API at http://localhost:3001. On Windows PowerShell, use `npm.cmd` if `npm` is blocked.

### Environment variables

| Variable | Purpose |
| --- | --- |
| `VITE_CLERK_PUBLISHABLE_KEY`, `CLERK_PUBLISHABLE_KEY` | Clerk publishable key (frontend and server) |
| `CLERK_SECRET_KEY` | Clerk secret key (server only) |
| `GROQ_API_KEY`, `GROQ_MODEL` | Chatbot (model defaults to `openai/gpt-oss-20b`) |
| `RESEND_API_KEY`, `FEEDBACK_TO`, `FEEDBACK_FROM` | Feedback email |
| `APP_ORIGIN` | Optional. Comma-separated allowed origins, such as a custom domain. Defaults to `http://localhost:5173` |

Never commit `.env`. It is git-ignored.



`VITE_*` variables are read at build time, so redeploy after changing them. For a public launch, use Clerk production keys, and verify a domain in Resend so feedback emails can reach any address.

## Customising the content

- Programme content: `src/data.ts` and `src/content.ts`
- Chatbot knowledge: `server/knowledge.ts` (keep it in sync with the site)
- Weekly PDFs: replace the files in `server/pdfs/` (`week_01.pdf` to `week_13.pdf`)

## Notes

This is an independent project. Company names and onboarding content are used for demonstration, and the company overview text comes from public sources.


