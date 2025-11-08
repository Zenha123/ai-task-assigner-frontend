import { useState } from "react";
import { motion } from "framer-motion";
import api from "../api";
import { Send } from "lucide-react";

export default function ChatUI() {
  const [messages, setMessages] = useState([
    { sender: "bot", text: "👋 Hi there! Describe your task and I'll find the best person for it." },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const response = await api.post("tasks/", {
        title: input.slice(0, 40),
        description: input,
        priority: "medium",
        created_by_id: 1, // replace with actual employee ID
      });

      const data = response.data;
      let botResponse = "";

      if (data.type === "task") {
        const assignedTo = data.assigned_to || "Unassigned";
        const confidencePercent = (data.confidence_score * 100).toFixed(1);

        botResponse += `<div class="space-y-2">`;
        botResponse += `<div class="text-lg font-semibold">✅ <span class="text-green-400">Task Assigned Successfully!</span></div>`;
        botResponse += `<div class="mt-2 p-3 bg-gray-900 rounded-lg">`;
        botResponse += `<div><strong>👤 Assigned to:</strong> <span class="text-blue-400">${assignedTo}</span></div>`;
        botResponse += `<div><strong>📊 Confidence:</strong> <span class="text-yellow-400">${confidencePercent}%</span></div>`;
        botResponse += `</div>`;

        if (data.assignment_reason) {
          botResponse += `<div class="mt-2"><strong>💡 Reason:</strong><br/><span class="text-gray-300">${data.assignment_reason}</span></div>`;
        }

        if (data.confidence_breakdown && data.confidence_breakdown.length > 0) {
          botResponse += `<div class="mt-3 p-3 bg-gray-900 rounded-lg">`;
          botResponse += `<div class="font-semibold mb-2">🧠 Confidence Breakdown:</div>`;
          botResponse += `<div class="space-y-1 text-sm">`;

          data.confidence_breakdown.forEach((b) => {
            const percentage = (b.confidence * 100).toFixed(1);
            const barWidth = percentage;
            botResponse += `<div class="mb-2">`;
            botResponse += `<div class="flex justify-between items-center mb-1">`;
            botResponse += `<span class="font-medium text-blue-300">${b.name}</span>`;
            botResponse += `<span class="text-yellow-400 font-semibold">${percentage}%</span>`;
            botResponse += `</div>`;
            botResponse += `<div class="w-full bg-gray-700 rounded-full h-2 mb-1">`;
            botResponse += `<div class="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full" style="width: ${barWidth}%"></div>`;
            botResponse += `</div>`;
            botResponse += `<div class="text-xs text-gray-400">${b.reason}</div>`;
            botResponse += `</div>`;
          });

          botResponse += `</div></div>`;
        }

        if (data.email_sent && data.assigned_to) {
          botResponse += `<div class="mt-3 p-2 bg-green-900/30 border border-green-500/50 rounded-lg">`;
          botResponse += `📧 <span class="text-green-400">Email has been sent to <strong>${data.assigned_to}</strong></span>`;
          botResponse += `</div>`;
        }

        botResponse += `</div>`;
      } else {
        // For greeting/help/unknown messages, show backend response directly
        botResponse = `<div class="p-3 bg-gray-900 rounded-lg text-gray-100">${data.response.replace(/\n/g, "<br/>")}</div>`;
      }

      setMessages((prev) => [...prev, { sender: "bot", text: botResponse }]);
    } catch (error) {
      console.error(error);
      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: `<div class="p-3 bg-red-900/30 border border-red-500/50 rounded-lg">⚠️ <span class="text-red-400">Something went wrong. Please try again.</span></div>`,
        },
      ]);
    }

    setLoading(false);
  };

  return (
    <div className="w-full max-w-2xl mx-auto bg-card rounded-2xl shadow-xl flex flex-col h-[80vh]">
      <div className="p-4 text-lg font-semibold border-b border-gray-700 text-center text-accent">
        🤖 AI Task Assignment Assistant
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((msg, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-4 rounded-2xl max-w-[85%] ${
              msg.sender === "bot"
                ? "bg-gray-800 self-start text-gray-100"
                : "bg-primary self-end text-white ml-auto"
            }`}
          >
            <div dangerouslySetInnerHTML={{ __html: msg.text }} />
          </motion.div>
        ))}
        {loading && (
          <div className="flex items-center gap-2 text-gray-400 text-sm">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-accent"></div>
            <span>AI thinking...</span>
          </div>
        )}
      </div>

      <div className="p-3 border-t border-gray-700 flex items-center gap-2">
        <input
          className="flex-1 bg-gray-900 p-3 rounded-lg outline-none text-gray-100 placeholder-gray-500 focus:ring-2 focus:ring-accent"
          placeholder="Describe your task..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />
        <button
          onClick={handleSend}
          disabled={loading}
          className="bg-accent hover:bg-primary text-black px-5 py-3 rounded-lg flex items-center gap-2 font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Send size={18} /> Send
        </button>
      </div>
    </div>
  );
}
