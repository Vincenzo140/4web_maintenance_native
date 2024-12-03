import axios from "axios";

const API_BASE_URL = "http://192.168.0.11:8000";

const api = axios.create({
  baseURL: API_BASE_URL,
});

export const getMachines = async () => {
  const response = await api.get("/machines");
  return response.data;
};

export default api;
