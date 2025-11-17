// services/api.js
import axios from 'axios';

// MUITO IMPORTANTE: Use o IP da sua máquina que você encontrou com 'ipconfig'
const API_URL = 'http://192.168.0.15:3001';

const api = axios.create({
  baseURL: API_URL,
});

export default api;
