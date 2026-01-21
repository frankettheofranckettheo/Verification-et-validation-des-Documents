// src/lib/axios.ts
import axios from 'axios';

// Création de l'instance unique
const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL, // Lit depuis .env.local
  timeout: 3000000, // 3000 secondes max (l'OCR peut être long)
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepteur pour gérer les erreurs globalement (optionnel mais recommandé)
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Vous pouvez logger l'erreur ici ou la formater
    console.error("Erreur API Axios:", error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export default apiClient;