# ⚡ Quick Start Guide

## 🎯 Langkah Cepat Menjalankan Project

### **1. Install Node.js**
- Download: https://nodejs.org/
- Install seperti biasa
- Restart komputer jika perlu

### **2. Install XAMPP (MySQL)**
- Download: https://www.apachefriends.org/
- Install XAMPP
- Buka XAMPP Control Panel
- Klik **Start** pada **MySQL**

### **3. Install Dependencies**
Buka Command Prompt di folder project, lalu ketik:

```bash
npm install
```

Tunggu sampai selesai (biasanya 1-2 menit).

### **4. Jalankan Server**

**Pilih salah satu cara:**

#### **Cara A: Double-click file**
- Double-click: **`start-server.bat`**
- Server akan jalan di background

#### **Cara B: Via Command Prompt**
```bash
npm run pm2:start
```

#### **Cara C: Development mode**
```bash
npm start
```
*(Server akan stop jika terminal ditutup)*

### **5. Buka Website**

Buka browser, akses:
- **Homepage:** http://localhost:3000
- **Admin:** http://localhost:3000/admin/login

**Login Admin:**
- Username: `admin`
- Password: `admin123`

---

## ✅ Selesai!

Website sudah berjalan. Database dan tabel akan dibuat otomatis saat pertama kali run.

---

## 🛑 Stop Server

**Jika pakai PM2:**
- Double-click: **`stop-server.bat`**
- Atau: `npm run pm2:stop`

**Jika pakai npm start:**
- Tekan `Ctrl + C` di terminal

---

## ❓ Masalah?

**Server tidak jalan?**
- Pastikan MySQL di XAMPP sudah **Start**
- Pastikan port 3000 tidak digunakan aplikasi lain

**Database error?**
- Pastikan MySQL di XAMPP sudah running
- Cek XAMPP Control Panel, pastikan MySQL berwarna hijau

**Module not found?**
- Jalankan lagi: `npm install`

---

**Selamat mencoba!** 🚀

