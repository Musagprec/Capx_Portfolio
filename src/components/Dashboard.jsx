import { LineChart, XAxis, YAxis, CartesianGrid, Tooltip, Line } from 'recharts';

const Dashboard = ({ totalValue, topStock, distribution }) => {
  return (
    <section className="mb-8">
      <h2 className="text-xl font-bold mb-4">Dashboard</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gray-100 p-4 rounded shadow">
          <h3 className="text-lg font-semibold">Total Portfolio Value</h3>
          <p className="text-2xl font-bold">${totalValue.toFixed(2)}</p>
        </div>
        <div className="bg-gray-100 p-4 rounded shadow">
          <h3 className="text-lg font-semibold">Top Performing Stock</h3>
          <p className="text-lg font-bold">{topStock.symbol}</p>
          <p className="text-gray-600">Performance: {((topStock.performance || 0) * 100).toFixed(2)}%</p>
        </div>
        <div className="bg-gray-100 p-4 rounded shadow">
          <h3 className="text-lg font-semibold">Portfolio Distribution</h3>
          <LineChart width={300} height={200} data={distribution}>
            <XAxis dataKey="name" />
            <YAxis />
            <CartesianGrid strokeDasharray="3 3" />
            <Tooltip />
            <Line type="monotone" dataKey="value" stroke="#8884d8" activeDot={{ r: 8 }} />
          </LineChart>
        </div>
      </div>
    </section>
  );
};

export default Dashboard;
