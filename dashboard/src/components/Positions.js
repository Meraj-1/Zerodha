import React, { useState, useEffect } from "react";
import { useTheme } from '../context/ThemeContext';
import { VerticalGraph } from "./VerticalGraph";

const Positions = () => {
  const { theme } = useTheme();
  const [positions, setPositions] = useState([]);
  const [dayTradingStats, setDayTradingStats] = useState({
    totalTrades: 0,
    profitableTrades: 0,
    totalPnL: 0
  });

  useEffect(() => {
    // Generate some dummy intraday positions for demo
    const dummyPositions = [
      {
        product: "MIS",
        name: "RELIANCE",
        qty: 10,
        avg: 2450.50,
        price: 2465.75,
        day: "+0.62%",
        isLoss: false
      },
      {
        product: "MIS",
        name: "TCS",
        qty: -5,
        avg: 3200.00,
        price: 3185.25,
        day: "+0.46%",
        isLoss: false
      },
      {
        product: "NRML",
        name: "INFY",
        qty: 8,
        avg: 1555.00,
        price: 1548.30,
        day: "-0.43%",
        isLoss: true
      },
      {
        product: "MIS",
        name: "HDFC",
        qty: -3,
        avg: 1650.75,
        price: 1642.20,
        day: "+0.52%",
        isLoss: false
      }
    ];
    
    setPositions(dummyPositions);
    
    // Calculate day trading stats
    const totalTrades = dummyPositions.length;
    const profitableTrades = dummyPositions.filter(p => !p.isLoss).length;
    const totalPnL = dummyPositions.reduce((sum, pos) => {
      const pnl = (pos.price - pos.avg) * Math.abs(pos.qty);
      return sum + (pos.qty > 0 ? pnl : -pnl);
    }, 0);
    
    setDayTradingStats({ totalTrades, profitableTrades, totalPnL });
  }, []);

  // Chart data for positions P&L
  const chartData = {
    labels: positions.map(pos => pos.name),
    datasets: [
      {
        label: "P&L",
        data: positions.map(pos => {
          const pnl = (pos.price - pos.avg) * Math.abs(pos.qty);
          return pos.qty > 0 ? pnl : -pnl;
        }),
        backgroundColor: positions.map(pos => pos.isLoss ? "rgba(239, 68, 68, 0.5)" : "rgba(34, 197, 94, 0.5)"),
        borderColor: positions.map(pos => pos.isLoss ? "rgba(239, 68, 68, 1)" : "rgba(34, 197, 94, 1)"),
        borderWidth: 2,
      },
    ],
  };

  return (
    <div className={`transition-colors ${theme === "dark" ? "text-white" : ""}`}>
      <h3 className={`title ${theme === "light" ? "text-gray-800" : "text-white"}`}>
        Positions ({positions.length})
      </h3>

      {/* Day Trading Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className={`p-4 rounded-lg border ${theme === "dark" ? "bg-gray-800 border-gray-600" : "bg-blue-50 border-blue-200"}`}>
          <h4 className={`text-2xl font-bold ${theme === "dark" ? "text-blue-400" : "text-blue-600"}`}>{dayTradingStats.totalTrades}</h4>
          <p className={`text-sm ${theme === "dark" ? "text-gray-300" : "text-blue-600"}`}>Active Positions</p>
        </div>
        <div className={`p-4 rounded-lg border ${theme === "dark" ? "bg-gray-800 border-gray-600" : "bg-green-50 border-green-200"}`}>
          <h4 className={`text-2xl font-bold ${theme === "dark" ? "text-green-400" : "text-green-600"}`}>{dayTradingStats.profitableTrades}</h4>
          <p className={`text-sm ${theme === "dark" ? "text-gray-300" : "text-green-600"}`}>Profitable</p>
        </div>
        <div className={`p-4 rounded-lg border ${theme === "dark" ? "bg-gray-800 border-gray-600" : "bg-purple-50 border-purple-200"}`}>
          <h4 className={`text-2xl font-bold ${dayTradingStats.totalPnL >= 0 ? 'text-green-500' : 'text-red-500'}`}>
            ₹{dayTradingStats.totalPnL.toFixed(0)}
          </h4>
          <p className={`text-sm ${theme === "dark" ? "text-gray-300" : "text-purple-600"}`}>Total P&L</p>
        </div>
      </div>

      <div className={`order-table ${theme === "dark" ? "dark-theme" : ""}`}>
        <table>
          <thead>
            <tr>
              <th>Product</th>
              <th>Instrument</th>
              <th>Qty.</th>
              <th>Avg.</th>
              <th>LTP</th>
              <th>P&L</th>
              <th>Chg.</th>
            </tr>
          </thead>
          <tbody>
            {positions.map((stock, index) => {
              const pnl = (stock.price - stock.avg) * Math.abs(stock.qty);
              const actualPnL = stock.qty > 0 ? pnl : -pnl;
              const profClass = actualPnL >= 0 ? "profit" : "loss";
              const dayClass = stock.isLoss ? "loss" : "profit";
              const qtyColor = stock.qty > 0 ? "text-blue-600" : "text-red-600";

              return (
                <tr key={index}>
                  <td>
                    <span className={`px-2 py-1 rounded text-xs ${
                      stock.product === 'MIS' ? 'bg-orange-100 text-orange-800' : 'bg-blue-100 text-blue-800'
                    }`}>
                      {stock.product}
                    </span>
                  </td>
                  <td className="font-semibold">{stock.name}</td>
                  <td className={qtyColor}>{stock.qty > 0 ? '+' : ''}{stock.qty}</td>
                  <td>₹{stock.avg.toFixed(2)}</td>
                  <td>₹{stock.price.toFixed(2)}</td>
                  <td className={profClass}>
                    ₹{actualPnL.toFixed(2)}
                  </td>
                  <td className={dayClass}>{stock.day}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* P&L Chart */}
      {positions.length > 0 && (
        <div className="mt-8">
          <h4 className={`text-lg font-semibold mb-4 ${theme === "dark" ? "text-white" : "text-gray-800"}`}>
            Position-wise P&L
          </h4>
          <VerticalGraph data={chartData} />
        </div>
      )}

      {/* Trading Tips */}
      <div className={`mt-8 p-4 rounded-lg border ${theme === "dark" ? "bg-gray-800 border-gray-600" : "bg-yellow-50 border-yellow-200"}`}>
        <h4 className={`font-semibold mb-2 ${theme === "dark" ? "text-yellow-400" : "text-yellow-800"}`}>
          💡 Day Trading Tips
        </h4>
        <ul className={`text-sm space-y-1 ${theme === "dark" ? "text-gray-300" : "text-yellow-700"}`}>
          <li>• MIS positions will be auto-squared off by 3:20 PM</li>
          <li>• Monitor your positions closely during market hours</li>
          <li>• Set stop-losses to manage risk effectively</li>
        </ul>
      </div>
    </div>
  );
};

export default Positions;
