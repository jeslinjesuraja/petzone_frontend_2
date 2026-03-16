const authHelper = {
    getToken() {
        return localStorage.getItem("access_token");
    },

    setToken(token) {
        localStorage.setItem("access_token", token);
    },

    logout() {
        localStorage.removeItem("access_token");
        localStorage.removeItem("username");
        window.location.reload();
    },

    getUserName() {
        return localStorage.getItem("username");
    },

    isLoggedIn() {
        return !!this.getToken();
    },

    async authenticatedFetch(url, options = {}) {
        const token = this.getToken();
        const headers = options.headers || {};

        if (token) {
            headers["Authorization"] = `Bearer ${token}`;
        }

        const response = await fetch(url, {
            ...options,
            headers: {
                ...headers,
                "Content-Type": "application/json"
            }
        });

        if (response.status === 401) {
            // Token expired or invalid
            this.logout();
            throw new Error("Session expired. Please login again.");
        }

        return response;
    }
};
