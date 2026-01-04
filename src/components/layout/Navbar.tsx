"use client";

import Link from "next/link";
import { Flame, Star, Heart, User, LayoutDashboard, Compass, Trophy } from "lucide-react";
import FuturisticButton from "../ui/FuturisticButton";

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 p-4">
      <div className="max-w-7xl mx-auto glass-morphism rounded-2xl px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="/" className="text-xl font-black tracking-tighter neon-text-blue">
            LONGO <span className="font-light text-zinc-500">2026</span>
          </Link>
          <div className="hidden md:flex items-center gap-1">
            <NavLink href="/learn" icon={<LayoutDashboard size={18} />} label="Aprender" active />
            <NavLink href="/explore" icon={<Compass size={18} />} label="Explorar" />
            <NavLink href="/quests" icon={<Trophy size={18} />} label="Misiones" />
          </div>
        </div>
        <div className="flex items-center gap-6">
          <div className="hidden sm:flex items-center gap-4">
            <Stat icon={<Flame size={20} className="text-orange-500" />} value="0" />
            <Stat icon={<Star size={20} className="text-yellow-400" />} value="120" />
            <Stat icon={<Heart size={20} className="text-rose-500" />} value="5" />
          </div>
          <div className="h-8 w-px bg-white/10 mx-2 hidden sm:block" />
          <FuturisticButton variant="ghost" className="p-2 px-3 rounded-xl border-none">
            <User size={20} />
          </FuturisticButton>
        </div>
      </div>
    </nav>
  );
}

function NavLink({ href, icon, label, active = false }: { href: string, icon: React.ReactNode, label: string, active?: boolean }) {
  return (
    <Link href={href} className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-300 ${active ? "bg-cyan-500/10 text-cyan-400 font-medium" : "text-zinc-500 hover:text-white hover:bg-white/5"}`}>
      {icon}
      <span className="text-sm uppercase tracking-widest font-bold">{label}</span>
    </Link>
  );
}

function Stat({ icon, value }: { icon: React.ReactNode, value: string }) {
  return (
    <div className="flex items-center gap-2 group cursor-default">
      <div className="transition-transform duration-300 group-hover:scale-110">{icon}</div>
      <span className="font-mono font-bold text-white">{value}</span>
    </div>
  );
}
