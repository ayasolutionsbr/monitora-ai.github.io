class ApiClient {
    constructor() {
        // In production, this would be your Quarkus backend URL
        this.baseUrl = 'http://localhost:8080/api';
    }

    async request(endpoint, options = {}) {
        const url = `${this.baseUrl}${endpoint}`;
        const defaultOptions = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.getAuthToken()}`
            },
            credentials: 'include' // This is important for handling cookies
        };

        try {
            const response = await fetch(url, { ...defaultOptions, ...options });
            if (!response.ok) {
                const error = await response.json().catch(() => ({}));
                throw new Error(error.message || `HTTP error! status: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error('API request failed:', error);
            throw error;
        }
    }

    getAuthToken() {
        return localStorage.getItem('auth_token');
    }

    // Product related methods
    async getProducts() {
        return this.request('/products');
    }

    async getProduct(id) {
        return this.request(`/products/${id}`);
    }

    // Order related methods
    async createOrder(orderData) {
        return this.request('/orders', {
            method: 'POST',
            body: JSON.stringify(orderData)
        });
    }

    async getOrderStatus(orderId) {
        return this.request(`/orders/${orderId}/status`);
    }

    // Payment related methods
    async processPayment(paymentData) {
        return this.request('/payments', {
            method: 'POST',
            body: JSON.stringify(paymentData)
        });
    }

    // Deployment related methods
    async startDeployment(deploymentData) {
        return this.request('/deployments', {
            method: 'POST',
            body: JSON.stringify(deploymentData)
        });
    }

    async getDeploymentStatus(deploymentId) {
        return this.request(`/deployments/${deploymentId}/status`);
    }
}

// Create and export a singleton instance
const apiClient = new ApiClient();
export default apiClient; 