"use client";

import { ReactNode } from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface FuturisticButtonProps {
  children: ReactNode;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "outline" | "ghost";
  className?: string;
  glow?: boolean;
}

export default function FuturisticButton({
  children,
  onClick,
  variant = "primary",
  className,
  glow = false,
}: FuturisticButtonProps) {
  const baseStyles = "relative px-6 py-3 rounded-xl font-medium transition-all duration-300 active:scale-95 overflow-hidden group";
  
  const variants = {
    primary: "bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 hover:bg-cyan-500/20 hover:border-cyan-500/50",
    secondary: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/20 hover:border-emerald-500/50",
    outline: "bg-transparent text-white border border-white/10 hover:bg-white/5 hover:border-white/20",
    ghost: "bg-transparent text-zinc-400 hover:text-white hover:bg-white/5",
  };

  const glowStyles = glow ? "shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:shadow-[0_0_30px_rgba(6,182,212,0.5)]" : "";

  return (
    <button
      onClick={onClick}
      className={cn(baseStyles, variants[variant], glowStyles, className)}
    >
      <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out" />
      <span className="relative z-10 flex items-center justify-center gap-2">
        {children}
      </span>
    </button>
  );
}
