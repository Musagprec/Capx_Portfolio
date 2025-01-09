import { useState } from 'react';
import axios from 'axios';

const StockForm = ({ stock, setStock, onSubmit, isEditing }) => {
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [stockDetails, setStockDetails] = useState(null); // Store stock details
  const [notFound, setNotFound] = useState(false); // Track "stock not found" state

  // Fetch stock data when the symbol changes
  const fetchStockData = async (symbol) => {
    if (!symbol) return;

    setLoading(true);
    setNotFound(false); // Reset "not found" state

    try {
      // Convert to uppercase for uniformity
      const normalizedSymbol = symbol.toUpperCase();

      // Use Finnhub's symbol search API to get matching stocks
      const response = await axios.get(`https://finnhub.io/api/v1/search`, {
        params: {
          q: normalizedSymbol,
          token: 'ctvmu99r01qh15ovq8g0ctvmu99r01qh15ovq8gg',
        },
      });

      // Filter results to include only symbols with letters and numbers
      const filteredResults = response.data.result.filter((item) =>
        /^[A-Z0-9]+$/.test(item.symbol)
      );

      if (filteredResults.length === 0) {
        setNotFound(true); // Mark as "not found" if no results
      }

      setSearchResult(filteredResults); // Set filtered results
    } catch (error) {
      console.error('Error fetching stock data:', error);
      setSearchResult([]);
      setNotFound(true); // Assume "not found" on error
    }
    setLoading(false);
  };

  // Fetch detailed stock data for the selected stock
  const fetchStockDetails = async (symbol) => {
    if (!symbol) return;

    setLoading(true);
    setNotFound(false); // Reset "not found" state

    try {
      // Fetch the stock's quote data (price, high, low, etc.)
      const response = await axios.get('https://finnhub.io/api/v1/quote', {
        params: {
          symbol,
          token: 'ctvmu99r01qh15ovq8g0ctvmu99r01qh15ovq8gg',
        },
      });

      setStockDetails(response.data); // Store detailed stock data
    } catch (error) {
      console.error('Error fetching stock details:', error);
      setStockDetails(null);
    }
    setLoading(false);
  };

  // Handle input change and fetch matching stocks
  const handleSymbolChange = (e) => {
    const newSymbol = e.target.value;
    setStock({ ...stock, symbol: newSymbol });
    setStockDetails(null); // Clear stock details when symbol changes
    fetchStockData(newSymbol); // Fetch stock data when symbol changes
  };

  // Handle stock selection from dropdown
  const handleStockSelect = (symbol) => {
    setStock({ ...stock, symbol });
    setSearchResult([]); // Hide dropdown after selection
    fetchStockDetails(symbol); // Fetch details for the selected symbol
  };

  return (
    <div className="bg-gray-100 p-4 rounded shadow mb-4">
      <h3 className="text-lg font-semibold mb-2">{isEditing ? 'Edit Stock' : 'Add New Stock'}</h3>
      <div className="flex flex-col space-y-2">
        <input
          type="text"
          placeholder="Stock Symbol"
          value={stock.symbol}
          onChange={handleSymbolChange}
          className="p-2 border rounded"
        />
        
        {loading && <p>Loading...</p>}

        {/* Dropdown for matching stocks */}
        {searchResult.length > 0 && (
          <div className="bg-gray-200 p-2 rounded max-h-40 overflow-y-auto">
            {searchResult.map((stockItem) => (
              <div
                key={stockItem.symbol}
                className="cursor-pointer p-1 hover:bg-gray-300"
                onClick={() => handleStockSelect(stockItem.symbol)}
              >
                {stockItem.symbol} - {stockItem.description}
              </div>
            ))}
          </div>
        )}

        {/* Stock not found message */}
        {!loading && notFound && (
          <p className="text-red-500">Stock not found. Please check the symbol.</p>
        )}

        {/* Display stock details if available */}
        {stockDetails && (
          <div className="bg-gray-200 p-2 rounded">
            <p><strong>Symbol:</strong> {stock.symbol.toUpperCase()}</p>
            <p><strong>Current Price:</strong> ${stockDetails.c}</p>
            <p><strong>High Price:</strong> ${stockDetails.h}</p>
            <p><strong>Low Price:</strong> ${stockDetails.l}</p>
            <p><strong>Open Price:</strong> ${stockDetails.o}</p>
            <p><strong>Previous Close Price:</strong> ${stockDetails.pc}</p>
          </div>
        )}

        <input
          type="number"
          placeholder="Quantity"
          value={stock.quantity}
          onChange={(e) => setStock({ ...stock, quantity: parseInt(e.target.value, 10) })}
          className="p-2 border rounded"
        />
        <input
          type="number"
          placeholder="Purchase Price"
          value={stock.purchasePrice}
          onChange={(e) => setStock({ ...stock, purchasePrice: parseFloat(e.target.value) })}
          className="p-2 border rounded"
        />
        <button onClick={onSubmit} className="p-2 bg-blue-500 text-white rounded">
          {isEditing ? 'Update Stock' : 'Add Stock'}
        </button>
      </div>
    </div>
  );
};

export default StockForm;
