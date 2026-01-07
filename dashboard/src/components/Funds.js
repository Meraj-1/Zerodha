import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { VerticalGraph } from "./VerticalGraph";
import toast from 'react-hot-toast';

const Funds = () => {
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
    <div className="transition-colors">
      <div className="funds">
        <p>Instant, zero-cost fund transfers with UPI</p>
        <button className="btn btn-green" onClick={() => setShowAddFunds(true)}>Add funds</button>
        <button className="btn btn-blue" onClick={() => setShowWithdraw(true)}>Withdraw</button>
      </div>

      {/* Add Funds Modal */}
      {showAddFunds && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="p-6 rounded-lg bg-white w-96">
            <h3 className="text-lg font-semibold mb-4">Add Funds</h3>
            <form onSubmit={handleAddFunds}>
              <input
                type="number"
                placeholder="Enter amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full p-3 border rounded mb-4"
                required
              />
              <select
                value={method}
                onChange={(e) => setMethod(e.target.value)}
                className="w-full p-3 border rounded mb-4"
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
          <div className="p-6 rounded-lg bg-white w-96">
            <h3 className="text-lg font-semibold mb-4">Withdraw Funds</h3>
            <p className="text-sm mb-4 text-gray-600">Available Balance: ₹{user?.balance || 0}</p>
            <form onSubmit={handleWithdrawFunds}>
              <input
                type="number"
                placeholder="Enter amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                max={user?.balance || 0}
                className="w-full p-3 border rounded mb-4"
                required
              />
              <select
                value={method}
                onChange={(e) => setMethod(e.target.value)}
                className="w-full p-3 border rounded mb-4"
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
        <div className="p-4 rounded-lg border bg-green-50 border-green-200">
          <h4 className="text-2xl font-bold text-green-600">₹{fundStats.totalDeposits.toLocaleString()}</h4>
          <p className="text-sm text-green-600">Total Deposits</p>
        </div>
        <div className="p-4 rounded-lg border bg-red-50 border-red-200">
          <h4 className="text-2xl font-bold text-red-600">₹{fundStats.totalWithdrawals.toLocaleString()}</h4>
          <p className="text-sm text-red-600">Total Withdrawals</p>
        </div>
        <div className="p-4 rounded-lg border bg-blue-50 border-blue-200">
          <h4 className="text-2xl font-bold text-blue-600">₹{fundStats.netFlow.toLocaleString()}</h4>
          <p className="text-sm text-blue-600">Net Flow</p>
        </div>
      </div>

      <div className="row">
        <div className="col">
          <span>
            <p>Equity</p>
          </span>

          <div className="table">
            <div className="data">
              <p>Available margin</p>
              <p className="imp colored">₹{user?.balance || 0}</p>
            </div>
            <div className="data">
              <p>Used margin</p>
              <p className="imp">0.00</p>
            </div>
            <div className="data">
              <p>Available cash</p>
              <p className="imp">₹{user?.balance || 0}</p>
            </div>
            <hr />
            <div className="data">
              <p>Opening Balance</p>
              <p>₹{user?.balance || 0}</p>
            </div>
            <div className="data">
              <p>Payin</p>
              <p>₹{fundStats.totalDeposits.toLocaleString()}</p>
            </div>
            <div className="data">
              <p>Payout</p>
              <p>₹{fundStats.totalWithdrawals.toLocaleString()}</p>
            </div>
            <div className="data">
              <p>SPAN</p>
              <p>0.00</p>
            </div>
            <div className="data">
              <p>Delivery margin</p>
              <p>0.00</p>
            </div>
            <div className="data">
              <p>Exposure</p>
              <p>0.00</p>
            </div>
            <div className="data">
              <p>Options premium</p>
              <p>0.00</p>
            </div>
            <hr />
            <div className="data">
              <p>Collateral (Liquid funds)</p>
              <p>0.00</p>
            </div>
            <div className="data">
              <p>Collateral (Equity)</p>
              <p>0.00</p>
            </div>
            <div className="data">
              <p>Total Collateral</p>
              <p>0.00</p>
            </div>
          </div>
        </div>

        <div className="col">
          {/* Recent Transactions */}
          <div className="p-6 rounded-lg border bg-gray-50 border-gray-200">
            <h4 className="font-semibold mb-4 text-gray-800">Recent Transactions</h4>
            <div className="space-y-3">
              {transactions.slice(0, 5).map((txn, index) => (
                <div key={index} className="flex justify-between items-center p-3 rounded border bg-white border-gray-200">
                  <div>
                    <p className={`font-medium ${txn.type === 'credit' ? 'text-green-600' : 'text-red-600'}`}>
                      {txn.type === 'credit' ? '+' : '-'}₹{txn.amount.toLocaleString()}
                    </p>
                    <p className="text-xs text-gray-500">{txn.description}</p>
                  </div>
                  <p className="text-xs text-gray-500">{new Date(txn.createdAt).toLocaleDateString()}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="commodity mt-6">
            <p>You don't have a commodity account</p>
            <Link className="btn btn-blue" to='/auth'>Open Account</Link>
          </div>
        </div>
      </div>

      {/* Fund Flow Chart */}
      {transactions.length > 0 && (
        <div className="mt-8">
          <h4 className="text-lg font-semibold mb-4 text-gray-800">
            Fund Flow Analysis
          </h4>
          <VerticalGraph data={chartData} />
        </div>
      )}
    </div>
  );
};

export default Funds;