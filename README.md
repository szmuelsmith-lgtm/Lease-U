# Lease U - Campus Housing Made Easy

A production-quality web application for students to find lease takeovers, roommates, and housing near campus. Built with Next.js 14, TypeScript, Tailwind CSS, Prisma, and NextAuth.

## Features

- **Guest Mode**: Browse listings and view details without an account
- **Host Functionality**: Create and manage property listings
- **Admin Dashboard**: Moderate listings, approve/reject submissions
- **University-First**: Browse listings by university (FSU, UF, UCF)
- **Modern UI**: Zublet-style split hero layout with smooth animations
- **Responsive Design**: Works seamlessly on desktop and mobile

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui (Radix UI primitives)
- **Animations**: Framer Motion
- **Database**: Prisma + SQLite
- **Authentication**: NextAuth.js (Credentials provider)
- **Validation**: Zod
- **Forms**: React Hook Form

## Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn/pnpm
- Git

### Installation

1. **Clone the repository** (or navigate to the project directory)

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up the database**:
   ```bash
   npx prisma generate
   npx prisma db push
   ```

4. **Seed the database** with sample data:
   ```bash
   npm run db:seed
   ```

5. **Start the development server**:
   ```bash
   npm run dev
   ```

6. **Open your browser** and navigate to [http://localhost:3000](http://localhost:3000)

## Database Setup

The application uses SQLite for local development. The database file will be created at `prisma/dev.db` after running `prisma db push`.

### Seed Data

The seed script creates:
- Admin user (login: `admin-temp` / password: `leaseu-admin`)
- Host users with sample listings for FSU, UF, and UCF
- Mix of listing types (Sublet, Lease Takeover, Room Rental)
- Various statuses (Approved, Pending)

### Database Commands

- `npm run db:push` - Push schema changes to database
- `npm run db:seed` - Seed database with sample data
- `npm run db:studio` - Open Prisma Studio (database GUI)

## Authentication

### Guest Mode (Default)
- No account required
- Can browse all listings
- Prompted to login/signup when attempting to contact hosts or post listings

### Host Account
- Sign up with email and password
- Create and manage listings
- View inquiries/messages

### Admin Access
- Username: `admin-temp`
- Password: `leaseu-admin`
- Access admin dashboard at `/admin`
- Approve/reject/remove listings

## Project Structure

```
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes
│   ├── admin/             # Admin dashboard
│   ├── host/              # Host pages (dashboard, create listing)
│   ├── listing/           # Listing detail pages
│   ├── u/                 # University feed pages
│   └── layout.tsx         # Root layout
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   └── ...               # Custom components
├── lib/                   # Utility functions
│   ├── auth.ts           # NextAuth configuration
│   ├── db.ts             # Prisma client
│   └── utils.ts          # Helper functions
├── prisma/               # Prisma schema and migrations
│   ├── schema.prisma     # Database schema
│   └── seed.ts           # Seed script
└── middleware.ts         # Route guards
```

## Routes

- `/` - Landing page with split hero and featured listings
- `/u/:slug` - University feed (fsu, uf, ucf)
- `/listing/:id` - Listing detail page
- `/login` - Login page
- `/signup` - Signup page
- `/host/dashboard` - Host dashboard (protected)
- `/host/new` - Create new listing (protected)
- `/host/listings/:id/edit` - Edit listing (protected)
- `/admin` - Admin moderation dashboard (protected)
- `/messages` - Messages/inquiries (protected)

## Design System

### Colors
- `bg_left`: #D7DFD5 (Left hero panel)
- `bg_right`: #EEF2EE (Right feed background)
- `text_primary`: #0B0F1A
- `text_muted`: rgba(11,15,26,0.55)
- `surface_card`: #FFFFFF
- `border_soft`: rgba(11,15,26,0.10)
- `accent`: #2F7D62 (Primary green)
- `accent_soft`: rgba(47,125,98,0.16)

### Typography
- **Headlines**: Playfair Display (serif)
- **UI Text**: Inter (sans-serif)

### Animations
- Page transitions: Fade + slide (cubic-bezier easing)
- Listing cards: Stagger fade-up on load
- Card hover: Lift 3px with stronger shadow
- Search typeahead: Scale + fade from top

## Development

### Adding New Features

1. Create database migrations if needed:
   ```bash
   npx prisma migrate dev --name your-feature-name
   ```

2. Update Prisma schema if needed:
   ```bash
   npx prisma db push
   ```

3. Generate Prisma client after schema changes:
   ```bash
   npx prisma generate
   ```

### Code Style

- Use TypeScript for type safety
- Follow Next.js App Router conventions
- Use server components by default, client components when needed
- Validate inputs with Zod schemas
- Use shadcn/ui components for consistent UI

## Production Deployment

1. **Update environment variables**:
   - Set `DATABASE_URL` to your production database
   - Set `NEXTAUTH_SECRET` to a secure random string
   - Set `NEXTAUTH_URL` to your production URL

2. **Run migrations**:
   ```bash
   npx prisma migrate deploy
   ```

3. **Build the application**:
   ```bash
   npm run build
   ```

4. **Start the production server**:
   ```bash
   npm start
   ```

## License

This project is built for educational purposes.

## Support

For issues or questions, please check the codebase or create an issue in the repository.
