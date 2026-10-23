import type { ReactNode } from "react";
import Card from "../Card";

interface AuthShellProps {
  title: string;
  subtitle: string;
  footer: ReactNode;
  children: ReactNode;
}

export default function AuthShell({ title, subtitle, footer, children }: AuthShellProps) {
  return (
    <div className="mx-auto w-full max-w-md px-4 py-8 sm:py-14">
      <Card className="sm:p-8">
        <h1 className="text-xl font-bold text-ink sm:text-2xl">{title}</h1>
        <p className="mt-1 text-sm text-muted">{subtitle}</p>
        <div className="mt-6">{children}</div>
      </Card>
      <p className="mt-5 text-center text-sm text-muted">{footer}</p>
    </div>
  );
}
