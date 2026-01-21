interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outline' | 'neutral';
  size?: 'sm' | 'md' | 'lg';
  interaction?: 'default' | 'static';
}

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  interaction = 'default',
  className = '',
  ...rest
}: ButtonProps & { className?: string }) {
  const btnType = {
    primary:
      interaction === 'static' ? 'bg-primary text-white' : 'bg-primary text-white hover:bg-gray-300 active:bg-gray-400',
    outline: 'bg-white text-primary border border-primary hover:bg-blue-50 active:bg-blue-100',
    neutral:
      'bg-blue-50 text-black border border-blue-200 hover:bg-blue-100  hover:border-gray-100 active:bg-gray-100 active:border-gray-100',
  };

  const disabledStyle = 'bg-gray-300 text-white cursor-not-allowed';

  const btnSize = {
    sm: 'w-[108px] h-[38px] text-body-sm-rg rounded-[10px]',
    md: 'w-[155px] h-[45px] text-12 rounded-[10px]',
    lg: 'w-[344px] h-[50px] text-subtitle-sm-sb rounded-[10px]',
  };

  return (
    <button
      className={`
      ${btnSize[size]}
      ${rest.disabled ? disabledStyle : btnType[variant]}
      ${rest.disabled ? 'cursor-not-allowed' : 'cursor-pointer'}
      ${className}
      transition-colors duration-200
    `}
      disabled={rest.disabled}
      {...rest}
    >
      {children}
    </button>
  );
}
