// Vendor API service for billing endpoints
import api from '../api/axios';

// Billing service URL - distinct from the main API (Auth) URL
const BILLING_API_URL = 'http://localhost:8001/api/v1';

// Utility function to transform snake_case to camelCase
const toCamelCase = (obj) => {
    if (obj === null || obj === undefined || typeof obj !== 'object') {
        return obj;
    }

    if (Array.isArray(obj)) {
        return obj.map(item => toCamelCase(item));
    }

    const camelCased = {};
    for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
            const camelKey = key.replace(/_([a-z])/g, (match, letter) => letter.toUpperCase());
            camelCased[camelKey] = toCamelCase(obj[key]);
        }
    }
    return camelCased;
};

export const vendorApi = {
    // Dashboard endpoints
    dashboard: {
        getToday: async (vendorId) => {
            const response = await api.get(`${BILLING_API_URL}/dashboard/vendor/${vendorId}/today`);
            return toCamelCase(response.data);
        },

        getStats: async (vendorId) => {
            const response = await api.get(`${BILLING_API_URL}/dashboard/vendor/${vendorId}/stats`);
            return toCamelCase(response.data);
        }
    },

    // Payout endpoints
    payout: {
        getCurrent: async (vendorId) => {
            const response = await api.get(`${BILLING_API_URL}/payout/current/${vendorId}`);
            return toCamelCase(response.data);
        },

        getHistory: async (vendorId, months = 6) => {
            const response = await api.get(`${BILLING_API_URL}/payout/history/${vendorId}?months=${months}`);
            return toCamelCase(response.data);
        },

        getSummary: async (vendorId) => {
            const response = await api.get(`${BILLING_API_URL}/payout/summary/${vendorId}`);
            return toCamelCase(response.data);
        },

        getIncentiveBreakdown: async (vendorId) => {
            const response = await api.get(`${BILLING_API_URL}/payout/vendor/${vendorId}/incentive-breakdown`);
            return toCamelCase(response.data);
        }
    },

    // Billing configuration endpoints
    billing: {
        getConfig: async (vendorId) => {
            const response = await api.get(`${BILLING_API_URL}/billing/vendor/${vendorId}`);
            return toCamelCase(response.data);
        },

        getSuggestions: async (vendorId) => {
            const response = await api.get(`${BILLING_API_URL}/billing/suggestions/${vendorId}`);
            return toCamelCase(response.data);
        }
    },

    // Fleet management endpoints
    fleet: {
        getVehicles: async (vendorId) => {
            const response = await api.get(`${BILLING_API_URL}/fleet/vendor/${vendorId}/vehicles`);
            return toCamelCase(response.data);
        },

        getDrivers: async (vendorId) => {
            const response = await api.get(`${BILLING_API_URL}/fleet/vendor/${vendorId}/drivers`);
            return toCamelCase(response.data);
        }
    },

    // Trip endpoints
    trips: {
        getRecent: async (vendorId, limit = 10) => {
            const response = await api.get(`${BILLING_API_URL}/trips/vendor/${vendorId}/recent?limit=${limit}`);
            return toCamelCase(response.data);
        }
    }
};
