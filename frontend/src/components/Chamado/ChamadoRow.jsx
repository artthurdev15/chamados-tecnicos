import { useState } from 'react'
import { chamadoService } from '../../services/chamadoService'
import { formatDate, formatDateTime } from '../../utils/formatters'
import { CATEGORIAS } from '../../utils/constants'
import Badge  from '../UI/Badge'
import Button from '../UI/Button'

export default function ChamadoRow({ chamado, onResolved }) {
  const [loading, setLoading] = useState(false)

  const categoriaLabel =
    CATEGORIAS.find((c) => c.value === chamado.categoria)?.label ?? chamado.categoria

  const handleResolver = async () => {
    if (!window.confirm('Confirma a resolução deste chamado?')) return
    setLoading(true)
    try {
      await chamadoService.resolver(chamado.id)
      onResolved()
    } catch (e) {
      alert(e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <tr className="border-b border-slate-800/60 hover:bg-slate-800/30 transition-colors group">
      <td className="px-4 py-3">
        <span className="font-mono text-xs text-slate-500">#{chamado.id}</span>
      </td>
      <td className="px-4 py-3">
        <p className="text-sm font-medium text-slate-200">{chamado.unidade.nome}</p>
        <p className="text-xs text-slate-500">{chamado.unidade.municipio.nome}</p>
      </td>
      <td className="px-4 py-3">
        <p className="text-sm text-slate-300">{chamado.tecnico.nome}</p>
      </td>
      <td className="px-4 py-3">
        <span className="text-xs bg-slate-800 text-slate-400 px-2 py-1 rounded-md">
          {categoriaLabel}
        </span>
      </td>
      <td className="px-4 py-3 max-w-[220px]">
        <p className="text-sm text-slate-400 truncate" title={chamado.descricao}>
          {chamado.descricao}
        </p>
      </td>
      <td className="px-4 py-3">
        <p className="text-xs text-slate-400 font-mono">
          {formatDateTime(chamado.dataSolicitacao)}
        </p>
        {chamado.dataConclusao && (
          <p className="text-xs text-emerald-500 font-mono mt-0.5">
            ✓ {formatDate(chamado.dataConclusao)}
          </p>
        )}
      </td>
      <td className="px-4 py-3">
        <Badge variant={chamado.status === 'RESOLVIDO' ? 'resolvido' : 'pendente'}>
          {chamado.status === 'RESOLVIDO' ? '✓ Resolvido' : '● Pendente'}
        </Badge>
      </td>
      <td className="px-4 py-3">
        {chamado.status === 'PENDENTE' && (
          <Button
            variant="success"
            size="sm"
            loading={loading}
            onClick={handleResolver}
            className="opacity-0 group-hover:opacity-100 transition-opacity"
          >
            Resolver
          </Button>
        )}
      </td>
    </tr>
  )
}
