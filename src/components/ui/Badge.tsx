import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

// ============================================
// BADGE VARIANTS
// ============================================

const BADGE_VARIANT = {
  DEFAULT: "default",
  SUCCESS: "success",
  WARNING: "warning",
  ERROR: "error",
  INFO: "info",
} as const;

type BadgeVariant = (typeof BADGE_VARIANT)[keyof typeof BADGE_VARIANT];

const VARIANT_STYLES: Record<BadgeVariant, string> = {
  [BADGE_VARIANT.DEFAULT]: "bg-zinc-500/20 text-zinc-300 border-zinc-500/30",
  [BADGE_VARIANT.SUCCESS]: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  [BADGE_VARIANT.WARNING]: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  [BADGE_VARIANT.ERROR]: "bg-rose-500/20 text-rose-400 border-rose-500/30",
  [BADGE_VARIANT.INFO]: "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
};

// ============================================
// BADGE COMPONENT
// ============================================

interface BadgeProps {
  children: ReactNode;
  variant?: BadgeVariant;
  className?: string;
  dot?: boolean;
}

export function Badge({
  children,
  variant = BADGE_VARIANT.DEFAULT,
  className,
  dot = false,
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border",
        VARIANT_STYLES[variant],
        className
      )}
    >
      {dot && (
        <span
          className={cn(
            "w-1.5 h-1.5 rounded-full",
            variant === BADGE_VARIANT.SUCCESS && "bg-emerald-400",
            variant === BADGE_VARIANT.WARNING && "bg-amber-400",
            variant === BADGE_VARIANT.ERROR && "bg-rose-400",
            variant === BADGE_VARIANT.INFO && "bg-cyan-400",
            variant === BADGE_VARIANT.DEFAULT && "bg-zinc-400"
          )}
        />
      )}
      {children}
    </span>
  );
}

export { BADGE_VARIANT };
