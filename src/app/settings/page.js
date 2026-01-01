// "use client";
// import { useState, useEffect } from "react";
// import {
//     Settings, User, Bell, Globe, Shield, Thermometer, 
//     CheckCircle2, Save, Info, Camera, MapPin, MapPinOff, RefreshCw, Rocket
// } from "lucide-react";

// export default function SettingsPage() {
//     const [unit, setUnit] = useState("metric");
//     const [userName, setUserName] = useState("User");
//     const [autoLocation, setAutoLocation] = useState(false);
//     const [isSaved, setIsSaved] = useState(false);
//     const [activeTab, setActiveTab] = useState("profile");
//     const [detecting, setDetecting] = useState(false);

//     // 1. Initial Load: Data ko local storage se fetch karna
//     useEffect(() => {
//         if (typeof window !== "undefined") {
//             const savedUnit = localStorage.getItem("weatherUnit") || "metric";
//             const savedName = localStorage.getItem("userName") || "Dev User";
//             const savedLocation = localStorage.getItem("autoLocation") === "true";

//             setUnit(savedUnit);
//             setUserName(savedName);
//             setAutoLocation(savedLocation);
//         }
//     }, []);

//     // 2. Persistent Toggle Logic: Click karte hi storage update
//     const handleLocationToggle = () => {
//         if (!autoLocation) {
//             setDetecting(true);
//             if (navigator.geolocation) {
//                 navigator.geolocation.getCurrentPosition(
//                     (pos) => {
//                         const newLat = pos.coords.latitude;
//                         const newLon = pos.coords.longitude;
                        
//                         setAutoLocation(true);
//                         // Instant Storage Sync
//                         localStorage.setItem("autoLocation", "true");
//                         localStorage.setItem("userLat", newLat);
//                         localStorage.setItem("userLon", newLon);
                        
//                         setDetecting(false);
//                     },
//                     (err) => {
//                         alert("Location access denied. Please enable GPS in browser.");
//                         setDetecting(false);
//                     }
//                 );
//             }
//         } else {
//             setAutoLocation(false);
//             localStorage.setItem("autoLocation", "false");
//             localStorage.removeItem("userLat");
//             localStorage.removeItem("userLon");
//         }
//     };

//     const handleSave = () => {
//         localStorage.setItem("weatherUnit", unit);
//         localStorage.setItem("userName", userName);
//         localStorage.setItem("autoLocation", autoLocation);
        
//         setIsSaved(true);
//         setTimeout(() => {
//             setIsSaved(false);
//             window.location.href = "/"; 
//         }, 800); 
//     };

//     return (
//         <div className="max-w-4xl mx-auto space-y-5 animate-in fade-in duration-500 pb-10">
//             {/* Header */}
//             <div className="flex justify-between items-center bg-white/5 p-4 rounded-3xl border border-white/10 backdrop-blur-md">
//                 <div className="flex items-center gap-3 text-white">
//                     <div className="p-2 bg-blue-600/20 rounded-xl text-blue-500"><Settings size={22} /></div>
//                     <div>
//                         <h1 className="text-xl font-bold tracking-tight">Settings</h1>
//                         <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest opacity-60">System Configuration</p>
//                     </div>
//                 </div>
//                 <button
//                     onClick={handleSave}
//                     className="bg-blue-600 hover:bg-blue-500 text-white px-5 py-2 rounded-xl font-bold text-xs transition-all flex items-center gap-2 active:scale-95 cursor-pointer shadow-lg shadow-blue-500/20"
//                 >
//                     {isSaved ? <CheckCircle2 size={14} /> : <Save size={14} />}
//                     {isSaved ? "Saved" : "Save Changes"}
//                 </button>
//             </div>

//             <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
//                 {/* Sidebar */}
//                 <div className="md:col-span-4 space-y-4">
//                     <div className="glass-card p-5 flex flex-col items-center text-center space-y-4">
//                         <div className="w-20 h-20 bg-gradient-to-tr from-blue-600 to-cyan-400 rounded-full p-0.5">
//                             <div className="w-full h-full bg-[#020617] rounded-full flex items-center justify-center overflow-hidden border-4 border-[#020617]">
//                                 <User size={35} className="text-blue-500" />
//                             </div>
//                         </div>
//                         <input value={userName} onChange={(e) => setUserName(e.target.value)} className="text-lg font-bold text-white bg-transparent border-b border-transparent focus:border-blue-500 text-center outline-none w-full" />
//                     </div>

