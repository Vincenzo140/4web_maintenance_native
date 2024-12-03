import axios from "axios";

const API_BASE_URL = "http://10.109.3.226:8000";

const api = axios.create({
  baseURL: API_BASE_URL,
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
