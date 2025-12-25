import React, { useState, useEffect } from "react";
import { useTheme } from '../context/ThemeContext';
import { DoughnutChart } from "./DoughnoutChart";

const Summary = () => {
  const { theme } = useTheme();
  const [user, setUser] = useState(null);
  const [holdings, setHoldings] = useState([]);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    // Fetch user data
    const token = localStorage.getItem("token");
    if (token) {
      fetchUserProfile();
    }
    
    // Load holdings and orders
    const storedHoldings = JSON.parse(localStorage.getItem('holdings') || '[]');
    const storedOrders = JSON.parse(localStorage.getItem('orders') || '[]');
    setHoldings(storedHoldings);
    setOrders(storedOrders);
  }, []);

  const fetchUserProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:8000/auth/me", {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  };

  const totalInvestment = holdings.reduce((sum, stock) => sum + (stock.avg * stock.qty), 0);
  const currentValue = holdings.reduce((sum, stock) => sum + (stock.price * stock.qty), 0);
  const totalPnL = currentValue - totalInvestment;
  const pnlPercentage = totalInvestment > 0 ? ((totalPnL / totalInvestment) * 100) : 0;

  // Chart data for portfolio distribution
  const chartData = {
    labels: holdings.map(stock => stock.name),
    datasets: [{
      data: holdings.map(stock => stock.price * stock.qty),
      backgroundColor: [
        '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', 
        '#9966FF', '#FF9F40', '#FF6384', '#C9CBCF'
      ],
      borderWidth: 2,
      borderColor: theme === 'dark' ? '#374151' : '#fff'
    }]
  };

  return (
    <div className={`transition-colors ${theme === "dark" ? "text-white" : ""}`}>
      <div className="username">
        <h6 className={`text-responsive-base ${theme === "dark" ? "text-white" : ""}`}>Hi, {user?.name || 'User'}!</h6>
        <hr className={`divider ${theme === "dark" ? "border-gray-600" : ""}`} />
      </div>

      {/* Portfolio Overview */}
      <div className="section">
        <span>
          <p className={`text-responsive-sm ${theme === "dark" ? "text-green-400" : ""}`}>Portfolio Overview</p>
        </span>
        <div className="data">
          <div className="first">
            <h3 className={`text-responsive-lg ${theme === "dark" ? "text-white" : ""}`}>₹{user?.balance || 0}</h3>
            <p className="text-responsive-xs">Available Balance</p>
          </div>
          <hr className={`${theme === "dark" ? "border-gray-600" : ""} mobile-hidden`} />
          <div className="second">
            <p className={`text-responsive-xs ${theme === "dark" ? "text-gray-300" : ""}`}>
              Total Holdings <span className={`text-responsive-sm ${theme === "dark" ? "text-white" : ""}`}>₹{currentValue.toFixed(0)}</span>
            </p>
            <p className={`text-responsive-xs ${theme === "dark" ? "text-gray-300" : ""}`}>
              Total Orders <span className={`text-responsive-sm ${theme === "dark" ? "text-white" : ""}`}>{orders.length}</span>
            </p>
          </div>
        </div>
        <hr className={`divider ${theme === "dark" ? "border-gray-600" : ""}`} />
      </div>

      {/* Holdings Summary */}
      <div className="section">
        <span>
          <p className={`text-responsive-sm ${theme === "dark" ? "text-green-400" : ""}`}>Holdings ({holdings.length})</p>
        </span>
        <div className="data">
          <div className="first">
            <h3 className={`text-responsive-lg ${totalPnL >= 0 ? 'profit text-green-500' : 'loss text-red-500'}`}>
              ₹{Math.abs(totalPnL).toFixed(0)} 
              <small className={`text-responsive-xs ${totalPnL >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {totalPnL >= 0 ? '+' : '-'}{Math.abs(pnlPercentage).toFixed(2)}%
              </small>
            </h3>
            <p className="text-responsive-xs">P&L</p>
          </div>
          <hr className={`${theme === "dark" ? "border-gray-600" : ""} mobile-hidden`} />
          <div className="second">
            <p className={`text-responsive-xs ${theme === "dark" ? "text-gray-300" : ""}`}>
              Current Value <span className={`text-responsive-sm ${theme === "dark" ? "text-white" : ""}`}>₹{currentValue.toFixed(0)}</span>
            </p>
            <p className={`text-responsive-xs ${theme === "dark" ? "text-gray-300" : ""}`}>
              Investment <span className={`text-responsive-sm ${theme === "dark" ? "text-white" : ""}`}>₹{totalInvestment.toFixed(0)}</span>
            </p>
          </div>
        </div>
        <hr className={`divider ${theme === "dark" ? "border-gray-600" : ""}`} />
      </div>

      {/* Portfolio Distribution Chart */}
      {holdings.length > 0 && (
        <div className="section">
          <span>
            <p className={`text-responsive-sm ${theme === "dark" ? "text-green-400" : ""}`}>Portfolio Distribution</p>
          </span>
          <div className="w-full max-w-[180px] mx-auto chart-container">
            <DoughnutChart data={chartData} />
          </div>
          <hr className={`divider ${theme === "dark" ? "border-gray-600" : ""}`} />
        </div>
      )}

      {/* Quick Stats */}
      <div className="section">
        <span>
          <p className={`text-responsive-sm ${theme === "dark" ? "text-green-400" : ""}`}>Today's Activity</p>
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3 mt-3">
          <div className={`p-2 sm:p-3 rounded-lg border ${theme === "dark" ? "bg-gray-800 border-gray-600" : "bg-gray-50 border-gray-200"}`}>
            <h4 className={`text-base sm:text-lg font-bold ${theme === "dark" ? "text-green-400" : "text-green-600"}`}>{orders.filter(o => o.side === 'BUY').length}</h4>
            <p className={`text-xs ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>Buy Orders</p>
          </div>
          <div className={`p-2 sm:p-3 rounded-lg border ${theme === "dark" ? "bg-gray-800 border-gray-600" : "bg-gray-50 border-gray-200"}`}>
            <h4 className={`text-base sm:text-lg font-bold ${theme === "dark" ? "text-blue-400" : "text-blue-600"}`}>{holdings.length}</h4>
            <p className={`text-xs ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>Holdings</p>
          </div>
          <div className={`p-2 sm:p-3 rounded-lg border ${theme === "dark" ? "bg-gray-800 border-gray-600" : "bg-gray-50 border-gray-200"}`}>
            <h4 className={`text-base sm:text-lg font-bold ${theme === "dark" ? "text-purple-400" : "text-purple-600"}`}>87%</h4>
            <p className={`text-xs ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>Success Rate</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Summary;
