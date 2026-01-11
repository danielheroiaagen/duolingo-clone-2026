import { Spinner } from "./Spinner";

// ============================================
// LOADING SCREEN - Full page loading state
// ============================================

interface LoadingScreenProps {
  message?: string;
}

export function LoadingScreen({ message = "Cargando..." }: LoadingScreenProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-zinc-950"
      role="status"
      aria-live="polite"
    >
      <div className="flex flex-col items-center gap-6">
        {/* Logo */}
        <h1 className="text-2xl font-black tracking-tighter neon-text-blue">
          LONGO <span className="font-light text-zinc-500">2026</span>
        </h1>

        {/* Spinner */}
        <Spinner size="lg" />

        {/* Message */}
        <p className="text-sm text-zinc-500 animate-pulse">{message}</p>
      </div>
    </div>
  );
}
