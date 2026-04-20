import { useState, useEffect } from 'react'
import { municipioService } from '../../services/municipioService'
import { unidadeService }   from '../../services/unidadeService'
import { tecnicoService }   from '../../services/tecnicoService'
import { chamadoService }   from '../../services/chamadoService'
import { CATEGORIAS }       from '../../utils/constants'
import Button from '../UI/Button'
import Select from '../UI/Select'

export default function ChamadoForm({ onSuccess, onCancel }) {
  const [municipios, setMunicipios] = useState([])
  const [unidades,   setUnidades]   = useState([])
  const [tecnicos,   setTecnicos]   = useState([])
  const [form, setForm] = useState({
    municipioId: '', unidadeId: '', tecnicoId: '', categoria: '', descricao: '',
  })
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState('')

  useEffect(() => {
    Promise.all([
      municipioService.listar(),
      tecnicoService.listarAtivos(),
    ]).then(([m, t]) => {
      setMunicipios(m.map((x) => ({ value: x.id, label: x.nome })))
      setTecnicos(t.map((x)   => ({ value: x.id, label: x.nome })))
    })
  }, [])

  useEffect(() => {
    if (!form.municipioId) { setUnidades([]); return }
    unidadeService
      .listarPorMunicipio(form.municipioId)
      .then((u) => setUnidades(u.map((x) => ({ value: x.id, label: x.nome }))))
  }, [form.municipioId])

  const set = (field) => (e) =>
    setForm((f) => ({ ...f, [field]: e.target.value }))

  const handleSubmit = async () => {
    const { unidadeId, tecnicoId, categoria, descricao } = form
    if (!unidadeId || !tecnicoId || !categoria || !descricao.trim()) {
      setError('Preencha todos os campos obrigatórios.')
      return
    }
    setLoading(true)
    setError('')
    try {
      await chamadoService.abrir({
        unidadeId: Number(unidadeId),
        tecnicoId: Number(tecnicoId),
        categoria,
        descricao,
      })
      onSuccess()
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      {error && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <Select
          label="Município *"
          options={municipios}
          value={form.municipioId}
          onChange={set('municipioId')}
          placeholder="Selecione o município"
        />
        <Select
          label="Unidade *"
          options={unidades}
          value={form.unidadeId}
          onChange={set('unidadeId')}
          placeholder={form.municipioId ? 'Selecione a unidade' : 'Selecione o município antes'}
          disabled={!form.municipioId}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Select
          label="Técnico *"
          options={tecnicos}
          value={form.tecnicoId}
          onChange={set('tecnicoId')}
          placeholder="Selecione o técnico"
        />
        <Select
          label="Categoria *"
          options={CATEGORIAS}
          value={form.categoria}
          onChange={set('categoria')}
          placeholder="Selecione a categoria"
        />
      </div>

      <div>
        <label className="label-base">Descrição *</label>
        <textarea
          rows={4}
          className="input-base resize-none"
          placeholder="Descreva o chamado em detalhes..."
          value={form.descricao}
          onChange={set('descricao')}
        />
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <Button variant="secondary" onClick={onCancel} disabled={loading}>
          Cancelar
        </Button>
        <Button loading={loading} onClick={handleSubmit}>
          Abrir Chamado
        </Button>
      </div>
    </div>
  )
}
