"use client";

import { useEffect } from "react";
import { X, Heart, CheckCircle2, AlertCircle } from "lucide-react";
import { useShallow } from "zustand/react/shallow";
import FuturisticButton from "../ui/FuturisticButton";
import { cn } from "@/lib/utils";
import {
  useExerciseStore,
  useUserStore,
  selectCurrentExercise,
  selectProgress,
  selectIsCompleted,
} from "@/stores";
import { EXERCISE_STATUS, BUTTON_VARIANT, type Exercise } from "@/types";

// ============================================
// SAMPLE EXERCISES - Would come from API/DB
// ============================================

const SAMPLE_EXERCISES: Exercise[] = [
  {
    id: 1,
    question: "How do you say 'Hello' in Spanish?",
    options: ["Hola", "Adiós", "Gracias", "Por favor"],
    correctAnswer: "Hola",
  },
  {
    id: 2,
    question: "Which of these means 'Thank you'?",
    options: ["Hola", "Gracias", "De nada", "Perdón"],
    correctAnswer: "Gracias",
  },
];

// ============================================
// PROPS INTERFACE
// ============================================

interface ExerciseScreenProps {
  onFinish: (xp: number) => void;
}

// ============================================
// COMPONENT
// ============================================

export default function ExerciseScreen({ onFinish }: ExerciseScreenProps) {
  // Exercise store
  const { selectedOption, status, setExercises, selectOption, checkAnswer, nextExercise, reset } =
    useExerciseStore(
      useShallow((state) => ({
        selectedOption: state.selectedOption,
        status: state.status,
        setExercises: state.setExercises,
        selectOption: state.selectOption,
        checkAnswer: state.checkAnswer,
        nextExercise: state.nextExercise,
        reset: state.reset,
      }))
    );

  const currentExercise = useExerciseStore(selectCurrentExercise);
  const progress = useExerciseStore(selectProgress);
  const isCompleted = useExerciseStore(selectIsCompleted);

  // User store
  const { hearts, loseHeart, addXp } = useUserStore(
    useShallow((state) => ({
      hearts: state.hearts,
      loseHeart: state.loseHeart,
      addXp: state.addXp,
    }))
  );

  // Initialize exercises on mount
  useEffect(() => {
    setExercises(SAMPLE_EXERCISES);
    return () => reset();
  }, [setExercises, reset]);

  // Handle completion
  useEffect(() => {
    if (isCompleted) {
      addXp(20);
      onFinish(20);
    }
  }, [isCompleted, addXp, onFinish]);

  const isChecked = status === EXERCISE_STATUS.CORRECT || status === EXERCISE_STATUS.INCORRECT;
  const isCorrect = status === EXERCISE_STATUS.CORRECT;

  const handleCheck = () => {
    const correct = checkAnswer();
    if (!correct) {
      loseHeart();
    }
  };

  const handleNext = () => {
    nextExercise();
  };

  const handleClose = () => {
    reset();
    window.location.reload();
  };

  if (!currentExercise) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-zinc-950 flex flex-col">
      {/* Header */}
      <div className="max-w-4xl mx-auto w-full p-6 flex items-center gap-6">
        <button
          onClick={handleClose}
          className="text-zinc-500 hover:text-white transition-colors"
        >
          <X size={28} />
        </button>

        {/* Progress Bar */}
        <div className="flex-1 h-3 bg-zinc-900 rounded-full border border-white/5 overflow-hidden">
          <div
            className="h-full bg-cyan-500 transition-all duration-500"
            style={{ width: `${progress.percentage}%` }}
          />
        </div>

        {/* Hearts */}
        <div className="flex items-center gap-2 text-rose-500 font-bold">
          <Heart size={24} fill="currentColor" />
          <span>{hearts}</span>
        </div>
      </div>

      {/* Question Area */}
      <div className="flex-1 max-w-2xl mx-auto w-full px-6 flex flex-col justify-center gap-12 text-center">
        <h2 className="text-zinc-500 text-xs font-black uppercase tracking-[0.3em]">
          Translation
        </h2>
        <h1 className="text-4xl font-bold text-white">
          {currentExercise.question}
        </h1>

        {/* Options */}
        <div className="grid grid-cols-1 gap-3">
          {currentExercise.options.map((option) => (
            <OptionButton
              key={option}
              option={option}
              isSelected={selectedOption === option}
              isChecked={isChecked}
              isCorrectAnswer={option === currentExercise.correctAnswer}
              onClick={() => selectOption(option)}
            />
          ))}
        </div>
      </div>

      {/* Footer */}
      <div
        className={cn(
          "p-8 border-t transition-all",
          !isChecked && "bg-zinc-950 border-white/5",
          isChecked && isCorrect && "bg-emerald-950/20 border-emerald-500/50",
          isChecked && !isCorrect && "bg-rose-950/20 border-rose-500/50"
        )}
      >
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          {/* Feedback */}
          <div className="flex items-center gap-4">
            {isChecked && (
              <>
                {isCorrect ? (
                  <CheckCircle2 className="text-emerald-400" size={40} />
                ) : (
                  <AlertCircle className="text-rose-400" size={40} />
                )}
                <div>
                  <h3
                    className={cn(
                      "font-black uppercase tracking-widest",
                      isCorrect ? "text-emerald-400" : "text-rose-400"
                    )}
                  >
                    {isCorrect ? "Excellent!" : "Correct Answer:"}
                  </h3>
                  {!isCorrect && (
                    <p className="text-rose-300 font-bold">
                      {currentExercise.correctAnswer}
                    </p>
                  )}
                </div>
              </>
            )}
          </div>

          {/* Action Button */}
          <FuturisticButton
            disabled={!selectedOption}
            onClick={isChecked ? handleNext : handleCheck}
            variant={
              isChecked
                ? isCorrect
                  ? BUTTON_VARIANT.SECONDARY
                  : BUTTON_VARIANT.PRIMARY
                : BUTTON_VARIANT.PRIMARY
            }
            className="px-12 h-14"
            glow
          >
            {isChecked ? "CONTINUE" : "CHECK"}
          </FuturisticButton>
        </div>
      </div>
    </div>
  );
}

// ============================================
// OPTION BUTTON SUB-COMPONENT
// ============================================

interface OptionButtonProps {
  option: string;
  isSelected: boolean;
  isChecked: boolean;
  isCorrectAnswer: boolean;
  onClick: () => void;
}

function OptionButton({
  option,
  isSelected,
  isChecked,
  isCorrectAnswer,
  onClick,
}: OptionButtonProps) {
  const getStyles = () => {
    if (isChecked && isCorrectAnswer) {
      return "border-emerald-500 bg-emerald-500/10 text-emerald-400";
    }
    if (isChecked && isSelected && !isCorrectAnswer) {
      return "border-rose-500 bg-rose-500/10 text-rose-400";
    }
    if (isSelected) {
      return "border-cyan-500 bg-cyan-500/10 text-white";
    }
    return "border-white/5 bg-white/5 text-zinc-400";
  };

  return (
    <button
      disabled={isChecked}
      onClick={onClick}
      className={cn(
        "p-6 rounded-2xl text-left border-2 transition-all",
        "disabled:cursor-not-allowed",
        getStyles()
      )}
    >
      {option}
    </button>
  );
}
