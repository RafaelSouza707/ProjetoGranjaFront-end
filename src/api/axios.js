import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000",
  withCredentials: true,
});

api.interceptors.response.use(
  response => response,

  error => {
    const mensagem = 
      error.response?.data?.error?.message ||
      "Erro inesperado."

      return Promise.reject(new Error(mensagem))
  }
)

export default api;