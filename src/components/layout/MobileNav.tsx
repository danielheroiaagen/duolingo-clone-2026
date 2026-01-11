"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Compass,
  Trophy,
  User,
  Flame,
} from "lucide-react";
import { useShallow } from "zustand/react/shallow";
import { cn } from "@/lib/utils";
import { useUserStore } from "@/stores";

// ============================================
// MOBILE BOTTOM NAVIGATION
// Only visible on mobile devices (lg:hidden)
// ============================================

const NAV_ITEMS = [
  { href: "/learn", icon: LayoutDashboard, label: "Aprender" },
  { href: "/explore", icon: Compass, label: "Explorar" },
  { href: "/quests", icon: Trophy, label: "Misiones" },
  { href: "/profile", icon: User, label: "Perfil" },
] as const;

export default function MobileNav() {
  const pathname = usePathname();
  const streak = useUserStore(useShallow((state) => state.streak));

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 lg:hidden safe-area-bottom">
      <div className="glass-morphism border-t border-white/5 px-2 py-2">
        <div className="flex items-center justify-around">
          {NAV_ITEMS.map(({ href, icon: Icon, label }) => {
            const isActive = pathname === href || pathname.startsWith(`${href}/`);
            
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all duration-300 min-w-[64px]",
                  isActive
                    ? "text-cyan-400 bg-cyan-500/10"
                    : "text-zinc-500 hover:text-zinc-300 active:bg-white/5"
                )}
              >
                <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                <span className="text-[10px] font-bold uppercase tracking-wider">
                  {label}
                </span>
              </Link>
            );
          })}
          
          {/* Streak indicator */}
          <div className="flex flex-col items-center gap-1 px-4 py-2 min-w-[64px]">
            <div className="relative">
              <Flame size={20} className="text-orange-500" />
              {streak > 0 && (
                <span className="absolute -top-1 -right-2 text-[8px] font-black text-orange-400">
                  {streak}
                </span>
              )}
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">
              Racha
            </span>
          </div>
        </div>
      </div>
    </nav>
  );
}
