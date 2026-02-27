# One-time setup – run these in order

Run these commands in your terminal from the project folder:

```bash
cd /Users/erinsmith/Downloads/edu

# 1. Install all dependencies
npm install

# 2. Generate Prisma client, create database, and seed data
npm run setup

# 3. Start the app
npm run dev
```

Then open **http://localhost:3000** in your browser.

---

**Already done for you:**
- `.env` file created (from `.env.example`) with `DATABASE_URL`, `NEXTAUTH_URL`, and `NEXTAUTH_SECRET`
- `postinstall` runs `prisma generate` after every `npm install`
- `npm run setup` runs: `prisma generate` → `prisma db push` → `npm run db:seed`

If you see any errors, paste them and we can fix them.
