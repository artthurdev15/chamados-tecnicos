import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:8080/api', 
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
})

// ── INTERCEPTADOR DE REQUISIÇÃO: Envia o token automaticamente ──
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

api.interceptors.response.use(
  (res) => res,
  (err) => {
    // Se a API responder 401 (Não autorizado), limpa o token e desloga
    if (err.response?.status === 401) {
      localStorage.clear()
      window.location.href = '/login'
    }

    const msg =
      err.response?.data?.messages?.[0] ||
      err.response?.data?.error ||
      'Erro inesperado. Tente novamente.'
    return Promise.reject(new Error(msg))
  }
)

export default api