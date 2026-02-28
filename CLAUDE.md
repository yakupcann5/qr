# QR Menü SaaS — Project Instructions

## Project Overview

QR-based digital menu platform for cafes, restaurants, and similar businesses. SaaS model with annual subscription. MVP1 scope: menu display only (ordering/payment planned for future).

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 15 (App Router, full-stack) |
| Language | TypeScript (strict mode) |
| ORM | Prisma |
| Database | PostgreSQL (local: brew, production: VPS) |
| API | tRPC (end-to-end type safety) |
| Auth | NextAuth.js (JWT strategy, credentials provider) |
| Validation | Zod (shared schemas: frontend + backend) |
| UI | Tailwind CSS + shadcn/ui |
| Payment | iyzico (card tokenization) |
| Email | Resend + React Email templates |
| Image Storage | Cloudinary |
| Translation | Google Translate API |
| Rate Limiting | Upstash Redis (@upstash/ratelimit) |
| QR Generation | qr-code-styling |
| Error Tracking | Sentry |

## Architecture

### Multi-tenancy
Single database, `businessId` field for tenant isolation. Every query MUST filter by `businessId`.

### Data Flow
```
Frontend Component → tRPC Client → tRPC Router (Zod validation + auth middleware) → Service Layer (business logic) → Prisma Client → PostgreSQL
```

### Layer Responsibilities
- **tRPC Routers** (`src/server/trpc/routers/`): Input validation (Zod), auth/role checks, rate limiting. NO business logic here.
- **Services** (`src/server/services/`): Business logic, third-party API calls. Services call Prisma.
- **Validators** (`src/lib/validators/`): Shared Zod schemas used by both frontend forms and tRPC inputs.

### Route Structure
- `(public)/` — No auth required (landing, login, register, etc.)
- `menu/[slug]/` — Public menu page (SSR/ISR)
- `admin/` — Super Admin panel (SUPER_ADMIN role required)
- `dashboard/` — Business panel (BUSINESS_OWNER role, verified email required)
- `api/` — tRPC handler, NextAuth, webhooks, cron jobs, upload

## Roles

| Role | Access |
|------|--------|
| SUPER_ADMIN | Full platform management |
| BUSINESS_OWNER | Own business menu, settings, subscription |
| End User | View menu via QR (no login required) |

## Database (12 Tables)

User, Token, Business, Plan, Subscription, SubscriptionHistory, Payment, Category, Product, BusinessLanguage, CategoryTranslation, ProductTranslation

Key constraints:
- `Business.taxNumber` is unique (prevents trial abuse)
- `Business.slug` is unique and immutable (QR codes depend on it)
- `Subscription.businessId` is unique (one subscription per business)
- Soft delete via `deletedAt` on User and Business (30-day retention)
- Categories/Products use `isActive` toggle (no hard delete)

## Subscription States

```
TRIAL (14 days) → payment success → ACTIVE
ACTIVE → payment fails → GRACE_PERIOD (15 days)
GRACE_PERIOD → payment fails → EXPIRED (menu deactivated)
ACTIVE/TRIAL → user cancels → CANCELLED
```

## Coding Conventions

### File Naming
- Components: `kebab-case.tsx` (e.g., `product-card.tsx`)
- Services: `kebab-case.service.ts` (e.g., `payment.service.ts`)
- Validators: `kebab-case.ts` in `src/lib/validators/`
- tRPC Routers: `kebab-case.ts` in `src/server/trpc/routers/`

### tRPC Router Pattern
```typescript
// Every router procedure follows this pattern:
export const categoryRouter = router({
  list: protectedProcedure
    .input(z.object({ businessId: z.string() }))
    .query(async ({ ctx, input }) => {
      return categoryService.list(input.businessId);
    }),
});
```

### Service Pattern
```typescript
// Services are pure functions, no side effects on input
export const categoryService = {
  async list(businessId: string) {
    return db.category.findMany({
      where: { businessId, isActive: true },
      orderBy: { sortOrder: 'asc' },
    });
  },
};
```

### Immutability
NEVER mutate objects. Always return new copies. Use spread operator or Object.assign for updates.

### Error Handling
- Use tRPC's `TRPCError` with appropriate codes
- Services throw typed errors, routers catch and transform
- User-facing error messages in Turkish

### Turkish Character Handling
Slug generation must convert: ş→s, ç→c, ğ→g, ı→i, ö→o, ü→u, İ→i, Ş→s, Ç→c, Ğ→g, Ö→o, Ü→u

## Package Feature Control

| Feature | Plan Field | Başlangıç | Pro | Premium |
|---------|-----------|-----------|-----|---------|
| Languages | `maxLanguages` | 1 | 3 | -1 (unlimited) |
| Images | `hasImages` | false | true | true |
| Detail Fields | `hasDetailFields` | false | true | true |
| Custom QR | `hasCustomQR` | false | true | true |
| Templates | `allowedTemplates` | ["classic"] | ["classic", ...] | all |

## Environment Variables

Required in `.env`:
- `DATABASE_URL` — PostgreSQL connection
- `NEXTAUTH_URL`, `NEXTAUTH_SECRET` — Auth
- `IYZICO_API_KEY`, `IYZICO_SECRET_KEY`, `IYZICO_BASE_URL` — Payment
- `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` — Images
- `RESEND_API_KEY` — Email
- `GOOGLE_TRANSLATE_API_KEY` — Translation
- `NEXT_PUBLIC_SENTRY_DSN` — Error tracking
- `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN` — Rate limiting
- `CRON_SECRET` — Cron job auth
- `NEXT_PUBLIC_APP_URL` — Public app URL

## Development Workflow

1. **Plan first** — Use planner agent for complex features
2. **TDD** — Write tests first, implement to pass, refactor
3. **Code review** — Use code-reviewer agent after changes
4. **Security check** — Use security-reviewer for auth/payment changes
5. **Database changes** — Always use Prisma migrations, never manual SQL

## Cron Jobs

All cron endpoints at `/api/cron/` require `CRON_SECRET` header:
- `subscriptions/` — Auto-charge expiring subscriptions
- `downgrade/` — Apply pending downgrades at period end
- `reminders/` — Send reminder emails (trial, subscription, grace)
- `cleanup/` — Hard delete 30-day-old soft-deleted records + Cloudinary cleanup

## Email Templates (15 total)

Templates in `src/emails/` using React Email + Resend. Shared layout in `src/emails/_components/`.

## Security Requirements

- Rate limit login: 5 failed attempts → 15 min cooldown
- Rate limit API: per-user limits via Upstash
- KVKK/GDPR: consent tracking, cookie banner, data deletion
- No card data in DB (iyzico tokens only)
- `CRON_SECRET` on all cron endpoints
- Middleware auth guards on `/admin/*` and `/dashboard/*`
