import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom'
import Sidebar    from './components/Layout/Sidebar'
import Dashboard  from './pages/Dashboard'
import Chamados   from './pages/Chamados'
import Relatorios from './pages/Relatorios'
import Tecnicos   from './pages/Tecnicos'
import Municipios from './pages/Municipios'
import Unidades   from './pages/Unidades'
import Login      from './pages/Login'
import Usuarios from './pages/Usuarios'

// Componente para proteger rotas internas
function LayoutProtegido() {
  const token = localStorage.getItem('token')

  // Se não houver token, barra o acesso e joga para o login
  if (!token) {
    return <Navigate to="/login" replace />
  }

  // Se estiver logado, renderiza o Sidebar e o conteúdo da página
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 ml-60 p-8 max-w-[1200px]">
        <Outlet /> 
      </main>
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rota pública de Login */}
        <Route path="/login" element={<Login />} />

        {/* Todas as rotas protegidas encapsuladas dentro do LayoutProtegido */}
        <Route element={<LayoutProtegido />}>
          <Route path="/"                       element={<Dashboard />}  />
          <Route path="/chamados"               element={<Chamados />}   />
          <Route path="/relatorios"             element={<Relatorios />} />
          <Route path="/cadastros/tecnicos"     element={<Tecnicos />}   />
          <Route path="/cadastros/municipios"   element={<Municipios />} />
          <Route path="/cadastros/unidades"     element={<Unidades />}   />
          <Route path="/cadastros/usuarios" element={<Usuarios />} />
        </Route>

        {/* Qualquer outra rota redireciona para a home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}