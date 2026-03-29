import { ReactNode, ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  children: ReactNode;
  loading?: boolean;
}

export function Button({
  variant = "primary",
  size = "md",
  loading = false,
  className = "",
  disabled,
  ...props
}: ButtonProps) {
  const baseClasses = "inline-flex items-center justify-center font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal disabled:opacity-50 disabled:pointer-events-none";
  
  const variants = {
    primary: "bg-ink text-mist hover:bg-ink/90 shadow-sm",
    secondary: "border border-teal/20 bg-transparent text-teal hover:bg-teal/5",
    ghost: "text-slate hover:text-ink hover:bg-slate-100/5",
    danger: "bg-coral text-mist hover:bg-coral/90 shadow-sm",
  };
  
  const sizes = {
    sm: "h-9 px-4 text-xs rounded-full",
    md: "h-11 px-5 py-3 text-sm rounded-full",
    lg: "h-14 px-8 py-4 text-base rounded-full",
  };

  return (
    <button 
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={loading || disabled}
      {...props}
    >
      {loading ? (
        <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
      ) : null}
      {props.children}
    </button>
  );
}
