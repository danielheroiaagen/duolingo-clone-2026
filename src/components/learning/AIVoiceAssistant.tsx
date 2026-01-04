"use client";
import { useState, useRef } from "react";
import { Mic, Square, Volume2, Loader2 } from "lucide-react";
import FuturisticButton from "../ui/FuturisticButton";

export default function AIVoiceAssistant() {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [lastTranscript, setLastTranscript] = useState("");
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setIsRecording(true);
      setTimeout(() => stopRecording(), 5000);
    } catch (err) { console.error(err); }
  };

  const stopRecording = () => {
    setIsRecording(false);
    setIsProcessing(true);
    setTimeout(() => {
      setLastTranscript("How do you say 'apple' in Spanish?");
      setIsProcessing(false);
      speakText("In Spanish, apple is 'manzana'. Excellent pronunciation!");
    }, 2000);
  };

  const speakText = async (text: string) => {
    setIsProcessing(true);
    try {
      const response = await fetch("/api/ai/speech", { method: "POST", body: JSON.stringify({ text }) });
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      if (audioRef.current) { audioRef.current.src = url; audioRef.current.play(); }
    } catch (err) { console.error(err); } finally { setIsProcessing(false); }
  };

  return (
    <div className="glass-morphism p-6 rounded-3xl space-y-4 border-cyan-500/10">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-bold text-zinc-500 uppercase tracking-widest">Asistente Vocal AI</h3>
        {isRecording && <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />}
      </div>
      <div className="bg-black/20 rounded-2xl p-4 min-h-[80px] flex items-center justify-center text-center">
        {isProcessing ? <Loader2 className="animate-spin text-cyan-400" /> : <p className="text-sm text-zinc-400 italic">{lastTranscript || "Pulsa el micro para practicar tu inglés"}</p>}
      </div>
      <div className="flex gap-3">
        <FuturisticButton onClick={isRecording ? stopRecording : startRecording} variant={isRecording ? "secondary" : "primary"} className="flex-1" glow={isRecording}>{isRecording ? <Square size={18} /> : <Mic size={18} />}{isRecording ? "DETENER" : "HABLAR"}</FuturisticButton>
        <FuturisticButton onClick={() => speakText(lastTranscript || "Hello, how can I help you today?")} variant="outline" className="px-4"><Volume2 size={18} /></FuturisticButton>
      </div>
      <audio ref={audioRef} className="hidden" />
    </div>
  );
}
