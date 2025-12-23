# 🌐 SFJ Consulting Website

SFJ Consulting Website adalah aplikasi web berbasis **client–admin** yang digunakan untuk menampilkan layanan konsultasi, menerima permintaan konsultasi dari klien, serta mengelola konten dan data internal perusahaan melalui dashboard admin.

Project ini dikembangkan sebagai bagian dari proyek pengembangan website consulting dengan fokus pada **manajemen proyek, kontrol biaya, dan pengujian fungsional & non-fungsional**.

---

## 📌 Features

### 🔓 Public / User Features

* Home, Services, About, Contact (static pages)
* Form konsultasi klien
* Review / komentar klien (CRUD – user view)
* Tampilan informasi perusahaan dan layanan

### 🔐 Admin Features

* Login khusus admin
* Dashboard admin
* Kelola Tim (CRUD anggota tim)
* Kelola User (aktif / nonaktif)
* Kelola Dokumentasi Kegiatan Perusahaan
* History & detail konsultasi masuk
* Moderasi Review / Komentar (approve, nonaktif, delete)

---

## 🧩 System Architecture

* **Frontend** : Web-based (SPA)
* **Backend** : REST API
* **Database** : Relational Database
* **Authentication** : Admin-based login & session management

---

## 🛠️ Tech Stack

### Frontend

* HTML5, CSS3, JavaScript
* Framework: *(sesuaikan, misal React / Vue / Blade)*
* UI Design: Figma

### Backend

*  Node.js *
* RESTful API

### Database

* MySQL 

### Tools & Others

* Figma (UI/UX Design)
* ClickUp (Project Management)
* Git & GitHub (Version Control)
* Google Drive (Dokumentasi)

---

## 📂 Project Structure (Example)

```
sfj-consulting-website/
│
├── frontend/
│   ├── public/
│   ├── src/
│   ├── components/
│   ├── pages/
│   └── services/
│
├── backend/
│   ├── app/
│   ├── routes/
│   ├── controllers/
│   ├── models/
│   └── database/
```

---

## ⚙️ Installation & Setup

### 1️⃣ Clone Repository

```bash
git clone https://github.com/username/sfj-consulting-website.git
cd sfj-consulting-website
```

### 2️⃣ Setup

```bash
cd frontend
npm install
npm run dev
```
---

## 🔑 Authentication

* Login **hanya tersedia untuk Admin**
* User umum tidak memerlukan login
* Session management digunakan untuk menjaga keamanan dashboard admin

---

## 🧪 Testing

### Functional Testing

* Login Admin
* Kelola Tim (CRUD)
* Kelola User
* Form Konsultasi
* Review & Komentar

### Non-Functional Testing

* Performance
* Load
* Compatibility
* Stability / Reliability
* Maintainability

---

## 👥 Team Roles

* Project Manager
* System Analyst
* Frontend Developer
* Backend Developer

---

## 🚀 Deployment

* Staging & Production Deployment
* Domain & Hosting Setup
* Final Approval dari Client

---

## 📬 Contact

* 🌍 Website: sfj.web.id

---

