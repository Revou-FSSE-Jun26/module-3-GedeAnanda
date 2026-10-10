import { Minus, Plus } from "@phosphor-icons/react";

interface QuantityCounterProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  label?: string;
  className?: string;
}

export default function QuantityCounter({
  value,
  onChange,
  min = 1,
  max = 99,
  label = "Quantity",
  className = "",
}: QuantityCounterProps) {
  return (
    <div
      role="group"
      aria-label={label}
      className={`inline-flex h-10 shrink-0 items-center rounded-full border border-line bg-surface ${className}`}
    >
      <button
        type="button"
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={value <= min}
        aria-label="Decrease quantity"
        className="grid size-10 place-items-center rounded-full text-muted transition-colors duration-200 hover:text-ink disabled:opacity-35"
      >
        <Minus size={14} weight="bold" aria-hidden />
      </button>
      <output aria-live="polite" className="w-7 text-center text-sm font-medium tabular-nums">
        {value}
      </output>
      <button
        type="button"
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={value >= max}
        aria-label="Increase quantity"
        className="grid size-10 place-items-center rounded-full text-muted transition-colors duration-200 hover:text-ink disabled:opacity-35"
      >
        <Plus size={14} weight="bold" aria-hidden />
      </button>
    </div>
  );
}
