const Select = ({ label, options, placeholder = "Selecione...", ...props }) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium opacity-70 mb-1">
          {label}
        </label>
      )}
      <select className="input-field" {...props}>
        <option value="">{placeholder}</option>
        {options.map((opt) => (
          <option key={opt.id} value={opt.id}>
            {opt.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Select;