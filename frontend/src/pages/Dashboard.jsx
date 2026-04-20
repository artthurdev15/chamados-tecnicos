import { useState, useEffect, useCallback } from 'react'
import { dashboardService } from '../services/dashboardService'
import { getMesAtual, getAnoAtual, getMesNome } from '../utils/formatters'
import { MESES, ANOS } from '../utils/constants'
import Header     from '../components/Layout/Header'
import Card       from '../components/UI/Card'
import Select     from '../components/UI/Select'
import Spinner    from '../components/UI/Spinner'
import EmptyState from '../components/UI/EmptyState'

export default function Dashboard() {
  const [dados,   setDados]   = useState([])
  const [mes,     setMes]     = useState(getMesAtual())
  const [ano,     setAno]     = useState(getAnoAtual())
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState('')

  const carregar = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const res = await dashboardService.resumoMensal(mes, ano)
      setDados(res)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }, [mes, ano])

  useEffect(() => { carregar() }, [carregar])

  const totalVisitas = dados.reduce((s, d) => s + d.totalVisitasNoMes, 0)
  const emAlerta     = dados.filter((d) => d.alertaExcesso).length

  return (
    <div className="animate-fade-in">
      <Header
        title="Dashboard"
        subtitle="Visão mensal de chamados resolvidos por técnico"
      />

      {/* Filtros */}
      <Card className="mb-6">
        <div className="flex items-center gap-4 flex-wrap">
          <span className="text-xs text-slate-500 uppercase tracking-wider font-medium">
            Período
          </span>
          <Select
            options={MESES}
            value={mes}
            onChange={(e) => setMes(Number(e.target.value))}
            className="w-40"
          />
          <Select
            options={ANOS}
            value={ano}
            onChange={(e) => setAno(Number(e.target.value))}
            className="w-28"
          />
        </div>
      </Card>

      {/* KPIs */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: 'Total de Visitas',   value: totalVisitas, color: 'text-brand-400' },
          { label: 'Técnicos Ativos',    value: dados.length, color: 'text-slate-200' },
          { label: 'Técnicos em Alerta', value: emAlerta,     color: 'text-red-400'   },
        ].map((kpi, i) => (
          <Card key={i}>
            <p className={`font-display text-4xl ${kpi.color}`}>{kpi.value}</p>
            <p className="text-xs text-slate-500 mt-1 uppercase tracking-wider">{kpi.label}</p>
          </Card>
        ))}
      </div>

      {/* Tabela */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-lg text-slate-200">
            {getMesNome(mes)} {ano}
          </h2>
          {emAlerta > 0 && (
            <span className="text-xs bg-red-500/15 text-red-400 border border-red-500/30 px-3 py-1 rounded-full">
              ⚠ {emAlerta} técnico{emAlerta > 1 ? 's' : ''} com excesso de visitas
            </span>
          )}
        </div>

        {error && (
          <p className="text-red-400 text-sm text-center py-6">{error}</p>
        )}

        {loading ? (
          <div className="flex justify-center py-16">
            <Spinner size="lg" />
          </div>
        ) : dados.length === 0 ? (
          <EmptyState
            icon="📊"
            title="Sem dados para o período"
            subtitle="Selecione outro mês/ano ou aguarde novos chamados resolvidos."
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-700/60">
                  {['Técnico', 'Visitas no Mês', 'Status'].map((h) => (
                    <th
                      key={h}
                      className="text-left px-4 py-3 text-xs text-slate-500 uppercase tracking-wider font-medium"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {dados.map((d, i) => (
                  <tr
                    key={d.tecnico.id}
                    style={{ animationDelay: `${i * 0.04}s` }}
                    className={`
                      border-b border-slate-800/50 animate-slide-up transition-colors
                      ${d.alertaExcesso
                        ? 'bg-red-500/5 hover:bg-red-500/10'
                        : 'hover:bg-slate-800/30'
                      }
                    `}
                  >
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-2">
                        {d.alertaExcesso && (
                          <span className="text-red-400 text-sm" title="Excesso de visitas">
                            ⚠
                          </span>
                        )}
                        <span
                          className={`font-medium ${d.alertaExcesso ? 'text-red-300' : 'text-slate-200'}`}
                        >
                          {d.tecnico.nome}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="flex-1 max-w-[160px] bg-slate-800 rounded-full h-1.5">
                          <div
                            className={`h-1.5 rounded-full transition-all duration-500 ${
                              d.alertaExcesso ? 'bg-red-500' : 'bg-brand-500'
                            }`}
                            style={{
                              width: `${Math.min((d.totalVisitasNoMes / 15) * 100, 100)}%`,
                            }}
                          />
                        </div>
                        <span
                          className={`font-mono font-semibold text-sm min-w-[2rem] ${
                            d.alertaExcesso ? 'text-red-400' : 'text-slate-200'
                          }`}
                        >
                          {d.totalVisitasNoMes}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      {d.alertaExcesso ? (
                        <span className="inline-flex items-center gap-1 text-xs bg-red-500/15 text-red-400 border border-red-500/30 px-2.5 py-0.5 rounded-full">
                          ⚠ Excesso
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-xs bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 px-2.5 py-0.5 rounded-full">
                          ✓ Normal
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  )
}
