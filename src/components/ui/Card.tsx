import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

// ============================================
// CARD VARIANTS
// ============================================

const CARD_VARIANT = {
  DEFAULT: "default",
  ELEVATED: "elevated",
  OUTLINE: "outline",
  GHOST: "ghost",
} as const;

type CardVariant = (typeof CARD_VARIANT)[keyof typeof CARD_VARIANT];

const VARIANT_STYLES: Record<CardVariant, string> = {
  [CARD_VARIANT.DEFAULT]: "glass-morphism",
  [CARD_VARIANT.ELEVATED]: "glass-morphism shadow-xl shadow-black/20",
  [CARD_VARIANT.OUTLINE]: "bg-transparent border border-white/10",
  [CARD_VARIANT.GHOST]: "bg-white/5",
};

// ============================================
// CARD COMPONENT
// ============================================

interface CardProps {
  children: ReactNode;
  variant?: CardVariant;
  className?: string;
  padding?: "none" | "sm" | "md" | "lg";
  as?: "div" | "article" | "section";
}

const PADDING_STYLES = {
  none: "",
  sm: "p-4",
  md: "p-6",
  lg: "p-8",
} as const;

export function Card({
  children,
  variant = CARD_VARIANT.DEFAULT,
  className,
  padding = "md",
  as: Component = "div",
}: CardProps) {
  return (
    <Component
      className={cn(
        "rounded-2xl",
        VARIANT_STYLES[variant],
        PADDING_STYLES[padding],
        className
      )}
    >
      {children}
    </Component>
  );
}

// ============================================
// CARD HEADER
// ============================================

interface CardHeaderProps {
  children: ReactNode;
  className?: string;
}

export function CardHeader({ children, className }: CardHeaderProps) {
  return (
    <div className={cn("mb-4 flex items-center justify-between", className)}>
      {children}
    </div>
  );
}

// ============================================
// CARD TITLE
// ============================================

interface CardTitleProps {
  children: ReactNode;
  className?: string;
}

export function CardTitle({ children, className }: CardTitleProps) {
  return (
    <h3
      className={cn(
        "text-sm font-bold uppercase tracking-widest text-zinc-500",
        className
      )}
    >
      {children}
    </h3>
  );
}

// ============================================
// CARD CONTENT
// ============================================

interface CardContentProps {
  children: ReactNode;
  className?: string;
}

export function CardContent({ children, className }: CardContentProps) {
  return <div className={cn("space-y-4", className)}>{children}</div>;
}

// Re-export variant for external use
export { CARD_VARIANT };
