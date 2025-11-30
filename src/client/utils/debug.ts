/**
 * Debug Helper
 * Utility untuk debugging API calls
 */

export const debugAPI = {
    logRequest: (method: string, url: string, data?: any) => {
        if (process.env.NODE_ENV === 'development') {
            console.group(`🔵 API Request: ${method} ${url}`);
            console.log('URL:', url);
            if (data) console.log('Data:', data);
            console.log('Timestamp:', new Date().toISOString());
            console.groupEnd();
        }
    },

    logResponse: (method: string, url: string, response: any) => {
        if (process.env.NODE_ENV === 'development') {
            console.group(`✅ API Response: ${method} ${url}`);
            console.log('Response:', response);
            console.log('Timestamp:', new Date().toISOString());
            console.groupEnd();
        }
    },

    logError: (method: string, url: string, error: any) => {
        console.group(`❌ API Error: ${method} ${url}`);
        console.error('Error:', error);
        console.error('Message:', error.message);
        console.error('Status:', error.statusCode);
        console.error('Data:', error.data);
        console.error('Timestamp:', new Date().toISOString());
        console.groupEnd();
    },
};
