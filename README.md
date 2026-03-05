# AI Astro Coach ✨

A full-featured, AI-powered astrology companion built with Next.js 15, Prisma, OpenAI, and Stripe. Offers daily readings, tarot spreads, birth chart analysis, an AI chat coach, journaling, mood tracking, and more — all wrapped in a glassmorphism UI with smooth Framer Motion animations.

---

## Features

### Core
- **Zodiac Sign Detection** — automatic sign calculation from birth date
- **Sign Profile** — 25+ section breakdown: overview, strengths, growth areas, love style, work style, communication tips
- **Daily Reading** — personalized quote, theme, full reading, "Try This Today" action, and "Heads Up" avoid
- **AI Chat Coach** — sign-aware conversational AI with mood/struggle context and 10-message history window

### Extended
- **Tarot Spreads** — single card, 3-card (Past/Present/Future), or 5-card (Context/Challenge/Focus/Advice/Outcome)
- **Birth Chart** — Big Three (Sun, Moon, Rising), elemental balance, and modality breakdown
- **Planetary Transits** — real-time planet positions with retrograde alerts and affected-sign warnings
- **Compatibility Checker** — input a sign or birthday; get friend & romance match scores with explanations
- **Weekly & Monthly Forecasts** — themed readings with love/career/health sections, lucky days, and cosmic advice
- **Cosmic Journal** — daily sign-specific writing prompts with mood selector, one entry per day
- **Mood Tracker** — 5-level mood & energy logger with a 14-day bar chart visualization
- **Bookmarks** — save any reading, quote, chat, or affirmation for later
- **Streak Tracking** — daily visit streak with longest-streak record
- **Daily Affirmation** — sign-specific affirmation on the dashboard

### Monetization
- **Free Tier** — daily quote, limited reading (2 sentences), 3 AI messages/day, basic sign profile
- **Premium Tier** ($9.99/mo or $79.99/yr) — full readings, 50 AI messages/day, regenerate readings, compatibility, birth chart, transits, weekly/monthly, tarot, journal, mood, bookmarks, priority AI
- **Stripe Integration** — checkout sessions with 7-day free trial, webhooks, and customer management
- **Demo Mode** — works without Stripe keys; settings page toggles tier instantly

---

## Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | Next.js 15 (App Router) + TypeScript |
| **Styling** | Tailwind CSS (glassmorphism design system) |
| **Animations** | Framer Motion |
| **Auth** | NextAuth.js (credentials + OAuth-ready) |
| **Database** | SQLite via Prisma ORM |
| **AI** | OpenAI API (gpt-4o-mini default; works without key via fallback content) |
| **Payments** | Stripe (subscriptions, checkout, webhooks) |
| **Email** | Nodemailer (SMTP; console-log fallback) |
| **Validation** | Zod |
| **Analytics** | PostHog (optional) |
| **Error Tracking** | Sentry (optional) |
| **E2E Testing** | Playwright |
| **PWA** | next-pwa with web manifest |

---

## Quick Start

### 1. Install dependencies

```bash
npm install
```

### 2. Set up environment

```bash
cp .env.example .env
```

Edit `.env` with your values. **All third-party keys are optional** — the app gracefully falls back:

| Variable | Required | Fallback |
|---|---|---|
| `DATABASE_URL` | Yes | `file:./dev.db` (default) |
| `NEXTAUTH_SECRET` | Yes | — |
| `OPENAI_API_KEY` | No | Deterministic readings from static zodiac data |
| `STRIPE_SECRET_KEY` | No | Demo mode (instant tier toggle) |
| `SMTP_HOST` | No | Logs emails to console |
| `NEXT_PUBLIC_POSTHOG_KEY` | No | Analytics disabled |
| `SENTRY_DSN` | No | Error tracking disabled |

### 3. Initialize database

