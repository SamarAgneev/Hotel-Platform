# Hotel Digital Platform — Foundation

A production-grade, multi-tenant-ready hotel platform: premium customer
website + operational admin console, built on a real inventory/availability
model instead of a booking toy.

**Current status: Step 1 — foundation only.** No booking engine, payments,
real auth, or automation handlers are implemented yet. This step exists to
get the architecture right before feature work starts.

## Stack

- Next.js 16 (App Router) + TypeScript (strict)
- Tailwind CSS v4, driven by a token system (`src/styles/tokens.css`)
- PostgreSQL + Prisma ORM
- Zod for validation, React Hook Form for forms
- Auth.js boundary (stubbed — see `src/lib/auth/session.ts`)

## Getting started

```bash
npm install
cp .env.example .env.local   # fill in DATABASE_URL at minimum
npx prisma generate
npx prisma migrate dev --name init
npm run dev
```

Open http://localhost:3000 for the customer site, and
http://localhost:3000/admin/dashboard for the admin console.

## Folder architecture

```
src/
  app/
    (marketing)/        Customer-facing site (own layout: header + footer)
    (admin)/admin/       Hotel admin console (own layout: sidebar shell)
    api/                 Route handlers
  components/
    ui/                  Design-system primitives (Button, Input, Card, ...)
    layout/              Page shells (MarketingHeader, AdminSidebar, ...)
    marketing/ admin/     Domain-composed components (populated in Step 2+)
  domain/
    hotel/ room/ booking/ guest/ payment/ staff/   Business types & logic,
                                                     deliberately independent
                                                     of Prisma's generated
                                                     types and of Next.js
  lib/
    db/                  Prisma client singleton
    auth/                Session/role boundary
    events/              Automation event bus (typed, no-op handlers for now)
    validation/          Shared Zod schemas (client + server use the same one)
    utils/
  config/                Tenant/site configuration boundary — hotel name,
                           contact info, branding read from here, never
                           hard-coded in components
  styles/
    tokens.css           The single source of truth for color, type,
                           spacing, radius, shadow
prisma/
  schema.prisma          Full domain model
```

**Why `domain/` is separate from `lib/db`:** business rules (what counts as
available, what a booking status transition means) shouldn't live inside
Prisma-flavored code, and shouldn't require `prisma generate` to have run
in order to typecheck. `src/domain/staff/types.ts` is an example: it
defines `RoleName` by hand rather than importing Prisma's generated enum,
so the auth boundary compiles independently of the database layer.

## Design system

All visual values are CSS custom properties in `src/styles/tokens.css`,
mapped into Tailwind v4's `@theme inline` in `src/app/globals.css` — so
`bg-surface-page`, `text-accent-primary`, `rounded-lg`, `shadow-md`, etc.
read from the token system, not Tailwind's built-in defaults. To re-theme
per hotel later, only `tokens.css` (or a per-tenant equivalent) needs to
change.

Primitives live in `src/components/ui/`: `Button`, `Input`, `Select`,
`Card`, `Badge`, `Table`, `Skeleton`, `EmptyState`, `ErrorState`, `Toast`,
`Dialog`. Every one is keyboard-accessible (visible focus ring, proper
labels/`aria-*`, native `<dialog>` for modals) and respects
`prefers-reduced-motion`.

## Availability model

`RoomInventory` is one row per physical `Room` per calendar date
(`@@unique([roomId, date])`), not a boolean on the room or room type. This
is what supports:

- multiple physical rooms per room type
- date-range availability queries (all dates in range must be `OPEN`)
- blocked/maintenance rooms (`InventoryState.BLOCKED` / `MAINTENANCE`)
- a database-level guard against double-booking: two concurrent booking
  attempts on the same room/date collide on the unique constraint instead
  of silently succeeding

See [`docs/availability-engine.md`](docs/availability-engine.md) for the availability
rules, date semantics, booking-status behaviour and concurrency strategy. The
search engine is implemented and tested (`npm test`); booking creation (the
transaction that writes `RoomInventory`) is **not** implemented yet.

## Automation

`src/lib/events` defines a typed catalog of business events
(`booking_created`, `payment_success`, `check_in_due`, ...) and an
`emitEvent()` / `onEvent()` pair. Feature code emits events; it never
calls a notification sender directly. No handlers are registered yet —
Step 2+ adds them (writing to the `Notification` table, then a delivery
worker) without changing any call site.

## Multi-hotel readiness

Every operational entity scopes to `Property`, and `Property` scopes to
`Hotel` — a brand with multiple locations keeps clean data boundaries by
construction. No hotel name, room, price, image, or contact detail is
hard-coded in a component; customer-facing pages read from
`src/config/site.ts` (env-var-backed today, DB-backed once multi-tenant
onboarding ships).

## Known gap: Prisma client generation

`npx prisma generate` requires downloading a platform-specific engine
binary from Prisma's CDN on first run. If you're behind a restrictive
proxy/firewall that blocks `binaries.prisma.sh`, generation will fail —
run it from an unrestricted network (or in CI/Vercel, which both have
normal internet access) at least once; the generated client is cached
in `node_modules/.prisma` afterward.

## Scripts

```bash
npm run dev         # start dev server
npm run build        # production build
npm run lint          # ESLint
npm run typecheck     # tsc --noEmit
npm run db:generate    # prisma generate
npm run db:migrate     # prisma migrate dev
npm run db:studio      # prisma studio
```

## What's deliberately NOT here yet

Booking engine logic, payment processing, real authentication/sessions,
WhatsApp integration, AI concierge, automation handlers, seed/demo data,
and deployment configuration beyond being Vercel-compatible. See the
architecture report for the full roadmap.
