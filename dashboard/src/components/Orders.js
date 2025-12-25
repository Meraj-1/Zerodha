import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useTheme } from '../context/ThemeContext';

const Orders = () => {
  const { theme } = useTheme();
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    // Load orders from localStorage
    const storedOrders = JSON.parse(localStorage.getItem('orders') || '[]');
    setOrders(storedOrders.reverse()); // Show latest first
  }, []);

  // Refresh orders when localStorage changes
  useEffect(() => {
    const handleStorageChange = () => {
      const storedOrders = JSON.parse(localStorage.getItem('orders') || '[]');
      setOrders(storedOrders.reverse());
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return (
    <div className={`orders transition-colors ${
      theme === "dark" ? "text-white" : ""
    }`}>
      {orders.length === 0 ? (
        <div className="no-orders">
          <div className={`icon text-6xl mb-4 ${
            theme === "light" ? "text-gray-300" : "text-gray-600"
          }`}>📈</div>
          <p className={theme === "light" ? "text-gray-600" : "text-gray-400"}>You haven't placed any orders today</p>
          <Link to={"/"} className="btn">
            Get started
          </Link>
        </div>
      ) : (
        <>
          <h3 className={`title ${
            theme === "light" ? "text-gray-800" : "text-white"
          }`}>Orders ({orders.length})</h3>
          
          <div className={`order-table mt-4 ${
            theme === "dark" ? "dark-theme" : ""
          }`}>
            <table>
              <thead>
                <tr>
                  <th>Time</th>
                  <th>Instrument</th>
                  <th>Qty.</th>
                  <th>Price</th>
                  <th>Type</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order, index) => (
                  <tr key={index}>
                    <td>{new Date(order.timestamp).toLocaleTimeString()}</td>
                    <td className="font-semibold text-blue-600">{order.symbol}</td>
                    <td>{order.quantity}</td>
                    <td>₹{order.price.toFixed(2)}</td>
                    <td>
                      <span className={`px-2 py-1 rounded text-xs ${
                        order.side === 'BUY' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {order.side}
                      </span>
                    </td>
                    <td>
                      <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs">
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};
export default Orders;
