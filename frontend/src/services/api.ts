import axios from 'axios';

// Creamos una conexión directa a tu servidor backend
const api = axios.create({
  baseURL: 'http://localhost:3001', // <--- El puerto de tu backend
});

export default api;