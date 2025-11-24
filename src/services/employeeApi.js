// Employee API service for billing endpoints
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

export const employeeApi = {
    // Dashboard endpoint
    dashboard: {
        get: async () => {
            // Token is automatically injected by axios interceptor in ../api/axios.js
            const response = await api.get(`${BILLING_API_URL}/employee/dashboard`);
            return toCamelCase(response.data);
        }
    },

    // Profile endpoint
    profile: {
        get: async () => {
            const response = await api.get(`${BILLING_API_URL}/employee/profile`);
            return toCamelCase(response.data);
        }
    },

    // Trip endpoints
    trips: {
        search: async (filters) => {
            const params = new URLSearchParams();
            if (filters.start_date) params.append('start_date', filters.start_date);
            if (filters.end_date) params.append('end_date', filters.end_date);
            if (filters.vendor) params.append('vendor', filters.vendor);
            if (filters.tripType) params.append('trip_type', filters.tripType);
            if (filters.limit) params.append('limit', filters.limit);
            if (filters.offset) params.append('offset', filters.offset);

            const response = await api.get(`${BILLING_API_URL}/employee/trips?${params}`);
            return toCamelCase(response.data);
        }
    },

    // Report endpoints
    reports: {
        getMonthly: async (month) => {
            const url = month
                ? `${BILLING_API_URL}/employee/report/monthly?month=${month}`
                : `${BILLING_API_URL}/employee/report/monthly`;
            const response = await api.get(url);
            return toCamelCase(response.data);
        },

        // Alias for compatibility
        getMonthlyReport: async (month) => {
            const url = month
                ? `${BILLING_API_URL}/employee/report/monthly?month=${month}`
                : `${BILLING_API_URL}/employee/report/monthly`;
            const response = await api.get(url);
            return toCamelCase(response.data);
        },

        getIncentiveHistory: async (months = 6) => {
            const response = await api.get(
                `${BILLING_API_URL}/employee/incentive-history?months=${months}`
            );
            return toCamelCase(response.data);
        },

        export: async (reportType, month, format) => {
            const response = await api.post(
                `${BILLING_API_URL}/employee/export`,
                {
                    report_type: reportType,
                    month: month,
                    format: format
                }
            );
            return toCamelCase(response.data);
        }
    }
};
