"use client";

import { Mic, Square, Loader2, MessageSquare } from "lucide-react";
import { useShallow } from "zustand/react/shallow";
import FuturisticButton from "../ui/FuturisticButton";
import { useVoiceStore, selectIsProcessing, selectStatusLabel } from "@/stores";
import { useVoiceRecorder } from "@/hooks/use-voice-recorder";
import { BUTTON_VARIANT } from "@/types";

// ============================================
// AI VOICE ASSISTANT - Uses Zustand store
// ============================================

export default function AIVoiceAssistant() {
  // Store state with selectors to prevent re-renders
  const { transcript, aiReply } = useVoiceStore(
    useShallow((state) => ({
      transcript: state.transcript,
      aiReply: state.aiReply,
    }))
  );

  const isProcessing = useVoiceStore(selectIsProcessing);
  const statusLabel = useVoiceStore(selectStatusLabel);

  // Custom hook for recording logic
  const { isRecording, audioRef, startRecording, stopRecording } =
    useVoiceRecorder();

  const handleClick = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  const getDisplayText = () => {
    if (aiReply) return aiReply;
    if (isRecording) return "Habla...";
    return "Pulsa para hablar";
  };

  return (
    <div className="glass-morphism p-6 rounded-3xl space-y-4 border-cyan-500/10">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-bold text-zinc-500 uppercase flex items-center gap-2">
          <MessageSquare size={16} />
          AI Tutor
        </h3>
        {isRecording && (
          <div className="flex items-center gap-2 font-bold animate-pulse text-red-500 text-[10px]">
            RECORDING
          </div>
        )}
      </div>

      {/* Display Area */}
      <div className="bg-black/20 rounded-2xl p-4 min-h-[120px] flex flex-col justify-center text-center relative overflow-hidden">
        {/* Processing Overlay */}
        {isProcessing && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-md flex flex-col items-center justify-center z-10 gap-2">
            <Loader2 className="animate-spin text-cyan-400" />
            <span className="text-[10px] text-cyan-400 animate-pulse">
              {statusLabel}
            </span>
          </div>
        )}

        {/* Transcript */}
        {transcript && (
          <p className="text-[10px] text-zinc-500 border-b border-white/5 pb-2 italic">
            &quot;{transcript}&quot;
          </p>
        )}

        {/* AI Reply or Placeholder */}
        <p className="text-sm text-zinc-200">{getDisplayText()}</p>
      </div>

      {/* Action Button */}
      <FuturisticButton
        onClick={handleClick}
        variant={isRecording ? BUTTON_VARIANT.SECONDARY : BUTTON_VARIANT.PRIMARY}
        className="w-full h-16"
        glow={isRecording}
      >
        {isRecording ? <Square size={20} /> : <Mic size={20} />}
        <span className="ml-2">{isRecording ? "STOP" : "HABLAR"}</span>
      </FuturisticButton>

      {/* Hidden Audio Element */}
      <audio ref={audioRef} className="hidden" />
    </div>
  );
}
