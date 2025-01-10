import React, { useState, useEffect } from 'react';
import Dashboard from './components/Dashboard';
import StockForm from './components/StockForm';
import StockList from './components/StockList';
import { fetchStockPrice, searchStockSymbols } from './api/finnhub';
import MyComponent from './components/MyComponent';

const initialStocks = [
  { id: 1, symbol: 'AAPL', quantity: 10, purchasePrice: 150 },
  { id: 2, symbol: 'GOOGL', quantity: 5, purchasePrice: 2800 },
  { id: 3, symbol: 'MSFT', quantity: 20, purchasePrice: 300 },
];

const PortfolioTracker = () => {
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

  const handleSearch = async (term) => {
    setSearchTerm(term);
    if (term === '') {
      setSearchResults([]);
      return;
    }

    try {
      const results = await searchStockSymbols(term);
      setSearchResults(results);
    } catch (error) {
      console.error('Error fetching search results:', error);
      setSearchResults([]);
    }
  };

  const handleSelectStock = (stock) => {
    setCurrentStock({ ...currentStock, symbol: stock.symbol });
    setSearchTerm('');
    setSearchResults([]);
  };

  return (
    <div>
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

const App = () => {
  return (
    <div>
      <PortfolioTracker />
      <MyComponent />
    </div>
  );
};

export default App;
