import { useState, useEffect, useCallback } from 'react'
import { chamadoService } from '../services/chamadoService'
import { tecnicoService } from '../services/tecnicoService'
import Header      from '../components/Layout/Header'
import Card        from '../components/UI/Card'
import Button      from '../components/UI/Button'
import Select      from '../components/UI/Select'
import Spinner     from '../components/UI/Spinner'
import EmptyState  from '../components/UI/EmptyState'
import Modal       from '../components/UI/Modal'
import ChamadoForm from '../components/Chamado/ChamadoForm'
import ChamadoRow  from '../components/Chamado/ChamadoRow'

const STATUS_OPTS = [
  { value: 'PENDENTE',  label: 'Pendente'  },
  { value: 'RESOLVIDO', label: 'Resolvido' },
]

export default function Chamados() {
  const [chamados,  setChamados]  = useState([])
  const [tecnicos,  setTecnicos]  = useState([])
  const [status,    setStatus]    = useState('')
  const [tecnicoId, setTecnicoId] = useState('')
  const [loading,   setLoading]   = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [error,     setError]     = useState('')

  const carregar = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const params = {}
      if (status)    params.status    = status
      if (tecnicoId) params.tecnicoId = tecnicoId
      const res = await chamadoService.listar(params)
      setChamados(res)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }, [status, tecnicoId])

  useEffect(() => {
    tecnicoService.listarTodos().then((t) =>
      setTecnicos(
        t.map((x) => ({ value: x.id, label: x.nome + (x.ativo ? '' : ' (inativo)') }))
      )
    )
  }, [])

  useEffect(() => { carregar() }, [carregar])

  const handleSuccess = () => {
    setModalOpen(false)
    carregar()
  }

  const pendentes  = chamados.filter((c) => c.status === 'PENDENTE').length
  const resolvidos = chamados.filter((c) => c.status === 'RESOLVIDO').length

  return (
    <div className="animate-fade-in">
      <Header
        title="Chamados"
        subtitle="Gerenciamento de chamados técnicos"
        actions={
          <Button onClick={() => setModalOpen(true)}>+ Novo Chamado</Button>
        }
      />

      {/* Filtros */}
      <Card className="mb-6">
        <div className="flex items-center gap-4 flex-wrap">
          <span className="text-xs text-slate-500 uppercase tracking-wider font-medium">
            Filtros
          </span>
          <Select
            options={STATUS_OPTS}
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            placeholder="Todos os status"
            className="w-44"
          />
          <Select
            options={tecnicos}
            value={tecnicoId}
            onChange={(e) => setTecnicoId(e.target.value)}
            placeholder="Todos os técnicos"
            className="w-52"
          />
          {(status || tecnicoId) && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => { setStatus(''); setTecnicoId('') }}
            >
              Limpar filtros
            </Button>
          )}
          <div className="ml-auto flex gap-3">
            <span className="text-xs text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 rounded-full">
              {pendentes} pendente{pendentes !== 1 ? 's' : ''}
            </span>
            <span className="text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full">
              {resolvidos} resolvido{resolvidos !== 1 ? 's' : ''}
            </span>
          </div>
        </div>
      </Card>

      {/* Tabela */}
      <Card>
        {error && (
          <p className="text-red-400 text-sm text-center py-4">{error}</p>
        )}

        {loading ? (
          <div className="flex justify-center py-16">
            <Spinner size="lg" />
          </div>
        ) : chamados.length === 0 ? (
          <EmptyState
            icon="🔧"
            title="Nenhum chamado encontrado"
            subtitle="Tente ajustar os filtros ou abra um novo chamado."
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-700/60">
                  {['#', 'Unidade', 'Técnico', 'Categoria', 'Descrição', 'Datas', 'Status', ''].map(
                    (h) => (
                      <th
                        key={h}
                        className="text-left px-4 py-3 text-xs text-slate-500 uppercase tracking-wider font-medium whitespace-nowrap"
                      >
                        {h}
                      </th>
                    )
                  )}
                </tr>
              </thead>
              <tbody>
                {chamados.map((c) => (
                  <ChamadoRow key={c.id} chamado={c} onResolved={carregar} />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Abrir Novo Chamado"
        maxWidth="max-w-2xl"
      >
        <ChamadoForm
          onSuccess={handleSuccess}
          onCancel={() => setModalOpen(false)}
        />
      </Modal>
    </div>
  )
}
