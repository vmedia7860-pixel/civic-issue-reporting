import './Input.css'

export default function Input({ 
  label, 
  error,
  className = '',
  as: Component = 'input',
  ...props 
}) {
  return (
    <div className={`input-group ${className}`}>
      {label && <label className="input-label">{label}</label>}
      <Component className={`input ${error ? 'input-error' : ''}`} {...props} />
      {error && <span className="input-error-text">{error}</span>}
    </div>
  )
}

