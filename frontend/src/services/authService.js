import axios from 'axios';

const API_BASE_URL = process.env.NODE_ENV === 'development'
    ? 'http://localhost:8000/api'
    : '/api';

const authService = {
    login: async (username, password) => {
        const response = await axios.post(`${API_BASE_URL}/auth/login`, {
            username,
            password
        });
        if (response.data.token) {
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify({
                username: response.data.username,
                name: response.data.name
            }));
        }
        return response.data;
    },

    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    },

    getToken: () => {
        return localStorage.getItem('token');
    },

    getUser: () => {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    },

    isAuthenticated: () => {
        return !!authService.getToken();
    },

    changePassword: async (currentPassword, newPassword) => {
        const token = authService.getToken();
        const response = await axios.post(
            `${API_BASE_URL}/auth/change-password`,
            { currentPassword, newPassword },
            { headers: { Authorization: `Bearer ${token}` } }
        );
        return response.data;
    }
};

export default authService;
