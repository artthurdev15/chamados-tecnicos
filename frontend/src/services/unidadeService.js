import api from './api'

export const unidadeService = {
  listar:             ()            => api.get('/unidades').then(r => r.data),
  listarPorMunicipio: (municipioId) => api.get(`/unidades/municipio/${municipioId}`).then(r => r.data),
  criar:              (dto)         => api.post('/unidades', dto).then(r => r.data),
}
