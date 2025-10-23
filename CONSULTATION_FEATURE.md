# Fitur Konsultasi Gratis - Prana Argentum

## Deskripsi
Fitur konsultasi gratis memungkinkan customer untuk mengirim request konsultasi melalui form modal yang muncul ketika mengklik tombol "Konsultasi Gratis" di halaman utama. Request tersebut kemudian akan muncul di halaman admin untuk dikelola.

## Komponen yang Ditambahkan

### 1. Database Schema
- **Model**: `ConsultationRequest` di `prisma/schema.prisma`
- **Enum**: 
  - `ConsultationServiceType`: Jenis layanan yang bisa dikonsultasikan
  - `ConsultationStatus`: Status request (PENDING, IN_PROGRESS, COMPLETED, CANCELLED)

### 2. API Endpoints
- **GET** `/api/consultation-requests` - Mendapatkan semua request konsultasi
- **POST** `/api/consultation-requests` - Membuat request konsultasi baru
- **PUT** `/api/consultation-requests/[id]` - Update status dan notes konsultasi
- **DELETE** `/api/consultation-requests/[id]` - Hapus request konsultasi

### 3. Components
- **`components/consultation-modal.tsx`** - Modal form untuk customer mengirim request konsultasi
  - Form dengan validasi
  - Fields: nama, email, telepon, perusahaan, jenis layanan, pesan
  - Loading state dan error handling
  - Success feedback

### 4. Admin Dashboard
- **Tab baru**: "Request Konsultasi" di halaman admin
- **Fitur**:
  - Melihat semua request konsultasi
  - Update status request (Menunggu, Diproses, Selesai, Dibatalkan)
  - Menambah catatan admin
  - Menghapus request
  - Statistik jumlah request pending di dashboard

### 5. Integration
- **Halaman utama**: Tombol "Konsultasi Gratis" sekarang membuka modal form
- **API Client**: Functions untuk CRUD consultation requests
- **Types**: TypeScript types untuk ConsultationRequest

## Cara Penggunaan

### Untuk Customer:
1. Buka halaman utama website
2. Klik tombol "Konsultasi Gratis" 
3. Isi form konsultasi dengan data yang diperlukan
4. Klik "Kirim Request"
5. Tim admin akan menghubungi dalam 24 jam

### Untuk Admin:
1. Login ke admin dashboard
2. Buka tab "Request Konsultasi"
3. Lihat semua request yang masuk
4. Update status request sesuai progress
5. Tambahkan catatan admin jika diperlukan
6. Hapus request jika sudah tidak diperlukan

## Database Migration
Jalankan migration untuk menambahkan tabel consultation_requests:
```bash
npx prisma migrate dev --name add_consultation_requests
```

## Testing
1. Buka halaman utama dan klik tombol "Konsultasi Gratis"
2. Isi form dan submit
3. Login sebagai admin dan cek tab "Request Konsultasi"
4. Test update status dan hapus request

## Fitur Tambahan yang Bisa Dikembangkan
- Email notification ke admin ketika ada request baru
- Email konfirmasi ke customer setelah submit
- Filter dan search di halaman admin
- Export data request ke Excel
- Chat atau follow-up system
