import { defineStore } from 'pinia';
import { jwtDecode } from "jwt-decode";
import { fetchWrapper, router } from '@/helpers';

const baseUrl = `${import.meta.env.VITE_API_URL}/api/auth`;

export const useAuthStore = defineStore({
    id: 'auth',
    state: () => ({
        // initialize state from local storage to enable user to stay logged in
        token : null,
        user: null,
        returnUrl: '/'
    }),
    actions: {
        async login(username, password) {
            const response = await fetchWrapper.post(`${baseUrl}/login`, { email : username, password : password });
            // update pinia state
            this.token = response.data.token
            this.user = jwtDecode(response.data.token);

            // store user details and jwt in local storage to keep user logged in between page refreshes
            localStorage.setItem('token', response.data.token)

            // redirect to previous url or default to home page
            router.push(this.returnUrl || '/');
        },
        logout() {
            this.token = null;
            this.user = null;
            localStorage.removeItem('token');
            router.push('/login');
        },
        initializeUser() {
            let token = localStorage.getItem('token')
            let decodedToken = null;
            
      
            try {
              decodedToken = jwtDecode(token || '');
            } catch (error) {
                console.warn("user not logged in");
            }
            
            this.setToken(token);
            this.setUser(decodedToken);

          },
        setUser(user) {
            this.user = user;
        },
        setToken(token) {
            this.token = token;
        },

    }
});
