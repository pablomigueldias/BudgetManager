const Input = ({ label, error, ...props }) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium opacity-70 mb-1">
          {label}
        </label>
      )}
      
      <input
        className={`input-field ${error ? 'border-red-500 focus:border-red-500' : ''}`}
        {...props}
      />
      
      {error && <span className="text-xs text-red-500 mt-1">{error}</span>}
    </div>
  );
};

export default Input;