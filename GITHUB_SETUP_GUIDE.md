# Complete GitHub Setup Guide - Step by Step

This guide will walk you through creating a GitHub repository and uploading your Lease U project.

---

## Part 1: Create GitHub Account (if you don't have one)

1. Go to **https://github.com**
2. Click **"Sign up"** in the top right
3. Enter your email, create a password, and choose a username
4. Verify your email address
5. Complete the setup process

---

## Part 2: Create a New Repository on GitHub

### Step 1: Navigate to Repository Creation
1. Once logged into GitHub, click the **"+"** icon in the top right corner
2. Select **"New repository"** from the dropdown menu

### Step 2: Fill in Repository Details
You'll see a form with these fields:

**Repository name:**
- Enter: `lease-u` (or any name you prefer, like `campus-housing-app`)

**Description (optional):**
- Enter: `Campus housing web app for students to find lease takeovers and roommates`

**Visibility:**
- Choose **Public** (anyone can see it) or **Private** (only you can see it)
- For a portfolio project, Public is usually fine

**IMPORTANT - Do NOT check these boxes:**
- ❌ Don't check "Add a README file" (we already have one)
- ❌ Don't check "Add .gitignore" (we already have one)
- ❌ Don't check "Choose a license" (optional, can add later)

### Step 3: Create Repository
1. Click the green **"Create repository"** button
2. You'll see a page with setup instructions - **don't follow those yet!**
3. **Copy the repository URL** - it will look like:
   ```
   https://github.com/yourusername/lease-u.git
   ```
   - Click the clipboard icon next to the URL to copy it
   - **Save this URL** - you'll need it in a moment

---

## Part 3: Prepare Your Local Project

### Step 1: Open Terminal/Command Prompt
- **Windows:** Press `Win + R`, type `cmd`, press Enter
- **Mac:** Press `Cmd + Space`, type `Terminal`, press Enter
- **Linux:** Press `Ctrl + Alt + T`

### Step 2: Navigate to Your Project Folder
```bash
# Change to your project directory
cd C:\Users\user\Desktop\edu

# Verify you're in the right place (should see your files)
dir
# or on Mac/Linux:
ls
```

### Step 3: Check if Git is Installed
```bash
git --version
```
- If you see a version number (like `git version 2.40.0`), you're good!
- If you see an error, install Git from: https://git-scm.com/downloads

---

## Part 4: Initialize Git and Make First Commit

### Step 1: Initialize Git Repository
```bash
git init
```
You should see: `Initialized empty Git repository in ...`

### Step 2: Check What Files Will Be Added
```bash
git status
```
This shows all files that will be committed. You should see:
- ✅ Files in green = will be added
- ❌ Files in red = ignored (like node_modules, .env)

### Step 3: Add All Files to Staging
```bash
git add .
```
The `.` means "add everything". You won't see output, but files are now staged.

### Step 4: Verify Files Are Staged
```bash
git status
```
Now you should see files listed as "Changes to be committed" in green.

### Step 5: Create Your First Commit
```bash
git commit -m "Initial commit: Lease U - Campus housing web app with Next.js, Prisma, and NextAuth"
```
You should see output like:
```
[main (root-commit) abc1234] Initial commit: Lease U...
 X files changed, Y insertions(+)
```

---

## Part 5: Connect to GitHub and Push

### Step 1: Add GitHub as Remote Repository
```bash
git remote add origin https://github.com/yourusername/lease-u.git
```
**Replace `yourusername/lease-u` with YOUR actual GitHub username and repository name!**

### Step 2: Verify Remote Was Added
```bash
git remote -v
```
You should see:
```
origin  https://github.com/yourusername/lease-u.git (fetch)
origin  https://github.com/yourusername/lease-u.git (push)
```

### Step 3: Rename Branch to Main (if needed)
```bash
git branch -M main
```
This ensures your branch is named "main" (GitHub's default).

### Step 4: Push to GitHub
```bash
git push -u origin main
```

**First time pushing?** You'll be prompted for authentication:

#### Option A: Personal Access Token (Recommended)
1. GitHub will ask for username and password
2. **Don't use your GitHub password!**
3. Instead, create a Personal Access Token:
   - Go to GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
   - Click "Generate new token (classic)"
   - Name it: "Lease U Project"
   - Select scopes: Check **"repo"** (gives full repository access)
   - Click "Generate token"
   - **COPY THE TOKEN IMMEDIATELY** (you won't see it again!)
   - Use this token as your password when pushing

#### Option B: GitHub CLI (Alternative)
```bash
# Install GitHub CLI first, then:
gh auth login
git push -u origin main
```

### Step 5: Verify Upload Success
After pushing, you should see:
```
Enumerating objects: X, done.
Counting objects: 100% (X/X), done.
Writing objects: 100% (X/X), done.
To https://github.com/yourusername/lease-u.git
 * [new branch]      main -> main
Branch 'main' set up to track remote branch 'main' from 'origin'.
```

---

## Part 6: Verify on GitHub

1. Go back to your browser
2. Refresh your GitHub repository page: `https://github.com/yourusername/lease-u`
3. You should now see:
   - ✅ All your files listed
   - ✅ README.md displayed
   - ✅ File count and commit message
   - ✅ Green "Code" button

**Congratulations! Your code is now on GitHub! 🎉**

---

## Troubleshooting

### Error: "remote origin already exists"
```bash
git remote remove origin
git remote add origin https://github.com/yourusername/lease-u.git
```

### Error: "failed to push some refs"
```bash
# If GitHub created a README, pull it first:
git pull origin main --allow-unrelated-histories
# Resolve any conflicts, then:
git push -u origin main
```

### Error: Authentication failed
- Make sure you're using a Personal Access Token, not your password
- Check that the token has "repo" scope enabled
- Verify your GitHub username is correct

### Want to update files later?
```bash
git add .
git commit -m "Update: describe your changes"
git push
```

---

## Quick Reference Card

```bash
# One-time setup
git init
git add .
git commit -m "Initial commit: Lease U web app"
git remote add origin https://github.com/yourusername/lease-u.git
git branch -M main
git push -u origin main

# Future updates
git add .
git commit -m "Your commit message"
git push
```

---

## Next Steps After Uploading

1. **Add a description** to your GitHub repo (click the gear icon next to "About")
2. **Add topics/tags** like: `nextjs`, `typescript`, `prisma`, `campus-housing`
3. **Create a GitHub Pages site** (optional) for live demo
4. **Share your repository** with others!

---

**Need help?** Check the error message and refer to the troubleshooting section above.
