export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-6 relative overflow-hidden">
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-cyan-500/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-500/10 rounded-full blur-[120px]" />

      <div className="z-10 text-center space-y-8 max-w-2xl">
        <h1 className="text-6xl font-black tracking-tight neon-text-blue mb-4">
          IDIOMA 2026
        </h1>
        <p className="text-zinc-400 text-xl font-light leading-relaxed">
          El futuro del aprendizaje de idiomas. <br />
          Minimalismo futurista impulsado por <span className="text-emerald-400 font-medium">Antigravity AI</span>.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
          <button className="glass-morphism px-8 py-4 rounded-2xl font-bold text-lg hover:scale-105 transition-all duration-300 active:scale-95 neon-glow-blue border-cyan-500/50">
            EMPEZAR AHORA
          </button>
          <button className="glass-morphism px-8 py-4 rounded-2xl font-bold text-lg hover:bg-white/5 transition-all duration-300">
            YA TENGO CUENTA
          </button>
        </div>
      </div>
    </main>
  );
}
