"use client";
import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
    Search, Wind, Droplets, Thermometer, MapPin, RefreshCw, 
    CloudRain, Sun, Cloud, Clock, Calendar, Navigation, 
    Sunrise, Sunset, ArrowRight, User, Activity, AlertCircle,
} from "lucide-react";
import { AreaChart, Area, ResponsiveContainer } from "recharts";

export default function Home() {
    const [city, setCity] = useState("");
    const [weather, setWeather] = useState(null);
    const [aqi, setAqi] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [unitLabel, setUnitLabel] = useState("°C");
    const [userName, setUserName] = useState("User");
    const [cityTime, setCityTime] = useState(new Date());
    const [mounted, setMounted] = useState(false);

    // 1. AQI Fetch Logic
    const fetchAQI = useCallback(async (lat, lon) => {
        try {
            const res = await fetch(`/api/weather?type=aqi&lat=${lat}&lon=${lon}`);
            const data = await res.json();
            if (data.list?.[0]) setAqi(data.list[0].main.aqi);
        } catch (e) {
            console.error("AQI fetch failed");
        }
    }, []);

    // 2. Weather fetch using coordinates (Precision Rounding Fix)
    const handleCoordsFetch = useCallback(async (lat, lon, unit) => {
        setLoading(true);
        setError("");
        
        // Coordinates precision 2 decimal tak rakhi hai taake OpenWeather grid match kar sakay
        const sLat = Math.round(lat * 100) / 100;
        const sLon = Math.round(lon * 100) / 100;

        try {
            const res = await fetch(`/api/weather?lat=${sLat}&lon=${sLon}&units=${unit}`);
            const data = await res.json();
            
            if (data.coord && data.main) {
                setWeather(data);
                fetchAQI(data.coord.lat, data.coord.lon);
            } else {
                setError("Satellite link weak. Please search your city manually.");
            }
        } catch (err) {
            setError("Atmospheric sync failed. Check your connection.");
        } finally {
            setLoading(false);
        }
    }, [fetchAQI]);

    // 3. Main Initialization Effect (Persistent Sync)
    useEffect(() => {
        setMounted(true);
        const savedName = localStorage.getItem("userName") || "User";
        const autoLoc = localStorage.getItem("autoLocation") === "true";
        const savedUnit = localStorage.getItem("weatherUnit") || "metric";
        
        setUserName(savedName);
        setUnitLabel(savedUnit === "metric" ? "°C" : "°F");

        // AUTO-FETCH TRIGGER: Jab page load ho aur toggle ON ho
        if (autoLoc) {
            const savedLat = localStorage.getItem("userLat");
            const savedLon = localStorage.getItem("userLon");

            if (savedLat && savedLon) {
                handleCoordsFetch(savedLat, savedLon, savedUnit);
            } else {
                // Fallback: Storage khali ho par toggle ON ho toh GPS mangen
                if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition(
                        (pos) => {
                            handleCoordsFetch(pos.coords.latitude, pos.coords.longitude, savedUnit);
                            localStorage.setItem("userLat", pos.coords.latitude);
                            localStorage.setItem("userLon", pos.coords.longitude);
                        },
                        () => setError("Location enabled but browser permission missing.")
                    );
                }
            }
        }
    }, [handleCoordsFetch]);

    // 4. Clock and Time Sync Effect
    useEffect(() => {
        const timer = setInterval(() => {
            if (weather && weather.timezone !== undefined) {
                const now = new Date();
                const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
                setCityTime(new Date(utc + (1000 * weather.timezone)));
            } else {
                setCityTime(new Date());
            }
        }, 1000);
        return () => clearInterval(timer);
    }, [weather]);

    const handleSearch = async (e, targetCity = city) => {
        if (e) e.preventDefault();
        const query = targetCity.trim();
        if (!query) return;

        setLoading(true);
        setError("");
        const savedUnit = localStorage.getItem("weatherUnit") || "metric";

        try {
            const res = await fetch(`/api/weather?city=${query}&units=${savedUnit}`);
            const data = await res.json();

            if (!res.ok || data.error || !data.coord) {
                let suggestion = "";
                const lower = query.toLowerCase();
                if (lower === "newyork") suggestion = "New York";
                if (lower === "hongkong") suggestion = "Hong Kong";
                if (lower === "sanfrancisco") suggestion = "San Francisco";

                throw new Error(
                    suggestion
                        ? `City not found. Did you mean "${suggestion}"?`
                        : `We couldn't find "${query}". Please check the spelling.`
                );
            }

            setWeather(data);
            setUnitLabel(savedUnit === "metric" ? "°C" : "°F");
            if (data.coord.lat) fetchAQI(data.coord.lat, data.coord.lon);
        } catch (err) {
            setError(err.message);
            setWeather(null);
            setAqi(null);
        } finally {
            setLoading(false);
        }
    };

    const getAQIStatus = (val) => {
        const status = {
            1: { label: "Excellent", color: "text-green-400" },
            2: { label: "Fair", color: "text-yellow-400" },
            3: { label: "Moderate", color: "text-orange-400" },
            4: { label: "Poor", color: "text-red-400" },
            5: { label: "Very Poor", color: "text-purple-400" },
        };
        return status[val] || { label: "N/A", color: "text-slate-400" };
    };

    return (
        <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in duration-1000 pb-10">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-end md:items-center gap-6">
                <div className="space-y-1 text-left w-full">
                    <h1 className="text-3xl font-bold text-white tracking-tight">
                        Hi, <span className="text-blue-500">{mounted ? userName : "User"}</span>
                    </h1>
                    <p className="text-[10px] text-slate-500 uppercase tracking-[0.2em] font-black opacity-60">
                        Atmospheric Intelligence Overview
                    </p>
                </div>
                <form onSubmit={handleSearch} className="relative w-full md:w-80 group">
                    <input
                        type="text"
                        placeholder="Search global city..."
                        className={`w-full bg-white/5 border ${error ? "border-red-500/40" : "border-white/10"} p-3 pl-11 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500/40 transition-all text-sm text-white`}
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                    />
                    <Search className="absolute left-4 top-3 text-slate-500" size={18} />
                    {loading && <RefreshCw className="absolute right-4 top-3 animate-spin text-blue-500" size={18} />}
                </form>
            </div>

            {error && (
                <div className="flex items-center justify-between p-4 bg-red-500/10 border border-red-500/20 rounded-2xl animate-in slide-in-from-top-2">
                    <div className="flex items-center gap-3 text-red-400 text-xs text-left">
                        <div className="p-2 bg-red-500/20 rounded-full"><AlertCircle size={14} /></div>
                        <p className="font-bold opacity-80">{error}</p>
                    </div>
                    <button onClick={() => setError("")} className="text-red-400/50 hover:text-red-400 text-xs font-bold px-2 uppercase">Dismiss</button>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* Time Tile */}
                <div className="md:col-span-1 glass-card p-6 flex flex-col justify-between bg-gradient-to-br from-blue-600/20 to-transparent min-h-[160px] text-left text-white">
                    <div className="flex justify-between items-center">
                        <Clock size={20} className="text-blue-400" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                            {weather ? "Local Time" : "System Time"}
                        </span>
                    </div>
                    <div>
                        <h2 className="text-4xl font-black tracking-tighter uppercase leading-tight">
                            {mounted ? cityTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" }) : "--:--:--"}
                        </h2>
                        <p className="text-[10px] text-slate-500 flex items-center gap-2 mt-1 uppercase font-bold tracking-widest leading-none">
                            <Calendar size={12} /> {mounted ? cityTime.toLocaleDateString("en-GB", { day: "numeric", month: "short" }) : "---"}
                        </p>
                    </div>
                </div>

                {/* Weather Hero Card */}
                <div className="md:col-span-3 glass-card p-8 min-h-[320px] flex flex-col justify-between relative overflow-hidden group">
                    {weather ? (
                        <>
                            <div className="flex justify-between items-start relative z-10 text-white text-left animate-in zoom-in-95 duration-500">
                                <div>
                                    <div className="flex items-center gap-2 text-blue-400 font-bold text-[10px] uppercase tracking-[0.2em] mb-2">
                                        <MapPin size={14} /> {weather.name}, {weather.sys?.country}
                                    </div>
                                    <h3 className="text-8xl font-black tracking-tighter">
                                        {Math.round(weather.main.temp)}{unitLabel}
                                    </h3>
                                </div>
                                <div className="text-right">
                                    <WeatherIcon condition={weather.weather[0].description} size={80} />
                                    <p className="text-xl font-bold capitalize mt-2">{weather.weather[0].description}</p>
                                    <p className="text-slate-500 text-sm">Feels like {Math.round(weather.main.feels_like)}{unitLabel}</p>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center text-center space-y-4 text-white">
                            <div className="p-4 bg-blue-500/10 rounded-full animate-pulse border border-blue-500/20">
                                <Navigation className="text-blue-500" size={32} />
                            </div>
                            <p className="text-slate-500 font-medium uppercase tracking-widest text-[10px]">
                                {loading ? "Syncing Atmospheric Data..." : "Satellite link offline. Enable auto-location or search city."}
                            </p>
                        </div>
                    )}
                </div>

                {/* Info Blocks Grid */}
                {weather && (
                    <>
                        <SmallStatCard icon={<Wind />} label="Wind velocity" value={`${weather.wind.speed} ${unitLabel === "°C" ? "km/h" : "mph"}`} color="text-blue-400" />
                        
                        <div className="glass-card p-6 flex flex-col justify-between border-b-2 border-transparent hover:border-blue-500/50 transition-all text-white text-left">
                            <div className="flex justify-between items-center text-slate-500 uppercase text-[9px] font-black tracking-widest leading-none">
                                <span>Air Quality</span><Activity size={14} className="text-blue-400" />
                            </div>
                            <div className="mt-2">
                                <p className={`text-xl font-black ${getAQIStatus(aqi).color}`}>{aqi ? getAQIStatus(aqi).label : "Syncing..."}</p>
                                <div className="flex items-center gap-2 mt-1">
                                    <div className={`w-1.5 h-1.5 rounded-full ${aqi ? 'bg-blue-400' : 'bg-slate-600'}`}></div>
                                    <span className="text-[10px] text-slate-500 font-bold uppercase">Index {aqi || 0}/5</span>
                                </div>
                            </div>
                        </div>

                        <SmallStatCard icon={<Droplets />} label="Humidity" value={`${weather.main.humidity}%`} color="text-cyan-400" />
                        
                        <Link href={`/forecast?city=${weather.name}`} className="glass-card p-6 flex flex-col items-center justify-center bg-blue-600 hover:bg-blue-700 transition-all cursor-pointer group shadow-lg text-white">
                            <p className="text-white font-bold text-sm mb-2 group-hover:translate-x-1 transition-transform flex items-center gap-2">Full Analytics <ArrowRight size={16} /></p>
                            <span className="text-[9px] text-blue-100 uppercase tracking-widest font-medium">5-Day Forecast</span>
                        </Link>
                    </>
                )}
            </div>

            {/* Popular Cities */}
            {!weather && !loading && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-in slide-in-from-bottom-4 duration-700 text-white">
                    {["Lahore", "London", "Tokyo", "New York"].map((c) => (
                        <div key={c} onClick={() => handleSearch(null, c)} className="glass-card p-4 hover:bg-white/5 cursor-pointer flex justify-between items-center transition-all group border border-white/5">
                            <span className="text-xs font-bold text-slate-400 group-hover:text-white uppercase tracking-wider">{c}</span>
                            <div className="p-1.5 bg-blue-500/10 rounded-lg group-hover:bg-blue-500 transition-colors"><Search size={12} className="text-blue-500 group-hover:text-white" /></div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

function SmallStatCard({ icon, label, value, color }) {
    return (
        <div className="glass-card p-6 flex flex-col items-start text-left space-y-2 hover:bg-white/5 transition-all border-b-2 border-transparent hover:border-blue-500/50 text-white">
            <div className={`p-3 bg-white/5 rounded-2xl ${color}`}>{icon}</div>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{label}</p>
            <p className="text-xl font-black">{value}</p>
        </div>
    );
}

function WeatherIcon({ condition, size }) {
    const cond = condition.toLowerCase();
    if (cond.includes("rain")) return <CloudRain size={size} className="text-blue-500" />;
    if (cond.includes("sun") || cond.includes("clear")) return <Sun size={size} className="text-yellow-500 animate-pulse" />;
    return <Cloud size={size} className="text-slate-400" />;
}