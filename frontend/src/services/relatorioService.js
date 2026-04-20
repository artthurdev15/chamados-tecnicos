import api from './api'

export const relatorioService = {
  downloadPdf: async (tecnicoId, mes, ano) => {
    const response = await api.get('/relatorios/pdf', {
      params: { tecnicoId, mes, ano },
      responseType: 'blob',
    })

    const url  = URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }))
    const link = document.createElement('a')
    link.href  = url
    link.setAttribute(
      'download',
      `relatorio_tecnico_${tecnicoId}_${String(mes).padStart(2, '0')}_${ano}.pdf`
    )
    document.body.appendChild(link)
    link.click()
    link.remove()
    URL.revokeObjectURL(url)
  },
}
