"use client";

import type { ReactNode, Ref } from "react";
import { cn } from "@/lib/utils";
import { BUTTON_VARIANT, type ButtonVariant } from "@/types";

// ============================================
// VARIANT STYLES - Const object for mapping
// ============================================

const VARIANT_STYLES = {
  [BUTTON_VARIANT.PRIMARY]:
    "bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 hover:bg-cyan-500/20 hover:border-cyan-500/50",
  [BUTTON_VARIANT.SECONDARY]:
    "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/20 hover:border-emerald-500/50",
  [BUTTON_VARIANT.OUTLINE]:
    "bg-transparent text-white border border-white/10 hover:bg-white/5 hover:border-white/20",
  [BUTTON_VARIANT.GHOST]:
    "bg-transparent text-zinc-400 hover:text-white hover:bg-white/5",
} as const;

// ============================================
// PROPS INTERFACE - Flat, explicit
// ============================================

interface FuturisticButtonProps {
  children: ReactNode;
  onClick?: () => void;
  variant?: ButtonVariant;
  className?: string;
  glow?: boolean;
  disabled?: boolean;
  ref?: Ref<HTMLButtonElement>; // React 19: ref as prop
}

// ============================================
// COMPONENT
// ============================================

export default function FuturisticButton({
  children,
  onClick,
  variant = BUTTON_VARIANT.PRIMARY,
  className,
  glow = false,
  disabled = false,
  ref,
}: FuturisticButtonProps) {
  const baseStyles =
    "relative px-6 py-3 rounded-xl font-medium transition-all duration-300 active:scale-95 overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100";

  const glowStyles = glow
    ? "shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:shadow-[0_0_30px_rgba(6,182,212,0.5)]"
    : "";

  return (
    <button
      ref={ref}
      onClick={onClick}
      disabled={disabled}
      className={cn(baseStyles, VARIANT_STYLES[variant], glowStyles, className)}
    >
      <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out" />
      <span className="relative z-10 flex items-center justify-center gap-2">
        {children}
      </span>
    </button>
  );
}
