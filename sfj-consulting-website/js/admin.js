// =============================================
// SFJ Consulting - Admin Dashboard JavaScript
// Connected to Backend API
// =============================================

// Wait for API to be loaded
document.addEventListener('DOMContentLoaded', function () {
    // Check if API is available
    if (typeof window.SFJ_API === 'undefined') {
        console.warn('API not loaded yet, using fallback mode');
    }

    initLoginForm();
    initDashboard();
    initSidebar();
});

// =====================
// LOGIN FUNCTIONALITY
// =====================
function initLoginForm() {
    const loginForm = document.getElementById('loginForm');

    if (loginForm) {
        // Check if already logged in
        if (window.SFJ_API && window.SFJ_API.AuthAPI.isLoggedIn()) {
            window.location.href = 'admin.html';
            return;
        }

        loginForm.addEventListener('submit', async function (e) {
            e.preventDefault();

            const username = document.getElementById('username').value.trim();
            const password = document.getElementById('password').value;
            const submitBtn = loginForm.querySelector('button[type="submit"]');

            if (!username || !password) {
                alert('Username dan password wajib diisi');
                return;
            }

            // Show loading state
            submitBtn.disabled = true;
            submitBtn.textContent = 'Loading...';

            try {
                if (window.SFJ_API) {
                    const response = await window.SFJ_API.AuthAPI.login(username, password);

                    if (response.ok && response.data.success) {
                        alert('Login berhasil! Selamat datang, Admin.');
                        window.location.href = 'admin.html';
                    } else {
                        alert(response.data.message || 'Login gagal!');
                        document.getElementById('password').value = '';
                    }
                } else {
                    // Fallback mode (no API)
                    if (username === 'admin' && password === 'admin123') {
                        alert('Login berhasil! Selamat datang, Admin.');
                        localStorage.setItem('sfj_token', 'dummy-token');
                        window.location.href = 'admin.html';
                    } else {
                        alert('Login gagal! Username atau password salah.');
                        document.getElementById('password').value = '';
                    }
                }
            } catch (error) {
                console.error('Login error:', error);
                alert('Terjadi kesalahan. Silakan coba lagi.');
            } finally {
                submitBtn.disabled = false;
                submitBtn.textContent = 'Login';
            }
        });
    }
}

// =====================
// DASHBOARD FUNCTIONALITY
// =====================
let bookingsData = [];

async function initDashboard() {
    const bookingCards = document.getElementById('bookingCards');
    
    // Only run on dashboard page
    if (!bookingCards) return;

    // Check authentication
    if (window.SFJ_API && !window.SFJ_API.AuthAPI.isLoggedIn()) {
        window.location.href = 'login.html';
        return;
    }

    // Load bookings
    await loadBookings();
    
    // Load activity logs
    await loadActivityLogs();

    // Setup tab filters
    setupTabFilters();

    // Setup search
    setupSearch();
}

async function loadBookings(status = 'all', search = '') {
    const container = document.getElementById('bookingCards');
    const noBooking = document.querySelector('.no-booking');

    if (!container) return;

    try {
        let params = {};
        if (status && status !== 'all') {
            // Map status
            const statusMap = {
                'waiting': 'Menunggu',
                'confirmed': 'Terkonfirmasi',
                'done': 'Selesai'
            };
            params.status = statusMap[status] || status;
        }
        if (search) params.search = search;

        if (window.SFJ_API) {
            const response = await window.SFJ_API.BookingsAPI.getAll(params);

            if (response.ok && response.data.success) {
                bookingsData = response.data.data;
                const stats = response.data.stats;

                // Update stats
                updateStats(stats);

                // Render bookings
                renderBookings(bookingsData);
            } else {
                console.error('Failed to load bookings:', response.data.message);
                if (noBooking) noBooking.style.display = 'block';
            }
        } else {
            // Fallback: use dummy data
            bookingsData = [
                { id: 1, name: 'John Doe', booking_date: '2025-12-15', status: 'Menunggu' },
                { id: 2, name: 'Jane Smith', booking_date: '2025-12-20', status: 'Terkonfirmasi' },
                { id: 3, name: 'Alice Johnson', booking_date: '2025-12-25', status: 'Selesai' }
            ];
            renderBookings(bookingsData);
            updateStats({ total: 3, waiting: 1, confirmed: 1, done: 1 });
        }
    } catch (error) {
        console.error('Load bookings error:', error);
    }
}

