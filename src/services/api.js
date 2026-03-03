/**
 * API service layer - matches reference frontend (rrichie551/frontend) implementation.
 * Uses REACT_APP_API_URL and REACT_APP_WEBSITE_ID (exact env var names).
 * Vite exposes REACT_APP_* via envPrefix in vite.config.js.
 */
import axios from 'axios';

const API_BASE_URL = import.meta.env.REACT_APP_API_URL || 'http://localhost:2800';
const WEBSITE_ID = import.meta.env.REACT_APP_WEBSITE_ID;

if (!import.meta.env.REACT_APP_API_URL) {
  console.warn(
    '⚠️  REACT_APP_API_URL is not configured! Using default: http://localhost:2800'
  );
  console.warn(
    'Please create a .env file with REACT_APP_API_URL set to your API server URL'
  );
}

if (!WEBSITE_ID || WEBSITE_ID === 'your-website-id-here') {
  console.error('⚠️  REACT_APP_WEBSITE_ID is not configured!');
  console.error('Please:');
  console.error('1. Create a website in the CRM');
  console.error('2. Copy the Website ID from the CRM');
  console.error('3. Add it to your .env file as REACT_APP_WEBSITE_ID');
}

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 60000,
  headers: {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'x-website-id': WEBSITE_ID || '',
  },
});

const pendingRequests = new Map();
let lastRequestTime = 0;
const MIN_REQUEST_INTERVAL = 150;

api.interceptors.request.use((config) => {
  const now = Date.now();

  if (now - lastRequestTime < MIN_REQUEST_INTERVAL) {
    const delay = MIN_REQUEST_INTERVAL - (now - lastRequestTime);
    return new Promise((resolve) => {
      setTimeout(() => {
        lastRequestTime = Date.now();
        resolve(config);
      }, delay);
    });
  }
  lastRequestTime = now;

  if (config.method === 'post' && config.data && typeof config.data === 'object') {
    config.data.websiteId = WEBSITE_ID;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
      console.warn(
        'Request timeout - flight search may be taking longer than expected'
      );
      const timeoutError = new Error(
        'The search is taking longer than expected. Please try again or try a different route.'
      );
      timeoutError.isTimeout = true;
      timeoutError.originalError = error;
      return Promise.reject(timeoutError);
    }

    if (error.code === 'ERR_NETWORK' || !error.response) {
      console.error('Network error - unable to connect to server');
      const networkError = new Error(
        'Unable to connect to the server. Please check your internet connection.'
      );
      networkError.isNetworkError = true;
      return Promise.reject(networkError);
    }

    if (error.response?.status === 429) {
      console.warn('Rate limit exceeded, retrying in 2 seconds...');
      return new Promise((resolve) => {
        setTimeout(() => resolve(api.request(error.config)), 2000);
      });
    }

    if (error.response?.status === 401 && error.response?.data?.error) {
      const errorData = error.response.data;
      switch (errorData.error) {
        case 'MISSING_WEBSITE_ID':
          console.error(
            'Website ID is missing. Please check your environment variables.'
          );
          break;
        case 'INVALID_WEBSITE_ID':
          console.error(
            'Invalid Website ID. Please check your environment variables.'
          );
          break;
        case 'INACTIVE_WEBSITE':
          console.error('Website is inactive. Please contact administrator.');
          break;
        default:
          console.error('Website validation error:', errorData.message);
      }
    }

    return Promise.reject(error);
  }
);

export const apiService = {
  searchCities: async (keyword) => {
    if (!keyword || keyword.trim().length < 2) return [];

    const trimmedKeyword = keyword.trim();
    const requestKey = `GET_/citySearch_${JSON.stringify({ keyword: trimmedKeyword })}`;

    if (pendingRequests.has(requestKey)) {
      try {
        const existingResponse = await pendingRequests.get(requestKey);
        return existingResponse.data?.data || [];
      } catch (err) {
        pendingRequests.delete(requestKey);
      }
    }

    try {
      const requestPromise = api.get('/citySearch', {
        params: { keyword: trimmedKeyword },
      });
      pendingRequests.set(requestKey, requestPromise);

      const response = await requestPromise;
      pendingRequests.delete(requestKey);
      return response.data.data || [];
    } catch (error) {
      pendingRequests.delete(requestKey);
      if (
        error.response?.status === 429 ||
        error.response?.data?.error === 'RATE_LIMIT_EXCEEDED'
      ) {
        return [];
      }
      console.error('Error searching cities:', error);
      return [];
    }
  },

  searchFlights: async (params) => {
    const requestBody = {
      departure: params.departureDate,
      locationDeparture: params.originLocationCode,
      locationArrival: params.destinationLocationCode,
      adults: params.adults || '1',
    };

    if (params.returnDate && params.tripType === 'round-trip') {
      requestBody.returnDate = params.returnDate;
    }

    const response = await api.post('/date', requestBody);
    const data = response.data;
    return data?.data ?? (Array.isArray(data) ? data : []);
  },

  getFlightPricing: async (flightOffer) => {
    const response = await api.post('/flightprice', flightOffer);
    return response.data;
  },

  createFlightOrder: async (flightOffer) => {
    const response = await api.post('/flightCreateOrder', flightOffer);
    return response.data;
  },

  getFlightOrderConfirmation: async () => {
    const response = await api.get('/flightcretaeorderget');
    return response.data;
  },

  createBooking: async (bookingData) => {
    const response = await api.post('/api/consumer/bookings', bookingData);
    return response.data;
  },
};

export default apiService;
