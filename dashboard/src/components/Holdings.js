import React, { useState, useEffect } from "react";
import { VerticalGraph } from "./VerticalGraph";
import { useTheme } from '../context/ThemeContext';

const Holdings = () => {
  const { theme } = useTheme();
  const [allHoldings, setAllHoldings] = useState([]);

  useEffect(() => {
    // Load holdings from localStorage
    const storedHoldings = JSON.parse(localStorage.getItem('holdings') || '[]');
    setAllHoldings(storedHoldings);
  }, []);

  // Refresh holdings when component mounts or when localStorage changes
  useEffect(() => {
    const handleStorageChange = () => {
      const storedHoldings = JSON.parse(localStorage.getItem('holdings') || '[]');
      setAllHoldings(storedHoldings);
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const labels = allHoldings.map((stock) => stock.name);

  const data = {
    labels,
    datasets: [
      {
        label: "Stock Price",
        data: allHoldings.map((stock) => stock.price),
        backgroundColor: "rgba(34, 197, 94, 0.5)",
        borderColor: "rgba(34, 197, 94, 1)",
        borderWidth: 2,
      },
    ],
  };

  // export const data = {
  //   labels,
  //   datasets: [
  // {
  //   label: 'Dataset 1',
  //   data: labels.map(() => faker.datatype.number({ min: 0, max: 1000 })),
  //   backgroundColor: 'rgba(255, 99, 132, 0.5)',
  // },
  //     {
  //       label: 'Dataset 2',
  //       data: labels.map(() => faker.datatype.number({ min: 0, max: 1000 })),
  //       backgroundColor: 'rgba(53, 162, 235, 0.5)',
  //     },
  //   ],
  // };

  return (
    <div className={`transition-colors ${
      theme === "light" ? "" : "text-white"
    }`}>
      <h3 className={`title ${
        theme === "light" ? "text-gray-800" : "text-white"
      }`}>Holdings ({allHoldings.length})</h3>

      {allHoldings.length === 0 ? (
        <div className="text-center py-12">
          <div className={`text-6xl mb-4 ${
            theme === "light" ? "text-gray-300" : "text-gray-600"
          }`}>📈</div>
          <p className={`text-lg mb-2 ${
            theme === "light" ? "text-gray-600" : "text-gray-400"
          }`}>No holdings yet</p>
          <p className={`text-sm ${
            theme === "light" ? "text-gray-500" : "text-gray-500"
          }`}>Start trading to see your holdings here</p>
        </div>
      ) : (
        <>
          <div className={`order-table ${
            theme === "dark" ? "dark-theme" : ""
          }`}>
            <table>
              <thead>
                <tr>
                  <th>Instrument</th>
                  <th>Qty.</th>
                  <th>Avg. cost</th>
                  <th>LTP</th>
                  <th>Cur. val</th>
                  <th>P&L</th>
                  <th>Net chg.</th>
                  <th>Day chg.</th>
                </tr>
              </thead>
              <tbody>
                {allHoldings.map((stock, index) => {
                  const curValue = stock.price * stock.qty;
                  const isProfit = curValue - stock.avg * stock.qty >= 0.0;
                  const profClass = isProfit ? "profit" : "loss";
                  const dayClass = stock.isLoss ? "loss" : "profit";

                  return (
                    <tr key={index}>
                      <td className="font-semibold">{stock.name}</td>
                      <td>{stock.qty}</td>
                      <td>₹{stock.avg.toFixed(2)}</td>
                      <td>₹{stock.price.toFixed(2)}</td>
                      <td>₹{curValue.toFixed(2)}</td>
                      <td className={profClass}>
                        ₹{(curValue - stock.avg * stock.qty).toFixed(2)}
                      </td>
                      <td className={profClass}>{stock.net}</td>
                      <td className={dayClass}>{stock.day}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className={`row mt-8 ${
            theme === "dark" ? "text-white" : ""
          }`}>
            <div className="col">
              <h5 className={theme === "dark" ? "text-white" : ""}>
                {allHoldings.reduce((total, stock) => total + (stock.avg * stock.qty), 0).toLocaleString()}.<span>00</span>
              </h5>
              <p>Total investment</p>
            </div>
            <div className="col">
              <h5 className={theme === "dark" ? "text-white" : ""}>
                {allHoldings.reduce((total, stock) => total + (stock.price * stock.qty), 0).toLocaleString()}.<span>00</span>
              </h5>
              <p>Current value</p>
            </div>
            <div className="col">
              <h5 className="text-green-500">
                +{(allHoldings.reduce((total, stock) => total + (stock.price * stock.qty), 0) - 
                   allHoldings.reduce((total, stock) => total + (stock.avg * stock.qty), 0)).toFixed(2)} 
                (+{((allHoldings.reduce((total, stock) => total + (stock.price * stock.qty), 0) / 
                     allHoldings.reduce((total, stock) => total + (stock.avg * stock.qty), 0) - 1) * 100).toFixed(2)}%)
              </h5>
              <p>P&L</p>
            </div>
          </div>
          
          {allHoldings.length > 0 && <VerticalGraph data={data} />}
        </>
      )}
    </div>
  );
};

export default Holdings;