function renderBookings(bookings) {
    const container = document.getElementById('bookingCards');
    const noBooking = document.querySelector('.no-booking');

    if (!container) return;

    container.innerHTML = '';

    if (bookings.length === 0) {
        if (noBooking) noBooking.style.display = 'block';
        return;
    }

    if (noBooking) noBooking.style.display = 'none';

    bookings.forEach(b => {
        const card = document.createElement('div');
        card.className = 'booking-card';

        // Status badge warna
        let statusColor = '';
        if (b.status === 'Menunggu') statusColor = '#b37c1d';
        else if (b.status === 'Terkonfirmasi') statusColor = 'rgba(26, 104, 115, 1)';
        else if (b.status === 'Selesai') statusColor = '#1d7cb3';

        // Format date
        const bookingDate = new Date(b.booking_date).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });

        card.innerHTML = `
            <div style="display:flex; justify-content:space-between; align-items:center;">
                <h4 style="margin:0;">Pengajuan #${String(b.id).padStart(3, '0')}</h4>
                <span onclick="deleteBooking(${b.id})" style="cursor:pointer; padding:6px; border-radius:6px; transition:all 0.2s; display:flex; align-items:center; justify-content:center;" 
                      onmouseover="this.style.background='#fee2e2'; this.style.transform='scale(1.1)'" 
                      onmouseout="this.style.background='transparent'; this.style.transform='scale(1)'" 
                      title="Hapus Pengajuan">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#dc2626" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <polyline points="3 6 5 6 21 6"></polyline>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                        <line x1="10" y1="11" x2="10" y2="17"></line>
                        <line x1="14" y1="11" x2="14" y2="17"></line>
                    </svg>
                </span>
            </div>
            <p><strong>Nama:</strong> ${b.name}</p>
            <p><strong>Tanggal:</strong> ${bookingDate}</p>
            <p><strong>Status:</strong> 
                <span style="display:inline-block; padding:4px 12px; border-radius:20px; background:${statusColor}; color:white; font-size:12px;">
                    ${b.status}
                </span>
            </p>
            <div style="margin-top:20px; display:flex; flex-direction: column; gap:8px;">
                ${b.status === 'Menunggu' ? `
                    <div style="display:flex; gap:8px;">
                        <button class="btn btn-action" onclick="updateBookingStatus(${b.id}, 'Terkonfirmasi')" style="padding: 8px 16px; flex: 1; font-size: 13px;">Konfirmasi</button>
                        <button class="btn btn-action" style="background:#FECACA; color:#991B1B; padding: 8px 16px; flex: 1; font-size: 13px;" onclick="updateBookingStatus(${b.id}, 'Dibatalkan')">Tolak</button>
                    </div>
                ` : ''}
                ${b.status === 'Terkonfirmasi' ? `
                    <button class="btn btn-action" onclick="updateBookingStatus(${b.id}, 'Selesai')" style="padding: 8px 16px; width: 100%; font-size: 13px;">Selesai</button>
                ` : ''}
                <button class="btn btn-action" style="background:#f3f4f6; color:#374151; padding: 8px 16px; width: 100%; font-size: 13px;" onclick="viewBookingDetail(${b.id})">Detail</button>
            </div>
        `;
        container.appendChild(card);
    });
}

