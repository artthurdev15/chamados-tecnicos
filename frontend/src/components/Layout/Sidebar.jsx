import { NavLink } from 'react-router-dom'

const links = [
  { to: '/',           icon: '⬡', label: 'Dashboard'  },
  { to: '/chamados',   icon: '◈', label: 'Chamados'   },
  { to: '/relatorios', icon: '◉', label: 'Relatórios' },
]

export default function Sidebar() {
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
      <nav className="flex-1 px-3 py-5 space-y-1">
        {links.map(({ to, icon, label }) => (
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
      </nav>

      {/* Footer */}
      <div className="px-6 py-4 border-t border-slate-700/40">
        <p className="text-xs text-slate-600 font-mono">v1.0.0</p>
      </div>
    </aside>
  )
}
