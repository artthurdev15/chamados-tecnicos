import api from './api'

const BASE = '/tecnicos'

export const tecnicoService = {
  listarAtivos: ()          => api.get(BASE).then(r => r.data),
  listarTodos:  ()          => api.get(`${BASE}/todos`).then(r => r.data),
  buscarPorId:  (id)        => api.get(`${BASE}/${id}`).then(r => r.data),
  criar:        (dto)       => api.post(BASE, dto).then(r => r.data),
  atualizar:    (id, dto)   => api.put(`${BASE}/${id}`, dto).then(r => r.data),
  desativar:    (id)        => api.delete(`${BASE}/${id}`),
  reativar:     (id)        => api.patch(`${BASE}/${id}/reativar`).then(r => r.data),
}
