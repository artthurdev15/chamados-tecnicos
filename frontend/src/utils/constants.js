export const CATEGORIAS = [
  { value: 'HARDWARE',              label: 'Hardware'              },
  { value: 'SOFTWARE',              label: 'Software'              },
  { value: 'REDE',                  label: 'Rede'                  },
  { value: 'INFRAESTRUTURA',        label: 'Infraestrutura'        },
  { value: 'SUPORTE_AO_USUARIO',    label: 'Suporte ao Usuário'    },
  { value: 'MANUTENCAO_PREVENTIVA', label: 'Manutenção Preventiva' },
  { value: 'OUTROS',                label: 'Outros'                },
]

export const STATUS_LABELS = {
  PENDENTE:  'Pendente',
  RESOLVIDO: 'Resolvido',
}

export const MESES = Array.from({ length: 12 }, (_, i) => ({
  value: i + 1,
  label: [
    'Janeiro','Fevereiro','Março','Abril','Maio','Junho',
    'Julho','Agosto','Setembro','Outubro','Novembro','Dezembro',
  ][i],
}))

export const ANOS = Array.from({ length: 5 }, (_, i) => {
  const y = new Date().getFullYear() - i
  return { value: y, label: String(y) }
})
