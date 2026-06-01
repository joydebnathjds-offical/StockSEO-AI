import React, { useEffect } from "react";
import { Sun, Moon } from "lucide-react";
import { useAppStore } from "../../store/useAppStore";
import { cn } from "../../utils/cn";

export const ThemeToggle: React.FC<{ className?: string }> = ({ className }) => {
  const { theme, toggleTheme } = useAppStore();

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  return (
    <button
      onClick={toggleTheme}
      className={cn(
        "relative w-14 h-7 rounded-full transition-all duration-500 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 dark:focus:ring-pink-400/50 cursor-pointer",
        theme === "dark"
          ? "bg-gradient-to-r from-violet-600 to-pink-500"
          : "bg-gradient-to-r from-cyan-400 to-blue-500",
        className
      )}
      aria-label="Toggle theme"
    >
      <span
        className={cn(
          "absolute top-1 w-5 h-5 rounded-full transition-all duration-500 flex items-center justify-center shadow-lg",
          theme === "dark"
            ? "translate-x-7 bg-[#090D16]"
            : "translate-x-1 bg-white"
        )}
      >
        {theme === "dark" ? (
          <Moon className="w-3 h-3 text-pink-400" />
        ) : (
          <Sun className="w-3 h-3 text-yellow-500" />
        )}
      </span>
    </button>
  );
};

export default ThemeToggle;
