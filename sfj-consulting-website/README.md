# 🚀 SFJ Consulting Website - Setup & Run Guide

## 📋 Prerequisites

Sebelum memulai, pastikan sudah terinstall:

1. **Node.js** (v14 atau lebih baru)
   - Download: https://nodejs.org/
   - Cek versi: `node --version`

2. **MySQL** (XAMPP atau MySQL standalone)
   - Download XAMPP: https://www.apachefriends.org/
   - Atau MySQL: https://dev.mysql.com/downloads/

3. **Git** (opsional, untuk clone repository)
   - Download: https://git-scm.com/

---

## 🔧 Setup Awal

### **1. Install Dependencies**

Buka terminal/command prompt di folder project, lalu jalankan:

```bash
npm install
```

Ini akan menginstall semua package yang diperlukan:
- express
- mysql2
- jsonwebtoken
- bcrypt
- multer
- cors
- pm2 (untuk production)

---

### **2. Setup Database MySQL**

#### **A. Start MySQL Server**

**Jika menggunakan XAMPP:**
1. Buka XAMPP Control Panel
2. Start **MySQL** service
3. Pastikan status menunjukkan "Running"

**Jika menggunakan MySQL standalone:**
- Start MySQL service sesuai OS Anda

#### **B. Konfigurasi Database**

File konfigurasi ada di: `backend/config/database.js`

Default settings:
```javascript
host: 'localhost'
user: 'root'
password: '' (kosong untuk XAMPP default)
database: 'sfj_consulting'
```

**Jika perlu ubah konfigurasi:**
- Edit file `backend/config/database.js`
- Atau set environment variables:
  ```bash
  set DB_HOST=localhost
  set DB_USER=root
  set DB_PASSWORD=your_password
  set DB_NAME=sfj_consulting
  ```

#### **C. Database Akan Dibuat Otomatis**

Saat pertama kali menjalankan server, database dan tabel akan dibuat otomatis. Tidak perlu setup manual!

---

## 🚀 Menjalankan Server

### **Cara 1: Development Mode (Manual)**

```bash
npm start
```

Atau:

```bash
node server.js
```

Server akan berjalan di: **http://localhost:3000**

**Untuk stop:** Tekan `Ctrl + C` di terminal

---

### **Cara 2: Production Mode (PM2 - Recommended)**

PM2 memungkinkan server berjalan di background dan tidak akan berhenti saat terminal ditutup.

#### **Start Server:**
```bash
npm run pm2:start
```

Atau double-click file: **`start-server.bat`**

#### **Stop Server:**
```bash
npm run pm2:stop
```

Atau double-click file: **`stop-server.bat`**

#### **Restart Server:**
```bash
npm run pm2:restart
```

Atau double-click file: **`restart-server.bat`**

#### **Cek Status:**
```bash
npm run pm2:status
```

#### **Lihat Logs:**
```bash
npm run pm2:logs
```

---

## 🌐 Akses Website

Setelah server berjalan, akses:

- **Homepage:** http://localhost:3000
- **Konsultasi:** http://localhost:3000/konsultasi
- **Admin Login:** http://localhost:3000/admin/login
- **Admin Dashboard:** http://localhost:3000/admin

---

## 👤 Default Admin Account

**Username:** `admin`  
**Password:** `admin123`

⚠️ **PENTING:** Ganti password setelah pertama kali login!

---

## 📁 Struktur Project

