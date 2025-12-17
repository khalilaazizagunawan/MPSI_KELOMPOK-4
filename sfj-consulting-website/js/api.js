/**
 * SFJ Consulting - API Helper
 * Frontend JavaScript untuk berkomunikasi dengan Backend API
 */

const API_BASE_URL = '/api';

// Token management
const TokenManager = {
    getToken: () => localStorage.getItem('sfj_token'),
    setToken: (token) => localStorage.setItem('sfj_token', token),
    removeToken: () => localStorage.removeItem('sfj_token'),
    getUser: () => {
        const user = localStorage.getItem('sfj_user');
        return user ? JSON.parse(user) : null;
    },
    setUser: (user) => localStorage.setItem('sfj_user', JSON.stringify(user)),
    removeUser: () => localStorage.removeItem('sfj_user'),
    clear: () => {
        localStorage.removeItem('sfj_token');
        localStorage.removeItem('sfj_user');
    }
};

// API request helper
async function apiRequest(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const token = TokenManager.getToken();

    const defaultHeaders = {
        'Content-Type': 'application/json'
    };

    if (token) {
        defaultHeaders['Authorization'] = `Bearer ${token}`;
    }

    const config = {
        ...options,
        headers: {
            ...defaultHeaders,
            ...options.headers
        }
    };

    try {
        const response = await fetch(url, config);
        const data = await response.json();

        // Handle unauthorized
        if (response.status === 401 || response.status === 403) {
            TokenManager.clear();
            // Redirect to login if on admin page
            if (window.location.pathname.includes('admin') && !window.location.pathname.includes('login')) {
                window.location.href = '/frontend_admin/login.html';
            }
        }

        return {
            ok: response.ok,
            status: response.status,
            data
        };
    } catch (error) {
        console.error('API Request Error:', error);
        return {
            ok: false,
            status: 500,
            data: { success: false, message: 'Network error' }
        };
    }
}

// =====================
// AUTH API
// =====================
const AuthAPI = {
    async login(username, password) {
        const response = await apiRequest('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ username, password })
        });

        if (response.ok && response.data.success) {
            TokenManager.setToken(response.data.data.token);
            TokenManager.setUser(response.data.data.user);
        }

        return response;
    },

    async logout() {
        const response = await apiRequest('/auth/logout', {
            method: 'POST'
        });
        TokenManager.clear();
        return response;
    },

    async verify() {
        return await apiRequest('/auth/verify');
    },

    async getMe() {
        return await apiRequest('/auth/me');
    },

    isLoggedIn() {
        return !!TokenManager.getToken();
    },

    getUser() {
        return TokenManager.getUser();
    }
};

// =====================
// BOOKINGS API
// =====================
const BookingsAPI = {
    async getAll(params = {}) {
        const query = new URLSearchParams(params).toString();
        return await apiRequest(`/bookings${query ? `?${query}` : ''}`);
    },

    async getById(id) {
        return await apiRequest(`/bookings/${id}`);
    },

    async create(bookingData) {
        return await apiRequest('/bookings', {
            method: 'POST',
            body: JSON.stringify(bookingData)
        });
    },

    async updateStatus(id, status) {
        return await apiRequest(`/bookings/${id}`, {
            method: 'PUT',
            body: JSON.stringify({ status })
        });
    },

    async delete(id) {
        return await apiRequest(`/bookings/${id}`, {
            method: 'DELETE'
        });
    }
};

// =====================
// TEAM API
// =====================
const TeamAPI = {
    async getAll(params = {}) {
        const query = new URLSearchParams(params).toString();
        return await apiRequest(`/team${query ? `?${query}` : ''}`);
    },

    async getById(id) {
        return await apiRequest(`/team/${id}`);
    },

    async create(memberData) {
        return await apiRequest('/team', {
            method: 'POST',
            body: JSON.stringify(memberData)
        });
    },

    async update(id, memberData) {
        return await apiRequest(`/team/${id}`, {
            method: 'PUT',
            body: JSON.stringify(memberData)
        });
    },

    async delete(id) {
        return await apiRequest(`/team/${id}`, {
            method: 'DELETE'
        });
    }
};

// =====================
// REVIEWS API
// =====================
const ReviewsAPI = {
    async getAll(params = {}) {
        const query = new URLSearchParams(params).toString();
        return await apiRequest(`/reviews${query ? `?${query}` : ''}`);
    },

    async getById(id) {
        return await apiRequest(`/reviews/${id}`);
    },

    async create(reviewData) {
        return await apiRequest('/reviews', {
            method: 'POST',
            body: JSON.stringify(reviewData)
        });
    },

    async update(id, reviewData) {
        return await apiRequest(`/reviews/${id}`, {
            method: 'PUT',
            body: JSON.stringify(reviewData)
        });
    },

    async toggle(id) {
        return await apiRequest(`/reviews/${id}/toggle`, {
            method: 'PUT'
        });
    },

    async delete(id) {
        return await apiRequest(`/reviews/${id}`, {
            method: 'DELETE'
        });
    }
};

// =====================
// USERS API
// =====================
const UsersAPI = {
    async getAll() {
        return await apiRequest('/users');
    },

    async getById(id) {
        return await apiRequest(`/users/${id}`);
    },

    async create(userData) {
        return await apiRequest('/users', {
            method: 'POST',
            body: JSON.stringify(userData)
        });
    },

    async update(id, userData) {
        return await apiRequest(`/users/${id}`, {
            method: 'PUT',
            body: JSON.stringify(userData)
        });
    },

    async delete(id) {
        return await apiRequest(`/users/${id}`, {
            method: 'DELETE'
        });
    }
};

// =====================
// ACTIVITY API
// =====================
const ActivityAPI = {
    async getLogs(limit = 20) {
        return await apiRequest(`/activity?limit=${limit}`);
    }
};

// Export for use in other files
window.SFJ_API = {
    TokenManager,
    AuthAPI,
    BookingsAPI,
    TeamAPI,
    ReviewsAPI,
    UsersAPI,
    ActivityAPI
};

