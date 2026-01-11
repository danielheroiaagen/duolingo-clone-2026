"use client";

import { useRef } from "react";
import { useVoiceStore, selectIsRecording } from "@/stores";
import { VOICE_STATUS } from "@/types";

// ============================================
// VOICE RECORDER HOOK - Separates recording logic
// ============================================

export function useVoiceRecorder() {
  const { status, setStatus, setTranscript, setAiReply, setError, reset } =
    useVoiceStore();
  const isRecording = useVoiceStore(selectIsRecording);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const startRecording = async () => {
    reset();
    setStatus(VOICE_STATUS.LISTENING);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: "audio/webm;codecs=opus",
      });

      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(chunksRef.current, { type: "audio/webm" });

        if (audioBlob.size < 100) {
          setError("Audio demasiado corto");
          return;
        }

        await processAudio(audioBlob);
      };

      mediaRecorder.start(1000);
    } catch {
      setError("Error accediendo al micrófono");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach((t) => t.stop());
      setStatus(VOICE_STATUS.PROCESSING);
    }
  };

  const processAudio = async (blob: Blob) => {
    try {
      // Step 1: Transcribe
      setStatus(VOICE_STATUS.TRANSCRIBING);
      const formData = new FormData();
      formData.append("file", blob, "audio.webm");
      formData.append("model", "whisper-1");

      const sttResponse = await fetch("/api/ai/transcribe", {
        method: "POST",
        body: formData,
      });
      const { text } = await sttResponse.json();

      if (!text) {
        setError("No se pudo transcribir el audio");
        return;
      }

      setTranscript(text);

      // Step 2: Get AI response
      setStatus(VOICE_STATUS.REASONING);
      const chatResponse = await fetch("/api/ai/chat", {
        method: "POST",
        body: JSON.stringify({ message: text }),
      });
      const { reply } = await chatResponse.json();
      setAiReply(reply);

      // Step 3: Text to speech
      setStatus(VOICE_STATUS.SPEAKING);
      await speakText(reply);

      setStatus(VOICE_STATUS.IDLE);
    } catch {
      setError("Error procesando el audio");
    }
  };

  const speakText = async (text: string) => {
    try {
      const response = await fetch("/api/ai/speech", {
        method: "POST",
        body: JSON.stringify({ text }),
      });
      const url = URL.createObjectURL(await response.blob());

      if (audioRef.current) {
        audioRef.current.src = url;
        await audioRef.current.play();
      }
    } catch {
      // Silent fail for TTS
    }
  };

  return {
    isRecording,
    status,
    audioRef,
    startRecording,
    stopRecording,
  };
}
