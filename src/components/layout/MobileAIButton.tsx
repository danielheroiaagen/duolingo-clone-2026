"use client";

import { useState } from "react";
import { MessageSquare, X } from "lucide-react";
import { cn } from "@/lib/utils";
import AIVoiceAssistant from "@/components/learning/AIVoiceAssistant";

// ============================================
// MOBILE AI FLOATING BUTTON
// Shows AI assistant in a modal on mobile
// ============================================

export default function MobileAIButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Floating Action Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={cn(
          "fixed right-4 bottom-24 z-40 lg:hidden",
          "w-14 h-14 rounded-full",
          "bg-gradient-to-br from-cyan-500 to-cyan-600",
          "flex items-center justify-center",
          "shadow-lg shadow-cyan-500/25",
          "transition-all duration-300",
          "hover:scale-105 active:scale-95",
          "focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-zinc-950"
        )}
        aria-label="Abrir asistente AI"
      >
        <MessageSquare size={24} className="text-white" />
      </button>

      {/* Modal Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 lg:hidden"
          role="dialog"
          aria-modal="true"
          aria-labelledby="ai-modal-title"
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />

          {/* Modal Content */}
          <div className="absolute inset-x-4 bottom-4 top-auto max-h-[80vh] overflow-auto rounded-3xl bg-zinc-900 border border-white/10 safe-area-bottom">
            {/* Header */}
            <div className="sticky top-0 flex items-center justify-between p-4 border-b border-white/5 bg-zinc-900/95 backdrop-blur-sm">
              <h2 id="ai-modal-title" className="text-sm font-bold text-zinc-400 uppercase tracking-wider">
                AI Tutor
              </h2>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 rounded-xl text-zinc-500 hover:text-white hover:bg-white/5 transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-500"
                aria-label="Cerrar"
              >
                <X size={20} />
              </button>
            </div>

            {/* AI Assistant */}
            <div className="p-4">
              <AIVoiceAssistant />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
