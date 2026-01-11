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
      setError("Error accediendo al micr\u00f3fono");
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
      // Step 1: Transcribe (FormData doesn't need Content-Type header)
      setStatus(VOICE_STATUS.TRANSCRIBING);
      const formData = new FormData();
      formData.append("file", blob, "audio.webm");

      const sttResponse = await fetch("/api/ai/transcribe", {
        method: "POST",
        body: formData,
      });

      if (!sttResponse.ok) {
        const errorData = await sttResponse.json().catch(() => ({}));
        throw new Error(errorData.message || "Transcription failed");
      }

      const { text } = await sttResponse.json();

      if (!text) {
        setError("No se pudo transcribir el audio");
        return;
      }

      setTranscript(text);

      // Step 2: Get AI response (JSON needs Content-Type header)
      setStatus(VOICE_STATUS.REASONING);
      const chatResponse = await fetch("/api/ai/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: text }),
      });

      if (!chatResponse.ok) {
        const errorData = await chatResponse.json().catch(() => ({}));
        throw new Error(errorData.message || "Chat failed");
      }

      const { reply } = await chatResponse.json();
      setAiReply(reply);

      // Step 3: Text to speech (JSON needs Content-Type header)
      setStatus(VOICE_STATUS.SPEAKING);
      await speakText(reply);

      setStatus(VOICE_STATUS.IDLE);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Error procesando el audio";
      setError(message);
      setStatus(VOICE_STATUS.IDLE);
    }
  };

  const speakText = async (text: string) => {
    try {
      const response = await fetch("/api/ai/speech", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) {
        console.error("[Speech] TTS failed:", response.status);
        return;
      }

      const audioBlob = await response.blob();
      const url = URL.createObjectURL(audioBlob);

      if (audioRef.current) {
        audioRef.current.src = url;
        await audioRef.current.play();

        // Cleanup URL after playing
        audioRef.current.onended = () => {
          URL.revokeObjectURL(url);
        };
      }
    } catch (error) {
      console.error("[Speech] TTS error:", error);
      // Silent fail for TTS - don't break the flow
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
