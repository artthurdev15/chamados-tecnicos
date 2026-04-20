const variants = {
  primary:   'bg-brand-600 hover:bg-brand-500 text-white shadow-lg shadow-brand-900/40',
  secondary: 'bg-slate-700/80 hover:bg-slate-600 text-slate-200 border border-slate-600',
  danger:    'bg-red-600/20 hover:bg-red-600/40 text-red-400 border border-red-500/30',
  ghost:     'hover:bg-slate-800 text-slate-400 hover:text-slate-200',
  success:   'bg-emerald-600/20 hover:bg-emerald-600/40 text-emerald-400 border border-emerald-500/30',
}

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  className = '',
  ...props
}) {
  const sizes = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-2.5 text-base',
  }

  return (
    <button
      disabled={disabled || loading}
      className={`
        inline-flex items-center justify-center gap-2 font-medium rounded-lg
        transition-all duration-200 cursor-pointer
        disabled:opacity-50 disabled:cursor-not-allowed
        ${sizes[size]} ${variants[variant]} ${className}
      `}
      {...props}
    >
      {loading && (
        <div className="w-3.5 h-3.5 animate-spin rounded-full border-2 border-current border-t-transparent" />
      )}
      {children}
    </button>
  )
}
