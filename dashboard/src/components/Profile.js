import React from "react";
import {
  User,
  Wallet,
  Shield,
  Sliders,
  LogOut,
  TrendingUp,
} from "lucide-react";

export default function OrbitProfile() {

    const handleLogout = async () =>  {
        try {
            await fetch("http://localhost:8000/auth/logout", {
                method: "Get",
                credentials: "include"
            });
            window.location.href = "/login";
        } catch (error) {
            console.log(error)
        }
    }
  return (
    <div className="min-h-screen text-black p-10">

      {/* IDENTITY STRIP */}
      <div className="px-8 py-6 flex justify-between items-center border border-white/10">
        <div className="flex items-center gap-5">
          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
            <User size={22} />
          </div>

          <div>
            <h2 className="text-xl font-semibold tracking-wide">
              Meraj Khan
            </h2>
            <p className="text-xs text-gray-600">
              Intraday Trader • Equity
            </p>
          </div>
        </div>

        <span className="text-xs px-3 py-1 rounded-[10px] bg-green-500 text-white">
          Account Healthy
        </span>
      </div>

      {/* GRID */}
      <div className="mt-10 grid grid-cols-12 gap-6">

        {/* CAPITAL */}
        <Card className="col-span-12 md:col-span-5">
          <CardHeader icon={Wallet} title="Capital Overview" />
          <Metric label="Available" value="₹3,740" highlight />
          <Metric label="Used Margin" value="₹0" />
          <Metric label="Today P&L" value="+₹1,550" positive />
        </Card>

        {/* RISK */}
        <Card className="col-span-12 md:col-span-4">
          <CardHeader icon={Shield} title="Risk Control" />
          <Metric label="Risk Level" value="Moderate" />
          <Metric label="Max Drawdown" value="-2.1%" />
          <Metric label="Discipline" value="87%" highlight />      
        </Card>

        {/* DNA */}
        <Card className="col-span-12 md:col-span-3">
          <CardHeader icon={TrendingUp} title="Trader DNA" />
          <Tag text="Quick Entries" />
          <Tag text="Tight SLs" />
          <Tag text="No Overtrade" accent />
        </Card>

        {/* PREFS */}
        <Card className="col-span-12 md:col-span-8">
          <CardHeader icon={Sliders} title="Preferences" />
          <Metric label="Alerts" value="Enabled" />
          <Metric label="Notifications" value="App + Email" />
          <Metric label="Theme" value="Dark Orbit" />
        </Card>

        {/* ACTION */}
        <Card className="col-span-12 md:col-span-4">
          <CardHeader icon={LogOut} title="Actions" />
          <Action text="Add Funds" />
          <Action text="Withdraw" />
          {/* <Action text="Logout" className="bg-red-700"/> */}
          <div className="flex justify-center p-2 items-center rounded-lg  ">
            <button onClick={handleLogout} className="w-[10vh] font-md cursor-pointer border border-white/10 text-center text-white rounded-lg bg-red-700">
                Logout
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
}

/* -------- COMPONENTS -------- */

function Card({ children, className }) {
  return (
    <div
      className={`p-6 border border-black/2 ${className}`}
    >
      {children}
    </div>
  );
}

function CardHeader({ icon: Icon, title }) {
  return (
    <div className="flex items-center gap-3 mb-5">
      <Icon size={18} className="text-indigo-400" />
      <h3 className="text-sm tracking-wide text-gray-300">{title}</h3>
    </div>
  );
}

function Metric({ label, value, highlight, positive }) {
  return (
    <div className="flex justify-between py-2 text-sm">
      <span className="text-gray-400">{label}</span>
      <span
        className={`font-medium ${
          highlight
            ? "text-indigo-400"
            : positive
            ? "text-green-400"
            : ""
        }`}
      >
        {value}
      </span>
    </div>
  );
}

function Tag({ text, accent }) {
  return (
    <div
      className={`text-xs px-3 py-2 rounded-full inline-block mr-2 mt-2 ${
        accent
          ? "bg-indigo-500/20 text-indigo-400"
          : "bg-white/10 text-gray-300"
      }`}
    >
      {text}
    </div>
  );
}

function Action({ text, danger }) {
  return (
    <button
      className={`w-full py-2 mt-3 rounded-lg text-sm transition ${
        danger
          ? "bg-red-500/20 text-red-400 hover:bg-red-500/30"
          : "bg-white/10 hover:bg-white/20"
      }`}
    >
      {text}
    </button>
  );
}
