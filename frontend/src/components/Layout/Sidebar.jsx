import { useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'

const mainLinks = [
  { to: '/',           icon: '⬡', label: 'Dashboard'  },
  { to: '/chamados',   icon: '◈', label: 'Chamados'   },
  { to: '/relatorios', icon: '◉', label: 'Relatórios' },
]

const cadastroLinks = [
  { to: '/cadastros/tecnicos',   label: 'Técnicos'   },
  { to: '/cadastros/municipios', label: 'Municípios' },
  { to: '/cadastros/unidades',   label: 'Unidades'   },
]

export default function Sidebar() {
  const location = useLocation()
  const inCadastros = location.pathname.startsWith('/cadastros')
  const [open, setOpen] = useState(inCadastros)

  return (
    <aside className="fixed left-0 top-0 h-full w-60 glass border-r border-slate-700/40 flex flex-col z-40">
      {/* Logo */}
      <div className="px-6 py-6 border-b border-slate-700/40">
        <span className="font-display text-xl text-slate-100 tracking-tight">
          Chamados<span className="text-brand-400">.</span>
        </span>
        <p className="text-xs text-slate-500 mt-0.5 font-mono">Sistema Técnico</p>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-5 space-y-1 overflow-y-auto">

        {/* Links principais */}
        {mainLinks.map(({ to, icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) => `
              flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm
              transition-all duration-200
              ${isActive
                ? 'bg-brand-600/20 text-brand-300 border border-brand-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }
            `}
          >
            <span className="text-base">{icon}</span>
            <span className="font-medium">{label}</span>
          </NavLink>
        ))}

        {/* Separador */}
        <div className="pt-2 pb-1 px-3">
          <span className="text-xs text-slate-600 uppercase tracking-widest font-medium">
            Cadastros
          </span>
        </div>

        {/* Botão do grupo Cadastros */}
        <button
          onClick={() => setOpen(o => !o)}
          className={`
            w-full flex items-center justify-between gap-3 px-3 py-2.5 rounded-lg text-sm
            transition-all duration-200
            ${inCadastros
              ? 'bg-brand-600/20 text-brand-300 border border-brand-500/30'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }
          `}
        >
          <div className="flex items-center gap-3">
            <span className="text-base">◧</span>
            <span className="font-medium">Cadastros</span>
          </div>
          {/* chevron animado */}
          <span
            className="text-xs transition-transform duration-200"
            style={{ transform: open ? 'rotate(90deg)' : 'rotate(0deg)' }}
          >
            ›
          </span>
        </button>

        {/* Submenu */}
        <div
          className="overflow-hidden transition-all duration-300"
          style={{ maxHeight: open ? '160px' : '0px', opacity: open ? 1 : 0 }}
        >
          <div className="pl-4 space-y-0.5 pt-1">
            {cadastroLinks.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) => `
                  flex items-center gap-2 px-3 py-2 rounded-lg text-sm
                  transition-all duration-200
                  ${isActive
                    ? 'bg-brand-600/15 text-brand-300'
                    : 'text-slate-500 hover:text-slate-200 hover:bg-slate-800/40'
                  }
                `}
              >
                <span className="w-1 h-1 rounded-full bg-current opacity-60" />
                <span>{label}</span>
              </NavLink>
            ))}
          </div>
        </div>

      </nav>

      {/* Footer */}
      <div className="px-6 py-4 border-t border-slate-700/40">
        <p className="text-xs text-slate-600 font-mono">v1.0.0</p>
      </div>
    </aside>
  )
}
