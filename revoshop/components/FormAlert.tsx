import { WarningCircle } from "@phosphor-icons/react/ssr";

export default function FormAlert({ children }: { children: string }) {
  return (
    <div role="alert" className="flex items-start gap-2 rounded-lg bg-danger-soft px-3 py-2.5 text-sm text-danger">
      <WarningCircle size={18} className="mt-px shrink-0" aria-hidden />
      {children}
    </div>
  );
}
