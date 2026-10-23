import Card from "./Card";

interface FetchErrorProps {
  title: string;
  message: string;
  onRetry: () => void;
}

export default function FetchError({ title, message, onRetry }: FetchErrorProps) {
  return (
    <Card role="alert" className="py-12 text-center">
      <h2 className="font-semibold text-ink">{title}</h2>
      <p className="mx-auto mt-1 max-w-sm text-sm text-muted">{message}</p>
      <button
        type="button"
        onClick={onRetry}
        className="mt-5 h-10 rounded-lg bg-accent px-5 text-sm font-semibold text-on-accent transition-colors duration-150 hover:bg-accent-hover"
      >
        Try again
      </button>
    </Card>
  );
}
