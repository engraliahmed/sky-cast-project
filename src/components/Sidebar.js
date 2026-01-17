import { LayoutDashboard, CloudRain, Settings } from "lucide-react";
import Link from "next/link";

export default function Sidebar() {
    return (
        <>
            {/* Desktop Sidebar - Hidden on Mobile */}
            <aside className="hidden md:flex w-64 h-screen border-r border-white/10 flex-col p-6 bg-black/40 sticky top-0">
                <div className="mb-12 font-bold text-blue-500 text-2xl tracking-tighter">
                    SKYCAST
                </div>
                <nav className="flex flex-col gap-6">
                    <Link
                        href="/"
                        className="flex items-center gap-4 text-slate-400 hover:text-white p-3 rounded-xl hover:bg-white/5 transition-all"
                    >
                        <LayoutDashboard size={22} />
                        <span className="font-medium">Dashboard</span>
                    </Link>
                    <Link
                        href="/forecast"
                        className="flex items-center gap-4 text-slate-400 hover:text-white p-3 rounded-xl hover:bg-white/5 transition-all"
                    >
                        <CloudRain size={22} />
                        <span className="font-medium">Forecast</span>
                    </Link>
                    <Link
                        href="/settings"
                        className="flex items-center gap-4 text-slate-400 hover:text-white p-3 rounded-xl hover:bg-white/5 transition-all"
                    >
                        <Settings size={22} />
                        <span className="font-medium">Settings</span>
                    </Link>
                </nav>
            </aside>

            {/* Mobile Bottom Navigation - Visible only on Mobile */}
            <nav className="md:hidden fixed bottom-0 left-0 w-full bg-black/90 backdrop-blur-lg border-t border-white/10 flex justify-around items-center p-4 z-50">
                <Link href="/" className="flex flex-col items-center gap-1 text-slate-400 hover:text-blue-500 transition-all">
                    <LayoutDashboard size={24} />
                    <span className="text-[10px] font-medium">Home</span>
                </Link>
                <Link href="/forecast" className="flex flex-col items-center gap-1 text-slate-400 hover:text-blue-500 transition-all">
                    <CloudRain size={24} />
                    <span className="text-[10px] font-medium">Forecast</span>
                </Link>
                <Link href="/settings" className="flex flex-col items-center gap-1 text-slate-400 hover:text-blue-500 transition-all">
                    <Settings size={24} />
                    <span className="text-[10px] font-medium">Settings</span>
                </Link>
            </nav>
        </>
    );
}