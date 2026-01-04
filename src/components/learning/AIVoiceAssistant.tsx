"use client";
import { useState, useRef } from "react";
import { Mic, Square, Volume2, Loader2, MessageSquare, AlertTriangle } from "lucide-react";
import FuturisticButton from "../ui/FuturisticButton";

export default function AIVoiceAssistant() {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [status, setStatus] = useState("");
  const [lastTranscript, setLastTranscript] = useState("");
  const [aiReply, setAiReply] = useState("");
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const startRecording = async () => {
    setAiReply(""); setLastTranscript(""); setStatus("Iniciando...");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream, { mimeType: 'audio/webm;codecs=opus' });
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];
      mediaRecorder.ondataavailable = (e) => { if (e.data.size > 0) chunksRef.current.push(e.data); };
      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(chunksRef.current, { type: 'audio/webm' });
        if (audioBlob.size < 100) { setStatus("Muy corto"); setIsProcessing(false); return; }
        processAudio(audioBlob);
      };
      mediaRecorder.start(1000); setIsRecording(true); setStatus("Escuchando...");
    } catch (err) { setStatus("Error micro"); }
  };

  const stopRecording = () => { if (mediaRecorderRef.current && isRecording) { mediaRecorderRef.current.stop(); setIsRecording(false); mediaRecorderRef.current.stream.getTracks().forEach(t => t.stop()); } };

  const processAudio = async (blob: Blob) => {
    setIsProcessing(true);
    try {
      setStatus("Whisper...");
      const fd = new FormData(); fd.append('file', blob, 'audio.webm'); fd.append('model', 'whisper-1');
      const stt = await fetch("/api/ai/transcribe", { method: "POST", body: fd });
      const { text } = await stt.json();
      if (!text) { setStatus("Vacio"); setIsProcessing(false); return; }
      setLastTranscript(text);
      setStatus("Razonando (o1)...");
      const chat = await fetch("/api/ai/chat", { method: "POST", body: JSON.stringify({ message: text }) });
      const { reply } = await chat.json();
      setAiReply(reply);
      setStatus("Voz...");
      await speakText(reply);
      setStatus("");
    } catch (e) { setStatus("Error"); } finally { setIsProcessing(false); }
  };

  const speakText = async (text: string) => {
    try {
      const res = await fetch("/api/ai/speech", { method: "POST", body: JSON.stringify({ text }) });
      const url = URL.createObjectURL(await res.blob());
      if (audioRef.current) { audioRef.current.src = url; audioRef.current.play(); }
    } catch (e) {}
  };

  return (
    <div className="glass-morphism p-6 rounded-3xl space-y-4 border-cyan-500/10">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-bold text-zinc-500 uppercase flex items-center gap-2"><MessageSquare size={16} /> AI Tutor</h3>
        {isRecording && <div className="flex items-center gap-2 font-bold animate-pulse text-red-500 text-[10px]">RECORDING</div>}
      </div>
      <div className="bg-black/20 rounded-2xl p-4 min-h-[120px] flex flex-col justify-center text-center relative overflow-hidden">
        {isProcessing && <div className="absolute inset-0 bg-black/60 backdrop-blur-md flex flex-col items-center justify-center z-10 gap-2"><Loader2 className="animate-spin text-cyan-400" /><span className="text-[10px] text-cyan-400 animate-pulse">{status}</span></div>}
        {lastTranscript && <p className="text-[10px] text-zinc-500 border-b border-white/5 pb-2 italic">"{lastTranscript}"</p>}
        <p className="text-sm text-zinc-200">{aiReply || (isRecording ? "Habla..." : "Pulsa para hablar")}</p>
      </div>
      <FuturisticButton onClick={isRecording ? stopRecording : startRecording} variant={isRecording ? "secondary" : "primary"} className="w-full h-16" glow={isRecording}>{isRecording ? <Square size={20} /> : <Mic size={20} />} <span className="ml-2">{isRecording ? "STOP" : "HABLAR"}</span></FuturisticButton>
      <audio ref={audioRef} className="hidden" />
    </div>
  );
}
