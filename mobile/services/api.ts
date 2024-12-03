import axios from "axios";

// Define a URL base para o backend, com fallback para localhost
const BACKEND_API_URL = process.env.BACKEND_API_URL || "http://localhost:8000";

const api = axios.create({
  baseURL: BACKEND_API_URL,
});

export const getMachines = async () => {
  const response = await api.get("/machines");
  return response.data;
};

export const getMaintenances = async () => {
  const response = await api.get("/maintenance");
  return response.data;
};

export const getTeams = async () => {
  const response = await api.get("/teams");
  return response.data;
};

export const getParts = async () => {
  const response = await api.get("/parts");
  return response.data;
};

export default api;
