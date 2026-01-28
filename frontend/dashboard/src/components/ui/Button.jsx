const Button = ({ children, variant = 'primary', onClick, type = 'button', className = '', ...props }) => {
  
  const baseStyle = "transition-all duration-200 font-bold py-2 px-4 rounded-lg shadow disabled:opacity-50";
  
  const variants = {
    primary: "btn-primary",
    danger: "text-white bg-red-600 hover:bg-red-700",
    outline: "border border-gray-300 text-gray-700 hover:bg-gray-50",
    link: "text-blue-600 hover:text-blue-900 hover:underline shadow-none p-0 bg-transparent"
  };

  const finalClass = variant === 'primary' 
    ? `btn-primary ${className}` 
    : `${baseStyle} ${variants[variant]} ${className}`;

  return (
    <button 
      type={type} 
      className={finalClass} 
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;