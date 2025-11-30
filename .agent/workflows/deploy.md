---
description: Deploy aplikasi ke production (Vercel + Railway) - Monorepo Setup
---

# Workflow Deployment - Akuntasi Mitra (Monorepo)

Workflow ini akan memandu Anda deploy aplikasi ke production menggunakan:
- **Vercel** untuk Frontend (Next.js)
- **Railway** untuk Backend (NestJS) + Database (PostgreSQL)

Karena ini adalah **Monorepo** (Frontend & Backend dalam satu folder), langkah-langkahnya sedikit berbeda dari biasanya.

---

## Prerequisites

Sebelum mulai, pastikan Anda punya:
- [ ] Akun GitHub (untuk push code)
- [ ] Akun Vercel (https://vercel.com)
- [ ] Akun Railway (https://railway.app)
- [ ] Git sudah terinstall

---

## Part 1: Persiapan Repository

### 1. Push ke GitHub

Pastikan seluruh folder project (`Website-Dashboard`) di-push ke GitHub repository baru.

```bash
git init
git add .
git commit -m "Ready for deployment"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/akuntasi-mitra.git
git push -u origin main
```

---

## Part 2: Deploy Backend ke Railway

### 1. Buat Project Baru di Railway
1. Buka Dashboard Railway -> **New Project** -> **Deploy from GitHub repo**.
2. Pilih repository `akuntasi-mitra` Anda.
3. Klik **Deploy Now**.

### 2. Konfigurasi Build & Start Command
Karena ini monorepo, kita perlu memberi tahu Railway cara menjalankan backend saja.

1. Buka **Settings** di service yang baru dibuat.
2. Scroll ke bagian **Build**.
   - **Build Command**: `npm run build:server`
3. Scroll ke bagian **Deploy**.
   - **Start Command**: `npm run start:prod`
4. Railway akan otomatis redeploy.

### 3. Tambahkan PostgreSQL Database
1. Klik tombol **New** (atau klik kanan di canvas) -> **Database** -> **PostgreSQL**.
2. Tunggu hingga database ter-deploy.

### 4. Set Environment Variables
Buka tab **Variables** di service backend Anda, lalu tambahkan:

- `DATABASE_URL`: (Otomatis ada jika PostgreSQL sudah ditambahkan, jika belum, copy dari tab Connect PostgreSQL)
- `JWT_SECRET`: (Isi dengan random string aman)
- `GOOGLE_CLIENT_ID`: (Dari Google Cloud Console)
- `GOOGLE_CLIENT_SECRET`: (Dari Google Cloud Console)
- `MAILERSEND_API_KEY`: (API Key email service)
- `EMAIL_FROM`: (Email pengirim)
- `FRONTEND_URL`: (Nanti diisi setelah deploy frontend, sementara isi `http://localhost:3000`)
- `PORT`: `3001` (Atau biarkan kosong, Railway akan assign port random dan `main.ts` kita sudah support `process.env.PORT`)

### 5. Generate Domain
1. Buka tab **Settings** -> **Networking**.
2. Klik **Generate Domain**.
3. Copy domain tersebut (misal: `backend-production.up.railway.app`).

### 6. Run Database Migration
Di local terminal Anda (pastikan terkoneksi internet):

```bash
# Ganti dengan connection string dari Railway (Tab Connect -> PostgreSQL Connection URL)
# Format: postgresql://postgres:password@roundhouse.proxy.rlwy.net:PORT/railway
set DATABASE_URL="postgresql://..." 

# Jalankan migrasi ke database production
npx prisma migrate deploy
npx prisma db seed
```

---

## Part 3: Deploy Frontend ke Vercel

### 1. Import Project di Vercel
1. Buka Dashboard Vercel -> **Add New...** -> **Project**.
2. Import repository `akuntasi-mitra`.

### 2. Konfigurasi Build
Vercel biasanya otomatis mendeteksi Next.js. Namun pastikan:

- **Framework Preset**: Next.js
- **Root Directory**: `./` (default)
- **Build Command**: `npm run build:client` (Override jika perlu, tapi default `next build` juga oke)
- **Output Directory**: `.next` (default)

### 3. Set Environment Variables
Di bagian **Environment Variables**, tambahkan:

- `NEXT_PUBLIC_API_URL`: `https://backend-production.up.railway.app` (Domain dari Railway Part 2 Step 5)

### 4. Deploy
Klik **Deploy**.

---

## Part 4: Finalisasi

### 1. Update Backend FRONTEND_URL
1. Copy domain frontend dari Vercel (misal: `akuntasi-mitra.vercel.app`).
2. Kembali ke Railway -> Service Backend -> **Variables**.
3. Update `FRONTEND_URL` dengan domain Vercel tersebut.
4. Railway akan redeploy otomatis.

### 2. Update Google OAuth
1. Buka Google Cloud Console.
2. Update **Authorized JavaScript origins**: `https://akuntasi-mitra.vercel.app`
3. Update **Authorized redirect URIs**: `https://backend-production.up.railway.app/auth/google/callback`
4. Update variable `GOOGLE_CALLBACK_URL` di Railway jika Anda menggunakannya di code.

---

## Troubleshooting

- **Backend Error**: Cek Logs di Railway. Pastikan `DATABASE_URL` benar.
- **Frontend Error**: Cek Logs di Vercel. Pastikan `NEXT_PUBLIC_API_URL` tidak berakhiran slash `/` jika code Anda menambahkannya manual.
