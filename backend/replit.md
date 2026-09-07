# Valencia Basket UAE

## Overview

Valencia Basket UAE is a premium sports academy website for a Spanish basketball academy operating in the UAE. The application is a conversion-focused marketing site designed to attract parents and young athletes to book trials, view programs, and register for events. The design follows a premium sports brand aesthetic inspired by elite sports academies, featuring bold typography, high-impact imagery, and a clean minimalist interface with an orange accent color palette (#FF6C0E).

## User Preferences

Preferred communication style: Simple, everyday language.

## Recent Changes

- **Feb 2026**: Migrated from Vite + React + Express to Next.js 16 with App Router and server-side rendering
- Removed old client/ directory (Vite/wouter-based SPA)
- Removed old Express server routes (server/routes.ts, server/storage.ts, server/vite.ts, server/static.ts)
- Created Next.js API routes under app/api/
- Added SEO infrastructure: sitemap.ts, robots.ts, metadata exports on all pages
- All images moved to root public/images/ directory
- **Feb 2026**: Added database-backed events, teams, and team_players tables with full CRUD API routes
- Seeded database with 3 events, 8 teams, and 94 players from previously hardcoded data
- Expanded admin dashboard with Events Management and Teams Management tabs (create/edit/delete with roster management)
- Events listing, EventStrip, and event detail pages now pull from database (each event has unique detail page)
- Teams listing and team detail pages now pull from database; height removed from roster display
- Added City of Arabia Courts as fourth facility location
- Full SEO audit: canonical URLs, OpenGraph, Twitter cards on all pages; dynamic sitemap with event/team routes
- **Feb 2026**: Added dynamic event registration form at /events/[slug]/register — pre-fills event name, collects parent/player details, saves to event_registrations table
- Admin login system: admin_users and admin_sessions tables with bcrypt password hashing, httpOnly session cookies, login/logout flow
- User management dialog in admin dashboard (create/delete admin users)
- Default admin credentials: username `admin`, password read from `ADMIN_SEED_PASSWORD` environment secret
- Build process (`script/build.ts`) never changes the database; reviewed migrations and any seed data run only as explicit release steps
- Seed script (`scripts/seed.ts`) creates default admin user, events, teams, and players if not already present
- Navbar reordered: Programs, Events, Methodology, Staff, Teams, Facilities (Admissions removed from nav)
- **Feb 2026**: Performance audit — removed 35 unused shadcn/ui components and 76+ unused npm packages (recharts, framer-motion, cmdk, etc.), replaced framer-motion with CSS keyframe animations, switched public pages from force-dynamic to ISR (revalidate=60s), removed 14 unused images
- **Feb 2026**: Fixed email notifications reading env vars dynamically instead of caching at module load time
- **Feb 2026**: Switched dev workflow to build+serve mode (next build → next start) to fix infinite Fast Refresh loop caused by Replit file sync updating file timestamps; disabled devIndicators in next.config.ts

## System Architecture

### Framework
- **Next.js 16** with App Router
- **TypeScript** throughout
- **Server-Side Rendering** for all pages (with "use client" where interactivity needed)

### Frontend Architecture
- **Routing**: Next.js App Router (file-based routing under app/)
- **Styling**: TailwindCSS v4 with @tailwindcss/postcss, CSS variables for theming
- **UI Components**: shadcn/ui (trimmed to ~20 used components) built on Radix UI primitives
- **Animations**: CSS keyframe animations (lightweight, no external library)
- **Form Handling**: React Hook Form with Zod validation schemas
- **State Management**: TanStack Query (React Query) for server state and API data fetching

### Backend Architecture
- **API Routes**: Next.js Route Handlers under app/api/
- **Database ORM**: Drizzle ORM with PostgreSQL dialect
- **Schema Validation**: Zod schemas generated from Drizzle table definitions using drizzle-zod
- **Storage Layer**: DatabaseStorage class in lib/storage.ts

### Build System
- **Development**: `next build` then `next start` on port 5000 (build+serve mode to avoid file watcher loops in Replit)
- **Production**: `next build` + `next start`
- **Database Migrations**: Generate and review migration SQL with `db:generate`, then apply committed migrations explicitly with `db:migrate`; `db:push` is a manually run, confirmation-required development tool and is never part of a deployment build
- **Entry Point**: server/index.ts runs `next build` then `next start` (used by npm run dev)
- **Note**: After code changes, restart the workflow to rebuild and see updates

### Project Structure
```
app/                    # Next.js App Router pages
  layout.tsx            # Root layout with Navbar, Footer, Providers
  page.tsx              # Home page
  globals.css           # Global styles and Tailwind theme
  providers.tsx         # Client-side providers (React Query)
  sitemap.ts            # SEO sitemap generation
  robots.ts             # SEO robots.txt generation
  not-found.tsx         # 404 page
  api/                  # API route handlers
    trial-bookings/     # Trial booking CRUD
    event-registrations/# Event registration CRUD
  programs/             # Programs pages
    page.tsx
    private-training/
  teams/                # Teams pages
    page.tsx
    [id]/               # Dynamic team detail
  methodology/          # Methodology page
  coaches/              # Staff & coaches page
  facilities/           # Facilities page
  admissions/           # Admissions & FAQ page
  events/               # Events pages
    page.tsx
    [id]/               # Dynamic event detail
  admin/                # Admin dashboard
  book-trial/           # Redirect to home trial form
  parents/              # Redirect to admissions
components/             # Reusable UI components
  layout/               # Navbar, Footer
  shared/               # SectionHeader, TrustBar, ProgramCard
  home/                 # Hero, EventStrip, BookTrialForm
  ui/                   # shadcn/ui components
hooks/                  # Custom React hooks (use-toast, use-mobile)
lib/                    # Utilities (utils.ts, storage.ts)
shared/                 # Shared types and schemas
  schema.ts             # Drizzle database schema and Zod types
db/                     # Database connection setup
public/                 # Static assets
  images/               # All site images
server/                 # Entry point (spawns Next.js dev server)
```

### Key Design Patterns
- **Storage Pattern**: DatabaseStorage class implements IStorage interface for data access abstraction
- **Schema-First Validation**: Database schemas in `shared/schema.ts` generate both TypeScript types and Zod validation schemas
- **Server Components**: Pages are server components by default, "use client" only where needed
- **Path Aliases**: `@/` maps to project root, `@shared/` maps to shared directory

## External Dependencies

### Database
- **PostgreSQL**: Primary database (connection via `DATABASE_URL` environment variable)
- **Drizzle ORM**: Type-safe database queries and migrations

### Third-Party UI Libraries
- **Radix UI**: Accessible component primitives (dialogs, dropdowns, forms, etc.)
- **Embla Carousel**: Carousel/slider functionality
- **Lucide React**: Icon library
- **Vaul**: Drawer component
- **Framer Motion**: Animation library

### Development Tools
- **PostCSS**: CSS processing with @tailwindcss/postcss plugin
- **Drizzle Kit**: Database migration tooling

### Email Notifications
- **Nodemailer**: Sends email alerts for new trial bookings and event registrations
- Email sending is non-blocking and gracefully skips if not configured
- Email templates use Valencia Basket UAE branding (orange header, clean table layout)

### Environment Requirements
- `DATABASE_URL`: PostgreSQL connection string (required)
- `SMTP_HOST`: SMTP server hostname (default: smtp.gmail.com)
- `SMTP_PORT`: SMTP port (default: 587)
- `SMTP_SECURE`: Set to "true" for port 465 (default: false)
- `SMTP_USER`: SMTP username/email (required for email alerts)
- `SMTP_PASS`: SMTP password or app password (required for email alerts)
- `SMTP_FROM`: From email address (defaults to SMTP_USER)
- `NOTIFICATION_EMAIL`: Email address to receive form submission alerts (required for email alerts)
- Node.js with ES modules support