```
sfj-consulting-website/
├── backend/
│   ├── config/
│   │   └── database.js          # Konfigurasi database
│   ├── middleware/
│   │   └── auth.js               # JWT authentication
│   └── routes/
│       ├── auth.js                # Login/logout
│       ├── bookings.js            # Konsultasi
│       ├── team.js                # Tim
│       ├── reviews.js             # Ulasan
│       ├── users.js               # User management
│       ├── documents.js           # Dokumentasi
│       ├── gallery.js             # Gallery
│       └── activity.js            # Activity logs
├── frontend_admin/
│   ├── admin.html                 # Dashboard
│   ├── login.html                 # Login page
│   ├── dokumentasi.html           # Manage documents & gallery
│   ├── kelola-tim.html            # Manage team
│   ├── kelola-user.html           # Manage users
│   └── ulasan.html                # Manage reviews
├── js/
│   ├── app.js                     # Public website JS
│   ├── admin.js                   # Admin JS
│   ├── konsultasi.js              # Consultation form JS
│   └── api.js                     # API helper
├── css/
│   ├── style.css                  # Public website CSS
│   ├── styleAdmin.css             # Admin CSS
│   └── styleKonsul.css            # Consultation CSS
├── uploads/
│   ├── documents/                 # Uploaded documents
│   └── team/                      # Team photos
├── public/
│   ├── doc/                       # Documentation images
│   ├── logo/                      # Logo files
│   └── icon/                      # Icons
├── server.js                      # Main server file
├── package.json                    # Dependencies
└── README.md                       # This file
```

---

## 🔍 Troubleshooting

### **Problem: Server tidak bisa start**

**Solusi:**
1. Cek apakah port 3000 sudah digunakan:
   ```bash
   netstat -ano | findstr :3000
   ```
2. Ubah port di `server.js` jika perlu:
   ```javascript
   const PORT = process.env.PORT || 3001; // Ganti ke 3001
   ```

### **Problem: Database connection error**

**Solusi:**
1. Pastikan MySQL/XAMPP sudah running
2. Cek username/password di `backend/config/database.js`
3. Pastikan database `sfj_consulting` ada (akan dibuat otomatis)

### **Problem: Module not found**

**Solusi:**
```bash
npm install
```

### **Problem: Upload file tidak bisa**

**Solusi:**
1. Pastikan folder `uploads/` ada
2. Pastikan folder `uploads/documents/` dan `uploads/team/` ada
3. Cek permission folder (harus bisa write)

### **Problem: PM2 tidak jalan**

**Solusi:**
```bash
# Install PM2 global (opsional)
npm install -g pm2

# Atau gunakan npx
npx pm2 start server.js --name sfj-server
```

---

## 📝 Environment Variables (Opsional)

Buat file `.env` di root project:

```env
PORT=3000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=sfj_consulting
NODE_ENV=development
```

Install dotenv:
```bash
npm install dotenv
```

Lalu tambahkan di `server.js`:
```javascript
require('dotenv').config();
```

---

## 🎯 Quick Start Checklist

- [ ] Install Node.js
- [ ] Install MySQL/XAMPP
- [ ] Start MySQL service
- [ ] Clone/download project
- [ ] Buka terminal di folder project
- [ ] Jalankan `npm install`
- [ ] Jalankan `npm start` atau `npm run pm2:start`
- [ ] Buka browser: http://localhost:3000
- [ ] Login admin: http://localhost:3000/admin/login
- [ ] Username: `admin`, Password: `admin123`

---

## 📚 API Endpoints

### **Public Endpoints:**
- `GET /api/documents` - Get all documents
- `GET /api/team?status=Aktif` - Get active team members
- `GET /api/gallery` - Get gallery items
- `POST /api/bookings` - Create consultation booking
- `POST /api/reviews` - Submit review

### **Admin Endpoints (Require Auth):**
- `POST /api/auth/login` - Login
- `GET /api/bookings` - Get all bookings
- `GET /api/users` - Get all users
- `POST /api/documents` - Upload document
- `POST /api/gallery` - Add gallery item
- Dan lainnya...

---

## 🆘 Butuh Bantuan?

Jika ada masalah:
1. Cek console/terminal untuk error messages
2. Cek browser console (F12) untuk frontend errors
3. Cek PM2 logs: `npm run pm2:logs`
4. Pastikan semua prerequisites sudah terinstall

---

**Selamat menggunakan SFJ Consulting Website!** 🎉

