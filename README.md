# LeaseU - FSU Campus Housing

Modern, sleek FSU-exclusive housing marketplace. Made for Florida State University students.

## Features

- **View-first**: Anyone can browse listings. Sign in to post or message.
- **FSU hosts only**: Only verified @fsu.edu users can post listings.
- **Viewer accounts**: Any email can sign up to browse and message hosts.
- **Admin**: Approve/reject/remove listings. Login: `admin-temp` / `leaseu-admin`

## Tech Stack

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- shadcn/ui
- Framer Motion
- Prisma + SQLite
- Zod
- React Hook Form
- Credentials-based auth (NextAuth)

## Setup

```bash
npm install
npx prisma db push
npm run db:seed
npm run dev
```

## Environment

Copy `.env.example` to `.env`:

```
DATABASE_URL="file:./dev.db"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key"
```

## Seed Accounts

| Email | Password | Role |
|-------|----------|------|
| admin-temp | leaseu-admin | Admin |
| student@fsu.edu | host123 | Host (can post) |
| viewer@gmail.com | viewer123 | Viewer (browse & message) |

## Routes

| Route | Access |
|-------|--------|
| / | Landing (public) |
| /browse | Browse listings (public) |
| /listings/[id] | Listing detail (public) |
| /post | Post listing (HOST only, @fsu.edu) |
| /messages | Messages (auth required) |
| /admin | Admin dashboard (ADMIN only) |
| /login | Log in |
| /signup | Sign up |

## Branding

- Primary Garnet: #782F40
- Dark Garnet: #5A1F2B
- Gold Accent: #CEB888
- Background: #F6F4EF
