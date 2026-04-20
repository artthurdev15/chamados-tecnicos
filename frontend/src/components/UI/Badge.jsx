const variants = {
  pendente:  'bg-amber-500/15 text-amber-400 border border-amber-500/30',
  resolvido: 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30',
  alerta:    'bg-red-500/15 text-red-400 border border-red-500/30',
  default:   'bg-slate-700/50 text-slate-300 border border-slate-600/50',
}

export default function Badge({ variant = 'default', children }) {
  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${variants[variant]}`}
    >
      {children}
    </span>
  )
}