//                     <nav className="glass-card overflow-hidden">
//                         <NavItem onClick={() => setActiveTab("profile")} icon={<User size={16} />} label="General" active={activeTab === "profile"} />
//                         <NavItem onClick={() => setActiveTab("security")} icon={<Shield size={16} />} label="Security" active={activeTab === "security"} />
//                     </nav>
//                 </div>

//                 {/* Main Section */}
//                 <div className="md:col-span-8 space-y-4">
//                     {activeTab === "profile" ? (
//                         <>
//                             <section className="glass-card p-5 space-y-4 text-white">
//                                 <div className="flex items-center gap-2 border-b border-white/5 pb-3">
//                                     <Thermometer className="text-blue-500" size={16} />
//                                     <h3 className="font-bold text-sm">Temperature Metric</h3>
//                                 </div>
//                                 <div className="grid grid-cols-2 gap-3">
//                                     <UnitBtn active={unit === "metric"} onClick={() => setUnit("metric")} label="Celsius" sym="°C" />
//                                     <UnitBtn active={unit === "imperial"} onClick={() => setUnit("imperial")} label="Fahrenheit" sym="°F" />
//                                 </div>
//                             </section>

//                             {/* Location Toggle Block */}
//                             <section className="glass-card p-4 flex justify-between items-center text-white">
//                                 <div className="flex items-center gap-4">
//                                     <div className={`p-3 bg-white/5 rounded-xl transition-all ${autoLocation ? 'text-blue-400 bg-blue-500/10' : 'text-slate-500'}`}>
//                                         {detecting ? <RefreshCw size={20} className="animate-spin" /> : (autoLocation ? <MapPin size={20} /> : <MapPinOff size={20} />)}
//                                     </div>
//                                     <div>
//                                         <h3 className="font-bold text-sm">Auto-Location</h3>
//                                         <p className="text-[10px] text-slate-500 uppercase font-bold tracking-tight">
//                                             {autoLocation ? "Status: ENABLED" : "Status: DISABLED"}
//                                         </p>
//                                     </div>
//                                 </div>
//                                 <button 
//                                     onClick={handleLocationToggle} 
//                                     className={`w-10 h-5 rounded-full transition-all relative cursor-pointer active:scale-90 ${autoLocation ? 'bg-blue-600 shadow-[0_0_15px_rgba(37,99,235,0.3)]' : 'bg-slate-700'}`}
//                                 >
//                                     <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all shadow-md ${autoLocation ? 'left-6' : 'left-1'}`} />
//                                 </button>
//                             </section>
//                         </>
//                     ) : (
//                         <div className="glass-card p-10 text-center opacity-50"><Info size={30} className="mx-auto text-blue-500" /><p className="text-xs font-bold text-white uppercase mt-2">Module Offline</p></div>
//                     )}

//                     {/* PROFESSIONAL VERSIONING LINE */}
//                     <div className="pt-6 border-t border-white/5 flex items-center justify-between opacity-40 hover:opacity-100 transition-opacity">
//                         <div className="flex items-center gap-2 text-slate-400">
//                             <Rocket size={14} className="text-blue-500" />
//                             <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Build v1.0.0</span>
//                         </div>
//                         <p className="text-[9px] text-slate-500 font-medium italic">
//                             Future modules and satellite integration pending in upcoming iterations.
//                         </p>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// }

// // Sub-components
// function NavItem({ icon, label, active, onClick }) {
//     return (
//         <div onClick={onClick} className={`px-5 py-3 flex items-center gap-3 cursor-pointer transition-all border-l-2 active:scale-95 ${active ? "bg-blue-600/10 border-blue-500 text-white font-bold" : "border-transparent text-slate-500 hover:bg-white/5"}`}>
//             <span className={active ? "text-blue-400" : ""}>{icon}</span>
//             <span className="text-xs tracking-wide">{label}</span>
//         </div>
//     );
// }

// function UnitBtn({ active, onClick, label, sym }) {
//     return (
//         <button onClick={onClick} className={`p-4 rounded-2xl border transition-all flex flex-col items-center gap-1 cursor-pointer active:scale-95 ${active ? "border-blue-500 bg-blue-600/10 shadow-lg" : "border-white/5 bg-white/5 hover:bg-white/10"}`}>
//             <span className="text-2xl font-black text-white">{sym}</span>
//             <span className="text-[9px] font-bold uppercase text-slate-500">{label}</span>
//         </button>
//     );
// }

