import axios from 'axios';

const API_KEY = 'ctvmu99r01qh15ovq8g0ctvmu99r01qh15ovq8gg';
const BASE_URL = 'https://finnhub.io/api/v1';

// Fetching stock price
export const fetchStockPrice = async (symbol) => {
  try {
    const response = await axios.get(`${BASE_URL}/quote`, {
      params: { symbol, token: API_KEY },
    });
    return response.data.c; // 'c' is the current price from Finnhub response
  } catch (error) {
    console.error('Error fetching stock price:', error);
    throw error;
  }
};

// Search for stock symbols
export const searchStockSymbols = async (query) => {
  try {
    const response = await axios.get(`${BASE_URL}/search`, {
      params: { q: query, token: API_KEY },
    });
    return response.data.result || []; // Return matching stock symbols
  } catch (error) {
    console.error('Error searching stock symbols:', error);
    throw error;
  }
};
