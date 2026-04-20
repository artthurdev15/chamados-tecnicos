import api from './api'

export const municipioService = {
  listar: ()    => api.get('/municipios').then(r => r.data),
  criar:  (dto) => api.post('/municipios', dto).then(r => r.data),
}
