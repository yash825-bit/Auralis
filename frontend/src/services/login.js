import { API_BASE_URL } from '../config';

export const login = async (form) => {
    try {
        const response = await fetch(API_BASE_URL + '/user/login', {
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(form)
        });

        const data = await response.json();
        
        if (response.ok && data.token && data.role) {
            // Store token and role in localStorage
            localStorage.setItem('authToken', data.token);
            localStorage.setItem('userRole', data.role);
            return { ...data, error: false };
        } else {
            return { error: true, message: data.detail || 'Login failed' };
        }
    } catch (error) {
        return { error: true, message: error.message || 'Network error' };
    }
};

export default login;
