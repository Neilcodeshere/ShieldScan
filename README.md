# ShieldScan

A personal security dashboard prototype. Enter your email and it checks known data breaches, gives you a risk score, and uses an LLM to explain in plain language what each breach means for you. It also has a URL checker for phishing links.

This is an early prototype. Some parts call real APIs, some run on sample data, and accounts are browser-only for now. The [status table](#what-is-real-and-what-is-sample-data) below spells out which is which.

## Overview

Breach-checking sites tell you *that* your email was in a leak, but not what to do about it. I wanted something that turns "your email was in the X breach, data types: passwords, phone numbers" into a short explanation of the actual risk and what to change first.

## Features

- Breach lookup for an email address through the BreachDirectory API (RapidAPI)
- Risk score from 0 to 100 with a breakdown of what contributed to it
- AI explanation of a breach, streamed from Groq (`llama-3.3-70b-versatile`)
- A security assistant chat that knows which identities you're monitoring
- Phishing URL check against Google Safe Browsing and VirusTotal
- Onboarding flow and settings for the emails, phone numbers and usernames you want to monitor
- Dashboard with charts (Recharts)

## What is real and what is sample data

| Part | Status |
|---|---|
| Breach lookup | Real API when `RAPIDAPI_KEY` / `RAPIDAPI_HOST` are set, otherwise sample breaches |
| Phishing check | Real APIs when the Google Safe Browsing and/or VirusTotal keys are set |
| AI explanations and chat | Groq when `GROQ_API_KEY` is set, otherwise a fixed fallback text |
| Dark-web mentions | Sample data only |
| Sign up / log in | Stored in `localStorage`, no real authentication yet |
| Email / SMS alerts | API routes exist (SendGrid, Twilio) but the UI doesn't call them yet |

## Tech Stack

- Next.js 16 (App Router), React 19, TypeScript
- Tailwind CSS 4, Radix UI primitives, Framer Motion, Recharts
- Groq SDK for the LLM calls
- External APIs: BreachDirectory (RapidAPI), Google Safe Browsing, VirusTotal, SendGrid, Twilio

## Project Structure

```
src/
  app/
    page.tsx                 landing page with a quick breach scan
    login/  signup/  onboarding/
    dashboard/               overview, breaches, dark web, phishing, assistant, alerts, settings
    api/
      scan/breach/           BreachDirectory lookup, falls back to sample data
      scan/phishing/         Safe Browsing + VirusTotal
      ai/analyse-breach/     streamed breach explanation
      ai/assistant/          streamed chat
      alerts/email/          SendGrid
      alerts/sms/            Twilio, critical alerts only
  components/                sidebar, top bar, scan modal, badges, notifications
  lib/
    riskEngine.ts            risk score calculation
    aiContext.ts             builds the assistant's context from your monitored identities
    mockData.ts              sample breaches and dark-web mentions
```

## Getting Started

You need Node.js 20.9 or newer.

```bash
git clone https://github.com/Neilcodeshere/ShieldScan.git
cd ShieldScan
npm install
cp .env.example .env.local    # all keys are optional
npm run dev                   # http://localhost:3000
```

The app runs with no keys at all. Each feature falls back to sample data or a fixed message until you add its key.

```bash
npm run build && npm start    # production build
```

## Environment Variables

All of these are read only on the server, inside the API routes.

| Variable | Used for |
|---|---|
| `RAPIDAPI_KEY`, `RAPIDAPI_HOST` | BreachDirectory breach lookup |
| `GROQ_API_KEY` | Breach explanations and the assistant |
| `GOOGLE_SAFE_BROWSING_API_KEY` | Phishing check |
| `VIRUSTOTAL_API_KEY` | Phishing check |
| `SENDGRID_API_KEY` | Email alert route |
| `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_PHONE_NUMBER` | SMS alert route |

`src/lib/supabase.ts` also reads `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` and `SUPABASE_SERVICE_ROLE_KEY`, but nothing imports it yet, so you can leave them out.

## How It Works

**Risk score.** `riskEngine.ts` adds up points: 30 per breach (capped at 60), 50 per active dark-web mention (capped at 50), 40 for a weak or reused password signal and 20 for phishing exposure. The total is capped at 100. Up to 30 is low, up to 69 is medium, and above that it's high, or critical from 85.

**Breach explanations.** The breach page sends the breach name and exposed data types to `/api/ai/analyse-breach`, which asks Groq for a short, specific explanation and streams the response back as it's generated. If Groq isn't configured or fails, it streams a fixed fallback message instead, so the UI behaves the same either way.

**Phishing check.** The URL goes to Google Safe Browsing first. It's also submitted to VirusTotal; the route waits a few seconds, fetches the analysis once, and combines both into a safe / suspicious / dangerous verdict. If the VirusTotal analysis hasn't finished by then, it adds nothing to the verdict.

## Current Limitations

- Dark-web monitoring is sample data. There's no dark-web data source behind it.
- Authentication is a placeholder in `localStorage`. Supabase and NextAuth are installed for this but not wired up yet.
- Monitored identities and scan results live in the browser, so nothing syncs between devices.
- The email and SMS alert routes aren't triggered anywhere yet.
- `npm run lint` currently reports errors, mostly `setState` calls inside effects and components defined inside render.

## Future Improvements

- Real accounts with Supabase Auth and a table for monitored identities
- Scheduled re-scans that trigger the email/SMS alerts
- Fix the lint errors
- Find a legitimate data source for dark-web mentions, or drop the page

## Author

Subhronil Chattoraj · GitHub: [Neilcodeshere](https://github.com/Neilcodeshere)
