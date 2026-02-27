# How to View/Run the App from GitHub

This guide shows you how to clone your repository from GitHub and run the Lease U app locally.

---

## Option 1: Clone and Run Locally (Full Setup)

### Step 1: Clone the Repository

**On Windows (Command Prompt or PowerShell):**
```bash
# Navigate to where you want the project
cd C:\Users\user\Desktop

# Clone the repository
git clone https://github.com/YOUR_USERNAME/lease-u.git

# Navigate into the project folder
cd lease-u
```

**On Mac/Linux:**
```bash
# Navigate to where you want the project
cd ~/Desktop

# Clone the repository
git clone https://github.com/YOUR_USERNAME/lease-u.git

# Navigate into the project folder
cd lease-u
```

### Step 2: Install Dependencies

```bash
npm install
```

This will install all required packages (Next.js, Prisma, etc.). This may take a few minutes.

### Step 3: Set Up Environment Variables

Create a `.env` file in the project root (copy from `.env.example`):

```bash
# Windows
copy .env.example .env

# Mac/Linux
cp .env.example .env
```

The `.env` file should contain:
```
DATABASE_URL="file:./dev.db"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="lease-u-secret-key-change-in-production"
```

### Step 4: Set Up Database

```bash
# Generate Prisma Client
npx prisma generate

# Create database and tables
npx prisma db push

# Seed with sample data
npm run db:seed
```

### Step 5: Run the Development Server

```bash
npm run dev
```

You should see:
```
▲ Next.js 14.0.4
- Local:        http://localhost:3000
```

### Step 6: View the App

Open your browser and go to:
```
http://localhost:3000
```

🎉 **Your app is now running!**

---

## Option 2: View Code on GitHub (No Installation)

If you can't install packages, you can still view the code:

### View Files Directly on GitHub

1. Go to your repository: `https://github.com/YOUR_USERNAME/lease-u`
2. Click on any file to view its contents
3. Use the file browser to navigate through folders

### View README

The README.md file will automatically display on your repository's main page, showing:
- Project description
- Setup instructions
- Features list

---

## Option 3: Use Online IDE (No Local Installation)

### Using StackBlitz (Recommended)

1. Go to **https://stackblitz.com**
2. Click **"Import from GitHub"**
3. Paste your repository URL: `https://github.com/YOUR_USERNAME/lease-u`
4. Click **"Import"**
5. StackBlitz will:
   - Clone your repo
   - Install dependencies automatically
   - Start the dev server
   - Open a preview in the browser

**Note:** Database operations might be limited in StackBlitz, but you can view the UI and code.

### Using CodeSandbox

1. Go to **https://codesandbox.io**
2. Click **"Import from GitHub"**
3. Paste your repository URL
4. Click **"Import and fork"**
5. Wait for setup to complete

### Using GitHub Codespaces (If Available)

1. Go to your repository on GitHub
2. Click the green **"Code"** button
3. Select **"Codespaces"** tab
4. Click **"Create codespace on main"**
5. Wait for the environment to load
6. Run commands in the terminal:
   ```bash
   npm install
   npx prisma generate
   npx prisma db push
   npm run db:seed
   npm run dev
   ```

---

## Option 4: Download ZIP (View Code Offline)

### Download from GitHub

1. Go to your repository: `https://github.com/YOUR_USERNAME/lease-u`
2. Click the green **"Code"** button
3. Click **"Download ZIP"**
4. Extract the ZIP file
5. Open files in your code editor (VS Code, etc.)

**Note:** This only lets you view code, not run the app.

---

## Quick Command Reference

Once you've cloned and are in the project folder:

```bash
# Install everything
npm install

# Setup database
npx prisma generate
npx prisma db push
npm run db:seed

# Run the app
npm run dev

# Open browser to
# http://localhost:3000
```

---

## Troubleshooting

### "npm: command not found"
- Install Node.js from: https://nodejs.org
- Restart your terminal after installing

### "git: command not found"
- Install Git from: https://git-scm.com/downloads
- Restart your terminal after installing

### Database errors
- Make sure you ran `npx prisma generate` first
- Check that `.env` file exists with correct DATABASE_URL

### Port 3000 already in use
```bash
# Kill process on port 3000 (Windows)
netstat -ano | findstr :3000
taskkill /PID <PID_NUMBER> /F

# Or run on different port
npm run dev -- -p 3001
```

### Can't clone (authentication error)
- Use HTTPS URL (not SSH)
- Or use GitHub Desktop app instead

---

## Test Accounts (After Seeding Database)

**Admin:**
- Username: `admin-temp`
- Password: `leaseu-admin`

**Host:**
- Email: `sarah@fsu.edu`
- Password: `password123`

---

## What You'll See

When running locally, you can:
- ✅ Browse listings on the landing page
- ✅ View university feeds (FSU, UF, UCF)
- ✅ See listing details
- ✅ Create listings (as host)
- ✅ Moderate listings (as admin)
- ✅ Test all features interactively

---

## Next Steps

- **Deploy to Vercel** (free hosting): https://vercel.com
- **Deploy to Netlify**: https://netlify.com
- **Share your GitHub repo** with others
- **Add more features** and push updates

---

**Need help?** Check the main README.md for detailed setup instructions.
