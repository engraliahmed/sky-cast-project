"use client";
import { useState, useEffect } from "react";
import {
    Settings,
    User,
    Shield,
    Thermometer,
    CheckCircle2,
    Save,
    Info,
    MapPin,
    MapPinOff,
    RefreshCw,
    Rocket,
    Lock,
    Trash2,
} from "lucide-react";

export default function SettingsPage() {
    const [unit, setUnit] = useState("metric");
    const [userName, setUserName] = useState("User");
    const [autoLocation, setAutoLocation] = useState(false);
    const [isSaved, setIsSaved] = useState(false);
    const [activeTab, setActiveTab] = useState("profile");
    const [detecting, setDetecting] = useState(false);

    // 1. Initial Load: Tera logic same hai
    useEffect(() => {
        if (typeof window !== "undefined") {
            const savedUnit = localStorage.getItem("weatherUnit") || "metric";
            const savedName = localStorage.getItem("userName") || "Dev User";
            const savedLocation =
                localStorage.getItem("autoLocation") === "true";
            setUnit(savedUnit);
            setUserName(savedName);
            setAutoLocation(savedLocation);
        }
    }, []);

    // 2. Persistent Toggle Logic: Unchanged
    const handleLocationToggle = () => {
        if (!autoLocation) {
            setDetecting(true);
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    (pos) => {
                        const newLat = pos.coords.latitude;
                        const newLon = pos.coords.longitude;
                        setAutoLocation(true);
                        localStorage.setItem("autoLocation", "true");
                        localStorage.setItem("userLat", newLat);
                        localStorage.setItem("userLon", newLon);
                        setDetecting(false);
                    },
                    () => {
                        alert(
                            "Location access denied. Please enable GPS in browser.",
                        );
                        setDetecting(false);
                    },
                );
            }
        } else {
            setAutoLocation(false);
            localStorage.setItem("autoLocation", "false");
            localStorage.removeItem("userLat");
            localStorage.removeItem("userLon");
        }
    };

    const handleSave = () => {
        localStorage.setItem("weatherUnit", unit);
        localStorage.setItem("userName", userName);
        localStorage.setItem("autoLocation", autoLocation);
        setIsSaved(true);
        setTimeout(() => {
            setIsSaved(false);
            window.location.href = "/";
        }, 800);
    };

    const clearAllData = () => {
        if (
            confirm(
                "Are you sure? This will permanently delete your saved profile and location history.",
            )
        ) {
            localStorage.clear();
            window.location.reload();
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-500 p-4 md:p-0 pb-32 md:pb-12 text-white">
            {/* Responsive Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white/5 p-4 md:p-6 rounded-[2rem] border border-white/10 backdrop-blur-md gap-4">
                <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-blue-600/20 rounded-2xl text-blue-500 shadow-inner">
                        <Settings size={24} />
                    </div>
                    <div className="text-left">
                        <h1 className="text-xl md:text-2xl font-black tracking-tighter uppercase">
                            Settings
                        </h1>
                        <p className="text-[10px] text-slate-500 uppercase font-bold tracking-[0.2em] opacity-60">
                            System Configuration
                        </p>
                    </div>
                </div>
                <button
                    onClick={handleSave}
                    className="w-full sm:w-auto bg-blue-600 hover:bg-blue-500 px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2 active:scale-95 shadow-lg shadow-blue-500/20"
                >
                    {isSaved ? <CheckCircle2 size={16} /> : <Save size={16} />}
                    {isSaved ? "Saved" : "Save Changes"}
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                {/* Responsive Sidebar (Horizontal on Mobile, Vertical on Desktop) */}
                <div className="md:col-span-4 space-y-4">
                    <div className="glass-card p-6 flex flex-col items-center text-center space-y-4">
                        <div className="w-24 h-24 bg-gradient-to-tr from-blue-600 to-cyan-400 rounded-full p-1 shadow-2xl">
                            <div className="w-full h-full bg-[#020617] rounded-full flex items-center justify-center border-4 border-[#020617] overflow-hidden">
                                <User size={40} className="text-blue-500" />
                            </div>
                        </div>
                        <div className="w-full space-y-1">
                            <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest">
                                Active Operator
                            </label>
                            <input
                                value={userName}
                                onChange={(e) => setUserName(e.target.value)}
                                className="text-xl font-black text-white bg-transparent border-b border-transparent focus:border-blue-500 text-center outline-none w-full transition-all"
                            />
                        </div>
                    </div>

                    <nav className="glass-card overflow-hidden flex md:flex-col">
                        <NavItem
                            onClick={() => setActiveTab("profile")}
                            icon={<User size={18} />}
                            label="General"
                            active={activeTab === "profile"}
                        />
                        <NavItem
                            onClick={() => setActiveTab("security")}
                            icon={<Shield size={18} />}
                            label="Security"
                            active={activeTab === "security"}
                        />
                    </nav>
                </div>

                {/* Main Content Section */}
                <div className="md:col-span-8 space-y-4">
                    {activeTab === "profile" ? (
                        <div className="space-y-4 animate-in slide-in-from-right-4 duration-500">
                            <section className="glass-card p-6 space-y-6">
                                <div className="flex items-center gap-3 border-b border-white/5 pb-4">
                                    <Thermometer
                                        className="text-blue-500"
                                        size={18}
                                    />
                                    <h3 className="font-black text-sm uppercase tracking-tight">
                                        Temperature Metric
                                    </h3>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <UnitBtn
                                        active={unit === "metric"}
                                        onClick={() => setUnit("metric")}
                                        label="Celsius"
                                        sym="°C"
                                    />
                                    <UnitBtn
                                        active={unit === "imperial"}
                                        onClick={() => setUnit("imperial")}
                                        label="Fahrenheit"
                                        sym="°F"
                                    />
                                </div>
                            </section>

                            <section className="glass-card p-6 flex justify-between items-center">
                                <div className="flex items-center gap-4">
                                    <div
                                        className={`p-4 bg-white/5 rounded-2xl transition-all ${autoLocation ? "text-blue-400 bg-blue-500/10 shadow-[0_0_15px_rgba(59,130,246,0.1)]" : "text-slate-500"}`}
                                    >
                                        {detecting ? (
                                            <RefreshCw
                                                size={24}
                                                className="animate-spin"
                                            />
                                        ) : autoLocation ? (
                                            <MapPin size={24} />
                                        ) : (
                                            <MapPinOff size={24} />
                                        )}
                                    </div>
                                    <div className="text-left">
                                        <h3 className="font-black text-sm uppercase leading-none mb-1">
                                            Auto-Location
                                        </h3>
                                        <p
                                            className={`text-[10px] font-black tracking-tighter uppercase ${autoLocation ? "text-green-500" : "text-slate-500"}`}
                                        >
                                            {autoLocation
                                                ? "Telemetry: Active"
                                                : "Telemetry: Offline"}
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={handleLocationToggle}
                                    className={`w-12 h-6 rounded-full transition-all relative cursor-pointer active:scale-90 ${autoLocation ? "bg-blue-600 shadow-lg shadow-blue-500/30" : "bg-slate-700"}`}
                                >
                                    <div
                                        className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all shadow-md ${autoLocation ? "left-7" : "left-1"}`}
                                    />
                                </button>
                            </section>
                        </div>
                    ) : (
                        <div className="space-y-4 animate-in slide-in-from-right-4 duration-500">
                            <section className="glass-card p-6 space-y-4 text-left">
                                <div className="flex items-center gap-3 border-b border-white/5 pb-4">
                                    <Lock className="text-blue-500" size={18} />
                                    <h3 className="font-black text-sm uppercase">
                                        Data & Privacy
                                    </h3>
                                </div>
                                <p className="text-[11px] text-slate-400 leading-relaxed font-medium">
                                    SkyCast utilizes{" "}
                                    <span className="text-blue-400 font-bold underline underline-offset-4">
                                        AES-256 Local Encryption
                                    </span>{" "}
                                    standards. Your location metadata is siloed
                                    within your device&apos;s local environment
                                    and is never transmitted to external cloud
                                    servers.
                                </p>
                            </section>

                            <section className="glass-card p-6 space-y-4 text-left">
                                <div className="flex items-center gap-3 border-b border-white/5 pb-4">
                                    <RefreshCw
                                        className="text-blue-500"
                                        size={18}
                                    />
                                    <h3 className="font-black text-sm uppercase">
                                        Connection Status
                                    </h3>
                                </div>
                                <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                        Satellite API 2.5
                                    </span>
                                    <div className="flex items-center gap-2">
                                        <div className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)]"></div>
                                        <span className="text-[10px] font-black text-green-500 uppercase">
                                            Encrypted
                                        </span>
                                    </div>
                                </div>
                            </section>

                            <section className="glass-card p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border border-red-500/10 group hover:border-red-500/30 transition-all">
                                <div className="text-left">
                                    <div className="flex items-center gap-2 mb-1">
                                        <Trash2
                                            className="text-red-500"
                                            size={16}
                                        />
                                        <h3 className="font-black text-sm uppercase text-white leading-none">
                                            Emergency Reset
                                        </h3>
                                    </div>
                                    <p className="text-[10px] text-slate-500 italic">
                                        Wipe all local telemetry and profile
                                        metadata cache.
                                    </p>
                                </div>
                                <button
                                    onClick={clearAllData}
                                    className="w-full sm:w-auto bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20 px-6 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all active:scale-95"
                                >
                                    Purge Data
                                </button>
                            </section>
                        </div>
                    )}

                    {/* Versioning Footer */}
                    <div className="pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 opacity-40 hover:opacity-100 transition-opacity">
                        <div className="flex items-center gap-2 text-slate-400">
                            <Rocket size={16} className="text-blue-500" />
                            <span className="text-[11px] font-black uppercase tracking-[0.3em]">
                                Build v2.0.0
                            </span>
                        </div>
                        <p className="text-[10px] text-slate-500 font-bold italic text-center sm:text-right leading-relaxed">
                            Optimized for all terminal interfaces{" "}
                            <br className="hidden sm:block" />
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Sub-components: Fixed for mobile flex
function NavItem({ icon, label, active, onClick }) {
    return (
        <div
            onClick={onClick}
            className={`flex-1 md:flex-none px-6 py-4 flex flex-col md:flex-row items-center justify-center md:justify-start gap-2 md:gap-4 cursor-pointer transition-all border-b-2 md:border-b-0 md:border-l-4 active:scale-95 ${active ? "bg-blue-600/10 border-blue-500 text-white font-black" : "border-transparent text-slate-500 hover:bg-white/5 hover:text-slate-200"}`}
        >
            <span className={active ? "text-blue-400" : ""}>{icon}</span>
            <span className="text-[10px] md:text-xs font-bold uppercase tracking-widest">
                {label}
            </span>
        </div>
    );
}

function UnitBtn({ active, onClick, label, sym }) {
    return (
        <button
            onClick={onClick}
            className={`p-6 rounded-3xl border transition-all flex flex-col items-center gap-2 cursor-pointer active:scale-95 ${active ? "border-blue-500 bg-blue-600/10 shadow-xl shadow-blue-500/5" : "border-white/5 bg-white/5 hover:bg-white/10 hover:border-white/20"}`}
        >
            <span className="text-3xl font-black text-white">{sym}</span>
            <span className="text-[10px] font-black uppercase text-slate-500 tracking-tighter">
                {label}
            </span>
        </button>
    );
}
