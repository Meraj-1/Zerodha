import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";
import toast from 'react-hot-toast';
import { useTheme } from '../context/ThemeContext';

import GeneralContext from "./GeneralContext";

import "./BuyActionWindow.css";

const BuyActionWindow = ({ uid }) => {
  const { theme } = useTheme();
  const generalContext = useContext(GeneralContext);
  const [stockQuantity, setStockQuantity] = useState(1);
  const [stockPrice, setStockPrice] = useState(0.0);
  const [orderType, setOrderType] = useState("MARKET");
  const [validity, setValidity] = useState("DAY");

  const handleBuyClick = () => {
    // Create order object
    const order = {
      symbol: uid,
      quantity: parseInt(stockQuantity),
      price: parseFloat(stockPrice),
      orderType: orderType,
      validity: validity,
      side: "BUY",
      timestamp: new Date().toISOString(),
      status: "COMPLETED",
      orderId: `ORD${Date.now()}`
    };

    // Store in localStorage for holdings
    const existingHoldings = JSON.parse(localStorage.getItem('holdings') || '[]');
    const existingHolding = existingHoldings.find(h => h.name === uid);
    
    if (existingHolding) {
      // Update existing holding
      const totalQty = existingHolding.qty + order.quantity;
      const totalValue = (existingHolding.avg * existingHolding.qty) + (order.price * order.quantity);
      existingHolding.qty = totalQty;
      existingHolding.avg = totalValue / totalQty;
    } else {
      // Add new holding
      existingHoldings.push({
        name: uid,
        qty: order.quantity,
        avg: order.price,
        price: order.price,
        net: "+0.00%",
        day: "+0.00%",
        isLoss: false
      });
    }
    
    localStorage.setItem('holdings', JSON.stringify(existingHoldings));
    
    // Store order history
    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    orders.push(order);
    localStorage.setItem('orders', JSON.stringify(orders));
    
    toast.success(`✅ Buy order executed: ${stockQuantity} shares of ${uid} at ₹${stockPrice}`);
    generalContext.closeBuyWindow();
  };

  const handleCancelClick = () => {
    generalContext.closeBuyWindow();
  };

  return (
    <div className={`container ${theme === "dark" ? "dark-theme" : ""}`} id="buy-window" draggable="true">
      <div className="header">
        <h3>{uid} <span>NSE</span></h3>
        <div className="market-options">
          <label>
            <input 
              type="radio" 
              name="orderType" 
              value="MARKET" 
              checked={orderType === "MARKET"}
              onChange={(e) => setOrderType(e.target.value)}
            />
            MARKET
          </label>
          <label>
            <input 
              type="radio" 
              name="orderType" 
              value="LIMIT" 
              checked={orderType === "LIMIT"}
              onChange={(e) => setOrderType(e.target.value)}
            />
            LIMIT
          </label>
        </div>
      </div>
      
      <div className="tab">
        <button>REGULAR</button>
      </div>
      
      <div className="regular-order">
        <div className="order-validity">
          <label>
            <input 
              type="radio" 
              name="validity" 
              value="DAY" 
              checked={validity === "DAY"}
              onChange={(e) => setValidity(e.target.value)}
            />
            DAY <span>(Default)</span>
          </label>
          <label>
            <input 
              type="radio" 
              name="validity" 
              value="IOC" 
              checked={validity === "IOC"}
              onChange={(e) => setValidity(e.target.value)}
            />
            IOC
          </label>
        </div>
        
        <div className="inputs">
          <fieldset className={theme === "dark" ? "dark-fieldset" : ""}>
            <legend className={theme === "dark" ? "dark-legend" : ""}>Qty.</legend>
            <input
              type="number"
              name="qty"
              id="qty"
              onChange={(e) => setStockQuantity(e.target.value)}
              value={stockQuantity}
              className={theme === "dark" ? "dark-input" : ""}
              min="1"
            />
          </fieldset>
          <fieldset className={theme === "dark" ? "dark-fieldset" : ""}>
            <legend className={theme === "dark" ? "dark-legend" : ""}>Price</legend>
            <input
              type="number"
              name="price"
              id="price"
              step="0.05"
              onChange={(e) => setStockPrice(e.target.value)}
              value={stockPrice}
              className={theme === "dark" ? "dark-input" : ""}
              disabled={orderType === "MARKET"}
              placeholder={orderType === "MARKET" ? "Market Price" : "0.00"}
            />
          </fieldset>
        </div>
        
        <div className="options">
          <span>More options</span>
        </div>
      </div>

      <div className="buttons">
        <span className={theme === "dark" ? "dark-text" : ""}>Margin required ₹{(stockQuantity * stockPrice * 0.2).toFixed(2)}</span>
        <div>
          <Link className="btn btn-blue" onClick={handleBuyClick}>
            Buy
          </Link>
          <Link to="" className="btn btn-grey" onClick={handleCancelClick}>
            Cancel
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BuyActionWindow;
