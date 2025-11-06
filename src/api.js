import axios from "axios";

const api = axios.create({
  baseURL: "https://ai-task-assigner-backend.onrender.com/api/",
});

export default api;
