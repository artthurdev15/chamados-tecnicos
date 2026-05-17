import { useState, useEffect, useCallback } from 'react'
import { tecnicoService } from '../services/tecnicoService'
import Header     from '../components/Layout/Header'
import Card       from '../components/UI/Card'
import Button     from '../components/UI/Button'
import Badge      from '../components/UI/Badge'
import Modal      from '../components/UI/Modal'
import Spinner    from '../components/UI/Spinner'
import EmptyState from '../components/UI/EmptyState'

export default function Tecnicos() {
  const [tecnicos,  setTecnicos]  = useState([])
  const [loading,   setLoading]   = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editando,  setEditando]  = useState(null)   // null = novo | objeto = editar
  const [nome,      setNome]      = useState('')
  const [saving,    setSaving]    = useState(false)
  const [error,     setError]     = useState('')
  const [loadingId, setLoadingId] = useState(null)

  const carregar = useCallback(async () => {
    setLoading(true)
    try {
      setTecnicos(await tecnicoService.listarTodos())
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { carregar() }, [carregar])

  const abrirNovo = () => {
    setEditando(null)
    setNome('')
    setError('')
    setModalOpen(true)
  }

  const abrirEdicao = (tec) => {
    setEditando(tec)
    setNome(tec.nome)
    setError('')
    setModalOpen(true)
  }

  const fechar = () => { setModalOpen(false); setError('') }

  const salvar = async () => {
    if (!nome.trim()) { setError('O nome é obrigatório.'); return }
    setSaving(true); setError('')
    try {
      if (editando) {
        await tecnicoService.atualizar(editando.id, { nome })
      } else {
        await tecnicoService.criar({ nome })
      }
      fechar()
      carregar()
    } catch (e) {
      setError(e.message)
    } finally {
      setSaving(false)
    }
  }

  const toggleAtivo = async (tec) => {
    setLoadingId(tec.id)
    try {
      if (tec.ativo) await tecnicoService.desativar(tec.id)
      else           await tecnicoService.reativar(tec.id)
      carregar()
    } finally {
      setLoadingId(null)
    }
  }

  const ativos   = tecnicos.filter(t =>  t.ativo).length
  const inativos = tecnicos.filter(t => !t.ativo).length

  return (
    <div className="animate-fade-in">
      <Header
        title="Técnicos"
        subtitle="Cadastro e gerenciamento de técnicos"
        actions={<Button onClick={abrirNovo}>+ Novo Técnico</Button>}
      />

      {/* KPIs */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: 'Total',    value: tecnicos.length, color: 'text-slate-200'  },
          { label: 'Ativos',   value: ativos,          color: 'text-emerald-400'},
          { label: 'Inativos', value: inativos,        color: 'text-slate-500'  },
        ].map((k, i) => (
          <Card key={i}>
            <p className={`font-display text-4xl ${k.color}`}>{k.value}</p>
            <p className="text-xs text-slate-500 mt-1 uppercase tracking-wider">{k.label}</p>
          </Card>
        ))}
      </div>

      {/* Tabela */}
      <Card>
        {loading ? (
          <div className="flex justify-center py-16"><Spinner size="lg" /></div>
        ) : tecnicos.length === 0 ? (
          <EmptyState icon="👷" title="Nenhum técnico cadastrado" subtitle="Clique em '+ Novo Técnico' para começar." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-700/60">
                  {['#', 'Nome', 'Status', 'Ações'].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-xs text-slate-500 uppercase tracking-wider font-medium">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {tecnicos.map((t, i) => (
                  <tr
                    key={t.id}
                    style={{ animationDelay: `${i * 0.04}s` }}
                    className="border-b border-slate-800/50 animate-slide-up hover:bg-slate-800/30 transition-colors"
                  >
                    <td className="px-4 py-3">
                      <span className="font-mono text-xs text-slate-500">#{t.id}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`font-medium ${t.ativo ? 'text-slate-200' : 'text-slate-500 line-through'}`}>
                        {t.nome}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {t.ativo
                        ? <Badge variant="resolvido">● Ativo</Badge>
                        : <Badge variant="default">○ Inativo</Badge>
                      }
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Button variant="secondary" size="sm" onClick={() => abrirEdicao(t)}>
                          Editar
                        </Button>
                        <Button
                          variant={t.ativo ? 'danger' : 'success'}
                          size="sm"
                          loading={loadingId === t.id}
                          onClick={() => toggleAtivo(t)}
                        >
                          {t.ativo ? 'Desativar' : 'Reativar'}
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Modal */}
      <Modal
        open={modalOpen}
        onClose={fechar}
        title={editando ? `Editar — ${editando.nome}` : 'Novo Técnico'}
      >
        <div className="space-y-4">
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm px-4 py-3 rounded-lg">
              {error}
            </div>
          )}
          <div>
            <label className="label-base">Nome *</label>
            <input
              className="input-base"
              placeholder="Ex: Carlos Silva"
              value={nome}
              onChange={e => setNome(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && salvar()}
              autoFocus
            />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="secondary" onClick={fechar} disabled={saving}>Cancelar</Button>
            <Button loading={saving} onClick={salvar}>
              {editando ? 'Salvar Alterações' : 'Cadastrar'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
