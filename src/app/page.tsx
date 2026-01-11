import { Navbar, MobileNav, MobileAIButton } from "@/components/layout";
import LearningPath from "@/components/learning/LearningPath";
import FuturisticButton from "@/components/ui/FuturisticButton";
import AIVoiceAssistant from "@/components/learning/AIVoiceAssistant";
import { Sparkles, ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <div className="relative min-h-screen">
      <Navbar />
      
      {/* Main Content - Responsive padding for mobile nav */}
      <main className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[1fr_350px] gap-6 lg:gap-8 pt-24 sm:pt-28 lg:pt-32 pb-24 lg:pb-8 container-padding">
        {/* Learning Section */}
        <section className="relative">
          <div className="flex flex-col items-center mb-8 sm:mb-12 text-center">
            <h2 className="text-zinc-500 text-xs sm:text-sm font-black uppercase tracking-[0.2em] sm:tracking-[0.3em] mb-2">
              Sección 1
            </h2>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white">
              Introducción al Futuro
            </h1>
          </div>
          <LearningPath />
        </section>

        {/* Sidebar - Desktop only */}
        <aside className="hidden lg:block space-y-6">
          <AIVoiceAssistant />
          <div className="glass-morphism p-6 rounded-3xl border-cyan-500/20 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <Sparkles size={64} className="text-cyan-400" />
            </div>
            <h3 className="text-sm font-bold text-cyan-400 uppercase tracking-widest mb-4 flex items-center gap-2">
              <Sparkles size={16} /> Recomendado
            </h3>
            <p className="text-white font-medium mb-6">
              Tu racha está en peligro. Completa la lección de "Saludos" para
              mantener el impulso.
            </p>
            <FuturisticButton variant="primary" className="w-full" glow>
              CONTINUAR <ArrowRight size={18} />
            </FuturisticButton>
          </div>
        </aside>
      </main>

      {/* Mobile Navigation */}
      <MobileNav />
      
      {/* Mobile AI Button */}
      <MobileAIButton />

      {/* Background Effects */}
      <div className="fixed inset-0 -z-50 overflow-hidden pointer-events-none">
        <div className="absolute top-[20%] left-[10%] w-[300px] sm:w-[400px] lg:w-[500px] h-[300px] sm:h-[400px] lg:h-[500px] bg-cyan-500/5 rounded-full blur-[100px] sm:blur-[130px] lg:blur-[150px]" />
        <div className="absolute bottom-[10%] right-[5%] w-[250px] sm:w-[300px] lg:w-[400px] h-[250px] sm:h-[300px] lg:h-[400px] bg-emerald-500/5 rounded-full blur-[80px] sm:blur-[100px] lg:blur-[130px]" />
      </div>
    </div>
  );
}
