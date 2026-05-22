"use client";
import { LayoutDashboard, CloudRain, Settings, CloudLightning } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Sidebar() {
    const pathname = usePathname();

    const isActive = (path) => {
        if (path === "/") {
            return pathname === "/";
        }
        return pathname.startsWith(path);
    };

    const linkClasses = (path) => {
        const base = "flex items-center gap-4 p-3.5 rounded-2xl transition-all duration-200 ";
        if (isActive(path)) {
            return base + "bg-blue-50 text-blue-600 font-semibold shadow-sm shadow-blue-500/5";
        }
        return base + "text-slate-500 hover:text-slate-800 hover:bg-slate-100/70";
    };

    const mobileLinkClasses = (path) => {
        const base = "flex flex-col items-center gap-1 transition-all duration-200 ";
        if (isActive(path)) {
            return base + "text-blue-600 scale-105 font-semibold";
        }
        return base + "text-slate-400 hover:text-slate-700";
    };

    return (
        <>
            {/* Desktop Sidebar - Hidden on Mobile */}
            <aside className="hidden md:flex w-64 h-screen border-r border-slate-200/80 flex-col p-6 bg-white/70 backdrop-blur-xl sticky top-0">
                <div className="mb-12 flex items-center gap-3">
                    <div className="p-2 bg-blue-600 text-white rounded-xl shadow-md shadow-blue-500/25">
                        <CloudLightning size={22} className="animate-pulse" />
                    </div>
                    <div className="font-extrabold text-slate-900 text-2xl tracking-tighter bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                        SKYCAST
                    </div>
                </div>
                <nav className="flex flex-col gap-3">
                    <Link href="/" className={linkClasses("/")}>
                        <LayoutDashboard size={20} />
                        <span className="text-sm">Dashboard</span>
                    </Link>
                    <Link href="/forecast" className={linkClasses("/forecast")}>
                        <CloudRain size={20} />
                        <span className="text-sm">Forecast</span>
                    </Link>
                    <Link href="/settings" className={linkClasses("/settings")}>
                        <Settings size={20} />
                        <span className="text-sm">Settings</span>
                    </Link>
                </nav>
                <div className="mt-auto p-4 bg-slate-50 border border-slate-100 rounded-2xl flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xs">
                        OP
                    </div>
                    <div className="text-left overflow-hidden">
                        <p className="text-xs font-semibold text-slate-700 truncate leading-none mb-1">Operator Console</p>
                        <span className="text-[10px] text-slate-400 leading-none">v2.0.0 Pro</span>
                    </div>
                </div>
            </aside>

            {/* Mobile Bottom Navigation - Visible only on Mobile */}
            <nav className="md:hidden fixed bottom-0 left-0 w-full bg-white/95 backdrop-blur-lg border-t border-slate-200/80 flex justify-around items-center p-3.5 z-50 shadow-[0_-8px_30px_rgb(0,0,0,0.04)]">
                <Link href="/" className={mobileLinkClasses("/")}>
                    <LayoutDashboard size={22} />
                    <span className="text-[10px] font-semibold">Home</span>
                </Link>
                <Link href="/forecast" className={mobileLinkClasses("/forecast")}>
                    <CloudRain size={22} />
                    <span className="text-[10px] font-semibold">Forecast</span>
                </Link>
                <Link href="/settings" className={mobileLinkClasses("/settings")}>
                    <Settings size={22} />
                    <span className="text-[10px] font-semibold">Settings</span>
                </Link>
            </nav>
        </>
    );
}