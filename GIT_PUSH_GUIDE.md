# Push Code ke Repository Pribadi - Setup Guide

## Step 1: Buat Repository Baru di GitHub
1. Login ke GitHub dengan akun: **nuranisadina**
2. Klik tombol "+" → "New repository"
3. Nama repo: `Website-Dashboard` (atau nama lain)
4. **JANGAN** initialize dengan README/gitignore
5. Klik "Create repository"

## Step 2: Change Remote URL
```bash
# Remove remote lama
git remote remove origin

# Add remote baru ke repo Anda
git remote add origin https://github.com/nuranisadina/Website-Dashboard.git

# Verify
git remote -v
```

## Step 3: Commit & Push
```bash
# Stage all changes
git add .

# Commit
git commit -m "Initial commit: Full accounting dashboard with Next.js"

# Push ke repository baru Anda
git push -u origin main
```

## Step 4: Authentication
Saat push, akan muncul prompt login:
- **Username**: nuranisadina
- **Password**: [Personal Access Token - buat di GitHub Settings]

### Cara Buat Token:
1. https://github.com/settings/tokens
2. Generate new token (classic)
3. Pilih scope: `repo`
4. Copy token
5. Paste sebagai password saat push

## Alternative: GitHub Desktop
Install GitHub Desktop - otomatis handle authentication!
https://desktop.github.com/

---

**Ready to execute?**
Buat repo dulu di GitHub, lalu jalankan commands di atas!
