# Quick Start - Copy & Paste Commands

Copy these commands one by one into your terminal (replace YOUR_USERNAME and REPO_NAME):

```bash
# 1. Navigate to project folder
cd C:\Users\user\Desktop\edu

# 2. Initialize git
git init

# 3. Add all files
git add .

# 4. Create first commit
git commit -m "Initial commit: Lease U - Campus housing web app"

# 5. Add GitHub remote (REPLACE with your actual GitHub URL!)
git remote add origin https://github.com/YOUR_USERNAME/REPO_NAME.git

# 6. Set branch to main
git branch -M main

# 7. Push to GitHub
git push -u origin main
```

## Before Step 7, you need:

1. **Create GitHub repo** at https://github.com/new
   - Name: `lease-u`
   - Don't check any boxes
   - Click "Create repository"

2. **Get Personal Access Token** (for authentication):
   - GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
   - Generate new token → Check "repo" → Generate
   - Copy the token (use as password when pushing)

3. **When prompted during `git push`:**
   - Username: Your GitHub username
   - Password: Paste your Personal Access Token (not your GitHub password!)

---

**Full detailed guide:** See `GITHUB_SETUP_GUIDE.md`
