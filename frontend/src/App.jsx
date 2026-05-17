import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Sidebar    from './components/Layout/Sidebar'
import Dashboard  from './pages/Dashboard'
import Chamados   from './pages/Chamados'
import Relatorios from './pages/Relatorios'
import Tecnicos   from './pages/Tecnicos'
import Municipios from './pages/Municipios'
import Unidades   from './pages/Unidades'

export default function App() {
  return (
    <BrowserRouter>
      <div className="flex min-h-screen">
        <Sidebar />
        <main className="flex-1 ml-60 p-8 max-w-[1200px]">
          <Routes>
            <Route path="/"                       element={<Dashboard />}  />
            <Route path="/chamados"               element={<Chamados />}   />
            <Route path="/relatorios"             element={<Relatorios />} />
            <Route path="/cadastros/tecnicos"     element={<Tecnicos />}   />
            <Route path="/cadastros/municipios"   element={<Municipios />} />
            <Route path="/cadastros/unidades"     element={<Unidades />}   />
            <Route path="*"                       element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}
