# AI Astro Coach ✨

A personalized AI-powered astrology web app built with Next.js, Prisma (SQLite), and OpenAI.

## Features

- **Zodiac Sign Detection** — enter your birth date, get your sign automatically
- **Sign Profile** — full breakdown: overview, strengths, growth areas, love style, work style, communication tips
- **Compatibility** — best friend & romance matches with explanations
- **Daily Reading** — personalized quote, theme, reading, action & avoid (AI-generated or fallback)
- **AI Chat** — "Ask your Astro Coach" with sign-aware context
- **Subscription Gating** — Free (3 messages/day, limited reading) vs Premium (50 messages/day, full reading)

## Tech Stack

- **Frontend:** Next.js 15 (App Router) + TypeScript + Tailwind CSS
- **Backend:** Next.js API Routes + Prisma + SQLite
- **Auth:** NextAuth (credentials)
- **AI:** OpenAI API (optional — works without key using fallback content)

## Quick Start

### 1. Install dependencies

```bash
npm install
```

### 2. Set up environment

```bash
cp .env.example .env
```

Edit `.env` and optionally add your `OPENAI_API_KEY`. The app works without it.

### 3. Initialize database

```bash
npx prisma migrate dev --name init
```

### 4. Seed test data

```bash
npm run db:seed
```

### 5. Run the app

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Demo Accounts

| Email | Password | Sign | Tier |
|---|---|---|---|
| alice@example.com | password123 | Aries | PREMIUM |
| bob@example.com | password123 | Cancer | FREE |
| carol@example.com | password123 | Scorpio | FREE |

## Project Structure

```
├── app/
│   ├── api/
│   │   ├── auth/[...nextauth]/   # NextAuth handler
│   │   ├── auth/register/        # User registration
│   │   ├── profile/              # Create/get user profile
│   │   ├── daily/                # Get daily reading
│   │   ├── daily/generate/       # Generate/refresh reading
│   │   ├── compatibility/        # Check sign compatibility
│   │   ├── chat/                 # AI chat endpoint
│   │   ├── sign-profile/         # Static sign data
│   │   └── subscription/upgrade/ # Toggle free/premium
│   ├── login/
│   ├── register/
│   ├── onboarding/
│   ├── dashboard/
│   ├── sign-profile/
│   ├── daily/
│   ├── compatibility/
│   ├── chat/
│   └── settings/
├── components/
│   ├── navbar.tsx
│   ├── providers.tsx
│   └── ui.tsx
├── lib/
│   ├── auth.ts          # NextAuth config
│   ├── content.ts       # Static zodiac content (12 signs + compatibility)
│   ├── openai.ts        # OpenAI client wrapper
│   ├── prisma.ts        # Prisma client singleton
│   ├── prompts.ts       # AI prompt builders
│   ├── rate-limit.ts    # In-memory rate limiter
│   ├── session.ts       # Session helpers
│   ├── subscription.ts  # Subscription/gating logic
│   ├── validators.ts    # Zod schemas
│   └── zodiac.ts        # Zodiac sign calculator
├── prisma/
│   ├── schema.prisma
│   └── seed.ts
├── types/
│   └── next-auth.d.ts
└── .env.example
```

## Business Rules

- **Free tier:** view sign profile, limited daily reading (2 sentences), 3 AI chat messages/day
- **Premium tier:** full daily reading with action/avoid, 50 AI chat messages/day
- Daily message counter resets automatically at midnight
- In Settings, click "Upgrade to Premium" to toggle tier (demo — no real payment)

## AI Behavior

- If `OPENAI_API_KEY` is set: daily readings and chat use GPT
- If no key: fallback deterministic readings from static content; chat returns template responses
- System prompt enforces supportive, non-medical, non-legal guidance
- Chat includes last 10 messages for context
- Daily reading returns structured JSON; retries once on parse failure

## Scripts

```bash
npm run dev          # Start development server
npm run build        # Production build
npm run db:migrate   # Run Prisma migrations
npm run db:seed      # Seed test data
npm run db:studio    # Open Prisma Studio
npm run db:reset     # Reset database
```
