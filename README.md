# Bakul Converse - Toko Sepatu Online

## Deskripsi Proyek

Bakul Converse adalah platform e-commerce yang dirancang khusus untuk penjualan sepatu Converse secara online. Proyek ini dikembangkan sebagai bagian dari tugas Mid Term Project mata kuliah Pemrograman Berbasis Platform (PBP) 2025. Platform ini mengimplementasikan aplikasi web modern dengan fokus pada user experience yang responsif dan menarik bagi para penggemar sepatu Converse.

## Tech Stack

Proyek ini diimplementasikan menggunakan:

- **Frontend**: Next.js (React)
- **Backend**: Next.js API Routes
- **Database**: Supabase (PostgreSQL)
- **Styling**: Tailwind CSS
- **State Management**: React Context API
<!-- - **Deployment**: Vercel -->

## Fitur Utama

- **Authentication & Authorization**
  - Register, login, dan logout user
  - Role-based access control (admin & customer)
- **Product Management**
  - Katalog produk Converse dengan filter dan sorting
  - Detail produk dengan multiple images
  - Panduan ukuran interaktif
- **Shopping Experience**
  - Cart management (add, remove, update quantity)
  - Wishlist functionality
  - Checkout process
- **User Dashboard**
  - Profile management
  - Order history
  - Address management
- **Admin Panel**
  - Product CRUD operations
  - Order management
  - User management

## Panduan Instalasi

### Prasyarat

- Node.js versi 14.x atau lebih tinggi
- npm atau yarn
- Akun Supabase

### Setup Lokal

1. Clone repository

   ```bash
   git clone https://github.com/bruhismyname/toko-online.git
   cd toko-online
   ```

2. Install dependencies

   ```bash
   npm install
   # atau
   yarn install
   ```

3. Setup environment variables

   - Salin file `.env.example` ke `.env.local`
   - Update dengan credentials Supabase Anda:

   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   ```

4. Jalankan development server

   ```bash
   npm run dev
   # atau
   yarn dev
   ```

5. Buka `http://localhost:3000` di browser

## Halaman & Fitur

### 1. Homepage

- Featured Converse products
- Categories navigation
- New arrivals
- Special offers

### 2. Product Catalog

- Grid/list view
- Sorting (price, popularity)
- Filtering (size, model, color)
- Search functionality

### 3. Product Detail

- Multiple product images
- Size selection
- Add to cart
- Add to wishlist
- Product description
- Related products

### 4. Cart & Checkout

- Cart summary
- Update quantities
- Remove items
- Shipping information
- Payment method selection
- Order confirmation

### 5. User Dashboard

- Profile settings
- Order history
- Address book

### 6. Admin Panel

- Product management
- Order management
- User management
- Analytics dashboard

## Tim Pengembang (Kelompok 9 PBP E)

- Sulhan Fuadi (24060123130115) - Product Manager & Minor Full-stack Developer
- Rajwaa Muflihul Aufaa (24060123140189) - Lead Frontend & Full-stack Developer
- Rangga Mulki Aji Muzaki (24060123140153) - Admin-focused Full-stack Developer
- Steven Jonathan Sihombing (24060123120044) - Lead Engineer & Full-stack Developer

## Kontribusi

Untuk kontribusi ke proyek ini:

1. Fork repository
2. Buat branch baru (`git checkout -b feature/fiturKeren`)
3. Commit perubahan (`git commit -m 'Menambahkan fitur keren'`)
4. Push ke branch (`git push origin feature/fiturKeren`)
5. Buat Pull Request

---

Dibuat dengan ❤️ oleh Kelompok 9 PBP E - Informatika Undip 2025
