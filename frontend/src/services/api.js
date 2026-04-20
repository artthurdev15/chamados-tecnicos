import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
})

api.interceptors.response.use(
  (res) => res,
  (err) => {
    const msg =
      err.response?.data?.messages?.[0] ||
      err.response?.data?.error ||
      'Erro inesperado. Tente novamente.'
    return Promise.reject(new Error(msg))
  }
)

export default api
