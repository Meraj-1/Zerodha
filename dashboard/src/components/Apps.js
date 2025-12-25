import React, { useState, useEffect } from "react";
import { useTheme } from '../context/ThemeContext';
import { DoughnutChart } from "./DoughnoutChart";

const Apps = () => {
  const { theme } = useTheme();
  const [appUsage, setAppUsage] = useState({
    kite: 85,
    coin: 45,
    console: 30,
    varsity: 60
  });

  const [marketData, setMarketData] = useState({
    nifty: { value: 21850.50, change: +125.30 },
    sensex: { value: 72240.80, change: +380.45 },
    bankNifty: { value: 46820.75, change: -85.20 }
  });

  useEffect(() => {
    // Simulate real-time market data updates
    const interval = setInterval(() => {
      setMarketData(prev => ({
        nifty: {
          value: prev.nifty.value + (Math.random() - 0.5) * 10,
          change: prev.nifty.change + (Math.random() - 0.5) * 5
        },
        sensex: {
          value: prev.sensex.value + (Math.random() - 0.5) * 30,
          change: prev.sensex.change + (Math.random() - 0.5) * 15
        },
        bankNifty: {
          value: prev.bankNifty.value + (Math.random() - 0.5) * 20,
          change: prev.bankNifty.change + (Math.random() - 0.5) * 8
        }
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const apps = [
    {
      name: "Kite",
      description: "Trading platform",
      icon: "📊",
      usage: appUsage.kite,
      color: "blue",
      features: ["Real-time charts", "Order management", "Portfolio tracking"]
    },
    {
      name: "Coin",
      description: "Mutual funds",
      icon: "🪙",
      usage: appUsage.coin,
      color: "green",
      features: ["SIP investments", "Fund research", "Goal planning"]
    },
    {
      name: "Console",
      description: "Back office",
      icon: "⚙️",
      usage: appUsage.console,
      color: "purple",
      features: ["Reports", "Tax statements", "Account settings"]
    },
    {
      name: "Varsity",
      description: "Learning platform",
      icon: "📚",
      usage: appUsage.varsity,
      color: "orange",
      features: ["Trading courses", "Market analysis", "Webinars"]
    }
  ];

  // Chart data for app usage
  const chartData = {
    labels: apps.map(app => app.name),
    datasets: [
      {
        data: apps.map(app => app.usage),
        backgroundColor: [
          "rgba(59, 130, 246, 0.8)",
          "rgba(34, 197, 94, 0.8)",
          "rgba(147, 51, 234, 0.8)",
          "rgba(249, 115, 22, 0.8)"
        ],
        borderColor: [
          "rgba(59, 130, 246, 1)",
          "rgba(34, 197, 94, 1)",
          "rgba(147, 51, 234, 1)",
          "rgba(249, 115, 22, 1)"
        ],
        borderWidth: 2,
      },
    ],
  };

  const getColorClasses = (color) => {
    const colors = {
      blue: theme === "dark" ? "bg-blue-900/30 border-blue-500/30 text-blue-300" : "bg-blue-50 border-blue-200 text-blue-700",
      green: theme === "dark" ? "bg-green-900/30 border-green-500/30 text-green-300" : "bg-green-50 border-green-200 text-green-700",
      purple: theme === "dark" ? "bg-purple-900/30 border-purple-500/30 text-purple-300" : "bg-purple-50 border-purple-200 text-purple-700",
      orange: theme === "dark" ? "bg-orange-900/30 border-orange-500/30 text-orange-300" : "bg-orange-50 border-orange-200 text-orange-700"
    };
    return colors[color] || colors.blue;
  };

  return (
    <div className={`transition-colors ${theme === "dark" ? "text-white" : ""}`}>
      <h3 className={`title ${theme === "light" ? "text-gray-800" : "text-white"}`}>
        Zerodha Ecosystem
      </h3>

      {/* Live Market Data */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {Object.entries(marketData).map(([key, data]) => (
          <div key={key} className={`p-4 rounded-lg border ${theme === "dark" ? "bg-gray-800 border-gray-600" : "bg-white border-gray-200"} shadow-sm`}>
            <h4 className={`font-semibold text-sm ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>
              {key.toUpperCase().replace('BANKNIFTY', 'BANK NIFTY')}
            </h4>
            <div className="flex items-center justify-between mt-2">
              <span className={`text-lg font-bold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                {data.value.toFixed(2)}
              </span>
              <span className={`text-sm font-medium ${
                data.change >= 0 ? 'text-green-500' : 'text-red-500'
              }`}>
                {data.change >= 0 ? '+' : ''}{data.change.toFixed(2)}
              </span>
            </div>
            <div className="flex items-center mt-1">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse mr-2"></div>
              <span className={`text-xs ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>Live</span>
            </div>
          </div>
        ))}
      </div>

      {/* Apps Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {apps.map((app, index) => (
          <div key={index} className={`p-6 rounded-xl border-2 ${getColorClasses(app.color)} hover:shadow-lg transition-all duration-200 cursor-pointer`}>
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <span className="text-3xl">{app.icon}</span>
                <div>
                  <h4 className="text-xl font-bold">{app.name}</h4>
                  <p className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>{app.description}</p>
                </div>
              </div>
              <div className="text-right">
                <div className={`text-2xl font-bold ${app.color === 'blue' ? 'text-blue-600' : app.color === 'green' ? 'text-green-600' : app.color === 'purple' ? 'text-purple-600' : 'text-orange-600'}`}>
                  {app.usage}%
                </div>
                <div className={`text-xs ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>Usage</div>
              </div>
            </div>
            
            {/* Usage Bar */}
            <div className={`w-full rounded-full h-2 mb-4 ${theme === "dark" ? "bg-gray-700" : "bg-gray-200"}`}>
              <div 
                className={`h-2 rounded-full transition-all duration-500 ${
                  app.color === 'blue' ? 'bg-blue-500' : 
                  app.color === 'green' ? 'bg-green-500' : 
                  app.color === 'purple' ? 'bg-purple-500' : 'bg-orange-500'
                }`}
                style={{ width: `${app.usage}%` }}
              ></div>
            </div>
            
            {/* Features */}
            <div className="space-y-2">
              {app.features.map((feature, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <div className={`w-1.5 h-1.5 rounded-full ${
                    app.color === 'blue' ? 'bg-blue-500' : 
                    app.color === 'green' ? 'bg-green-500' : 
                    app.color === 'purple' ? 'bg-purple-500' : 'bg-orange-500'
                  }`}></div>
                  <span className={`text-sm ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>{feature}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* App Usage Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className={`p-6 rounded-xl border ${theme === "dark" ? "bg-gray-800 border-gray-600" : "bg-white border-gray-200"}`}>
          <h4 className={`text-lg font-semibold mb-4 ${theme === "dark" ? "text-white" : "text-gray-800"}`}>
            App Usage Distribution
          </h4>
          <DoughnutChart data={chartData} />
        </div>

        {/* Quick Actions */}
        <div className={`p-6 rounded-xl border ${theme === "dark" ? "bg-gray-800 border-gray-600" : "bg-white border-gray-200"}`}>
          <h4 className={`text-lg font-semibold mb-4 ${theme === "dark" ? "text-white" : "text-gray-800"}`}>
            Quick Actions
          </h4>
          <div className="space-y-3">
            <button className={`w-full p-4 rounded-lg border-2 border-dashed transition-all duration-200 hover:border-solid ${
              theme === "dark" ? "border-gray-600 hover:border-blue-500 hover:bg-blue-900/20" : "border-gray-300 hover:border-blue-500 hover:bg-blue-50"
            }`}>
              <div className="flex items-center gap-3">
                <span className="text-2xl">📱</span>
                <div className="text-left">
                  <p className={`font-medium ${theme === "dark" ? "text-white" : "text-gray-900"}`}>Download Mobile App</p>
                  <p className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>Trade on the go</p>
                </div>
              </div>
            </button>
            
            <button className={`w-full p-4 rounded-lg border-2 border-dashed transition-all duration-200 hover:border-solid ${
              theme === "dark" ? "border-gray-600 hover:border-green-500 hover:bg-green-900/20" : "border-gray-300 hover:border-green-500 hover:bg-green-50"
            }`}>
              <div className="flex items-center gap-3">
                <span className="text-2xl">📊</span>
                <div className="text-left">
                  <p className={`font-medium ${theme === "dark" ? "text-white" : "text-gray-900"}`}>API Documentation</p>
                  <p className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>Build trading apps</p>
                </div>
              </div>
            </button>
            
            <button className={`w-full p-4 rounded-lg border-2 border-dashed transition-all duration-200 hover:border-solid ${
              theme === "dark" ? "border-gray-600 hover:border-purple-500 hover:bg-purple-900/20" : "border-gray-300 hover:border-purple-500 hover:bg-purple-50"
            }`}>
              <div className="flex items-center gap-3">
                <span className="text-2xl">🎓</span>
                <div className="text-left">
                  <p className={`font-medium ${theme === "dark" ? "text-white" : "text-gray-900"}`}>Learning Center</p>
                  <p className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>Improve your skills</p>
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Developer Tools */}
      <div className={`mt-8 p-6 rounded-xl border ${theme === "dark" ? "bg-gray-800 border-gray-600" : "bg-gradient-to-r from-indigo-50 to-purple-50 border-indigo-200"}`}>
        <h4 className={`text-lg font-semibold mb-4 ${theme === "dark" ? "text-white" : "text-gray-800"}`}>
          🚀 Developer Tools & APIs
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className={`p-4 rounded-lg ${theme === "dark" ? "bg-gray-700" : "bg-white"} border ${theme === "dark" ? "border-gray-600" : "border-gray-200"}`}>
            <h5 className={`font-semibold ${theme === "dark" ? "text-blue-400" : "text-blue-600"}`}>Kite Connect API</h5>
            <p className={`text-sm mt-2 ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>REST & WebSocket APIs for trading</p>
          </div>
          <div className={`p-4 rounded-lg ${theme === "dark" ? "bg-gray-700" : "bg-white"} border ${theme === "dark" ? "border-gray-600" : "border-gray-200"}`}>
            <h5 className={`font-semibold ${theme === "dark" ? "text-green-400" : "text-green-600"}`}>Publisher API</h5>
            <p className={`text-sm mt-2 ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>Real-time market data streaming</p>
          </div>
          <div className={`p-4 rounded-lg ${theme === "dark" ? "bg-gray-700" : "bg-white"} border ${theme === "dark" ? "border-gray-600" : "border-gray-200"}`}>
            <h5 className={`font-semibold ${theme === "dark" ? "text-purple-400" : "text-purple-600"}`}>Historical API</h5>
            <p className={`text-sm mt-2 ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>Access historical market data</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Apps;
