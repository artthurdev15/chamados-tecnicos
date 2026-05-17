import { useState, useEffect } from 'react'
import usuarioService from '../services/usuarioService'
import Button from '../components/UI/Button'
import Modal from '../components/UI/Modal'
import Card from '../components/UI/Card'
import Badge from '../components/UI/Badge'

export default function Usuarios() {
  const [usuarios, setUsuarios] = useState([])
  const [loading, setLoading] = useState(true)
  const [modalAberto, setModalAberto] = useState(false)
  const [error, setError] = useState('')

  // Campos do formulário
  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [role, setRole] = useState('TECNICO') // Padrão
  const [salvando, setSalvando] = useState(false)

  const carregarUsuarios = async () => {
    try {
      setLoading(true)
      const dados = await usuarioService.listarTodos()
      setUsuarios(dados)
    } catch (err) {
      setError('Não foi possível carregar os usuários.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    carregarUsuarios()
  }, [])

  const handleCadastrar = async (e) => {
    e.preventDefault()
    if (!nome || !email || !senha) {
      alert('Preencha todos os campos obrigatórios!')
      return
    }

    try {
      setSalvando(true)
      await usuarioService.salvar({ nome, email, senha, role })
      
      // Limpa formulário e fecha modal
      setNome('')
      setEmail('')
      setSenha('')
      setRole('TECNICO')
      setModalAberto(false)
      
      // Recarrega a tabela
      carregarUsuarios()
    } catch (err) {
      alert(err.message || 'Erro ao salvar usuário.')
    } finally {
      setSalvando(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-100 tracking-tight">Gestão de Usuários</h1>
          <p className="text-sm text-slate-400">Cadastre e gerencie os acessos dos técnicos e administradores.</p>
        </div>
        <Button onClick={() => setModalAberto(true)}>+ Novo Usuário</Button>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm px-4 py-3 rounded-lg">
          ⚠ {error}
        </div>
      )}

      <Card>
        {loading ? (
          <p className="text-center text-slate-400 py-8 font-mono text-sm">Carregando usuários...</p>
        ) : usuarios.length === 0 ? (
          <p className="text-center text-slate-400 py-8 font-mono text-sm">Nenhum usuário cadastrado.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-700/50 text-slate-400 text-xs font-mono uppercase tracking-wider">
                  <th className="pb-3 pl-4">Nome</th>
                  <th className="pb-3">E-mail</th>
                  <th className="pb-3">Nível de Acesso (Role)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300 text-sm">
                {usuarios.map((usr) => (
                  <tr key={usr.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="py-3.5 pl-4 font-medium text-slate-200">{usr.nome}</td>
                    <td className="py-3.5 font-mono text-xs text-slate-400">{usr.email}</td>
                    <td className="py-3.5">
                      <Badge variant={usr.role === 'ADMINISTRADOR' ? 'brand' : 'slate'}>
                        {usr.role}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* MODAL DE CADASTRO CORRIGIDO (open em vez de isOpen) */}
      <Modal open={modalAberto} onClose={() => setModalAberto(false)} title="Cadastrar Novo Usuário">
        <form onSubmit={handleCadastrar} className="space-y-4 pt-2">
          <div>
            <label className="label-base">Nome Completo</label>
            <input
              type="text"
              className="input-base"
              placeholder="Ex: João da Silva"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="label-base">E-mail (Login)</label>
            <input
              type="email"
              className="input-base"
              placeholder="exemplo@chamados.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="label-base">Senha Inicial</label>
            <input
              type="password"
              className="input-base"
              placeholder="Mínimo 6 caracteres"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="label-base">Nível de Acesso</label>
            <select
              className="input-base"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="TECNICO">TÉCNICO (Usuário comum sem acesso a relatórios/configurações)</option>
              <option value="ADMINISTRADOR">ADMINISTRADOR (Acesso total ao sistema)</option>
            </select>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-700/40">
            <button
              type="button"
              onClick={() => setModalAberto(false)}
              className="px-4 py-2 text-sm font-medium text-slate-400 hover:text-slate-200 transition-colors"
            >
              Cancelar
            </button>
            <Button type="submit" loading={salvando}>Salvar Usuário</Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}