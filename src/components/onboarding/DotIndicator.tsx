type Props = {
  total: number;
  current: number;
};

export default function DotIndicator({ total, current }: Props) {
  return (
    <div className="flex items-center gap-2.5">
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          className={`w-2 h-2 rounded-full transition-colors duration-300 ${
            i === current ? 'bg-gray-950' : 'bg-gray-200'
          }`}
        />
      ))}
    </div>
  );
}
