// Updated filename to PascalCase

interface BtnRoundProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outline' | 'neutral' | 'subtle';
  size?: 'sm' | 'md' | 'lg';
}

export default function BtnRound({
  children,
  variant = 'outline',
  size = 'sm',
  className = '',
  ...rest
}: BtnRoundProps & { className?: string }) {
  const btnType = {
    primary: 'bg-primary text-white border border-primary',
    outline: 'bg-white text-primary border border-primary',
    neutral: 'bg-white text-black border border-gray-200 hover:bg-gray-100 hover:border-gray-100',
    subtle: 'bg-gray-100 text-primary',
  };

  const btnSize = {
    sm: 'h-[30px] px-[14px] py-[5px] text-14 rounded-[15px]', // btn_30
    md: 'h-8 px-[13px] py-[3px] text-14 rounded-[15px]', // btn_32
    lg: 'h-[40px] w-[130px] text-[15px] rounded-full', //btn_41
  };

  return (
    <button
      className={`
        ${btnSize[size]}
        ${btnType[variant]}
        cursor-pointer transition-colors duration-200
        inline-flex items-center justify-center
        ${className}
      `}
      {...rest}
    >
      {children}
    </button>
  );
}
