# RISA BUR - Sistem Informasi Manajemen Kantor Jasa Akuntan

Platform manajemen layanan akuntansi modern berbasis web yang dirancang untuk memfasilitasi interaksi antara Klien, Akuntan, dan Administrator dalam mengelola layanan akuntansi secara efisien dan terstruktur.

![RISA BUR Dashboard](public/logo-risabur.png)

## 🌟 Tentang Proyek

RISA BUR adalah sistem informasi terintegrasi yang menggabungkan Landing Page publik dengan Dashboard manajemen komprehensif, dibangun menggunakan teknologi modern untuk memberikan pengalaman pengguna yang optimal dan performa yang cepat.

## 🚀 Fitur Utama

### 📱 Landing Page Publik
- **Modern UI/UX**: Desain responsif dengan dark mode dan glassmorphism effect
- **Animasi Halus**: Implementasi Framer Motion untuk transisi yang smooth
- **Katalog Layanan**: Menampilkan detail layanan akuntansi (Laporan Keuangan, Pembukuan, Perpajakan, dll.)
- **Halaman Detail Layanan**: Setiap layanan memiliki halaman khusus dengan informasi lengkap
- **Halaman Kontak**: Formulir kontak dengan integrasi Google Maps
- **WhatsApp Integration**: Floating button WhatsApp untuk komunikasi cepat
- **SEO Optimized**: Meta tags dan semantic HTML untuk SEO terbaik

### 👥 Dashboard Admin
- **Overview & Analytics**: Statistik pendapatan, pesanan, dan performa layanan
- **Manajemen User**: Kelola akun Klien dan Akuntan (CRUD)
- **Manajemen Layanan**: Tambah, edit, hapus layanan yang ditawarkan
- **Manajemen Pesanan**: Monitor dan update status pengerjaan proyek
- **Manajemen Pembayaran**: Tracking pembayaran dari semua klien
- **Export Data**: Export ke PDF dan Excel untuk laporan
- **Grafik Interaktif**: Visualisasi data menggunakan Recharts

### 💼 Dashboard Klien
- **Order Layanan**: Memesan layanan akuntansi secara online
- **Tracking Progress**: Monitor status pengerjaan real-time
- **Upload Dokumen**: Upload bukti transaksi dan dokumen pendukung via drag & drop
- **Riwayat Pesanan**: Lihat semua pesanan yang pernah dibuat
- **Riwayat Pembayaran**: Detail pembayaran dan invoice
- **Notifikasi**: Update status pesanan

### 📊 Dashboard Akuntan
- **Task Management**: Daftar pekerjaan yang ditugaskan
- **Update Progress**: Update status pengerjaan untuk visibility klien
- **Upload Hasil**: Upload deliverables dan laporan
- **Manajemen Pesanan**: Lihat detail pesanan yang ditugaskan

## 🛠 Tech Stack

