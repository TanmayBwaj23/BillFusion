// Client API service for billing endpoints
import api from '../api/axios';

// Billing service URL - distinct from the main API (Auth) URL
const BILLING_API_URL = 'http://localhost:8001/api/v1';

// Hardcoded client ID for demo - in production, this would come from auth context
const CLIENT_ID = 3;

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

export const clientApi = {
    // Dashboard endpoints
    dashboard: {
        getSummary: async (clientId = CLIENT_ID) => {
            const response = await api.get(`${BILLING_API_URL}/client/${clientId}/dashboard/summary`);
            return toCamelCase(response.data);
        },

        getCostTrends: async (clientId = CLIENT_ID, months = 6) => {
            const response = await api.get(`${BILLING_API_URL}/client/${clientId}/dashboard/cost-trends?months=${months}`);
            return toCamelCase(response.data);
        },

        getVendorDistribution: async (clientId = CLIENT_ID) => {
            const response = await api.get(`${BILLING_API_URL}/client/${clientId}/dashboard/vendor-distribution`);
            return toCamelCase(response.data);
        }
    },

    // Billing endpoints
    billing: {
        getMonthlyReport: async (clientId = CLIENT_ID, month) => {
            const url = month
                ? `${BILLING_API_URL}/client/${clientId}/billing/monthly-report?month=${month}`
                : `${BILLING_API_URL}/client/${clientId}/billing/monthly-report`;
            const response = await api.get(url);
            return toCamelCase(response.data);
        }
    },

    // Trip endpoints
    trips: {
        search: async (clientId = CLIENT_ID, filters) => {
            const params = new URLSearchParams();
            if (filters.start_date) params.append('start_date', filters.start_date);
            if (filters.end_date) params.append('end_date', filters.end_date);
            if (filters.vendor_id) params.append('vendor_id', filters.vendor_id);
            if (filters.employee_id) params.append('employee_id', filters.employee_id);
            if (filters.trip_type) params.append('trip_type', filters.trip_type);
            if (filters.limit) params.append('limit', filters.limit);
            if (filters.offset) params.append('offset', filters.offset);

            const response = await api.get(`${BILLING_API_URL}/client/${clientId}/trips/search?${params}`);
            return toCamelCase(response.data);
        },

        getTodaySummary: async (clientId = CLIENT_ID) => {
            const response = await api.get(`${BILLING_API_URL}/client/${clientId}/trips/today-summary`);
            return toCamelCase(response.data);
        }
    },

    // Vendor endpoints
    vendors: {
        getList: async (clientId = CLIENT_ID) => {
            const response = await api.get(`${BILLING_API_URL}/client/${clientId}/vendors/list`);
            return toCamelCase(response.data);
        }
    }
};
