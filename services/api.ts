// import axios from 'axios';

// // 👇 Replace with your local IP (find it via `ipconfig` or `ifconfig`) or use your server URL if deployed
// const API = axios.create({
//   baseURL: 'http://192.168.1.2:5000', // <--- your Node.js backend address
//   headers: {
//     'Content-Type': 'application/json',
//   },
// });

// export default API;

import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const api = axios.create({
  baseURL: 'https://clientbackend-7frc.onrender.com/',
});

api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;