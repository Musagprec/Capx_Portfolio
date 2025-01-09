import { useState, useEffect } from 'react';
import Dashboard from './components/Dashboard';
import StockForm from './components/StockForm';
import StockList from './components/StockList';
import { fetchStockPrice, searchStockSymbols } from './api/finnhub';  // You'll create this function

const initialStocks = [
  { id: 1, symbol: 'AAPL', quantity: 10, purchasePrice: 150 },
  { id: 2, symbol: 'GOOGL', quantity: 5, purchasePrice: 2800 },
  { id: 3, symbol: 'MSFT', quantity: 20, purchasePrice: 300 },
];

const App = () => {
  const [stocks, setStocks] = useState(initialStocks);
  const [stockPrices, setStockPrices] = useState({});
  const [currentStock, setCurrentStock] = useState({ symbol: '', quantity: 0, purchasePrice: 0 });
  const [isEditing, setIsEditing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    const fetchPrices = async () => {
      const prices = {};
      for (const stock of stocks) {
        try {
          const price = await fetchStockPrice(stock.symbol);
          prices[stock.symbol] = price;
        } catch {
          prices[stock.symbol] = stock.purchasePrice;
        }
      }
      setStockPrices(prices);
    };

    fetchPrices();
    const interval = setInterval(fetchPrices, 60000);
    return () => clearInterval(interval);
  }, [stocks]);

  const calculateTotalValue = () =>
    stocks.reduce((total, stock) => total + stock.quantity * (stockPrices[stock.symbol] || stock.purchasePrice), 0);

  const handleAddOrUpdate = () => {
    if (isEditing) {
      setStocks(stocks.map((s) => (s.id === currentStock.id ? currentStock : s)));
      setIsEditing(false);
    } else {
      setStocks([...stocks, { ...currentStock, id: Date.now() }]);
    }
    setCurrentStock({ symbol: '', quantity: 0, purchasePrice: 0 });
  };

  const handleEdit = (stock) => {
    setCurrentStock(stock);
    setIsEditing(true);
  };

  const handleDelete = (id) => setStocks(stocks.filter((stock) => stock.id !== id));

  const calculateTopStock = () => {
    return stocks.reduce(
      (top, stock) => {
        const currentPrice = stockPrices[stock.symbol] || stock.purchasePrice;
        const performance = (currentPrice - stock.purchasePrice) / stock.purchasePrice;
        return performance > top.performance ? { ...stock, performance } : top;
      },
      { performance: -Infinity }
    );
  };

  // Function to search stock symbols from Finnhub API
  const handleSearch = async (term) => {
    setSearchTerm(term);
    if (term === '') {
      setSearchResults([]);
      return;
    }

    try {
      const results = await searchStockSymbols(term);  // Fetch matching stock symbols from Finnhub
      setSearchResults(results);
    } catch (error) {
      console.error('Error fetching search results:', error);
      setSearchResults([]);
    }
  };

  // Function to handle selecting a stock from search results
  const handleSelectStock = (stock) => {
    setCurrentStock({ ...currentStock, symbol: stock.symbol });
    setSearchTerm('');  // Clear search after selection
    setSearchResults([]);  // Hide dropdown after selection
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Simple Portfolio Tracker</h1>

      {/* Search Input with Dropdown */}
      <div className="mb-4 relative">
        <input
          type="text"
          placeholder="Search Stock by Symbol"
          value={searchTerm}
          onChange={(e) => handleSearch(e.target.value)}
          className="p-2 border rounded w-full"
        />
        
        {/* Dropdown for Search Results */}
        {searchResults.length > 0 && (
          <div className="absolute bg-white border rounded shadow-lg mt-1 w-full max-h-60 overflow-y-auto z-10">
            {searchResults.map((stock) => (
              <div
                key={stock.symbol}
                onClick={() => handleSelectStock(stock)}
                className="p-2 cursor-pointer hover:bg-gray-100"
              >
                {stock.symbol}
              </div>
            ))}
          </div>
        )}
      </div>

      <Dashboard
        totalValue={calculateTotalValue()}
        topStock={calculateTopStock()}
        distribution={stocks.map((s) => ({
          name: s.symbol,
          value: s.quantity * (stockPrices[s.symbol] || s.purchasePrice),
        }))}
      />

      <StockForm
        stock={currentStock}
        setStock={setCurrentStock}
        onSubmit={handleAddOrUpdate}
        isEditing={isEditing}
      />
      <StockList stocks={stocks} onEdit={handleEdit} onDelete={handleDelete} />
    </div>
  );
};

export default App;
