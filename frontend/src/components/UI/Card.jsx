export default function Card({ children, className = '' }) {
  return (
    <div className={`glass rounded-xl p-5 animate-slide-up ${className}`}>
      {children}
    </div>
  )
}