### Frontend
- **Framework**: [Next.js 14](https://nextjs.org/) dengan App Router
- **Language**: TypeScript
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: Custom components dengan glassmorphism design
- **Icons**: [Lucide React](https://lucide.dev/)
- **Animation**: [Framer Motion](https://www.framer.com/motion/)
- **Charts**: [Recharts](https://recharts.org/)
- **Form Handling**: React Hook Form + Zod validation
- **File Upload**: React Dropzone
- **HTTP Client**: Axios dengan TanStack React Query
- **PDF Export**: jsPDF + jsPDF-AutoTable
- **Excel Export**: XLSX

### Backend Integration
- **Database**: [PostgreSQL](https://www.postgresql.org/)
- **ORM**: [Prisma](https://www.prisma.io/)
- **Authentication**: JWT & Google OAuth 2.0
- **Email**: MailerSend integration

### Development Tools
- **Linting**: ESLint + Prettier
- **Type Safety**: TypeScript strict mode
- **Git**: Version control dengan best practices

## 📁 Struktur Proyek

```
Website-Dashboard/
├── prisma/
│   ├── schema.prisma      # Database schema
│   └── seed.ts            # Database seeding
├── public/                # Static assets
│   ├── images/           # Gambar dan logo
│   └── ...
├── src/
│   ├── app/              # Next.js App Router
│   │   ├── (auth)/      # Auth pages (login, register)
│   │   ├── contact/     # Halaman kontak
│   │   ├── dashboard/   # Dashboard pages
│   │   │   ├── admin/   # Admin dashboard
│   │   │   ├── akuntan/ # Akuntan dashboard
│   │   │   └── klien/   # Klien dashboard
│   │   ├── services/    # Service detail pages
│   │   └── page.tsx     # Landing page
│   ├── client/
│   │   ├── components/  # Reusable components
│   │   ├── context/     # React context providers
│   │   └── hooks/       # Custom React hooks
│   └── server/
│       ├── actions/     # Server actions
│       └── lib/         # Utility functions
├── .env                  # Environment variables
├── .env.example         # Environment template
├── next.config.js       # Next.js configuration
├── tailwind.config.js   # Tailwind configuration
└── package.json         # Dependencies

```

## 📦 Instalasi & Setup

### Prerequisites
- Node.js v18.0.0 atau lebih tinggi
- npm v9.0.0 atau lebih tinggi
- PostgreSQL Database
- Google Cloud Console account (untuk OAuth & Maps)

### Langkah Setup

1. **Clone Repository**
   ```bash
   git clone https://github.com/rivzee/Website-Dashboard.git
   cd Website-Dashboard
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Setup Environment Variables**
   
   Copy file `.env.example` ke `.env`:
   ```bash
   copy .env.example .env
   ```
   
   Kemudian isi variabel berikut di file `.env`:
   ```env
   # Database
   DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE"
   
   # NextAuth
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="your-secret-key-here"
   
   # Google OAuth
   GOOGLE_CLIENT_ID="your-google-client-id"
   GOOGLE_CLIENT_SECRET="your-google-client-secret"
   
   # Google Maps
   NEXT_PUBLIC_GOOGLE_MAPS_API_KEY="your-maps-api-key"
   
   # Email (MailerSend)
   MAILERSEND_API_KEY="your-mailersend-api-key"
   EMAIL_FROM="noreply@yourdomain.com"
   ```

4. **Setup Database dengan Prisma**
   ```bash
   # Generate Prisma Client
   npm run prisma:generate

   # Jalankan migrasi database
   npm run prisma:migrate

   # Seed database dengan data awal
   npm run prisma:seed
   ```

5. **Jalankan Development Server**
   ```bash
   npm run dev
   ```
   
   Aplikasi akan berjalan di: **http://localhost:3000**

6. **Login Pertama Kali**
   
   Setelah seeding, gunakan kredensial berikut untuk login:
   - **Admin**: admin@risabur.com / admin123
   - **Akuntan**: akuntan@risabur.com / akuntan123
   - **Klien**: klien@risabur.com / klien123

## 🚀 Deployment

### Deployment ke Vercel (Recommended)

1. Push kode ke GitHub repository
2. Import project di [Vercel](https://vercel.com)
3. Set environment variables di Vercel dashboard
4. Deploy otomatis akan berjalan

**Environment Variables yang diperlukan:**
- `DATABASE_URL`
- `NEXTAUTH_URL` (ubah ke domain production)
- `NEXTAUTH_SECRET`
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`
- `MAILERSEND_API_KEY`
- `EMAIL_FROM`

### Build untuk Production

```bash
# Build aplikasi
npm run build

# Jalankan production server
npm start
```

## 🔧 Scripts yang Tersedia

- `npm run dev` - Menjalankan development server
- `npm run build` - Build untuk production
- `npm start` - Menjalankan production server
- `npm run lint` - Menjalankan ESLint
- `npm run format` - Format kode dengan Prettier
- `npm run prisma:generate` - Generate Prisma Client
- `npm run prisma:migrate` - Jalankan database migration
- `npm run prisma:studio` - Buka Prisma Studio
- `npm run prisma:seed` - Seed database dengan data awal

## 🔐 Autentikasi & Autorisasi

Aplikasi menggunakan JWT-based authentication dengan role-based access control:

- **ADMIN**: Akses penuh ke semua fitur
- **AKUNTAN**: Akses ke task management dan orderan
- **KLIEN**: Akses ke order layanan dan tracking

Login dapat dilakukan melalui:
- Email & Password (traditional login)
- Google OAuth 2.0

## 📊 Database Schema

Database menggunakan PostgreSQL dengan schema Prisma yang mencakup:
- Users (dengan role-based system)
- Services (layanan yang ditawarkan)
- Orders (pesanan dari klien)
- Payments (pembayaran)
- Documents (upload file)

## 🎨 Design System

Aplikasi menggunakan design system yang konsisten:
- **Color Palette**: Blue, Purple, Pink gradients
- **Typography**: Inter font family
- **Layout**: Responsive grid system
- **Components**: Glassmorphism cards dengan backdrop blur
- **Dark Mode**: Full dark mode support

## 📱 Fitur Responsif

Semua halaman fully responsive dengan breakpoints:
- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px

## 🤝 Kontribusi

Untuk kontribusi, silakan:
1. Fork repository
2. Buat branch fitur (`git checkout -b feature/AmazingFeature`)
3. Commit perubahan (`git commit -m 'Add some AmazingFeature'`)
4. Push ke branch (`git push origin feature/AmazingFeature`)
5. Buat Pull Request

## 📝 Lisensi

This project is **UNLICENSED** - Private project untuk RISA BUR.

## 👥 Tim Pengembang

**RISA BUR Development Team**

## 📧 Kontak

Untuk pertanyaan atau dukungan, hubungi:
- Website: [RISA BUR Official](https://risabur.com)
- Email: info@risabur.com

---

**Dibuat dengan ❤️ menggunakan Next.js 14 dan TypeScript**
