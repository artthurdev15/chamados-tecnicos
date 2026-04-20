export default function EmptyState({
  icon = '📭',
  title = 'Nenhum item encontrado',
  subtitle,
}) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center animate-fade-in">
      <span className="text-5xl mb-4 opacity-50">{icon}</span>
      <p className="text-slate-400 font-medium">{title}</p>
      {subtitle && (
        <p className="text-slate-600 text-sm mt-1">{subtitle}</p>
      )}
    </div>
  )
}
