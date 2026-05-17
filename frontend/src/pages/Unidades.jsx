import { useState, useEffect, useCallback } from 'react'
import { unidadeService }   from '../services/unidadeService'
import { municipioService } from '../services/municipioService'
import Header     from '../components/Layout/Header'
import Card       from '../components/UI/Card'
import Button     from '../components/UI/Button'
import Select     from '../components/UI/Select'
import Modal      from '../components/UI/Modal'
import Spinner    from '../components/UI/Spinner'
import EmptyState from '../components/UI/EmptyState'

export default function Unidades() {
  const [unidades,   setUnidades]   = useState([])
  const [municipios, setMunicipios] = useState([])
  const [filtroMun,  setFiltroMun]  = useState('')
  const [loading,    setLoading]    = useState(true)
  const [modalOpen,  setModalOpen]  = useState(false)
  const [form,       setForm]       = useState({ nome: '', municipioId: '' })
  const [saving,     setSaving]     = useState(false)
  const [error,      setError]      = useState('')

  // carrega municípios uma vez só (para filtro e formulário)
  useEffect(() => {
    municipioService.listar().then(m =>
      setMunicipios(m.map(x => ({ value: x.id, label: x.nome })))
    )
  }, [])

  const carregar = useCallback(async () => {
    setLoading(true)
    try {
      const data = filtroMun
        ? await unidadeService.listarPorMunicipio(filtroMun)
        : await unidadeService.listar()
      setUnidades(data)
    } finally {
      setLoading(false)
    }
  }, [filtroMun])

  useEffect(() => { carregar() }, [carregar])

  const abrir  = () => { setForm({ nome: '', municipioId: '' }); setError(''); setModalOpen(true) }
  const fechar = () => { setModalOpen(false); setError('') }
  const set    = f => e => setForm(p => ({ ...p, [f]: e.target.value }))

  const salvar = async () => {
    if (!form.nome.trim())   { setError('O nome é obrigatório.'); return }
    if (!form.municipioId)   { setError('Selecione um município.'); return }
    setSaving(true); setError('')
    try {
      await unidadeService.criar({ nome: form.nome, municipioId: Number(form.municipioId) })
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
        title="Unidades"
        subtitle="Cadastro de unidades de atendimento (UBS, postos, etc.)"
        actions={<Button onClick={abrir}>+ Nova Unidade</Button>}
      />

      {/* KPI */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <Card>
          <p className="font-display text-4xl text-brand-400">{unidades.length}</p>
          <p className="text-xs text-slate-500 mt-1 uppercase tracking-wider">Unidades cadastradas</p>
        </Card>
      </div>

      {/* Filtro */}
      <Card className="mb-6">
        <div className="flex items-center gap-4 flex-wrap">
          <span className="text-xs text-slate-500 uppercase tracking-wider font-medium">Filtrar por</span>
          <Select
            options={municipios}
            value={filtroMun}
            onChange={e => setFiltroMun(e.target.value)}
            placeholder="Todos os municípios"
            className="w-56"
          />
          {filtroMun && (
            <Button variant="ghost" size="sm" onClick={() => setFiltroMun('')}>
              Limpar filtro
            </Button>
          )}
        </div>
      </Card>

      {/* Tabela */}
      <Card>
        {loading ? (
          <div className="flex justify-center py-16"><Spinner size="lg" /></div>
        ) : unidades.length === 0 ? (
          <EmptyState icon="🏥" title="Nenhuma unidade encontrada" subtitle="Cadastre um município primeiro, depois crie as unidades." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-700/60">
                  {['#', 'Unidade', 'Município'].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-xs text-slate-500 uppercase tracking-wider font-medium">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {unidades.map((u, i) => (
                  <tr
                    key={u.id}
                    style={{ animationDelay: `${i * 0.04}s` }}
                    className="border-b border-slate-800/50 animate-slide-up hover:bg-slate-800/30 transition-colors"
                  >
                    <td className="px-4 py-3">
                      <span className="font-mono text-xs text-slate-500">#{u.id}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-medium text-slate-200">{u.nome}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm text-slate-400">{u.municipio.nome}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Modal */}
      <Modal open={modalOpen} onClose={fechar} title="Nova Unidade">
        <div className="space-y-4">
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm px-4 py-3 rounded-lg">
              {error}
            </div>
          )}
          <div>
            <label className="label-base">Nome da Unidade *</label>
            <input
              className="input-base"
              placeholder="Ex: UBS Centro, Posto de Saúde Norte"
              value={form.nome}
              onChange={set('nome')}
              autoFocus
            />
          </div>
          <Select
            label="Município *"
            options={municipios}
            value={form.municipioId}
            onChange={set('municipioId')}
            placeholder="Selecione o município"
          />
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="secondary" onClick={fechar} disabled={saving}>Cancelar</Button>
            <Button loading={saving} onClick={salvar}>Cadastrar</Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
