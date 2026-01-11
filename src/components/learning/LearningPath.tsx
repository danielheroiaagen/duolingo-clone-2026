"use client";

import { Check, Lock, Play } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  MODULE_STATUS,
  MODULE_POSITION,
  type Module,
  type ModuleStatus,
} from "@/types";

// ============================================
// SAMPLE MODULES - Would come from API/DB
// ============================================

const SAMPLE_MODULES: Module[] = [
  {
    id: 1,
    title: "Fundamentos I",
    position: MODULE_POSITION.CENTER,
    status: MODULE_STATUS.COMPLETED,
    progress: 5,
    total: 5,
  },
  {
    id: 2,
    title: "Saludos",
    position: MODULE_POSITION.RIGHT,
    status: MODULE_STATUS.COMPLETED,
    progress: 5,
    total: 5,
  },
  {
    id: 3,
    title: "Viajes",
    position: MODULE_POSITION.CENTER,
    status: MODULE_STATUS.AVAILABLE,
    progress: 1,
    total: 5,
  },
  {
    id: 4,
    title: "Restaurantes",
    position: MODULE_POSITION.LEFT,
    status: MODULE_STATUS.LOCKED,
    progress: 0,
    total: 5,
  },
  {
    id: 5,
    title: "Familia",
    position: MODULE_POSITION.CENTER,
    status: MODULE_STATUS.LOCKED,
    progress: 0,
    total: 5,
  },
];

// ============================================
// POSITION TRANSFORMS
// ============================================

const POSITION_TRANSFORMS = {
  [MODULE_POSITION.LEFT]: "translateX(-60px)",
  [MODULE_POSITION.CENTER]: "none",
  [MODULE_POSITION.RIGHT]: "translateX(60px)",
} as const;

// ============================================
// COMPONENT
// ============================================

export default function LearningPath() {
  return (
    <div className="flex flex-col items-center gap-12 py-32 max-w-xl mx-auto">
      {SAMPLE_MODULES.map((module) => (
        <div
          key={module.id}
          className="flex flex-col items-center gap-4"
          style={{ transform: POSITION_TRANSFORMS[module.position] }}
        >
          <ModuleNode
            status={module.status}
            progress={module.progress}
            total={module.total}
          />
          <h3
            className={cn(
              "text-sm font-bold uppercase tracking-widest",
              module.status === MODULE_STATUS.LOCKED
                ? "text-zinc-700"
                : "text-zinc-400"
            )}
          >
            {module.title}
          </h3>
        </div>
      ))}
    </div>
  );
}

// ============================================
// MODULE NODE SUB-COMPONENT
// ============================================

interface ModuleNodeProps {
  status: ModuleStatus;
  progress: number;
  total: number;
}

function ModuleNode({ status, progress, total }: ModuleNodeProps) {
  const isCompleted = status === MODULE_STATUS.COMPLETED;
  const isLocked = status === MODULE_STATUS.LOCKED;

  if (isLocked) {
    return (
      <div className="w-16 h-16 rounded-3xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-700">
        <Lock size={24} />
      </div>
    );
  }

  return (
    <div className="relative group">
      {/* Glow effect */}
      <div
        className={cn(
          "absolute inset-[-4px] rounded-[2rem] blur-xl opacity-0 group-hover:opacity-40 transition-opacity duration-500",
          isCompleted ? "bg-emerald-500" : "bg-cyan-500"
        )}
      />

      {/* Button */}
      <button
        className={cn(
          "relative w-20 h-20 rounded-[2rem] flex items-center justify-center transition-all duration-300 transform group-hover:-translate-y-1 group-active:scale-95",
          isCompleted
            ? "bg-emerald-500/20 border-2 border-emerald-500 text-emerald-400"
            : "glass-morphism border-2 border-cyan-500/50 text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.2)]"
        )}
      >
        {isCompleted ? (
          <Check size={32} strokeWidth={3} />
        ) : (
          <Play size={32} fill="currentColor" />
        )}
      </button>

      {/* Progress badge */}
      <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-zinc-900 border-2 border-zinc-800 flex items-center justify-center">
        <span className="text-[10px] font-black">
          {progress}/{total}
        </span>
      </div>
    </div>
  );
}
