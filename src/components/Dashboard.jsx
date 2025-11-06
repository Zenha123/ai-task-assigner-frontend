import { useEffect, useState } from "react";
import api from "../api";

export default function Dashboard() {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    api.get("assignment_logs/").then((res) => setLogs(res.data));
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-accent mb-4">📊 Assignment Logs</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-card rounded-xl shadow-md">
          <thead>
            <tr className="text-left bg-gray-800 text-gray-200">
              <th className="p-3">Task</th>
              <th className="p-3">Assigned To</th>
              <th className="p-3">Confidence</th>
              <th className="p-3">Decision Status</th>
              <th className="p-3">Date</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log) => (
              <tr key={log.id} className="border-t border-gray-700 hover:bg-gray-800">
                <td className="p-3">{log.task_title}</td>
                <td className="p-3">{log.assigned_to || "Unassigned"}</td>
                <td className="p-3">{(log.confidence || 0).toFixed(2)}</td>
                <td className="p-3">
                  <span
                    className={`px-2 py-1 rounded text-sm ${
                      log.decision_status === "manager_approved"
                        ? "bg-green-600 text-white"
                        : log.decision_status === "auto_assigned"
                        ? "bg-blue-600 text-white"
                        : "bg-yellow-500 text-black"
                    }`}
                  >
                    {log.decision_status}
                  </span>
                </td>
                <td className="p-3 text-sm text-gray-400">
                  {new Date(log.created_at).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}