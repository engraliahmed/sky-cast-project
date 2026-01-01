import { LayoutDashboard, CloudRain, Settings, Map } from "lucide-react";
import Link from "next/link";

export default function Sidebar() {
    return (
        <aside className="w-64 h-screen border-r border-white/10 flex flex-col p-6 bg-black/40 sticky top-0">
            <div className="mb-12 font-bold text-blue-500 text-2xl tracking-tighter">
                SKYCAST
            </div>
            <nav className="flex flex-col gap-6">
                <Link
                    href="/"
                    className="flex items-center gap-4 text-slate-400 hover:text-white p-3 rounded-xl hover:bg-white/5 transition-all"
                >
                    <LayoutDashboard size={22} />{" "}
                    <span className="font-medium">Dashboard</span>
                </Link>
                <Link
                    href="/forecast"
                    className="flex items-center gap-4 text-slate-400 hover:text-white p-3 rounded-xl hover:bg-white/5 transition-all"
                >
                    <CloudRain size={22} />{" "}
                    <span className="font-medium">Forecast</span>
                </Link>
                <Link
                    href="/settings"
                    className="flex items-center gap-4 text-slate-400 hover:text-white p-3 rounded-xl hover:bg-white/5 transition-all"
                >
                    <Settings size={22} />{" "}
                    <span className="font-medium">Settings</span>
                </Link>
            </nav>
        </aside>
    );
}
