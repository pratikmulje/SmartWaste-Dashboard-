import React from "react";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28"];

function SmartBins({ smartBins, role, resetBins }) {
  const dataForLocation = (location) =>
    Object.entries(smartBins[location]).map(([type, value]) => ({
      name: type,
      value,
    }));

  const overallData = ["Dry", "Wet", "Metal"].map((type) => ({
    name: type,
    value:
      smartBins.campus[type] +
      smartBins.hostel[type] +
      smartBins.library[type],
  }));

  return (
    <div className="p-4 grid grid-cols-2 gap-6">
      <div>
        <h2>Campus Gate</h2>
        <PieChart width={300} height={250}>
          <Pie data={dataForLocation("campus")} dataKey="value" cx="50%" cy="50%" outerRadius={80}>
            {dataForLocation("campus").map((entry, i) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(v) => `${v}%`} />
          <Legend />
        </PieChart>
      </div>

      <div>
        <h2>Hostel</h2>
        <PieChart width={300} height={250}>
          <Pie data={dataForLocation("hostel")} dataKey="value" cx="50%" cy="50%" outerRadius={80}>
            {dataForLocation("hostel").map((entry, i) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(v) => `${v}%`} />
          <Legend />
        </PieChart>
      </div>

      <div>
        <h2>Library</h2>
        <PieChart width={300} height={250}>
          <Pie data={dataForLocation("library")} dataKey="value" cx="50%" cy="50%" outerRadius={80}>
            {dataForLocation("library").map((entry, i) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(v) => `${v}%`} />
          <Legend />
        </PieChart>
      </div>

      <div>
        <h2>Overall Storage</h2>
        <PieChart width={300} height={250}>
          <Pie data={overallData} dataKey="value" cx="50%" cy="50%" outerRadius={80}>
            {overallData.map((entry, i) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(v) => `${v}%`} />
          <Legend />
        </PieChart>
      </div>

      {role === "admin" && (
        <div className="col-span-2 flex justify-center">
          <button className="reset-btn" onClick={resetBins}>
            🔄 Reset All Bins
          </button>
        </div>
      )}
    </div>
  );
}

export default SmartBins;
