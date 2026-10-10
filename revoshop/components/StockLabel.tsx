const LOW_STOCK_LIMIT = 5;

interface StockLabelProps {
  stock: number;
  isActive?: boolean;
  className?: string;
}

export default function StockLabel({ stock, isActive = true, className = "" }: StockLabelProps) {
  if (!isActive) return <span className={`text-subtle ${className}`}>Unavailable</span>;
  if (stock === 0) return <span className={`font-semibold text-danger ${className}`}>Sold out</span>;
  if (stock <= LOW_STOCK_LIMIT) {
    return <span className={`font-semibold text-danger ${className}`}>Only {stock} left</span>;
  }
  return <span className={`text-subtle ${className}`}>Stock {stock}</span>;
}
