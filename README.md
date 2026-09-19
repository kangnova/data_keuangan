# 💰 FinansialKu - Personal Wealth & Cashflow Hub

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Visit%20App-4f46e5?style=for-the-badge&logo=vercel&logoColor=white)](https://datakeuangan-smoky.vercel.app/)
[![Next.js](https://img.shields.io/badge/Next.js%2016-black?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React%2019-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase%20PostgreSQL-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com/)
[![Prisma](https://img.shields.io/badge/Prisma%20ORM-2D3748?style=for-the-badge&logo=prisma&logoColor=white)](https://www.prisma.io/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS%20v4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

> **Aplikasi Web Manajemen & Pencatatan Keuangan Pribadi Modern** berbasis Next.js 16, React 19, Prisma ORM, dan PostgreSQL Supabase. Dirancang dengan tampilan FinTech glassmorphism yang responsif, visualisasi analitik interaktif, mode privasi, dan generator laporan keuangan siap cetak ke PDF.

🔗 **Akses Aplikasi Langsung (Live Demo):** [https://datakeuangan-smoky.vercel.app/](https://datakeuangan-smoky.vercel.app/)

---

## 🚀 Fitur Unggulan (Key Features)

### 1. 💼 Manajemen Multi-Kantong Dana (Multi-Account)
* Mengelola berbagai instrumen penyimpanan dana secara terpisah: **Rekening Bank**, **Dompet Tunai (Cash)**, **E-Wallet**, dan **Portofolio Investasi**.
* Dilengkapi preset rekening populer Indonesia (BCA, Mandiri, BRI, GoPay, OVO, DANA, Bibit).
* Fitur penambahan kantong baru dengan custom icon, nomor rekening, warna aksen, dan saldo awal.

### 2. 🔄 Buku Kas & Mutasi Transaksi Atomik
* Pencatatan 3 tipe mutasi: **Pemasukan (Income)**, **Pengeluaran (Expense)**, dan **Transfer Antar Kantong (Transfer)**.
* **Atomic Balance Rollback**: Menghapus transaksi akan otomatis membalikkan saldo rekening ke posisi semula secara akurat.
* Input cepat dengan tombol shortcut nominal (+50rb, +100rb, +500rb, +1jt).
* Filter transaksi instan berdasarkan tipe dan pencarian kata kunci secara real-time.

### 3. 👁️ Privacy Mode (Mode Sensor Saldo)
* Proteksi privasi saat membuka aplikasi di ruang publik dengan satu klik toggle mata (`Rp ••••••••`).
* Preferensi tersimpan otomatis pada `localStorage`.

### 4. 📊 Grafik Analitik & Finansial Intelligence
* **Cashflow Trend Chart**: Perbandingan visual antara pemasukan dan pengeluaran harian, mingguan, bulanan, atau tahunan menggunakan Recharts.
* **Category Breakdown (Donut Chart)**: Rincian persentase belanja berdasarkan kategori untuk mengevaluasi kebocoran anggaran.

### 5. 🖨️ Generator Laporan Keuangan Siap Cetak (HTML & PDF)
* Menghasilkan dokumen rekap keuangan berformat resmi, bersih, dan elegan.
* Tombol **Cetak Laporan** yang langsung terhubung ke dialog print browser (*Save as PDF*).
* Fitur unduh berkas offline `.html` langsung ke komputer.

### 6. 🌙 Dark Mode & Desain Responsif
* Desain UI FinTech modern dengan aksen glassmorphism, tipografi bersih, dan palet warna HSL kontras tinggi.
* Mendukung penuh tema Gelap (Dark Mode) dan Terang (Light Mode).
* Responsif di semua perangkat (Desktop, Tablet, dan Smartphone) dengan bottom navigation bar khusus mobile.

---

## 🛠️ Tech Stack & Arsitektur

| Komponen | Teknologi | Keterangan |
| :--- | :--- | :--- |
| **Framework** | Next.js 16 (App Router) | Server Components & Server Actions |
| **Frontend Library** | React 19 | Hooks, Suspense, State Management |
| **Language** | TypeScript | Strict type checking & interfaces |
| **Styling** | Tailwind CSS v4 | Modern styling with PostCSS plugin |
| **Icons & Charts** | Lucide React & Recharts | Dynamic SVG icons & responsive data visualization |
| **ORM** | Prisma ORM 6 | Schema migrations, type-safe queries, connection pooler |
| **Database** | PostgreSQL (Supabase) | Cloud relational database with pooled transactions |
| **Deployment** | Vercel | Production CI/CD automated pipeline |

---

## 🗄️ Skema Database (Database Schema)

Aplikasi menggunakan skema relasional di PostgreSQL:
* **Account**: Menyimpan data kantong dana, tipe, warna tema, saldo awal, dan saldo saat ini.
* **Category**: Kategori pemasukan dan pengeluaran.
* **Transaction**: Rekod mutasi keuangan dengan relasi ke akun sumber (`FromAccount`), akun tujuan (`ToAccount` untuk transfer), dan relasi ke `Category`.

---

## 💻 Menjalankan Secara Lokal (Local Development)

### Prasyarat:
* Node.js versi 18+ atau 20+
* Akun PostgreSQL (Lokal / Docker / Supabase)

### Langkah Instalasi:

1. **Clone repositori:**
   ```bash
   git clone https://github.com/kangnova/data_keuangan.git
   cd data_keuangan
   ```

2. **Install dependensi:**
   ```bash
   npm install
   ```

3. **Konfigurasi Environment Variables:**
   Buat file `.env` di root direktori:
   ```env
   DATABASE_URL="postgresql://username:password@host:6543/postgres?pgbouncer=true"
   DIRECT_URL="postgresql://username:password@host:5432/postgres"
   ```

4. **Sinkronkan skema database:**
   ```bash
   npx prisma db push
   ```

5. **Jalankan server pengembangan:**
   ```bash
   npm run dev
   ```
   Buka [http://localhost:3000](http://localhost:3000) di browser Anda.

---

## 👨‍💻 Pengembang

Dibuat oleh **[Nova Suharyanto](https://github.com/kangnova)**
* Live URL: [https://datakeuangan-smoky.vercel.app/](https://datakeuangan-smoky.vercel.app/)
* GitHub Repo: [https://github.com/kangnova/data_keuangan](https://github.com/kangnova/data_keuangan)
