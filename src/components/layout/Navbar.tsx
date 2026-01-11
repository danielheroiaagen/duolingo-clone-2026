"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import {
  Flame,
  Star,
  Heart,
  User,
  LayoutDashboard,
  Compass,
  Trophy,
} from "lucide-react";
import { useShallow } from "zustand/react/shallow";
import FuturisticButton from "../ui/FuturisticButton";
import { cn } from "@/lib/utils";
import { useUserStore } from "@/stores";
import { BUTTON_VARIANT } from "@/types";

// ============================================
// NAVBAR - Connected to Zustand store
// ============================================

export default function Navbar() {
  // Get user stats from store
  const { xp, hearts, streak } = useUserStore(
    useShallow((state) => ({
      xp: state.xp,
      hearts: state.hearts,
      streak: state.streak,
    }))
  );

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 p-4">
      <div className="max-w-7xl mx-auto glass-morphism rounded-2xl px-6 py-3 flex items-center justify-between">
        {/* Left side - Logo & Navigation */}
        <div className="flex items-center gap-8">
          <Link
            href="/"
            className="text-xl font-black tracking-tighter neon-text-blue"
          >
            LONGO <span className="font-light text-zinc-500">2026</span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            <NavLink
              href="/learn"
              icon={<LayoutDashboard size={18} />}
              label="Aprender"
              active
            />
            <NavLink
              href="/explore"
              icon={<Compass size={18} />}
              label="Explorar"
            />
            <NavLink
              href="/quests"
              icon={<Trophy size={18} />}
              label="Misiones"
            />
          </div>
        </div>

        {/* Right side - Stats & Profile */}
        <div className="flex items-center gap-6">
          <div className="hidden sm:flex items-center gap-4">
            <Stat
              icon={<Flame size={20} className="text-orange-500" />}
              value={streak}
            />
            <Stat
              icon={<Star size={20} className="text-yellow-400" />}
              value={xp}
            />
            <Stat
              icon={<Heart size={20} className="text-rose-500" />}
              value={hearts}
            />
          </div>

          <div className="h-8 w-px bg-white/10 mx-2 hidden sm:block" />

          <FuturisticButton
            variant={BUTTON_VARIANT.GHOST}
            className="p-2 px-3 rounded-xl border-none"
          >
            <User size={20} />
          </FuturisticButton>
        </div>
      </div>
    </nav>
  );
}

// ============================================
// NAV LINK SUB-COMPONENT
// ============================================

interface NavLinkProps {
  href: string;
  icon: ReactNode;
  label: string;
  active?: boolean;
}

function NavLink({ href, icon, label, active = false }: NavLinkProps) {
  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-300",
        active
          ? "bg-cyan-500/10 text-cyan-400 font-medium"
          : "text-zinc-500 hover:text-white hover:bg-white/5"
      )}
    >
      {icon}
      <span className="text-sm uppercase tracking-widest font-bold">
        {label}
      </span>
    </Link>
  );
}

// ============================================
// STAT SUB-COMPONENT
// ============================================

interface StatProps {
  icon: ReactNode;
  value: number;
}

function Stat({ icon, value }: StatProps) {
  return (
    <div className="flex items-center gap-2 group cursor-default">
      <div className="transition-transform duration-300 group-hover:scale-110">
        {icon}
      </div>
      <span className="font-mono font-bold text-white">{value}</span>
    </div>
  );
}
