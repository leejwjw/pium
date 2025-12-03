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

    changePassword: async (username, currentPassword, newPassword) => {
        const response = await axios.post(
            `${API_BASE_URL}/auth/change-password`,
            { username, currentPassword, newPassword }
            // JWT 토큰 없이 호출
        );
        return response.data;
    }
};

export default authService;
