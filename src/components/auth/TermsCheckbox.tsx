interface TermsCheckboxProps {
  label: string;
  linkText: string;
  linkUrl: string;
  isRequired?: boolean;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

export default function TermsCheckbox({
  label,
  linkText,
  linkUrl,
  isRequired = true,
  checked,
  onChange,
}: TermsCheckboxProps) {
  const handleLinkClick = (e: React.MouseEvent) => {
    e.preventDefault();
    window.open(linkUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="flex items-center gap-2">
      <input
        type="checkbox"
        id={`terms-${label}`}
        checked={checked}
        onChange={e => onChange(e.target.checked)}
        className="w-4.5 h-4.5 border-2 border-[#D9D9D9] rounded cursor-pointer accent-primary"
      />
      <label htmlFor={`terms-${label}`} className="text-body-rg text-black select-none">
        {isRequired && <span className="text-primary">(필수) </span>}
        <span>{label} </span>
        <button type="button" onClick={handleLinkClick} className="underline underline-offset-2 cursor-pointer">
          {linkText}
        </button>
        <span> 동의</span>
      </label>
    </div>
  );
}
