"use client";

import { Check, Lock, Play } from "lucide-react";

export default function LearningPath() {
  const modules = [
    { id: 1, title: "Fundamentos I", position: "center" as const, isCompleted: true },
    { id: 2, title: "Saludos", position: "right" as const, isCompleted: true },
    { id: 3, title: "Viajes", position: "center" as const, isLocked: false },
    { id: 4, title: "Restaurantes", position: "left" as const, isLocked: true },
    { id: 5, title: "Familia", position: "center" as const, isLocked: true },
  ];

  return (
    <div className="flex flex-col items-center gap-12 py-32 max-w-xl mx-auto">
      {modules.map((mod) => (
        <div key={mod.id} className="flex flex-col items-center gap-4" style={{ transform: mod.position === "left" ? "translateX(-60px)" : mod.position === "right" ? "translateX(60px)" : "none" }}>
          <ModuleNode isCompleted={mod.isCompleted} isLocked={mod.isLocked} />
          <h3 className={`text-sm font-bold uppercase tracking-widest ${mod.isLocked ? "text-zinc-700" : "text-zinc-400"}`}>{mod.title}</h3>
        </div>
      ))}
    </div>
  );
}

function ModuleNode({ isCompleted, isLocked }: { isCompleted?: boolean, isLocked?: boolean }) {
  if (isLocked) return <div className="w-16 h-16 rounded-3xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-700"><Lock size={24} /></div>;
  return (
    <div className="relative group">
      <div className={`absolute inset-[-4px] rounded-[2rem] blur-xl opacity-0 group-hover:opacity-40 transition-opacity duration-500 ${isCompleted ? 'bg-emerald-500' : 'bg-cyan-500'}`} />
      <button className={`relative w-20 h-20 rounded-[2rem] flex items-center justify-center transition-all duration-300 transform group-hover:-translate-y-1 group-active:scale-95 ${isCompleted ? "bg-emerald-500/20 border-2 border-emerald-500 text-emerald-400" : "glass-morphism border-2 border-cyan-500/50 text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.2)]"}`}>
        {isCompleted ? <Check size={32} strokeWidth={3} /> : <Play size={32} fill="currentColor" />}
      </button>
      <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-zinc-900 border-2 border-zinc-800 flex items-center justify-center"><span className="text-[10px] font-black">{isCompleted ? "5/5" : "1/5"}</span></div>
    </div>
  );
}
