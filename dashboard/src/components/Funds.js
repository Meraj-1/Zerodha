import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useTheme } from '../context/ThemeContext';
import { VerticalGraph } from "./VerticalGraph";
import toast from 'react-hot-toast';

const Funds = () => {
  const { theme } = useTheme();
  const [user, setUser] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [fundStats, setFundStats] = useState({
    totalDeposits: 0,
    totalWithdrawals: 0,
    netFlow: 0
  });
  const [showAddFunds, setShowAddFunds] = useState(false);
  const [showWithdraw, setShowWithdraw] = useState(false);
  const [amount, setAmount] = useState('');
  const [method, setMethod] = useState('UPI');

  useEffect(() => {
    fetchUserProfile();
    fetchTransactionHistory();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;
      
      const response = await fetch("https://kitebackend.vercel.app/auth/me", {
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

  const fetchTransactionHistory = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;
      
      const response = await fetch("https://kitebackend.vercel.app/user/transactions", {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setTransactions(data.transactions);
        
        const totalDeposits = data.transactions.filter(t => t.type === 'credit').reduce((sum, t) => sum + t.amount, 0);
        const totalWithdrawals = data.transactions.filter(t => t.type === 'debit').reduce((sum, t) => sum + t.amount, 0);
        
        setFundStats({
          totalDeposits,
          totalWithdrawals,
          netFlow: totalDeposits - totalWithdrawals
        });
      }
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
  };

  const handleAddFunds = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("https://kitebackend.vercel.app/user/add-funds", {
        method: 'POST',
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ amount: parseFloat(amount), method })
      });
      
      const data = await response.json();
      if (response.ok) {
        toast.success(`₹${amount} added successfully!`);
        setUser(prev => ({ ...prev, balance: data.balance }));
        fetchTransactionHistory();
        setShowAddFunds(false);
        setAmount('');
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error('Failed to add funds');
    }
  };

  const handleWithdrawFunds = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("https://kitebackend.vercel.app/user/withdraw-funds", {
        method: 'POST',
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ amount: parseFloat(amount), method })
      });
      
      const data = await response.json();
      if (response.ok) {
        toast.success(`₹${amount} withdrawn successfully!`);
        setUser(prev => ({ ...prev, balance: data.balance }));
        fetchTransactionHistory();
        setShowWithdraw(false);
        setAmount('');
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error('Failed to withdraw funds');
    }
  };

  // Chart data for fund flow
  const chartData = {
    labels: ['Deposits', 'Withdrawals', 'Net Flow'],
    datasets: [
      {
        label: "Amount (₹)",
        data: [fundStats.totalDeposits, fundStats.totalWithdrawals, fundStats.netFlow],
        backgroundColor: ["rgba(34, 197, 94, 0.5)", "rgba(239, 68, 68, 0.5)", "rgba(59, 130, 246, 0.5)"],
        borderColor: ["rgba(34, 197, 94, 1)", "rgba(239, 68, 68, 1)", "rgba(59, 130, 246, 1)"],
        borderWidth: 2,
      },
    ],
  };

  return (
    <div className={`transition-colors ${theme === "dark" ? "text-white" : ""}`}>
      <div className="funds">
        <p className={theme === "dark" ? "text-gray-300" : ""}>Instant, zero-cost fund transfers with UPI</p>
        <button className="btn btn-green" onClick={() => setShowAddFunds(true)}>Add funds</button>
        <button className="btn btn-blue" onClick={() => setShowWithdraw(true)}>Withdraw</button>
      </div>

      {/* Add Funds Modal */}
      {showAddFunds && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className={`p-6 rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} w-96`}>
            <h3 className={`text-lg font-semibold mb-4 ${theme === 'dark' ? 'text-white' : ''}`}>Add Funds</h3>
            <form onSubmit={handleAddFunds}>
              <input
                type="number"
                placeholder="Enter amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className={`w-full p-3 border rounded mb-4 ${theme === 'dark' ? 'bg-gray-700 text-white border-gray-600' : ''}`}
                required
              />
              <select
                value={method}
                onChange={(e) => setMethod(e.target.value)}
                className={`w-full p-3 border rounded mb-4 ${theme === 'dark' ? 'bg-gray-700 text-white border-gray-600' : ''}`}
              >
                <option value="UPI">UPI</option>
                <option value="Net Banking">Net Banking</option>
                <option value="Debit Card">Debit Card</option>
              </select>
              <div className="flex gap-2">
                <button type="submit" className="btn btn-green flex-1">Add Funds</button>
                <button type="button" onClick={() => setShowAddFunds(false)} className="btn btn-grey flex-1">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Withdraw Funds Modal */}
      {showWithdraw && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className={`p-6 rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} w-96`}>
            <h3 className={`text-lg font-semibold mb-4 ${theme === 'dark' ? 'text-white' : ''}`}>Withdraw Funds</h3>
            <p className={`text-sm mb-4 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>Available Balance: ₹{user?.balance || 0}</p>
            <form onSubmit={handleWithdrawFunds}>
              <input
                type="number"
                placeholder="Enter amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                max={user?.balance || 0}
                className={`w-full p-3 border rounded mb-4 ${theme === 'dark' ? 'bg-gray-700 text-white border-gray-600' : ''}`}
                required
              />
              <select
                value={method}
                onChange={(e) => setMethod(e.target.value)}
                className={`w-full p-3 border rounded mb-4 ${theme === 'dark' ? 'bg-gray-700 text-white border-gray-600' : ''}`}
              >
                <option value="Bank Transfer">Bank Transfer</option>
                <option value="UPI">UPI</option>
              </select>
              <div className="flex gap-2">
                <button type="submit" className="btn btn-blue flex-1">Withdraw</button>
                <button type="button" onClick={() => setShowWithdraw(false)} className="btn btn-grey flex-1">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Fund Statistics */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className={`p-4 rounded-lg border ${theme === "dark" ? "bg-gray-800 border-gray-600" : "bg-green-50 border-green-200"}`}>
          <h4 className={`text-2xl font-bold ${theme === "dark" ? "text-green-400" : "text-green-600"}`}>₹{fundStats.totalDeposits.toLocaleString()}</h4>
          <p className={`text-sm ${theme === "dark" ? "text-gray-300" : "text-green-600"}`}>Total Deposits</p>
        </div>
        <div className={`p-4 rounded-lg border ${theme === "dark" ? "bg-gray-800 border-gray-600" : "bg-red-50 border-red-200"}`}>
          <h4 className={`text-2xl font-bold ${theme === "dark" ? "text-red-400" : "text-red-600"}`}>₹{fundStats.totalWithdrawals.toLocaleString()}</h4>
          <p className={`text-sm ${theme === "dark" ? "text-gray-300" : "text-red-600"}`}>Total Withdrawals</p>
        </div>
        <div className={`p-4 rounded-lg border ${theme === "dark" ? "bg-gray-800 border-gray-600" : "bg-blue-50 border-blue-200"}`}>
          <h4 className={`text-2xl font-bold ${theme === "dark" ? "text-blue-400" : "text-blue-600"}`}>₹{fundStats.netFlow.toLocaleString()}</h4>
          <p className={`text-sm ${theme === "dark" ? "text-gray-300" : "text-blue-600"}`}>Net Flow</p>
        </div>
      </div>

      <div className="row">
        <div className="col">
          <span>
            <p className={theme === "dark" ? "text-green-400" : ""}>Equity</p>
          </span>

          <div className={`table ${theme === "dark" ? "bg-gray-800 border-gray-600" : ""}`}>
            <div className="data">
              <p className={theme === "dark" ? "text-gray-300" : ""}>Available margin</p>
              <p className={`imp colored ${theme === "dark" ? "text-blue-400" : ""}`}>₹{user?.balance || 0}</p>
            </div>
            <div className="data">
              <p className={theme === "dark" ? "text-gray-300" : ""}>Used margin</p>
              <p className={`imp ${theme === "dark" ? "text-white" : ""}`}>0.00</p>
            </div>
            <div className="data">
              <p className={theme === "dark" ? "text-gray-300" : ""}>Available cash</p>
              <p className={`imp ${theme === "dark" ? "text-white" : ""}`}>₹{user?.balance || 0}</p>
            </div>
            <hr className={theme === "dark" ? "border-gray-600" : ""} />
            <div className="data">
              <p className={theme === "dark" ? "text-gray-400" : ""}>Opening Balance</p>
              <p className={theme === "dark" ? "text-gray-300" : ""}>₹{user?.balance || 0}</p>
            </div>
            <div className="data">
              <p className={theme === "dark" ? "text-gray-400" : ""}>Payin</p>
              <p className={theme === "dark" ? "text-gray-300" : ""}>₹{fundStats.totalDeposits.toLocaleString()}</p>
            </div>
            <div className="data">
              <p className={theme === "dark" ? "text-gray-400" : ""}>Payout</p>
              <p className={theme === "dark" ? "text-gray-300" : ""}>₹{fundStats.totalWithdrawals.toLocaleString()}</p>
            </div>
            <div className="data">
              <p className={theme === "dark" ? "text-gray-400" : ""}>SPAN</p>
              <p className={theme === "dark" ? "text-gray-300" : ""}>0.00</p>
            </div>
            <div className="data">
              <p className={theme === "dark" ? "text-gray-400" : ""}>Delivery margin</p>
              <p className={theme === "dark" ? "text-gray-300" : ""}>0.00</p>
            </div>
            <div className="data">
              <p className={theme === "dark" ? "text-gray-400" : ""}>Exposure</p>
              <p className={theme === "dark" ? "text-gray-300" : ""}>0.00</p>
            </div>
            <div className="data">
              <p className={theme === "dark" ? "text-gray-400" : ""}>Options premium</p>
              <p className={theme === "dark" ? "text-gray-300" : ""}>0.00</p>
            </div>
            <hr className={theme === "dark" ? "border-gray-600" : ""} />
            <div className="data">
              <p className={theme === "dark" ? "text-gray-400" : ""}>Collateral (Liquid funds)</p>
              <p className={theme === "dark" ? "text-gray-300" : ""}>0.00</p>
            </div>
            <div className="data">
              <p className={theme === "dark" ? "text-gray-400" : ""}>Collateral (Equity)</p>
              <p className={theme === "dark" ? "text-gray-300" : ""}>0.00</p>
            </div>
            <div className="data">
              <p className={theme === "dark" ? "text-gray-400" : ""}>Total Collateral</p>
              <p className={theme === "dark" ? "text-gray-300" : ""}>0.00</p>
            </div>
          </div>
        </div>

        <div className="col">
          {/* Recent Transactions */}
          <div className={`p-6 rounded-lg border ${theme === "dark" ? "bg-gray-800 border-gray-600" : "bg-gray-50 border-gray-200"}`}>
            <h4 className={`font-semibold mb-4 ${theme === "dark" ? "text-white" : "text-gray-800"}`}>Recent Transactions</h4>
            <div className="space-y-3">
              {transactions.slice(0, 5).map((txn, index) => (
                <div key={index} className={`flex justify-between items-center p-3 rounded border ${theme === "dark" ? "bg-gray-700 border-gray-600" : "bg-white border-gray-200"}`}>
                  <div>
                    <p className={`font-medium ${txn.type === 'credit' ? 'text-green-600' : 'text-red-600'}`}>
                      {txn.type === 'credit' ? '+' : '-'}₹{txn.amount.toLocaleString()}
                    </p>
                    <p className={`text-xs ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>{txn.description}</p>
                  </div>
                  <p className={`text-xs ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>{new Date(txn.createdAt).toLocaleDateString()}</p>
                </div>
              ))}}
            </div>
          </div>

          <div className={`commodity mt-6 ${theme === "dark" ? "bg-gray-800 border-gray-600" : ""}`}>
            <p className={theme === "dark" ? "text-gray-300" : ""}>You don't have a commodity account</p>
            <Link className="btn btn-blue" to='/auth'>Open Account</Link>
          </div>
        </div>
      </div>

      {/* Fund Flow Chart */}
      {transactions.length > 0 && (
        <div className="mt-8">
          <h4 className={`text-lg font-semibold mb-4 ${theme === "dark" ? "text-white" : "text-gray-800"}`}>
            Fund Flow Analysis
          </h4>
          <VerticalGraph data={chartData} />
        </div>
      )}
    </div>
  );
};

export default Funds;
