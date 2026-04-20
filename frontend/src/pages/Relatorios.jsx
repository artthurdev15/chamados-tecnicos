import { useState, useEffect } from 'react'
import { tecnicoService }   from '../services/tecnicoService'
import { relatorioService } from '../services/relatorioService'
import { getMesAtual, getAnoAtual, getMesNome } from '../utils/formatters'
import { MESES, ANOS } from '../utils/constants'
import Header from '../components/Layout/Header'
import Card   from '../components/UI/Card'
import Button from '../components/UI/Button'
import Select from '../components/UI/Select'

export default function Relatorios() {
  const [tecnicos,  setTecnicos]  = useState([])
  const [tecnicoId, setTecnicoId] = useState('')
  const [mes,       setMes]       = useState(getMesAtual())
  const [ano,       setAno]       = useState(getAnoAtual())
  const [loading,   setLoading]   = useState(false)
  const [feedback,  setFeedback]  = useState(null)

  useEffect(() => {
    tecnicoService
      .listarTodos()
      .then((t) => setTecnicos(t.map((x) => ({ value: x.id, label: x.nome }))))
  }, [])

  const handleDownload = async () => {
    if (!tecnicoId) {
      setFeedback({ type: 'error', msg: 'Selecione um técnico para gerar o relatório.' })
      return
    }
    setLoading(true)
    setFeedback(null)
    try {
      await relatorioService.downloadPdf(Number(tecnicoId), mes, ano)
      const nomeTecnico = tecnicos.find((t) => t.value == tecnicoId)?.label ?? ''
      setFeedback({
        type: 'success',
        msg: `PDF gerado: ${nomeTecnico} — ${getMesNome(mes)}/${ano}`,
      })
    } catch (e) {
      setFeedback({ type: 'error', msg: e.message })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="animate-fade-in">
      <Header
        title="Relatórios"
        subtitle="Exportação de chamados concluídos em PDF"
      />

      <div className="max-w-xl">
        <Card>
          {/* Cabeçalho do card */}
          <div className="flex items-center gap-3 mb-6 pb-5 border-b border-slate-700/50">
            <div className="w-10 h-10 rounded-xl bg-brand-600/20 border border-brand-500/30 flex items-center justify-center text-lg">
              ◉
            </div>
            <div>
              <p className="text-slate-200 font-medium text-sm">Relatório por Técnico</p>
              <p className="text-slate-500 text-xs">
                Chamados resolvidos · Referência: data de conclusão
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <Select
              label="Técnico *"
              options={tecnicos}
              value={tecnicoId}
              onChange={(e) => setTecnicoId(e.target.value)}
              placeholder="Selecione o técnico"
            />

            <div className="grid grid-cols-2 gap-4">
              <Select
                label="Mês"
                options={MESES}
                value={mes}
                onChange={(e) => setMes(Number(e.target.value))}
              />
              <Select
                label="Ano"
                options={ANOS}
                value={ano}
                onChange={(e) => setAno(Number(e.target.value))}
              />
            </div>

            {/* Preview do nome do arquivo */}
            {tecnicoId && (
              <div className="bg-slate-800/60 border border-slate-700/50 rounded-lg px-4 py-3 flex items-center gap-3 animate-slide-up">
                <span className="text-2xl">📄</span>
                <div>
                  <p className="text-xs text-slate-400 font-mono">
                    relatorio_tecnico_{tecnicoId}_{String(mes).padStart(2, '0')}_{ano}.pdf
                  </p>
                  <p className="text-xs text-slate-600 mt-0.5">
                    {getMesNome(mes)} de {ano}
                  </p>
                </div>
              </div>
            )}

            {/* Feedback */}
            {feedback && (
              <div
                className={`text-sm px-4 py-3 rounded-lg border animate-slide-up ${
                  feedback.type === 'success'
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                    : 'bg-red-500/10 border-red-500/30 text-red-400'
                }`}
              >
                {feedback.type === 'success' ? '✓ ' : '⚠ '}
                {feedback.msg}
              </div>
            )}

            <Button className="w-full" size="lg" loading={loading} onClick={handleDownload}>
              ⬇ Baixar PDF
            </Button>
          </div>
        </Card>

        {/* Nota informativa */}
        <div className="mt-4 px-4 py-3 rounded-lg border border-slate-700/30 bg-slate-900/30">
          <p className="text-xs text-slate-500 leading-relaxed">
            <span className="text-slate-400 font-medium">ℹ Nota:</span> O relatório considera
            apenas chamados com status{' '}
            <span className="font-mono text-brand-400">RESOLVIDO</span>, usando a{' '}
            <span className="text-slate-300">data de conclusão</span> como referência temporal,
            independente da data de abertura.
          </p>
        </div>
      </div>
    </div>
  )
}
