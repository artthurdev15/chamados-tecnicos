export default function Select({
  label,
  options = [],
  placeholder = 'Selecione...',
  className = '',
  ...props
}) {
  return (
    <div className={className}>
      {label && <label className="label-base">{label}</label>}
      <select className="input-base" {...props}>
        <option value="">{placeholder}</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  )
}
