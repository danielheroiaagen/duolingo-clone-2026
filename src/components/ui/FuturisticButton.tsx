"use client";

import type { ReactNode, Ref, ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

// ============================================
// BUTTON VARIANTS & SIZES
// ============================================

const BUTTON_VARIANT = {
  PRIMARY: "primary",
  SECONDARY: "secondary",
  OUTLINE: "outline",
  GHOST: "ghost",
  DANGER: "danger",
} as const;

const BUTTON_SIZE = {
  SM: "sm",
  MD: "md",
  LG: "lg",
  ICON: "icon",
} as const;

type ButtonVariant = (typeof BUTTON_VARIANT)[keyof typeof BUTTON_VARIANT];
type ButtonSize = (typeof BUTTON_SIZE)[keyof typeof BUTTON_SIZE];

const VARIANT_STYLES: Record<ButtonVariant, string> = {
  [BUTTON_VARIANT.PRIMARY]: cn(
    "bg-cyan-500/10 text-cyan-400 border border-cyan-500/30",
    "hover:bg-cyan-500/20 hover:border-cyan-500/50",
    "focus:ring-cyan-500/50"
  ),
  [BUTTON_VARIANT.SECONDARY]: cn(
    "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30",
    "hover:bg-emerald-500/20 hover:border-emerald-500/50",
    "focus:ring-emerald-500/50"
  ),
  [BUTTON_VARIANT.OUTLINE]: cn(
    "bg-transparent text-white border border-white/10",
    "hover:bg-white/5 hover:border-white/20",
    "focus:ring-white/30"
  ),
  [BUTTON_VARIANT.GHOST]: cn(
    "bg-transparent text-zinc-400 border-transparent",
    "hover:text-white hover:bg-white/5",
    "focus:ring-white/20"
  ),
  [BUTTON_VARIANT.DANGER]: cn(
    "bg-rose-500/10 text-rose-400 border border-rose-500/30",
    "hover:bg-rose-500/20 hover:border-rose-500/50",
    "focus:ring-rose-500/50"
  ),
};

const SIZE_STYLES: Record<ButtonSize, string> = {
  [BUTTON_SIZE.SM]: "px-3 py-1.5 text-sm rounded-lg",
  [BUTTON_SIZE.MD]: "px-6 py-3 text-base rounded-xl",
  [BUTTON_SIZE.LG]: "px-8 py-4 text-lg rounded-2xl",
  [BUTTON_SIZE.ICON]: "p-3 rounded-xl",
};

// ============================================
// PROPS INTERFACE
// ============================================

interface FuturisticButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children"> {
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  glow?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  ref?: Ref<HTMLButtonElement>;
}

// ============================================
// COMPONENT
// ============================================

export default function FuturisticButton({
  children,
  onClick,
  variant = BUTTON_VARIANT.PRIMARY,
  size = BUTTON_SIZE.MD,
  className,
  glow = false,
  loading = false,
  fullWidth = false,
  disabled = false,
  ref,
  type = "button",
  ...props
}: FuturisticButtonProps) {
  const isDisabled = disabled || loading;

  const baseStyles = cn(
    "relative font-medium transition-all duration-300",
    "active:scale-95 overflow-hidden group",
    "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-zinc-950",
    "disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100"
  );

  const glowStyles = glow
    ? "shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:shadow-[0_0_30px_rgba(6,182,212,0.5)]"
    : "";

  return (
    <button
      ref={ref}
      type={type}
      onClick={onClick}
      disabled={isDisabled}
      className={cn(
        baseStyles,
        VARIANT_STYLES[variant],
        SIZE_STYLES[size],
        glowStyles,
        fullWidth && "w-full",
        className
      )}
      {...props}
    >
      {/* Shine effect */}
      <div
        className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out"
        aria-hidden="true"
      />

      {/* Content */}
      <span className="relative z-10 flex items-center justify-center gap-2">
        {loading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" aria-hidden="true" />
            <span>Loading...</span>
          </>
        ) : (
          children
        )}
      </span>
    </button>
  );
}

export { BUTTON_VARIANT, BUTTON_SIZE };
export type { ButtonVariant, ButtonSize };