async function viewBookingDetail(id) {
    const modal = document.getElementById('bookingDetailModal');
    const content = document.getElementById('bookingDetailContent');

    if (!modal || !content) {
        console.error('Modal bookingDetailModal tidak ditemukan di HTML!');
        alert('Error: Modal detail belum ditambahkan ke admin.html');
        return;
    }

    content.innerHTML = '<p style="text-align:center; color:#6b7280; padding:20px 0;">Memuat detail pengajuan...</p>';
    modal.classList.add('show');

    try {
        const response = await window.SFJ_API.BookingsAPI.getById(id);

        if (response.ok && response.data.success) {
            const b = response.data.data;

            const tanggal = new Date(b.booking_date).toLocaleDateString('id-ID', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
            });

            let statusColor = '#b37c1d';
            if (b.status === 'Terkonfirmasi') statusColor = 'rgba(26, 104, 115, 1)';
            else if (b.status === 'Selesai') statusColor = '#1d7cb3';
            else if (b.status === 'Dibatalkan') statusColor = '#dc2626';

            content.innerHTML = `
                <div class="detail-item">
                    <span class="detail-label">Pengajuan : </span>
                    <span class="detail-value">#${String(b.id).padStart(3, '0')}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Nama : </span>
                    <span class="detail-value">${b.name || '-'}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Email : </span>
                    <span class="detail-value">${b.email || '-'}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Instansi : </span>
                    <span class="detail-value">${b.company || '-'}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Jabatan : </span>
                    <span class="detail-value">${b.position || '-'}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">WhatsApp : </span>
                    <span class="detail-value">${b.whatsapp || '-'}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Layanan : </span>
                    <span class="detail-value">${b.service || '-'}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Tanggal : </span>
                    <span class="detail-value">${tanggal}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Waktu : </span>
                    <span class="detail-value">${b.booking_time || '-'}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Status : </span>
                    <span class="detail-value">
                        <span style="display:inline-block; padding:6px 16px; border-radius:20px; background:${statusColor}; color:white; font-size:13px; font-weight:600;">
                            ${b.status || '-'}
                        </span>
                    </span>
                </div>
                <div class="detail-item message-item">
                    <span class="detail-label">Pesan : </span>
                    <span class="detail-value-2">${b.message || '-'}</span>
                </div>
            `;
        } else {
            content.innerHTML = `<p style="color:#dc2626; text-align:center; padding:20px;">Gagal memuat: ${response.data.message || 'Unknown error'}</p>`;
        }
    } catch (error) {
        console.error('Error fetching booking detail:', error);
        content.innerHTML = `<p style="color:#dc2626; text-align:center; padding:20px;">Terjadi kesalahan jaringan atau server.</p>`;
    }
}

// Event listener untuk tutup modal detail booking
document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('bookingDetailModal');
    if (!modal) return;

    // Klik X atau tombol Tutup
    modal.querySelectorAll('.modal-close, .modal-close-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            modal.classList.remove('show');
        });
    });

    // Klik luar modal
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('show');
        }
    });
});


function updateStats(stats) {
    const totalEl = document.querySelector('.stat-card.total h2');
    const waitingEl = document.querySelector('.stat-card.waiting h2');
    const confirmedEl = document.querySelector('.stat-card.confirmed h2');
    const doneEl = document.querySelector('.stat-card.done h2');

    if (totalEl) totalEl.textContent = stats.total || 0;
    if (waitingEl) waitingEl.textContent = stats.waiting || 0;
    if (confirmedEl) confirmedEl.textContent = stats.confirmed || 0;
    if (doneEl) doneEl.textContent = stats.done || 0;

    // Update tab counts
    const tabAll = document.querySelector('[data-status="all"] span');
    const tabWaiting = document.querySelector('[data-status="waiting"] span');
    const tabConfirmed = document.querySelector('[data-status="confirmed"] span');
    const tabDone = document.querySelector('[data-status="done"] span');

    if (tabAll) tabAll.textContent = stats.total || 0;
    if (tabWaiting) tabWaiting.textContent = stats.waiting || 0;
    if (tabConfirmed) tabConfirmed.textContent = stats.confirmed || 0;
    if (tabDone) tabDone.textContent = stats.done || 0;
}

