import React from "react";

function Reports({ smartBins }) {
  return (
    <div className="p-4">
      <h2>📊 Reports</h2>
      <pre>{JSON.stringify(smartBins, null, 2)}</pre>
    </div>
  );
}

export default Reports;
