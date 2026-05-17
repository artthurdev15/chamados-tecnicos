import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'
import Button from '../components/UI/Button'

export default function Login() {
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()
    if (!email || !senha) {
      setError('Por favor, preencha todos os campos.')
      return
    }

    setLoading(true)
    setError('')

    try {
      // Faz o POST para a rota pública do teu AuthController do Java
      const response = await api.post('/auth/login', { email, senha })
      
      // Guarda os dados no localStorage
      localStorage.setItem('token', response.data.token)
      localStorage.setItem('user_nome', response.data.nome)
      localStorage.setItem('user_role', response.data.role)

      // Vai para a dashboard
      navigate('/')
    } catch (err) {
      setError(err.message || 'Falha na autenticação.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center p-4 bg-slate-950">
      <div className="w-full max-w-md glass rounded-2xl p-8 shadow-2xl animate-slide-up">
        <div className="text-center mb-8">
          <h1 className="font-display text-3xl text-slate-100 tracking-tight">
            Chamados<span className="text-brand-400">.</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1 font-mono">Entrar no Sistema Técnico</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm px-4 py-3 rounded-lg">
              ⚠ {error}
            </div>
          )}

          <div>
            <label className="label-base">E-mail</label>
            <input
              type="email"
              className="input-base"
              placeholder="seu.email@exemplo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="label-base">Senha</label>
            <input
              type="password"
              className="input-base"
              placeholder="••••••••"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
            />
          </div>

          <Button type="submit" className="w-full" size="lg" loading={loading}>
            Entrar
          </Button>
        </form>
      </div>
    </div>
  )
}