async function updateBookingStatus(id, status) {
    if (!confirm(`Ubah status booking #${id} menjadi "${status}"?`)) return;

    try {
        if (window.SFJ_API) {
            const response = await window.SFJ_API.BookingsAPI.updateStatus(id, status);

            if (response.ok && response.data.success) {
                alert('Status berhasil diperbarui!');
                await loadBookings();
                await loadActivityLogs();
            } else {
                alert(response.data.message || 'Gagal memperbarui status');
            }
        } else {
            alert('Status berhasil diperbarui! (Demo Mode)');
            await loadBookings();
        }
    } catch (error) {
        console.error('Update status error:', error);
        alert('Terjadi kesalahan');
    }
}

async function deleteBooking(id) {
    if (!confirm(`Apakah Anda yakin ingin menghapus Pengajuan #${String(id).padStart(3, '0')}?\n\nData yang dihapus tidak dapat dikembalikan.`)) return;

    try {
        const token = localStorage.getItem('sfj_token');
        if (!token) {
            alert('Silakan login terlebih dahulu');
            window.location.href = 'login.html';
            return;
        }

        const response = await fetch(`/api/bookings/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        const data = await response.json();

        if (response.ok && data.success) {
            alert(`Pengajuan #${String(id).padStart(3, '0')} berhasil dihapus!`);
            await loadBookings();
            await loadActivityLogs();
        } else {
            alert(data.message || 'Gagal menghapus booking');
        }
    } catch (error) {
        console.error('Delete booking error:', error);
        alert('Terjadi kesalahan saat menghapus booking');
    }
}

function setupTabFilters() {
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', async () => {
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const status = btn.dataset.status;
            await loadBookings(status);
        });
    });
}

function setupSearch() {
    const searchInput = document.querySelector('.search-input');
    const searchBtn = document.querySelector('.btn-search');

    if (searchBtn) {
        searchBtn.addEventListener('click', async () => {
            const searchTerm = searchInput?.value || '';
            await loadBookings('all', searchTerm);
        });
    }

    if (searchInput) {
        searchInput.addEventListener('keypress', async (e) => {
            if (e.key === 'Enter') {
                await loadBookings('all', searchInput.value);
            }
        });
    }
}

async function loadActivityLogs() {
    const activityList = document.querySelector('.activity-log ul');
    if (!activityList) return;

    try {
        if (window.SFJ_API) {
            const response = await window.SFJ_API.ActivityAPI.getLogs(10);

            if (response.ok && response.data.success) {
                activityList.innerHTML = '';
                
                if (response.data.data.length === 0) {
                    activityList.innerHTML = '<li>Belum ada aktivitas</li>';
                    return;
                }

                response.data.data.forEach(log => {
                    const li = document.createElement('li');
                    li.textContent = log.display_text;
                    activityList.appendChild(li);
                });
            }
        }
    } catch (error) {
        console.error('Load activity logs error:', error);
    }
}

let allReviews = []; // Akan diisi saat load data

