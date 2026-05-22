"use client";
import { useState, useEffect } from "react";
import {
    Settings,
    User,
    Shield,
    Thermometer,
    CheckCircle2,
    Save,
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

    // 1. Initial Load
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

    // 2. Persistent Toggle Logic
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
        <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-500 p-4 md:p-0 pb-32 md:pb-12 text-slate-800">
            {/* Responsive Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white p-4 md:p-6 rounded-[2rem] border border-slate-200/80 shadow-sm gap-4">
                <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-blue-50 border border-blue-100 rounded-2xl text-blue-600 shadow-inner">
                        <Settings size={24} />
                    </div>
                    <div className="text-left">
                        <h1 className="text-xl md:text-2xl font-extrabold tracking-tighter uppercase text-slate-900">
                            Settings
                        </h1>
                        <p className="text-[10px] text-slate-400 uppercase font-bold tracking-[0.2em]">
                            System Configuration
                        </p>
                    </div>
                </div>
                <button
                    onClick={handleSave}
                    className="w-full sm:w-auto bg-blue-600 hover:bg-blue-500 px-6 py-3.5 rounded-2xl font-bold text-xs uppercase tracking-widest text-white transition-all flex items-center justify-center gap-2 active:scale-95 shadow-md shadow-blue-600/10 cursor-pointer"
                >
                    {isSaved ? <CheckCircle2 size={16} /> : <Save size={16} />}
                    {isSaved ? "Saved" : "Save Changes"}
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                {/* Responsive Sidebar */}
                <div className="md:col-span-4 space-y-4">
                    <div className="glass-card p-6 flex flex-col items-center text-center space-y-4 border border-slate-200/80 bg-white">
                        <div className="w-24 h-24 bg-gradient-to-tr from-blue-600 to-indigo-500 rounded-full p-1 shadow-md">
                            <div className="w-full h-full bg-white rounded-full flex items-center justify-center border-4 border-white overflow-hidden shadow-inner">
                                <User size={40} className="text-blue-600" />
                            </div>
                        </div>
                        <div className="w-full space-y-1.5">
                            <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                                Active Operator
                            </label>
                            <input
                                value={userName}
                                onChange={(e) => setUserName(e.target.value)}
                                className="text-lg font-extrabold text-slate-800 bg-transparent border-b border-transparent focus:border-blue-500 text-center outline-none w-full transition-all py-0.5"
                            />
                        </div>
                    </div>

                    <nav className="glass-card overflow-hidden flex md:flex-col border border-slate-200/80 bg-white p-2 gap-1 rounded-[2rem]">
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
                            <section className="glass-card p-6 space-y-6 border border-slate-200/80 bg-white">
                                <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                                    <Thermometer
                                        className="text-blue-600"
                                        size={18}
                                    />
                                    <h3 className="font-extrabold text-sm uppercase tracking-tight text-slate-800">
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

                            <section className="glass-card p-6 flex justify-between items-center border border-slate-200/80 bg-white">
                                <div className="flex items-center gap-4">
                                    <div
                                        className={`p-4 rounded-2xl border transition-all ${autoLocation ? "text-blue-600 bg-blue-50 border-blue-200/60 shadow-sm" : "text-slate-400 bg-slate-50 border-slate-200"}`}
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
                                        <h3 className="font-extrabold text-sm uppercase leading-none mb-1 text-slate-800">
                                            Auto-Location
                                        </h3>
                                        <p
                                            className={`text-[9px] font-black tracking-wider uppercase ${autoLocation ? "text-emerald-600" : "text-slate-400"}`}
                                        >
                                            {autoLocation
                                                ? "Telemetry: Active"
                                                : "Telemetry: Offline"}
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={handleLocationToggle}
                                    className={`w-12 h-6.5 rounded-full transition-all relative cursor-pointer active:scale-90 ${autoLocation ? "bg-blue-600 shadow-md shadow-blue-500/10" : "bg-slate-200 border border-slate-300/40"}`}
                                >
                                    <div
                                        className={`absolute top-1 w-4.5 h-4.5 bg-white rounded-full transition-all shadow-md ${autoLocation ? "left-6.5" : "left-1"}`}
                                    />
                                </button>
                            </section>
                        </div>
                    ) : (
                        <div className="space-y-4 animate-in slide-in-from-right-4 duration-500">
                            <section className="glass-card p-6 space-y-4 text-left border border-slate-200/80 bg-white">
                                <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                                    <Lock className="text-blue-600" size={18} />
                                    <h3 className="font-extrabold text-sm uppercase text-slate-800">
                                        Data & Privacy
                                    </h3>
                                </div>
                                <p className="text-[11px] text-slate-500 leading-relaxed font-semibold">
                                    SkyCast utilizes{" "}
                                    <span className="text-blue-600 font-bold underline underline-offset-4">
                                        AES-256 Local Encryption
                                    </span>{" "}
                                    standards. Your location metadata is siloed
                                    within your device&apos;s local environment
                                    and is never transmitted to external cloud
                                    servers.
                                </p>
                            </section>

                            <section className="glass-card p-6 space-y-4 text-left border border-slate-200/80 bg-white">
                                <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                                    <RefreshCw
                                        className="text-blue-600"
                                        size={18}
                                    />
                                    <h3 className="font-extrabold text-sm uppercase text-slate-800">
                                        Connection Status
                                    </h3>
                                </div>
                                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-200/60">
                                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                                        Satellite API 2.5
                                    </span>
                                    <div className="flex items-center gap-2">
                                        <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.4)]"></div>
                                        <span className="text-[10px] font-black text-emerald-600 uppercase">
                                            Encrypted
                                        </span>
                                    </div>
                                </div>
                            </section>

                            <section className="glass-card p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border border-rose-100/80 bg-rose-50/20 group hover:border-rose-300 transition-all rounded-[2rem]">
                                <div className="text-left">
                                    <div className="flex items-center gap-2 mb-1">
                                        <Trash2
                                            className="text-rose-600"
                                            size={16}
                                        />
                                        <h3 className="font-extrabold text-sm uppercase text-slate-800 leading-none">
                                            Emergency Reset
                                        </h3>
                                    </div>
                                    <p className="text-[10px] text-slate-400 font-bold italic">
                                        Wipe all local telemetry and profile
                                        metadata cache.
                                    </p>
                                </div>
                                <button
                                    onClick={clearAllData}
                                    className="w-full sm:w-auto bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 px-6 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all active:scale-95 cursor-pointer"
                                >
                                    Purge Data
                                </button>
                            </section>
                        </div>
                    )}

                    {/* Versioning Footer */}
                    <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 opacity-70 hover:opacity-100 transition-opacity">
                        <div className="flex items-center gap-2 text-slate-400">
                            <Rocket size={16} className="text-blue-600" />
                            <span className="text-[10px] font-black uppercase tracking-[0.3em]">
                                Build v2.0.0
                            </span>
                        </div>
                        <p className="text-[10px] text-slate-400 font-bold italic text-center sm:text-right leading-relaxed">
                            Optimized for all terminal interfaces{" "}
                            <br className="hidden sm:block" />
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Sub-components
function NavItem({ icon, label, active, onClick }) {
    return (
        <div
            onClick={onClick}
            className={`flex-1 md:flex-none px-6 py-3.5 flex flex-col md:flex-row items-center justify-center md:justify-start gap-2 md:gap-4 cursor-pointer transition-all rounded-2xl border active:scale-95 ${
                active 
                    ? "bg-blue-50/60 border-blue-200 text-blue-600 font-bold shadow-sm shadow-blue-500/5" 
                    : "border-transparent text-slate-500 hover:bg-slate-50 hover:text-slate-800"
            }`}
        >
            <span className={active ? "text-blue-600" : ""}>{icon}</span>
            <span className="text-[10px] md:text-xs font-bold uppercase tracking-wider">
                {label}
            </span>
        </div>
    );
}

function UnitBtn({ active, onClick, label, sym }) {
    return (
        <button
            onClick={onClick}
            className={`p-6 rounded-3xl border transition-all flex flex-col items-center gap-2.5 cursor-pointer active:scale-95 w-full ${
                active 
                    ? "border-blue-600 bg-blue-50/50 shadow-md shadow-blue-500/5 text-blue-600" 
                    : "border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300 text-slate-400"
            }`}
        >
            <span className={`text-3xl font-extrabold ${active ? "text-blue-600" : "text-slate-500"}`}>{sym}</span>
            <span className="text-[10px] font-black uppercase tracking-tighter text-slate-400">
                {label}
            </span>
        </button>
    );
}