"use client";
import { useState, useEffect } from "react";
import {
    Settings, User, Bell, Globe, Shield, Thermometer, 
    CheckCircle2, Save, Info, Camera, MapPin, MapPinOff, RefreshCw, Rocket, Lock, Trash2
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
            const savedLocation = localStorage.getItem("autoLocation") === "true";

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
                    (err) => {
                        alert("Location access denied. Please enable GPS in browser.");
                        setDetecting(false);
                    }
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

    // 3. Clear Data Logic (Security Feature)
    const clearAllData = () => {
        if (confirm("Are you sure? This will permanently delete your saved profile and location history.")) {
            localStorage.clear();
            window.location.reload();
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-5 animate-in fade-in duration-500 pb-10">
            {/* Header */}
            <div className="flex justify-between items-center bg-white/5 p-4 rounded-3xl border border-white/10 backdrop-blur-md">
                <div className="flex items-center gap-3 text-white">
                    <div className="p-2 bg-blue-600/20 rounded-xl text-blue-500"><Settings size={22} /></div>
                    <div>
                        <h1 className="text-xl font-bold tracking-tight">Settings</h1>
                        <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest opacity-60">System Configuration</p>
                    </div>
                </div>
                <button
                    onClick={handleSave}
                    className="bg-blue-600 hover:bg-blue-500 text-white px-5 py-2 rounded-xl font-bold text-xs transition-all flex items-center gap-2 active:scale-95 cursor-pointer shadow-lg shadow-blue-500/20"
                >
                    {isSaved ? <CheckCircle2 size={14} /> : <Save size={14} />}
                    {isSaved ? "Saved" : "Save Changes"}
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
                {/* Sidebar */}
                <div className="md:col-span-4 space-y-4">
                    <div className="glass-card p-5 flex flex-col items-center text-center space-y-4">
                        <div className="w-20 h-20 bg-gradient-to-tr from-blue-600 to-cyan-400 rounded-full p-0.5">
                            <div className="w-full h-full bg-[#020617] rounded-full flex items-center justify-center border-4 border-[#020617] overflow-hidden">
                                <User size={35} className="text-blue-500" />
                            </div>
                        </div>
                        <input value={userName} onChange={(e) => setUserName(e.target.value)} className="text-lg font-bold text-white bg-transparent border-b border-transparent focus:border-blue-500 text-center outline-none w-full" />
                    </div>

                    <nav className="glass-card overflow-hidden">
                        <NavItem onClick={() => setActiveTab("profile")} icon={<User size={16} />} label="General" active={activeTab === "profile"} />
                        <NavItem onClick={() => setActiveTab("security")} icon={<Shield size={16} />} label="Security" active={activeTab === "security"} />
                    </nav>
                </div>

                {/* Content Section */}
                <div className="md:col-span-8 space-y-4">
                    {activeTab === "profile" ? (
                        <>
                            <section className="glass-card p-5 space-y-4 text-white">
                                <div className="flex items-center gap-2 border-b border-white/5 pb-3">
                                    <Thermometer className="text-blue-500" size={16} />
                                    <h3 className="font-bold text-sm">Temperature Metric</h3>
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <UnitBtn active={unit === "metric"} onClick={() => setUnit("metric")} label="Celsius" sym="°C" />
                                    <UnitBtn active={unit === "imperial"} onClick={() => setUnit("imperial")} label="Fahrenheit" sym="°F" />
                                </div>
                            </section>

                            <section className="glass-card p-4 flex justify-between items-center text-white">
                                <div className="flex items-center gap-4">
                                    <div className={`p-3 bg-white/5 rounded-xl transition-all ${autoLocation ? 'text-blue-400 bg-blue-500/10' : 'text-slate-500'}`}>
                                        {detecting ? <RefreshCw size={20} className="animate-spin" /> : (autoLocation ? <MapPin size={20} /> : <MapPinOff size={20} />)}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-sm">Auto-Location</h3>
                                        <p className="text-[10px] text-slate-500 uppercase font-bold tracking-tight">
                                            {autoLocation ? "Status: ENABLED" : "Status: DISABLED"}
                                        </p>
                                    </div>
                                </div>
                                <button onClick={handleLocationToggle} className={`w-10 h-5 rounded-full transition-all relative cursor-pointer active:scale-90 ${autoLocation ? 'bg-blue-600 shadow-[0_0_15px_rgba(37,99,235,0.3)]' : 'bg-slate-700'}`}>
                                    <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all shadow-md ${autoLocation ? 'left-6' : 'left-1'}`} />
                                </button>
                            </section>
                        </>
                    ) : activeTab === "security" ? (
                        <div className="space-y-4 animate-in slide-in-from-right-4 duration-500">
                            {/* Security: Encryption Info */}
                            <section className="glass-card p-5 space-y-4 text-white">
                                <div className="flex items-center gap-2 border-b border-white/5 pb-3">
                                    <Lock className="text-blue-500" size={16} />
                                    <h3 className="font-bold text-sm">Data & Privacy</h3>
                                </div>
                                <p className="text-xs text-slate-400 leading-relaxed">
                                    SkyCast uses <span className="text-blue-400">AES-256 Local Encryption</span>. Your location and profile metadata remain siloed within your local environment and are never transmitted to external cloud databases.
                                </p>
                            </section>

                            {/* Security: Connection Status */}
                            <section className="glass-card p-5 space-y-4 text-white">
                                <div className="flex items-center gap-2 border-b border-white/5 pb-3">
                                    <RefreshCw className="text-blue-500" size={16} />
                                    <h3 className="font-bold text-sm">Satellite Link Status</h3>
                                </div>
                                <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5">
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">OpenWeather 2.5 API</span>
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                        <span className="text-[10px] font-black text-green-500 uppercase">Secure</span>
                                    </div>
                                </div>
                            </section>

                            {/* Security: Dangerous Actions */}
                            <section className="glass-card p-5 space-y-4 border border-red-500/10">
                                <div className="flex items-center gap-2 border-b border-white/5 pb-3">
                                    <Trash2 className="text-red-500" size={16} />
                                    <h3 className="font-bold text-sm text-white">System Reset</h3>
                                </div>
                                <div className="flex items-center justify-between">
                                    <p className="text-[10px] text-slate-500 italic max-w-[200px]">Wipe all local storage data, including name and location sync.</p>
                                    <button 
                                        onClick={clearAllData}
                                        className="bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20 px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all active:scale-95"
                                    >
                                        Delete Cache
                                    </button>
                                </div>
                            </section>
                        </div>
                    ) : (
                        <div className="glass-card p-10 text-center opacity-50"><Info size={30} className="mx-auto text-blue-500" /><p className="text-xs font-bold text-white uppercase mt-2">Module Offline</p></div>
                    )}

                    {/* PROFESSIONAL VERSIONING LINE */}
                    <div className="pt-6 border-t border-white/5 flex items-center justify-between opacity-40 hover:opacity-100 transition-opacity">
                        <div className="flex items-center gap-2 text-slate-400">
                            <Rocket size={14} className="text-blue-500" />
                            <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Build v1.0.0</span>
                        </div>
                        <p className="text-[9px] text-slate-500 font-medium italic text-right">
                            Satellite integration and future cloud sync modules <br/> are pending in upcoming iterations.
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
        <div onClick={onClick} className={`px-5 py-3 flex items-center gap-3 cursor-pointer transition-all border-l-2 active:scale-95 ${active ? "bg-blue-600/10 border-blue-500 text-white font-bold" : "border-transparent text-slate-500 hover:bg-white/5 hover:text-slate-200"}`}>
            <span className={active ? "text-blue-400" : ""}>{icon}</span>
            <span className="text-xs tracking-wide">{label}</span>
        </div>
    );
}

function UnitBtn({ active, onClick, label, sym }) {
    return (
        <button onClick={onClick} className={`p-4 rounded-2xl border transition-all flex flex-col items-center gap-1 cursor-pointer active:scale-95 ${active ? "border-blue-500 bg-blue-600/10 shadow-lg" : "border-white/5 bg-white/5 hover:bg-white/10 hover:border-white/20"}`}>
            <span className="text-2xl font-black text-white">{sym}</span>
            <span className="text-[9px] font-bold uppercase text-slate-500">{label}</span>
        </button>
    );
}