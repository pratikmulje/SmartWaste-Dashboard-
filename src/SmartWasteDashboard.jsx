import React, { useState, useEffect, useRef } from "react";
import MyContainers from "./MyContainers";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import "./App.css";

function SmartWasteDashboard({ username, isAdmin }) {
  const [bins, setBins] = useState([]);
  const [containers, setContainers] = useState([]);
  const [tab, setTab] = useState("bins");
  const [credits, setCredits] = useState(0);

  // New bot state
  const [botMessages, setBotMessages] = useState([]);
  const botEndRef = useRef(null);

  const COLORS = ["#8884d8", "#82ca9d", "#ffc658"];

  // Load bins & containers
  useEffect(() => {
    const savedBins = localStorage.getItem("smart_bins");
    if (savedBins) setBins(JSON.parse(savedBins));
    else {
      const defaultBins = [
        { id: "Campus Gate", dry: 20, wet: 30, metal: 10 },
        { id: "Library", dry: 40, wet: 25, metal: 15 },
        { id: "Hostel", dry: 60, wet: 50, metal: 30 },
      ];
      setBins(defaultBins);
      localStorage.setItem("smart_bins", JSON.stringify(defaultBins));
    }

    if (!isAdmin) {
      const savedContainers = localStorage.getItem(`containers_${username}`);
      if (savedContainers) setContainers(JSON.parse(savedContainers));
      const savedCredits = localStorage.getItem(`credits_${username}`);
      if (savedCredits) setCredits(Number(savedCredits));
    }
  }, [username, isAdmin]);

  // Auto-fill bins slightly
  useEffect(() => {
    const interval = setInterval(() => {
      setBins((prev) =>
        prev.map((bin) => ({
          ...bin,
          dry: Math.min(100, bin.dry + Math.random() * 1),
          wet: Math.min(100, bin.wet + Math.random() * 1),
          metal: Math.min(100, bin.metal + Math.random() * 1),
        }))
      );
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  // Bot helper
  const addBotMessage = (text) => {
    setBotMessages((prev) => [...prev, { text }]);
  };

  // Scroll to latest bot message
  useEffect(() => {
    if (botEndRef.current) botEndRef.current.scrollIntoView({ behavior: "smooth" });
  }, [botMessages]);

  // New autonomous bot behavior
  useEffect(() => {
    const botInterval = setInterval(() => {
      if (isAdmin) {
        bins.forEach((bin) => {
          if (bin.dry > 80 || bin.wet > 80 || bin.metal > 80) {
            addBotMessage(`⚠️ ${bin.id} is almost full!`);
          }
        });
      } else {
        // User messages
        if (credits > 0) addBotMessage(`💰 You currently have ${credits} credits!`);
        if (bins.some((b) => b.dry >= 100 && b.wet >= 100 && b.metal >= 100)) {
          addBotMessage("⚠️ Some bins are full. Wait before borrowing more.");
        }
      }
    }, 8000); // Every 8 seconds
    return () => clearInterval(botInterval);
  }, [bins, credits, isAdmin]);

  // Borrow / Return
  const borrowContainer = (c) => {
    setContainers((prev) => {
      const updated = prev.map((x) =>
        x.id === c.id ? { ...x, inUse: true } : x
      );
      localStorage.setItem(`containers_${username}`, JSON.stringify(updated));
      return updated;
    });
  };

  const returnContainer = (c) => {
    setContainers((prev) => {
      const updated = prev.map((x) =>
        x.id === c.id ? { ...x, inUse: false } : x
      );
      localStorage.setItem(`containers_${username}`, JSON.stringify(updated));

      // Give credits for dry waste
      if (!isAdmin && c.type.toLowerCase().includes("dry")) {
        setCredits((prevCredits) => {
          const newCredits = prevCredits + 10;
          localStorage.setItem(`credits_${username}`, newCredits);
          addBotMessage(`🎉 You earned 10 credits for returning ${c.type}!`);
          return newCredits;
        });
      }
      return updated;
    });

    setBins((prev) =>
      prev.map((bin) => ({
        ...bin,
        [c.type.toLowerCase().split(" ")[0]]: Math.min(
          100,
          bin[c.type.toLowerCase().split(" ")[0]] + 5
        ),
      }))
    );
  };

  const resetBin = (id) => {
    setBins((prev) =>
      prev.map((bin) =>
        bin.id === id ? { ...bin, dry: 0, wet: 0, metal: 0 } : bin
      )
    );
    if (isAdmin) addBotMessage(`♻️ Admin reset ${id} bin!`);
  };

  const resetAllBins = () => {
    setBins((prev) => prev.map((bin) => ({ ...bin, dry: 0, wet: 0, metal: 0 })));
    if (isAdmin) addBotMessage(`♻️ Admin reset all bins!`);
  };

  const isBinFull = bins.some(
    (bin) => bin.dry >= 100 && bin.wet >= 100 && bin.metal >= 100
  );

  return (
    <div className="dashboard">
      <h1>
        ♻️ SmartWaste Dashboard ({username} {isAdmin ? "- Admin" : ""})
      </h1>

      {!isAdmin && <h3>💰 Credits: {credits}</h3>}

      <div className="tabs">
        <button onClick={() => setTab("bins")}>Smart Bins</button>
        {!isAdmin && <button onClick={() => setTab("containers")}>My Containers</button>}
        <button onClick={() => setTab("reports")}>Reports</button>
      </div>

      {tab === "bins" && (
        <div className="bin-section">
          {bins.map((bin) => {
            const data = [
              { name: "Dry", value: bin.dry },
              { name: "Wet", value: bin.wet },
              { name: "Metal", value: bin.metal },
            ];
            return (
              <div key={bin.id} className="bin-card">
                <h3>{bin.id}</h3>
                <PieChart width={250} height={250}>
                  <Pie
                    data={data}
                    dataKey="value"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label={({ value }) => `${Math.round(value)}%`}
                  >
                    {data.map((entry, index) => (
                      <Cell key={index} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
                {isAdmin && <button onClick={() => resetBin(bin.id)}>Reset</button>}
              </div>
            );
          })}
          {isAdmin && <button onClick={resetAllBins}>Reset All</button>}
        </div>
      )}

      {tab === "containers" && !isAdmin && (
        <MyContainers
          containers={containers}
          onBorrow={borrowContainer}
          onReturn={returnContainer}
          onBorrowAll={() => containers.forEach((c) => borrowContainer(c))}
          onReturnAll={() => containers.forEach((c) => returnContainer(c))}
          isBinFull={isBinFull}
        />
      )}

      {tab === "reports" && (
        <div className="reports">
          <h2>📊 Reports</h2>
          <p>Plastic bottles avoided: {Math.round(bins.reduce((sum, b) => sum + b.dry, 0) / 10)}</p>
          <p>Wet waste composted: {Math.round(bins.reduce((sum, b) => sum + b.wet, 0) / 10)} kg</p>
          <p>Metal recycled: {Math.round(bins.reduce((sum, b) => sum + b.metal, 0) / 10)} kg</p>
        </div>
      )}

      {/* ===== New Autonomous Bot Container ===== */}
      <div className="bot-autonomous">
        {botMessages.map((msg, i) => (
          <div key={i} className="bot-msg">{msg.text}</div>
        ))}
        <div ref={botEndRef}></div>
      </div>

      <style>{`
        .bot-autonomous {
          position: fixed;
          bottom: 20px;
          right: 20px;
          width: 300px;
          max-height: 400px;
          overflow-y: auto;
          background: rgba(255,255,255,0.95);
          border: 1px solid #ccc;
          border-radius: 12px;
          padding: 10px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.3);
          font-family: 'Poppins', sans-serif;
          z-index: 9999;
        }
        .bot-msg {
          background: #e1f5e1;
          margin: 5px 0;
          padding: 8px;
          border-radius: 8px;
          font-size: 14px;
          box-shadow: 0 2px 6px rgba(0,0,0,0.1);
        }
      `}</style>
    </div>
  );
}

export default SmartWasteDashboard;
