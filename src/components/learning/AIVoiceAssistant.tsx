"use client";
import { useState, useRef } from "react";
import { Mic, Square, Volume2, Loader2, MessageSquare } from "lucide-react";
import FuturisticButton from "../ui/FuturisticButton";

export default function AIVoiceAssistant() {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [lastTranscript, setLastTranscript] = useState("");
  const [aiReply, setAiReply] = useState("");
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];
      mediaRecorder.ondataavailable = (e) => { if (e.data.size > 0) chunksRef.current.push(e.data); };
      mediaRecorder.onstop = async () => { await processAudio(new Blob(chunksRef.current, { type: 'audio/webm' })); };
      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) { console.error(err); }
  };

  const stopRecording = () => { if (mediaRecorderRef.current && isRecording) { mediaRecorderRef.current.stop(); setIsRecording(false); mediaRecorderRef.current.stream.getTracks().forEach(t => t.stop()); } };

  const processAudio = async (blob: Blob) => {
    setIsProcessing(true);
    try {
      const formData = new FormData();
      formData.append('file', blob, 'audio.webm');
      formData.append('model', 'whisper-1');
      const sttRes = await fetch("/api/ai/transcribe", { method: "POST", body: formData });
      const { text } = await sttRes.json();
      setLastTranscript(text);
      const chatRes = await fetch("/api/ai/chat", { method: "POST", body: JSON.stringify({ message: text }) });
      const { reply } = await chatRes.json();
      setAiReply(reply);
      await speakText(reply);
    } catch (e) { console.error(e); } finally { setIsProcessing(false); }
  };

  const speakText = async (text: string) => {
    try {
      const response = await fetch("/api/ai/speech", { method: "POST", body: JSON.stringify({ text }) });
      const url = URL.createObjectURL(await response.blob());
      if (audioRef.current) { audioRef.current.src = url; audioRef.current.play(); }
    } catch (e) { console.error(e); }
  };

  return (
    <div className="glass-morphism p-6 rounded-3xl space-y-4 border-cyan-500/10">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-2"><MessageSquare size={16} /> AI Tutor</h3>
        {isRecording && <div className="flex items-center gap-2"><span className="text-[10px] text-red-500 font-bold animate-pulse">RECORDING</span><div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" /></div>}
      </div>
      <div className="bg-black/20 rounded-2xl p-4 min-h-[100px] flex flex-col justify-center gap-2 text-center relative overflow-hidden">
        {isProcessing && <div className="absolute inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-10"><Loader2 className="animate-spin text-cyan-400" size={24} /></div>}
        {lastTranscript && <p className="text-xs text-zinc-500 border-b border-white/5 pb-2">You: "{lastTranscript}"</p>}
        <p className="text-sm text-zinc-200 font-medium">{aiReply || "Practica tu inglés hablando ahora."}</p>
      </div>
      <div className="flex gap-3">
        <FuturisticButton onClick={isRecording ? stopRecording : startRecording} variant={isRecording ? "secondary" : "primary"} className="flex-1 h-14" glow={isRecording}>{isRecording ? <Square size={20} className="fill-current" /> : <Mic size={20} />}<span className="ml-2 text-xs font-black tracking-widest">{isRecording ? "PARAR" : "HABLAR"}</span></FuturisticButton>
        {aiReply && <FuturisticButton onClick={() => speakText(aiReply)} variant="outline" className="px-4 h-14"><Volume2 size={20} /></FuturisticButton>}
      </div>
      <audio ref={audioRef} className="hidden" />
    </div>
  );
}
