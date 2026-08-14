# Product Requirements Document (PRD)

**Project:** Live E-Sports Tournament Bracket System  
**Author:** Zidny Al Hikam Mawarist  
**Version:** 1.1  

---

## 1. Visi Produk
Membangun *Single Page Application* (SPA) untuk menggantikan bagan turnamen manual dengan bagan dinamis beranimasi *real-time*, guna meningkatkan nilai produksi visual sebuah turnamen e-sports.

## 2. Roles & Akses
* **Admin (Secured Route):** Wajib *login*. Memiliki *sidebar dashboard* untuk mengelola Pengaturan, Peserta, dan *Match Controller*.
* **Viewer (Public Route):** Tampilan layar penuh 16:9 tanpa *login* dan tanpa tombol antarmuka, dirancang khusus untuk proyektor atau OBS *streaming*.

## 3. Alur Sistem (System Flow)
Alur logika sistem dibagi menjadi 4 tahapan utama:
1. **Tahap Setup (Persiapan):** Admin melakukan *login*, mengatur profil turnamen di halaman *Settings*, lalu berpindah ke halaman *Participants* untuk menginput data seluruh tim beserta logo.
2. **Tahap Generation (Pengacakan):** Admin menekan tombol "Shuffle & Generate". Sistem secara acak memasukkan tim ke dalam *slot* bagan penyisihan. Pada halaman *Live Viewer*, tim akan muncul menempati posisi awalnya.
3. **Tahap Progression (Proses Pertandingan):** Turnamen dimulai di dunia nyata. Saat sebuah ronde selesai, Admin masuk ke *Match Controller* dan menekan tombol **"Set Winner"** pada tim yang menang. 
4. **Tahap Real-Time Action (Eksekusi Visual):** Sistem memperbarui *database*, lalu melakukan *broadcasting* seketika ke halaman *Live Viewer*. Halaman *Viewer* menangkap data tersebut dan langsung memicu animasi komponen (tim pemenang bergerak maju, tim kalah meredup). Proses ini berulang hingga babak Grand Final.

## 4. Fitur Utama (Functional Requirements)
* **Team Management:** Tersedia *form* penambahan tim dan unggah logo.
* **Auto-Shuffle Engine:** Logika pengacakan tim secara otomatis ke dalam bagan (8 atau 16 slot).
* **Match Controller:** Antarmuka *grid* bagan interaktif dengan tombol "Set Winner" (memilih pemenang) dan "Undo" (membatalkan aksi jika Admin salah klik).
* **Real-Time Sync:** Sinkronisasi instan satu arah (Admin -> Viewer) tanpa perlu memuat ulang (*reload*) halaman.

## 5. UI/UX & Design Constraints
* **Tema Utama:** *Clean Monochromatic Blue* (Navy, Slate, Ice Blue, Champagne Gold). Dilarang menggunakan warna neon yang terlalu mencolok/norak.
* **Aturan Tipografi Ketat:** *Font* (jenis, ketebalan, spasi) **WAJIB 100% sama persis** dengan desain poster acara. Tidak diizinkan menggunakan *font* alternatif apa pun demi konsistensi *branding*.
* **Animasi (Viewer Screen):** 
    * *Winner State:* Kartu membesar 105%, memancarkan pendaran biru (*soft glow*), dan bergerak translasi pindah ke babak selanjutnya.
    * *Eliminated State:* Filter *grayscale* aktif dan *opacity* turun menjadi 40%.
    * *Champion State:* Aksen warna berubah menjadi emas (*Champagne Gold*).
* **Ambient Elements:** Latar belakang halaman *Viewer* wajib memiliki tekstur *hex-grid* 5%, efek partikel melayang (CSS), dan *running text ticker* di area *lower-third* layar untuk nuansa *broadcast* profesional.

## 6. Technology Stack
* **Frontend:** React.js (menggunakan Vite atau Next.js).
* **Styling:** Tailwind CSS (untuk implementasi *glassmorphism* dan *glow* secara cepat).
* **Animation:** Framer Motion (fitur `layout` untuk menangani transisi pergerakan *name tag* antar-bagan secara presisi dan mulus).
* **Backend, Database & Sync:** Supabase (PostgreSQL). Menggunakan fitur *Real-time Subscriptions* bawaan Supabase untuk *broadcasting* pembaruan data secara instan dari Admin ke *Viewer*, mengeliminasi kebutuhan *setup* *server* WebSocket secara manual.