```bash
npx prisma migrate dev
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

---

## Demo Accounts

| Email | Password | Sign | Tier |
|---|---|---|---|
| alice@example.com | password123 | Aries | PREMIUM |
| bob@example.com | password123 | Cancer | FREE |
| carol@example.com | password123 | Scorpio | FREE |

---

## API Routes

| Route | Method | Description |
|---|---|---|
| `/api/auth/[...nextauth]` | * | NextAuth handlers |
| `/api/auth/register` | POST | User registration |
| `/api/auth/forgot-password` | POST | Send password reset email |
| `/api/auth/reset-password` | POST | Reset password with token |
| `/api/profile` | GET / POST | Get or update user profile |
| `/api/daily` | GET | Today's daily reading |
| `/api/daily/generate` | POST | Regenerate reading (premium) |
| `/api/weekly` | GET | Weekly reading |
| `/api/monthly` | GET | Monthly forecast |
| `/api/chat` | GET / POST | Chat history / send message |
| `/api/chat/like` | POST | Like a chat message |
| `/api/compatibility` | GET / POST | Check sign compatibility |
| `/api/tarot` | GET | Pull tarot cards (`?count=1\|3\|5`) |
| `/api/birth-chart` | GET | Birth chart (Big Three + elements) |
| `/api/transits` | GET | Current planetary transits |
| `/api/journal` | GET / POST | Journal entries (one per day) |
| `/api/journal/prompt` | GET | Daily sign-specific prompt |
| `/api/mood` | GET / POST | Mood entries (one per day) |
| `/api/affirmation` | GET | Daily sign affirmation |
| `/api/bookmarks` | GET / DELETE | Manage bookmarks |
| `/api/conversations` | GET | List chat conversations |
| `/api/streak` | GET | Track visit streaks |
| `/api/notifications` | GET / PUT | Notification preferences |
| `/api/sign-profile` | GET | Full sign profile data |
| `/api/subscription` | GET | Current subscription info |
| `/api/subscription/checkout` | POST | Create Stripe checkout session |
| `/api/subscription/upgrade` | POST | Toggle tier (demo mode) |
| `/api/webhook/stripe` | POST | Stripe webhook handler |
| `/api/account/delete` | DELETE | Delete user account |

---

## Project Structure

```
├── app/
│   ├── page.tsx                     # Landing page
│   ├── layout.tsx                   # Root layout (fonts, providers, metadata)
│   ├── login/ register/ onboarding/ # Auth & onboarding flows
│   ├── forgot-password/ reset-password/
│   ├── (app)/                       # Authenticated app routes
│   │   ├── layout.tsx               # Auth shell + navigation
│   │   ├── dashboard/               # Home dashboard
│   │   ├── daily/                   # Daily reading
│   │   ├── weekly/ monthly/         # Extended forecasts
│   │   ├── chat/                    # AI chat coach
│   │   ├── compatibility/           # Sign compatibility
│   │   ├── tarot/                   # Tarot card spreads
│   │   ├── birth-chart/             # Birth chart analysis
│   │   ├── transits/                # Planetary transits
│   │   ├── sign-profile/            # Full sign breakdown
│   │   ├── journal/                 # Cosmic journal
│   │   ├── mood/                    # Mood tracker
│   │   ├── bookmarks/               # Saved items
│   │   └── settings/                # Profile, plan & preferences
│   └── api/                         # 30+ API routes (see table above)
├── components/
│   ├── auth-shell.tsx               # Auth context + profile provider
│   ├── navbar.tsx                   # Responsive nav (sidebar + mobile tabs)
│   ├── providers.tsx                # Session & analytics providers
│   ├── ui.tsx                       # Design system (GlassCard, GlowButton, etc.)
│   └── error-boundary.tsx           # Error boundary wrapper
├── lib/
│   ├── auth.ts                      # NextAuth configuration
│   ├── openai.ts                    # OpenAI client wrapper
│   ├── prompts.ts                   # AI system prompt builders
│   ├── prisma.ts                    # Prisma client singleton
│   ├── birth-chart.ts               # Birth chart, transits & tarot logic
│   ├── readings.ts                  # Weekly/monthly/journal/affirmation generators
│   ├── content.ts                   # Static zodiac content (12 signs)
│   ├── zodiac.ts                    # Zodiac sign calculator
│   ├── zodiac-data/                 # Per-sign data files (profiles + daily content)
│   ├── stripe.ts / stripe-client.ts # Stripe server & client setup
│   ├── subscription.ts              # Tier gating & message limits
│   ├── rate-limit.ts                # In-memory rate limiter
│   ├── session.ts                   # Session helpers
│   ├── email.ts                     # Nodemailer transporter
│   ├── analytics.ts                 # PostHog integration
│   └── validators.ts                # Zod schemas
├── prisma/
│   ├── schema.prisma                # 16 models (see Data Model below)
│   ├── seed.ts                      # Test data seeder
│   └── migrations/
├── e2e/
│   └── app.spec.ts                  # Playwright end-to-end tests
├── types/
│   └── next-auth.d.ts               # NextAuth type augmentation
└── public/
    └── manifest.json                # PWA manifest
```

---

## Data Model

16 Prisma models on SQLite:

| Model | Purpose |
|---|---|
| **User** | Core auth (email, password, name, image) |
| **Account** | OAuth provider accounts (NextAuth) |
| **Session** | Server-side sessions |
| **VerificationToken** | Email verification tokens |
| **PasswordResetToken** | Password reset flow |
| **Profile** | Birth date/time/place, sign, moon, rising, focus area, mood, struggle |
| **DailyReading** | One per user per day — quote, theme, reading, action, avoid |
| **Conversation** | Chat thread container (title, topic) |
| **ChatMessage** | Individual messages (role, content, liked) |
| **Subscription** | Tier (FREE/PREMIUM), daily message counter, Stripe fields, billing cycle |
| **CompatibilityCheck** | Cached compatibility results |
| **Bookmark** | Saved readings, quotes, chats, affirmations |
| **JournalEntry** | One per user per day — content, prompt, mood |
| **MoodEntry** | One per user per day — mood, energy, notes |
| **Streak** | Current/longest streak, total visits |
| **NotificationPreference** | Email & push notification toggles |

---

## Business Rules

- **Free tier:** daily quote, truncated reading (2 sentences), 3 AI messages/day, basic sign profile
- **Premium tier:** full reading with action/avoid, 50 AI messages/day, all features unlocked
- Daily AI message counter resets at midnight
- One journal entry and one mood entry per user per day
- Streak increments on consecutive daily visits; resets if a day is missed
- Compatibility checker and reading regeneration are premium-only
- Security headers set on all responses (XSS, clickjacking, MIME sniffing)

## AI Behavior

- **With `OPENAI_API_KEY`:** daily readings and chat powered by GPT (model configurable via `OPENAI_MODEL`)
- **Without key:** deterministic readings from 12 × sign-specific static content files; chat returns template responses
- System prompt enforces supportive, non-medical, non-legal, non-financial guidance
- Chat context includes last 10 messages plus user profile (sign, mood, focus area, struggle)
- Daily reading API returns structured JSON; retries once on parse failure

---

## Scripts

```bash
npm run dev          # Start development server
npm run build        # Production build
npm run start        # Start production server
npm run lint         # ESLint
npm run typecheck    # TypeScript type checking
npm run test:e2e     # Playwright end-to-end tests
npm run db:migrate   # Run Prisma migrations
npm run db:seed      # Seed test data (3 demo accounts)
npm run db:studio    # Open Prisma Studio GUI
npm run db:reset     # Reset database (destructive)
```

---

## License

Private project.
