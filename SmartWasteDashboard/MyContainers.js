import React from "react";
import "./App.css";

function MyContainers({ containers, onBorrow, onReturn, onBorrowAll, onReturnAll, isBinFull }) {
  return (
    <div className="containers">
      <h2>🍶 My Containers</h2>

      {/* Bulk Actions */}
      <div className="bulk-actions">
        <button
          onClick={onBorrowAll}
          disabled={containers.every((c) => c.inUse) || isBinFull}
        >
          Borrow All
        </button>
        <button
          onClick={onReturnAll}
          disabled={containers.every((c) => !c.inUse)}
        >
          Return All
        </button>
      </div>

      <table className="container-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Type</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {containers.map((c) => (
            <tr key={c.id}>
              <td>{c.id}</td>
              <td>{c.type}</td>
              <td>
                <span className={`badge ${c.inUse ? "inuse" : "available"}`}>
                  {c.inUse ? "Borrowed" : "Available"}
                </span>
              </td>
              <td className="actions">
                <button
                  onClick={() => onBorrow(c)}
                  disabled={c.inUse || isBinFull} // ✅ use updated isBinFull
                >
                  Borrow
                </button>
                <button
                  onClick={() => onReturn(c)}
                  disabled={!c.inUse}
                >
                  Return
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default MyContainers;
