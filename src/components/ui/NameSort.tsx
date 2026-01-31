'use client';

interface NameSortProps {
  children: React.ReactNode;
  state?: 'default' | 'hover' | 'pressed';
  onClick?: () => void;
}

export default function NameSort({ 
  children,
  state = 'default',
  onClick
}: NameSortProps) {
  const stateStyles = {
    default: 'bg-gray-50',
    hover: 'bg-gray-100',
    pressed: 'bg-gray-200'
  };

  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-28 h-8.75 text-body-sm-rg text-center transition-colors ${stateStyles[state]}`}
    >
      {children}
    </button>
  );
}