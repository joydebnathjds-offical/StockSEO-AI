import React from "react";
import { cn } from "../../utils/cn";
import { Loader2 } from "lucide-react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "gradient" | "glass" | "outline" | "ghost" | "danger" | "success";
  size?: "sm" | "md" | "lg" | "xl";
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = "gradient",
  size = "md",
  loading = false,
  icon,
  iconPosition = "left",
  children,
  className,
  disabled,
  ...props
}) => {
  const sizeClasses = {
    sm: "px-3 py-1.5 text-xs rounded-lg",
    md: "px-4 py-2 text-sm rounded-xl",
    lg: "px-6 py-3 text-base rounded-xl",
    xl: "px-8 py-4 text-lg rounded-2xl",
  };

  const variantClasses = {
    gradient: "btn-gradient text-white font-semibold",
    glass: "glass-surface text-[var(--color-text)] font-medium hover:bg-white/20 dark:hover:bg-white/10",
    outline: "border border-[var(--color-glass-border)] text-[var(--color-text)] hover:border-cyan-400 dark:hover:border-pink-400 font-medium bg-transparent",
    ghost: "text-[var(--color-text)] hover:bg-white/10 dark:hover:bg-white/5 font-medium bg-transparent",
    danger: "bg-red-500/80 hover:bg-red-500 text-white font-semibold backdrop-blur",
    success: "bg-emerald-500/80 hover:bg-emerald-500 text-white font-semibold backdrop-blur",
  };

  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 font-semibold transition-all duration-200 cursor-pointer select-none focus:outline-none focus:ring-2 focus:ring-cyan-400/50 dark:focus:ring-pink-400/50 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none",
        sizeClasses[size],
        variantClasses[variant],
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        icon && iconPosition === "left" && icon
      )}
      {children}
      {!loading && icon && iconPosition === "right" && icon}
    </button>
  );
};

export default Button;
