import React from "react";
import { cn } from "../../utils/cn";

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "bubble" | "dark" | "neon";
  hover?: boolean;
  children: React.ReactNode;
}

export const GlassCard: React.FC<GlassCardProps> = ({
  variant = "default",
  hover = true,
  children,
  className,
  ...props
}) => {
  return (
    <div
      className={cn(
        variant === "default" && "glass-card",
        variant === "bubble" && "bubble-glass",
        variant === "dark" && "glass-card bg-opacity-30",
        variant === "neon" && "glass-card neon-border-primary",
        hover && "transition-all duration-300",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export default GlassCard;
