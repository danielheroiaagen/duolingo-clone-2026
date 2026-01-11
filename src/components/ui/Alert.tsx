import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { AlertCircle, CheckCircle2, Info, AlertTriangle, X } from "lucide-react";

// ============================================
// ALERT VARIANTS
// ============================================

const ALERT_VARIANT = {
  INFO: "info",
  SUCCESS: "success",
  WARNING: "warning",
  ERROR: "error",
} as const;

type AlertVariant = (typeof ALERT_VARIANT)[keyof typeof ALERT_VARIANT];

const VARIANT_STYLES: Record<AlertVariant, string> = {
  [ALERT_VARIANT.INFO]: "bg-cyan-500/10 border-cyan-500/30 text-cyan-400",
  [ALERT_VARIANT.SUCCESS]: "bg-emerald-500/10 border-emerald-500/30 text-emerald-400",
  [ALERT_VARIANT.WARNING]: "bg-amber-500/10 border-amber-500/30 text-amber-400",
  [ALERT_VARIANT.ERROR]: "bg-rose-500/10 border-rose-500/30 text-rose-400",
};

const VARIANT_ICONS: Record<AlertVariant, ReactNode> = {
  [ALERT_VARIANT.INFO]: <Info className="w-5 h-5" />,
  [ALERT_VARIANT.SUCCESS]: <CheckCircle2 className="w-5 h-5" />,
  [ALERT_VARIANT.WARNING]: <AlertTriangle className="w-5 h-5" />,
  [ALERT_VARIANT.ERROR]: <AlertCircle className="w-5 h-5" />,
};

// ============================================
// ALERT COMPONENT
// ============================================

interface AlertProps {
  variant?: AlertVariant;
  title?: string;
  children: ReactNode;
  onClose?: () => void;
  className?: string;
}

export function Alert({
  variant = ALERT_VARIANT.INFO,
  title,
  children,
  onClose,
  className,
}: AlertProps) {
  return (
    <div
      role="alert"
      className={cn(
        "flex gap-3 p-4 rounded-xl border",
        VARIANT_STYLES[variant],
        className
      )}
    >
      {/* Icon */}
      <div className="flex-shrink-0">{VARIANT_ICONS[variant]}</div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        {title && <p className="font-semibold mb-1">{title}</p>}
        <div className="text-sm opacity-90">{children}</div>
      </div>

      {/* Close button */}
      {onClose && (
        <button
          onClick={onClose}
          className="flex-shrink-0 p-1 rounded-lg hover:bg-white/10 transition-colors focus:outline-none focus:ring-2 focus:ring-white/20"
          aria-label="Cerrar alerta"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}

export { ALERT_VARIANT };
