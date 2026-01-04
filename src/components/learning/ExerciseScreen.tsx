"use client";
import { useState } from "react";
import { X, Heart, CheckCircle2, AlertCircle } from "lucide-react";
import FuturisticButton from "../ui/FuturisticButton";

export default function ExerciseScreen({ onFinish }: { onFinish: (xp: number) => void }) {
  const exercises = [{ id: 1, question: "How do you say 'Hello' in Spanish?", options: ["Hola", "Adiós", "Gracias", "Por favor"], correctAnswer: "Hola" }, { id: 2, question: "Which of these means 'Thank you'?", options: ["Hola", "Gracias", "De nada", "Perdón"], correctAnswer: "Gracias" }];
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isChecked, setIsChecked] = useState(false);
  const [hearts, setHearts] = useState(5);
  const current = exercises[currentIdx];

  const handleCheck = () => {
    if (selectedOption !== current.correctAnswer) setHearts(h => Math.max(0, h - 1));
    setIsChecked(true);
  };

  const handleNext = () => {
    if (currentIdx < exercises.length - 1) { setCurrentIdx(currentIdx + 1); setSelectedOption(null); setIsChecked(false); }
    else { onFinish(20); }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-zinc-950 flex flex-col">
      <div className="max-w-4xl mx-auto w-full p-6 flex items-center gap-6">
        <button onClick={() => window.location.reload()} className="text-zinc-500 hover:text-white"><X size={28} /></button>
        <div className="flex-1 h-3 bg-zinc-900 rounded-full border border-white/5 overflow-hidden"><div className="h-full bg-cyan-500 transition-all duration-500" style={{ width: `${(currentIdx / exercises.length) * 100}%` }} /></div>
        <div className="flex items-center gap-2 text-rose-500 font-bold"><Heart size={24} fill="currentColor" /><span>{hearts}</span></div>
      </div>
      <div className="flex-1 max-w-2xl mx-auto w-full px-6 flex flex-col justify-center gap-12 text-center">
        <h2 className="text-zinc-500 text-xs font-black uppercase tracking-[0.3em]">Translation</h2>
        <h1 className="text-4xl font-bold text-white">{current.question}</h1>
        <div className="grid grid-cols-1 gap-3">
          {current.options.map(opt => (
            <button key={opt} disabled={isChecked} onClick={() => setSelectedOption(opt)} className={`p-6 rounded-2xl text-left border-2 transition-all ${selectedOption === opt ? "border-cyan-500 bg-cyan-500/10 text-white" : "border-white/5 bg-white/5 text-zinc-400"} ${isChecked && opt === current.correctAnswer ? "border-emerald-500 bg-emerald-500/10 text-emerald-400" : ""} ${isChecked && selectedOption === opt && opt !== current.correctAnswer ? "border-rose-500 bg-rose-500/10 text-rose-400" : ""}`}>{opt}</button>
          ))}
        </div>
      </div>
      <div className={`p-8 border-t transition-all ${!isChecked ? "bg-zinc-950 border-white/5" : selectedOption === current.correctAnswer ? "bg-emerald-950/20 border-emerald-500/50" : "bg-rose-950/20 border-rose-500/50"}`}>
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">{isChecked && (
            <>{selectedOption === current.correctAnswer ? <CheckCircle2 className="text-emerald-400" size={40} /> : <AlertCircle className="text-rose-400" size={40} />}
            <div><h3 className={`font-black uppercase tracking-widest ${selectedOption === current.correctAnswer ? "text-emerald-400" : "text-rose-400"}`}>{selectedOption === current.correctAnswer ? "Excellent!" : "Correct Answer:"}</h3>{selectedOption !== current.correctAnswer && <p className="text-rose-300 font-bold">{current.correctAnswer}</p>}</div></>
          )}</div>
          <FuturisticButton disabled={!selectedOption} onClick={isChecked ? handleNext : handleCheck} variant={isChecked ? (selectedOption === current.correctAnswer ? "secondary" : "primary") : "primary"} className="px-12 h-14" glow>{isChecked ? "CONTINUE" : "CHECK"}</FuturisticButton>
        </div>
      </div>
    </div>
  );
}
