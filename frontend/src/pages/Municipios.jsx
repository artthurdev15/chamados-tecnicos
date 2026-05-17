import { useState, useEffect, useCallback } from 'react'
import { municipioService } from '../services/municipioService'
import Header     from '../components/Layout/Header'
import Card       from '../components/UI/Card'
import Button     from '../components/UI/Button'
import Modal      from '../components/UI/Modal'
import Spinner    from '../components/UI/Spinner'
import EmptyState from '../components/UI/EmptyState'

export default function Municipios() {
  const [municipios, setMunicipios] = useState([])
  const [loading,    setLoading]    = useState(true)
  const [modalOpen,  setModalOpen]  = useState(false)
  const [nome,       setNome]       = useState('')
  const [saving,     setSaving]     = useState(false)
  const [error,      setError]      = useState('')

  const carregar = useCallback(async () => {
    setLoading(true)
    try {
      setMunicipios(await municipioService.listar())
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { carregar() }, [carregar])

  const abrir  = () => { setNome(''); setError(''); setModalOpen(true) }
  const fechar = () => { setModalOpen(false); setError('') }

  const salvar = async () => {
    if (!nome.trim()) { setError('O nome é obrigatório.'); return }
    setSaving(true); setError('')
    try {
      await municipioService.criar({ nome })
      fechar()
      carregar()
    } catch (e) {
      setError(e.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="animate-fade-in">
      <Header
        title="Municípios"
        subtitle="Cadastro de municípios para vincular às unidades"
        actions={<Button onClick={abrir}>+ Novo Município</Button>}
      />

      {/* KPI */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <Card>
          <p className="font-display text-4xl text-brand-400">{municipios.length}</p>
          <p className="text-xs text-slate-500 mt-1 uppercase tracking-wider">Municípios cadastrados</p>
        </Card>
      </div>

      {/* Tabela */}
      <Card>
        {loading ? (
          <div className="flex justify-center py-16"><Spinner size="lg" /></div>
        ) : municipios.length === 0 ? (
          <EmptyState icon="🏙️" title="Nenhum município cadastrado" subtitle="Cadastre um município antes de criar unidades." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-700/60">
                  {['#', 'Nome'].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-xs text-slate-500 uppercase tracking-wider font-medium">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {municipios.map((m, i) => (
                  <tr
                    key={m.id}
                    style={{ animationDelay: `${i * 0.04}s` }}
                    className="border-b border-slate-800/50 animate-slide-up hover:bg-slate-800/30 transition-colors"
                  >
                    <td className="px-4 py-3">
                      <span className="font-mono text-xs text-slate-500">#{m.id}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-medium text-slate-200">{m.nome}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Modal */}
      <Modal open={modalOpen} onClose={fechar} title="Novo Município">
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
              placeholder="Ex: João Pessoa"
              value={nome}
              onChange={e => setNome(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && salvar()}
              autoFocus
            />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="secondary" onClick={fechar} disabled={saving}>Cancelar</Button>
            <Button loading={saving} onClick={salvar}>Cadastrar</Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
