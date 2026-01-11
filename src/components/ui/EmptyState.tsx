import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Inbox, Search, AlertCircle } from "lucide-react";
import FuturisticButton from "./FuturisticButton";

// ============================================
// EMPTY STATE VARIANTS
// ============================================

const EMPTY_VARIANT = {
  DEFAULT: "default",
  SEARCH: "search",
  ERROR: "error",
} as const;

type EmptyVariant = (typeof EMPTY_VARIANT)[keyof typeof EMPTY_VARIANT];

const VARIANT_ICONS: Record<EmptyVariant, ReactNode> = {
  [EMPTY_VARIANT.DEFAULT]: <Inbox className="w-16 h-16 text-zinc-700" />,
  [EMPTY_VARIANT.SEARCH]: <Search className="w-16 h-16 text-zinc-700" />,
  [EMPTY_VARIANT.ERROR]: <AlertCircle className="w-16 h-16 text-rose-500/50" />,
};

// ============================================
// EMPTY STATE COMPONENT
// ============================================

interface EmptyStateProps {
  variant?: EmptyVariant;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  icon?: ReactNode;
  className?: string;
}

export function EmptyState({
  variant = EMPTY_VARIANT.DEFAULT,
  title,
  description,
  action,
  icon,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center py-16 px-4 text-center",
        className
      )}
      role="status"
    >
      {/* Icon */}
      <div className="mb-6">{icon || VARIANT_ICONS[variant]}</div>

      {/* Title */}
      <h3 className="text-lg font-bold text-white mb-2">{title}</h3>

      {/* Description */}
      {description && (
        <p className="text-sm text-zinc-500 max-w-sm mb-6">{description}</p>
      )}

      {/* Action */}
      {action && (
        <FuturisticButton onClick={action.onClick} variant="primary">
          {action.label}
        </FuturisticButton>
      )}
    </div>
  );
}

export { EMPTY_VARIANT };
