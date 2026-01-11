import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

// ============================================
// SPINNER - Loading indicator
// ============================================

const SPINNER_SIZE = {
  SM: "sm",
  MD: "md",
  LG: "lg",
} as const;

type SpinnerSize = (typeof SPINNER_SIZE)[keyof typeof SPINNER_SIZE];

const SIZE_STYLES: Record<SpinnerSize, string> = {
  [SPINNER_SIZE.SM]: "w-4 h-4",
  [SPINNER_SIZE.MD]: "w-6 h-6",
  [SPINNER_SIZE.LG]: "w-10 h-10",
};

interface SpinnerProps {
  size?: SpinnerSize;
  className?: string;
  label?: string;
}

export function Spinner({
  size = SPINNER_SIZE.MD,
  className,
  label,
}: SpinnerProps) {
  return (
    <div className="flex flex-col items-center gap-2">
      <Loader2
        className={cn(
          "animate-spin text-cyan-400",
          SIZE_STYLES[size],
          className
        )}
        aria-hidden="true"
      />
      {label && (
        <span className="text-xs text-zinc-400 animate-pulse">{label}</span>
      )}
      <span className="sr-only">{label || "Loading..."}</span>
    </div>
  );
}

export { SPINNER_SIZE };
