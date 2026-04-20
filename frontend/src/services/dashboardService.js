import api from './api'

export const dashboardService = {
  resumoMensal: (mes, ano) =>
    api.get('/dashboard/mensal', { params: { mes, ano } }).then(r => r.data),
}