// Fungsi untuk render tabel ulasan (sesuaikan dengan kode Anda yang sudah ada)
function renderReviews(reviews) {
    const tbody = document.querySelector('#reviewsTableBody'); // sesuaikan ID tabel Anda
    if (!tbody) return;

    tbody.innerHTML = '';

    if (reviews.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" style="text-align:center; padding:40px; color:#6b7280;">Tidak ada ulasan ditemukan</td></tr>';
        return;
    }

    reviews.forEach((review, index) => {
        const row = document.createElement('tr');

        // Status badge
        const isPublished = review.status === 'published' || review.status === 'Tampil';
        const statusText = isPublished ? 'Tampil' : 'Disembunyikan';
        const statusColor = isPublished ? '#10b981' : '#ef4444';

        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${review.name || 'Anonim'}</td>
            <td>${review.message}</td>
            <td>${new Date(review.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</td>
            <td>
                <span style="display:inline-block; padding:6px 16px; border-radius:20px; background:${statusColor}; color:white; font-size:13px; font-weight:600;">
                    ${statusText}
                </span>
            </td>
            <td style="text-align:right;">
                ${isPublished 
                    ? `<button class="btn btn-action" style="background:#fee2e2; color:#991b1b;" onclick="toggleReviewStatus(${review.id}, 'hidden')">Sembunyikan</button>`
                    : `<button class="btn btn-action" onclick="toggleReviewStatus(${review.id}, 'published')">Tampilkan</button>`
                }
                <button class="btn btn-action" style="background:#fee2e2; color:#991b1b; margin-left:8px;" onclick="deleteReview(${review.id})">Hapus</button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// Fungsi filter saat klik button
document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        // Update active state
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        // Filter data
        const status = btn.dataset.status;
        let filtered = allReviews;

        if (status === 'published') {
            filtered = allReviews.filter(r => r.status === 'published' || r.status === 'Tampil');
        } else if (status === 'hidden') {
            filtered = allReviews.filter(r => r.status === 'hidden' || r.status === 'Disembunyikan');
        }
        // 'all' → tampilkan semua

        renderReviews(filtered);
    });
});

// Saat load data pertama kali (di fungsi loadReviews Anda)
async function loadReviews() {
    try {
        // ... kode fetch API ...
        const response = await window.SFJ_API.ReviewsAPI.getAll(); // sesuaikan dengan API Anda
        if (response.ok && response.data.success) {
            allReviews = response.data.data;
            renderReviews(allReviews); // tampilkan semua di awal
        }
    } catch (error) {
        console.error(error);
    }
}

// =====================
// SIDEBAR FUNCTIONALITY
// =====================
function initSidebar() {
    const body = document.body;
    const sidebar = document.querySelector('.sidebar');
    const menuToggle = document.getElementById('menuToggle');

    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            body.classList.toggle('sidebar-collapsed');
        });
    }

    // Add close button to sidebar
    const sidebarHeader = document.querySelector('.sidebar-header');
    if (sidebarHeader && !document.querySelector('.sidebar-close-btn')) {
        const closeBtn = document.createElement('button');
        closeBtn.innerHTML = '×';
        closeBtn.className = 'sidebar-close-btn';
        closeBtn.title = 'Tutup menu';
        closeBtn.style.cssText = `
            margin-left: auto;
            background: none;
            border: none;
            font-size: 28px;
            cursor: pointer;
            color: #64748b;
            padding: 0 10px;
        `;
        sidebarHeader.style.display = 'flex';
        sidebarHeader.style.alignItems = 'center';
        sidebarHeader.appendChild(closeBtn);

        closeBtn.addEventListener('click', () => {
            body.classList.add('sidebar-collapsed');
        });
    }
}

// =====================
// LOGOUT FUNCTIONALITY
// =====================
async function logout() {
    if (confirm('Apakah Anda yakin ingin logout?')) {
        try {
            if (window.SFJ_API) {
                await window.SFJ_API.AuthAPI.logout();
            } else {
                localStorage.removeItem('sfj_token');
            }
            window.location.href = '../index.html';
        } catch (error) {
            console.error('Logout error:', error);
            window.location.href = '../index.html';
        }
    }
}

// =====================
// PAGE TITLE UPDATER
// =====================
const pageTitles = {
    'admin.html': 'Dashboard',
    'kelola-tim.html': 'Kelola Tim',
    'dokumentasi.html': 'Dokumentasi & Materi',
    'kelola-user.html': 'Kelola User',
    'ulasan.html': 'Kelola Ulasan'
};

const currentPage = location.pathname.split('/').pop() || 'admin.html';
const pageTitle = pageTitles[currentPage] || 'Admin Dashboard';
const pageTitleEl = document.getElementById('pageTitle');
if (pageTitleEl) pageTitleEl.textContent = pageTitle;

// Make functions globally available
window.logout = logout;
window.updateBookingStatus = updateBookingStatus;
window.viewBookingDetail = viewBookingDetail;
window.deleteBooking = deleteBooking;
