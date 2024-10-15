import { cn } from "@/lib/utils";

// components/ui/button.js
export const Button = ({ children, onClick, disabled, className }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={cn(
      "px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50",
      className
    )}
  >
    {children}
  </button>
);
