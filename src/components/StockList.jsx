import { Edit, Trash } from 'lucide-react';

const StockList = ({ stocks, onEdit, onDelete }) => {
  return (
    <div className="bg-gray-100 p-4 rounded shadow">
      <h3 className="text-lg font-semibold mb-2">Stock List</h3>
      <table className="w-full">
        <thead>
          <tr>
            <th className="p-2">Symbol</th>
            <th className="p-2">Quantity</th>
            <th className="p-2">Purchase Price</th>
            <th className="p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {stocks.map((stock) => (
            <tr key={stock.id}>
              <td className="p-2">{stock.symbol}</td>
              <td className="p-2">{stock.quantity}</td>
              <td className="p-2">${stock.purchasePrice.toFixed(2)}</td>
              <td className="p-2">
                <button onClick={() => onEdit(stock)} className="p-1 bg-yellow-500 text-white rounded mr-2">
                  <Edit className="h-4 w-4" />
                </button>
                <button onClick={() => onDelete(stock.id)} className="p-1 bg-red-500 text-white rounded">
                  <Trash className="h-4 w-4" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StockList;
