import { Minus, Plus } from "@phosphor-icons/react";

interface QuantityCounterProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  label?: string;
  size?: "sm" | "md";
}

export default function QuantityCounter({
  value,
  onChange,
  min = 1,
  max = 99,
  label = "Quantity",
  size = "md",
}: QuantityCounterProps) {
  const box = size === "sm" ? "h-8" : "h-10";
  const button = size === "sm" ? "size-8" : "size-10";

  return (
    <div
      role="group"
      aria-label={label}
      className={`inline-flex shrink-0 items-center rounded-lg border border-line bg-surface ${box}`}
    >
      <button
        type="button"
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={value <= min}
        aria-label="Decrease quantity"
        className={`grid ${button} place-items-center rounded-l-lg text-accent transition-colors duration-150 hover:bg-accent-soft disabled:text-line disabled:hover:bg-transparent`}
      >
        <Minus size={14} weight="bold" aria-hidden />
      </button>
      <output aria-live="polite" className="min-w-7 text-center text-sm font-semibold tabular-nums">
        {value}
      </output>
      <button
        type="button"
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={value >= max}
        aria-label="Increase quantity"
        className={`grid ${button} place-items-center rounded-r-lg text-accent transition-colors duration-150 hover:bg-accent-soft disabled:text-line disabled:hover:bg-transparent`}
      >
        <Plus size={14} weight="bold" aria-hidden />
      </button>
    </div>
  );
}
