export function Button({ children, onClick, variant = 'default', className = '', ...props }) {
  const style = variant === 'outline'
    ? 'border border-gray-400 text-gray-700 bg-white hover:bg-gray-100'
    : 'bg-indigo-600 text-white hover:bg-indigo-700';
  return (
    <button onClick={onClick} className={`px-4 py-2 rounded ${style} ${className}`} {...props}>
      {children}
    </button>
  );
}
