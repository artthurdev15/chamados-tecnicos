import api from './api'

export const chamadoService = {
  listar:   (params = {}) => api.get('/chamados', { params }).then(r => r.data),
  buscar:   (id)          => api.get(`/chamados/${id}`).then(r => r.data),
  abrir:    (dto)         => api.post('/chamados', dto).then(r => r.data),
  resolver: (id)          => api.patch(`/chamados/${id}/resolver`).then(r => r.data),
}
