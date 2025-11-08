import axios from "axios";

const api = axios.create({
  baseURL: "https://ai-task-assigner-cfc8ewape0dmdmd2.westus-01.azurewebsites.net/api/",
  // baseURL: "http://localhost:8000/api/",
});

export default api;
