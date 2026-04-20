export const formatDate = (dateStr) => {
  if (!dateStr) return '—'
  const [year, month, day] = dateStr.split('-')
  return `${day}/${month}/${year}`
}

export const formatDateTime = (dateTimeStr) => {
  if (!dateTimeStr) return '—'
  const d = new Date(dateTimeStr)
  return d.toLocaleString('pt-BR', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
}

export const getMesNome = (mes) => {
  const nomes = [
    'Janeiro','Fevereiro','Março','Abril','Maio','Junho',
    'Julho','Agosto','Setembro','Outubro','Novembro','Dezembro',
  ]
  return nomes[mes - 1] ?? ''
}

export const getMesAtual = () => new Date().getMonth() + 1
export const getAnoAtual = () => new Date().getFullYear()
