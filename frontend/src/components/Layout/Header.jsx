export default function Header({ title, subtitle, actions }) {
  return (
    <div className="flex items-start justify-between mb-8 animate-fade-in">
      <div>
        <h1 className="font-display text-3xl text-slate-100">{title}</h1>
        {subtitle && (
          <p className="text-slate-500 text-sm mt-1">{subtitle}</p>
        )}
      </div>
      {actions && (
        <div className="flex items-center gap-2">{actions}</div>
      )}
    </div>
  )
}
