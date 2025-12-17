# 🚀 Cara Menjalankan Server SFJ Consulting

## ✅ Solusi: Server Tetap Jalan Meski Terminal Ditutup

Server sekarang menggunakan **PM2** (Process Manager) agar tetap berjalan meski terminal ditutup.

---

## 📋 Cara Menggunakan

### **1. Start Server (Paling Mudah)**
Double-click file: **`start-server.bat`**

Server akan:
- ✅ Berjalan di background dengan PM2
- ✅ Tetap jalan meski terminal ditutup
- ✅ Auto-buka browser ke http://localhost:3000

---

### **2. Stop Server**
Double-click file: **`stop-server.bat`**

---

### **3. Restart Server**
Double-click file: **`restart-server.bat`**

---

## 🔧 Command Manual (Opsional)

Jika ingin pakai command langsung:

```bash
# Start server
npm run pm2:start

# Stop server
npm run pm2:stop

# Restart server
npm run pm2:restart

# Lihat status
npm run pm2:status

# Lihat logs
npm run pm2:logs
```

---

## ⚠️ Catatan Penting

1. **Jangan tutup terminal saat pertama kali start** - Biarkan PM2 daemon jalan dulu
2. **Setelah PM2 daemon jalan**, terminal bisa ditutup
3. **Server tetap jalan** di background meski terminal ditutup
4. Untuk stop server, gunakan `stop-server.bat` atau `npm run pm2:stop`

---

## 🌐 Akses Website

- **Homepage:** http://localhost:3000
- **Admin Login:** http://localhost:3000/admin/login
- **API Health:** http://localhost:3000/api/health

---

## 🔑 Login Admin Default

- **Username:** `admin`
- **Password:** `admin123`

---

**Selamat menggunakan!** 🎉

