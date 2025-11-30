# RISA BUR - Sistem Informasi Kantor Jasa Akuntan

Platform manajemen layanan akuntansi modern yang terintegrasi, dirancang untuk memfasilitasi interaksi antara Klien, Akuntan, dan Administrator. Aplikasi ini mencakup Landing Page publik dan Dashboard manajemen yang komprehensif.

![RISA BUR Dashboard](public/logo-risabur.png)

## 🚀 Fitur Utama

### 1. Public Landing Page
- **Modern UI/UX**: Desain responsif dengan animasi halus (Framer Motion).
- **Layanan**: Informasi detail mengenai jasa Laporan Keuangan, Pembukuan, Perpajakan, dll.
- **Interaktif**: Formulir kontak dan integrasi WhatsApp.

### 2. Dashboard Admin
- **Overview Statistik**: Pendapatan, total pesanan, dan kinerja layanan.
- **Manajemen User**: Mengelola akun Klien dan Akuntan.
- **Manajemen Pesanan**: Memantau status pengerjaan proyek.
- **Laporan Keuangan**: Grafik tren pendapatan dan aktivitas.

### 3. Dashboard Klien
- **Order Layanan**: Memesan layanan akuntansi secara online.
- **Tracking Progress**: Memantau status pengerjaan laporan keuangan.
- **Upload Dokumen**: Mengirim bukti transaksi dan dokumen pendukung.
- **Riwayat Pembayaran**: Melihat status pembayaran dan invoice.

### 4. Dashboard Akuntan
- **Task Management**: Melihat daftar pekerjaan yang ditugaskan.
- **Update Progress**: Memperbarui status pengerjaan untuk dilihat klien.

## 🛠 Tech Stack

**Frontend:**
- **Framework**: [Next.js 14](https://nextjs.org/) (App Router)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Animation**: [Framer Motion](https://www.framer.com/motion/)
- **Charts**: [Recharts](https://recharts.org/)

**Backend:**
- **Framework**: [NestJS](https://nestjs.com/)
- **Database**: [PostgreSQL](https://www.postgresql.org/)
- **ORM**: [Prisma](https://www.prisma.io/)
- **Auth**: JWT & Google OAuth

**Monorepo Structure:**
- Frontend dan Backend terintegrasi dalam satu repositori untuk kemudahan pengembangan.

## 📦 Instalasi & Menjalankan Local

### Prerequisites
- Node.js (v18+)
- PostgreSQL Database

### Langkah-langkah

1. **Clone Repository**
   ```bash
   git clone https://github.com/username/akuntasi-mitra.git
   cd akuntasi-mitra
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Setup Environment Variables**
   Copy file `.env.example` ke `.env` dan sesuaikan isinya.
   ```bash
   cp .env.example .env
   ```
   Pastikan `DATABASE_URL` sudah diisi sesuai kredensial PostgreSQL Anda.

4. **Setup Database**
   ```bash
   # Generate Prisma Client
   npm run prisma:generate

   # Push schema ke database
   npm run prisma:migrate

   # Seeding data awal (Admin user, layanan, dll)
   npm run prisma:seed
   ```

5. **Jalankan Aplikasi**
   ```bash
   npm run dev
   ```
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:3001

## 🚀 Deployment

### Backend (Railway/VPS)
Build command:
```bash
npm run build:server
```
Start command:
```bash
npm run start:prod
```

### Frontend (Vercel/Netlify)
Build command:
```bash
npm run build:client
```

## 📝 Lisensi

[MIT](LICENSE)
