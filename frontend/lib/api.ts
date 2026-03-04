import axios from "axios";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
  headers: {
    "Accept": "application/json",
    "Content-Type": "application/json",
  },
});

// Intercepteur pour ajouter le Token à chaque requête
api.interceptors.request.use((config) => {
  // On récupère le token stocké dans le localStorage (ou cookies selon ta config)
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});