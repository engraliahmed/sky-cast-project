"use client";
import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
    Search, Wind, Droplets, Thermometer, MapPin, RefreshCw, 
    CloudRain, Sun, Cloud, Clock, Calendar, Navigation, 
    Sunrise, Sunset, ArrowRight, Activity, AlertCircle,
    Star, StarOff, Heart, Eye, Gauge, Compass, CloudLightning
} from "lucide-react";

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
    const [bookmarks, setBookmarks] = useState([]);

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

    // 2. Weather fetch using coordinates
    const handleCoordsFetch = useCallback(async (lat, lon, unit) => {
        setLoading(true);
        setError("");
        
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

    // 3. Main Initialization Effect (Persistent Sync & Bookmarks)
    useEffect(() => {
        setMounted(true);
        const savedName = localStorage.getItem("userName") || "User";
        const autoLoc = localStorage.getItem("autoLocation") === "true";
        const savedUnit = localStorage.getItem("weatherUnit") || "metric";
        
        setUserName(savedName);
        setUnitLabel(savedUnit === "metric" ? "°C" : "°F");

        // Load Bookmarks
        const savedBookmarks = localStorage.getItem("skycast_bookmarks");
        if (savedBookmarks) {
            try {
                setBookmarks(JSON.parse(savedBookmarks));
            } catch (e) {
                console.error("Failed to parse bookmarks");
            }
        }

        // AUTO-FETCH TRIGGER
        if (autoLoc) {
            const savedLat = localStorage.getItem("userLat");
            const savedLon = localStorage.getItem("userLon");

            if (savedLat && savedLon) {
                handleCoordsFetch(savedLat, savedLon, savedUnit);
            } else {
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
            setCity("");
        } catch (err) {
            setError(err.message);
            setWeather(null);
            setAqi(null);
        } finally {
            setLoading(false);
        }
    };

    // Toggle city in bookmarks list
    const toggleBookmark = (cityName) => {
        if (!cityName) return;
        let updated;
        if (bookmarks.includes(cityName)) {
            updated = bookmarks.filter(c => c !== cityName);
        } else {
            updated = [...bookmarks, cityName];
        }
        setBookmarks(updated);
        localStorage.setItem("skycast_bookmarks", JSON.stringify(updated));
    };

    const getAQIStatus = (val) => {
        const status = {
            1: { label: "Excellent", color: "text-emerald-600 bg-emerald-50 border-emerald-200/60" },
            2: { label: "Fair", color: "text-amber-600 bg-amber-50 border-amber-200/60" },
            3: { label: "Moderate", color: "text-orange-600 bg-orange-50 border-orange-200/60" },
            4: { label: "Poor", color: "text-red-600 bg-red-50 border-red-200/60" },
            5: { label: "Very Poor", color: "text-purple-600 bg-purple-50 border-purple-200/60" },
        };
        return status[val] || { label: "N/A", color: "text-slate-500 bg-slate-50 border-slate-200/60" };
    };

    // Get dynamic atmospheric comfort score
    const getComfortIndex = (temp, humidity, aqiVal) => {
        let score = 100;
        let tips = [];
        
        if (temp < 15) {
            score -= 15;
            tips.push("Chilly air, layering recommended.");
        } else if (temp > 30) {
            score -= 20;
            tips.push("High heat, hydrate frequently.");
        }
        
        if (humidity > 70) {
            score -= 15;
            tips.push("Humid atmospheric humidity.");
        } else if (humidity < 20) {
            score -= 10;
            tips.push("Dry environment.");
        }
        
        if (aqiVal) {
            if (aqiVal >= 4) {
                score -= 30;
                tips.push("Poor air, indoor workouts advised.");
            } else if (aqiVal === 3) {
                score -= 10;
                tips.push("Moderate air quality.");
            }
        }
        
        score = Math.max(15, score);
        
        let label = "Excellent";
        let color = "text-emerald-600 bg-emerald-50 border-emerald-100";
        if (score < 50) {
            label = "Uncomfortable";
            color = "text-rose-600 bg-rose-50 border-rose-100";
        } else if (score < 75) {
            label = "Moderate";
            color = "text-amber-600 bg-amber-50 border-amber-100";
        } else if (score < 92) {
            label = "Good";
            color = "text-blue-600 bg-blue-50 border-blue-100";
        }
        
        return { score, label, color, tip: tips[0] || "Perfect weather for outdoors!" };
    };

    // Format Sunrise & Sunset in target city local time
    const formatLocalTime = (timestamp, timezoneOffset) => {
        if (!timestamp || timezoneOffset === undefined) return "--:--";
        const utcTime = timestamp * 1000;
        const localTime = new Date(utcTime + (timezoneOffset * 1000));
        const hours = localTime.getUTCHours().toString().padStart(2, "0");
        const minutes = localTime.getUTCMinutes().toString().padStart(2, "0");
        return `${hours}:${minutes}`;
    };

    const isBookmarked = weather && bookmarks.includes(weather.name);
    const comfort = weather ? getComfortIndex(weather.main.temp, weather.main.humidity, aqi) : null;

    return (
        <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in duration-700 pb-12 text-slate-800">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="space-y-1 text-left w-full">
                    <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight leading-tight">
                        Hi, <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">{mounted ? userName : "User"}</span>
                    </h1>
                    <p className="text-[10px] text-slate-400 uppercase tracking-[0.2em] font-black">
                        Atmospheric Intelligence Console
                    </p>
                </div>
                <form onSubmit={handleSearch} className="relative w-full md:w-80 group">
                    <input
                        type="text"
                        placeholder="Search global city..."
                        className={`w-full bg-white border ${error ? "border-red-400" : "border-slate-200"} p-3.5 pl-11 pr-11 rounded-2xl outline-none focus:border-blue-500/80 shadow-sm focus:ring-4 focus:ring-blue-100 transition-all text-sm text-slate-800 placeholder-slate-400`}
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                    />
                    <Search className="absolute left-4 top-4 text-slate-400" size={16} />
                    {loading && <RefreshCw className="absolute right-4 top-4 animate-spin text-blue-500" size={16} />}
                </form>
            </div>

            {/* Bookmarks Bar */}
            {mounted && bookmarks.length > 0 && (
                <div className="flex flex-wrap items-center gap-2 p-3 bg-white/60 border border-slate-200/70 rounded-2xl shadow-sm">
                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider flex items-center gap-1.5 px-2">
                        <Star size={12} className="text-yellow-500 fill-yellow-500 animate-pulse" /> Bookmarks:
                    </span>
                    {bookmarks.map((bName) => (
                        <button
                            key={bName}
                            onClick={() => handleSearch(null, bName)}
                            className="text-xs bg-slate-100 hover:bg-blue-50 text-slate-600 hover:text-blue-600 px-3 py-1.5 rounded-xl border border-slate-200/50 hover:border-blue-200 transition-all font-semibold active:scale-95"
                        >
                            {bName}
                        </button>
                    ))}
                </div>
            )}

            {error && (
                <div className="flex items-center justify-between p-4 bg-rose-50 border border-rose-100 rounded-2xl animate-in slide-in-from-top-2">
                    <div className="flex items-center gap-3 text-rose-600 text-xs text-left">
                        <div className="p-2 bg-rose-100 rounded-full"><AlertCircle size={14} /></div>
                        <p className="font-bold opacity-90">{error}</p>
                    </div>
                    <button onClick={() => setError("")} className="text-rose-400 hover:text-rose-600 text-xs font-bold px-2 uppercase">Dismiss</button>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
                {/* Time Tile */}
                <div className="md:col-span-1 glass-card p-6 flex flex-col justify-between bg-gradient-to-br from-blue-50/70 to-indigo-50/20 min-h-[160px] text-left">
                    <div className="flex justify-between items-center">
                        <Clock size={18} className="text-blue-500 animate-float" />
                        <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">
                            {weather ? "Local Time" : "System Time"}
                        </span>
                    </div>
                    <div className="mt-4">
                        <h2 className="text-4xl font-extrabold tracking-tighter text-slate-900 leading-tight">
                            {mounted ? cityTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" }) : "--:--:--"}
                        </h2>
                        <p className="text-[10px] text-slate-400 flex items-center gap-1.5 mt-2 uppercase font-extrabold tracking-widest">
                            <Calendar size={12} className="text-slate-400" /> {mounted ? cityTime.toLocaleDateString("en-GB", { day: "numeric", month: "short" }) : "---"}
                        </p>
                    </div>
                </div>

                {/* Weather Hero Card */}
                <div className="md:col-span-3 glass-card p-8 min-h-[160px] flex flex-col justify-between relative overflow-hidden group">
                    {/* Background faint light circle */}
                    <div className="absolute right-0 top-0 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl pointer-events-none transform translate-x-20 -translate-y-20"></div>
                    
                    {weather ? (
                        <>
                            <div className="flex justify-between items-start relative z-10 text-left animate-in zoom-in-95 duration-500">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2 text-blue-600 font-bold text-[10px] uppercase tracking-[0.2em] mb-1">
                                        <MapPin size={12} /> {weather.name}, {weather.sys?.country}
                                    </div>
                                    <h3 className="text-8xl font-black tracking-tighter text-slate-900 leading-none">
                                        {Math.round(weather.main.temp)}{unitLabel}
                                    </h3>
                                    <div className="flex items-center gap-3 pt-3">
                                        <button
                                            onClick={() => toggleBookmark(weather.name)}
                                            className={`p-2.5 rounded-xl border flex items-center gap-1.5 transition-all text-[10px] font-bold uppercase tracking-wider ${
                                                isBookmarked
                                                    ? "bg-yellow-50 text-yellow-600 border-yellow-200 shadow-sm"
                                                    : "bg-slate-50 hover:bg-slate-100 text-slate-400 hover:text-slate-600 border-slate-200"
                                            }`}
                                        >
                                            <Star size={13} className={isBookmarked ? "fill-yellow-500 text-yellow-500" : ""} />
                                            {isBookmarked ? "Bookmarked" : "Bookmark City"}
                                        </button>
                                    </div>
                                </div>
                                <div className="text-right flex flex-col items-end">
                                    <div className="p-4 bg-slate-50 rounded-full shadow-inner border border-slate-100/50">
                                        <WeatherIcon condition={weather.weather[0].description} size={56} />
                                    </div>
                                    <p className="text-lg font-extrabold capitalize text-slate-800 mt-3">{weather.weather[0].description}</p>
                                    <p className="text-slate-400 text-xs mt-0.5 font-medium">Feels like {Math.round(weather.main.feels_like)}{unitLabel}</p>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center text-center space-y-4 py-8">
                            <div className="p-4 bg-blue-50 rounded-full animate-pulse border border-blue-100">
                                <Navigation className="text-blue-500" size={32} />
                            </div>
                            <p className="text-slate-400 font-bold uppercase tracking-wider text-[10px] max-w-sm">
                                {loading ? "Syncing Atmospheric Data..." : "Satellite Link Offline. Search a city or enable Auto-Location."}
                            </p>
                        </div>
                    )}
                </div>

                {/* Primary Stats Info Blocks Grid */}
                {weather && (
                    <>
                        {/* Wind velocity */}
                        <SmallStatCard
                            icon={<Wind />}
                            label="Wind velocity"
                            value={`${weather.wind.speed} ${unitLabel === "°C" ? "km/h" : "mph"}`}
                            color="text-blue-500 bg-blue-50 border-blue-100/50"
                            hoverBorder="hover:border-blue-300"
                        />
                        
                        {/* AQI Tile */}
                        <div className="glass-card p-6 flex flex-col justify-between border border-slate-200/80 hover:border-indigo-300/80 transition-all text-left">
                            <div className="flex justify-between items-center text-slate-400 uppercase text-[9px] font-black tracking-widest">
                                <span>Air Quality</span>
                                <Activity size={14} className="text-indigo-500" />
                            </div>
                            <div className="mt-4">
                                <p className={`text-xl font-extrabold ${getAQIStatus(aqi).color} px-3 py-1 rounded-xl border inline-block text-xs`}>
                                    {aqi ? getAQIStatus(aqi).label : "Syncing..."}
                                </p>
                                <div className="flex items-center gap-2 mt-3.5">
                                    <div className={`w-2 h-2 rounded-full ${aqi ? 'bg-indigo-500 animate-pulse' : 'bg-slate-300'}`}></div>
                                    <span className="text-[10px] text-slate-400 font-bold uppercase">Index {aqi || 0}/5</span>
                                </div>
                            </div>
                        </div>

                        {/* Humidity */}
                        <SmallStatCard
                            icon={<Droplets />}
                            label="Humidity"
                            value={`${weather.main.humidity}%`}
                            color="text-cyan-500 bg-cyan-50 border-cyan-100/50"
                            hoverBorder="hover:border-cyan-300"
                        />
                        
                        {/* Forecast redirect card */}
                        <Link href={`/forecast?city=${weather.name}`} className="glass-card p-6 flex flex-col items-center justify-center bg-gradient-to-br from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 transition-all cursor-pointer group shadow-md shadow-blue-600/10 text-white">
                            <p className="text-white font-bold text-sm mb-1.5 group-hover:translate-x-1 transition-transform flex items-center gap-2">
                                Full Analytics <ArrowRight size={16} />
                            </p>
                            <span className="text-[9px] text-blue-100 uppercase tracking-widest font-extrabold">5-Day Outlook</span>
                        </Link>
                    </>
                )}
            </div>

            {/* Upscaled Secondary Advanced Analytics Bento Grid */}
            {weather && comfort && (
                <div className="animate-in slide-in-from-bottom-6 duration-700 space-y-4">
                    <div className="flex items-center gap-2 text-left pt-2">
                        <Activity size={16} className="text-blue-500 animate-pulse" />
                        <h4 className="text-[11px] font-black uppercase tracking-widest text-slate-400">Advanced Atmospheric Analytics</h4>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5">
                        
                        {/* 1. Comfort Rating Score */}
                        <div className="glass-card p-6 flex flex-col justify-between border border-slate-200/80 hover:border-emerald-300/80 transition-all text-left">
                            <div className="flex justify-between items-center text-slate-400 uppercase text-[9px] font-black tracking-widest">
                                <span>Comfort Rating</span>
                                <Heart size={14} className="text-emerald-500" />
                            </div>
                            <div className="my-2.5">
                                <div className="flex items-baseline gap-1.5">
                                    <span className="text-4xl font-extrabold text-slate-900 tracking-tighter">{comfort.score}</span>
                                    <span className="text-xs text-slate-400">/100</span>
                                </div>
                                <span className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded-md border ${comfort.color} inline-block mt-2`}>
                                    {comfort.label}
                                </span>
                            </div>
                            <p className="text-[10px] text-slate-500 font-semibold italic border-t border-slate-100 pt-2 leading-relaxed">
                                {comfort.tip}
                            </p>
                        </div>

                        {/* 2. Solar times */}
                        <div className="glass-card p-6 flex flex-col justify-between border border-slate-200/80 hover:border-amber-300/80 transition-all text-left">
                            <div className="flex justify-between items-center text-slate-400 uppercase text-[9px] font-black tracking-widest">
                                <span>Solar Schedule</span>
                                <Compass size={14} className="text-amber-500" />
                            </div>
                            <div className="mt-3.5 space-y-2.5">
                                <div className="flex items-center justify-between">
                                    <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1.5 uppercase">
                                        <Sunrise size={13} className="text-amber-500" /> Sunrise
                                    </span>
                                    <span className="text-xs font-bold text-slate-800">
                                        {formatLocalTime(weather.sys?.sunrise, weather.timezone)}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between border-t border-slate-100 pt-2.5">
                                    <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1.5 uppercase">
                                        <Sunset size={13} className="text-orange-500" /> Sunset
                                    </span>
                                    <span className="text-xs font-bold text-slate-800">
                                        {formatLocalTime(weather.sys?.sunset, weather.timezone)}
                                    </span>
                                </div>
                            </div>
                            <span className="text-[9px] text-slate-400 italic font-semibold mt-2 block uppercase text-right">
                                UTC {weather.timezone >= 0 ? `+${weather.timezone/3600}` : weather.timezone/3600} hours
                            </span>
                        </div>

                        {/* 3. Barometric Pressure */}
                        <div className="glass-card p-6 flex flex-col justify-between border border-slate-200/80 hover:border-blue-300/80 transition-all text-left">
                            <div className="flex justify-between items-center text-slate-400 uppercase text-[9px] font-black tracking-widest">
                                <span>Pressure</span>
                                <Gauge size={14} className="text-blue-500" />
                            </div>
                            <div className="my-2.5">
                                <p className="text-3xl font-extrabold text-slate-900 tracking-tighter">
                                    {weather.main.pressure} <span className="text-xs font-bold text-slate-400">hPa</span>
                                </p>
                                <span className="text-[9px] font-bold uppercase text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200/60 inline-block mt-2">
                                    {weather.main.pressure > 1013 ? "High Pressure" : "Low / Normal"}
                                </span>
                            </div>
                            <p className="text-[10px] text-slate-400 leading-relaxed font-semibold border-t border-slate-100 pt-2">
                                Pressure affects wind and atmospheric fronts.
                            </p>
                        </div>

                        {/* 4. Thermal Extremes */}
                        <div className="glass-card p-6 flex flex-col justify-between border border-slate-200/80 hover:border-rose-300/80 transition-all text-left">
                            <div className="flex justify-between items-center text-slate-400 uppercase text-[9px] font-black tracking-widest">
                                <span>Daily Extremes</span>
                                <Thermometer size={14} className="text-rose-500" />
                            </div>
                            <div className="mt-3.5 space-y-2.5">
                                <div className="flex items-center justify-between">
                                    <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1.5 uppercase">
                                        High Temp
                                    </span>
                                    <span className="text-xs font-bold text-rose-600">
                                        {Math.round(weather.main.temp_max)}{unitLabel}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between border-t border-slate-100 pt-2.5">
                                    <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1.5 uppercase">
                                        Low Temp
                                    </span>
                                    <span className="text-xs font-bold text-blue-500">
                                        {Math.round(weather.main.temp_min)}{unitLabel}
                                    </span>
                                </div>
                            </div>
                            <span className="text-[9px] text-slate-400 italic font-semibold mt-2 block uppercase text-right">
                                Core satellite reading
                            </span>
                        </div>
                    </div>
                </div>
            )}

            {/* Popular preset cities for first boot */}
            {!weather && !loading && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-in slide-in-from-bottom-4 duration-700">
                    {["Lahore", "London", "Tokyo", "New York"].map((c) => (
                        <div
                            key={c}
                            onClick={() => handleSearch(null, c)}
                            className="glass-card p-4 hover:bg-blue-50/50 cursor-pointer flex justify-between items-center transition-all group border border-slate-200/60 hover:border-blue-300"
                        >
                            <span className="text-xs font-bold text-slate-500 group-hover:text-slate-800 uppercase tracking-wider">{c}</span>
                            <div className="p-1.5 bg-slate-100 rounded-lg group-hover:bg-blue-600 transition-colors">
                                <Search size={12} className="text-slate-500 group-hover:text-white" />
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

function SmallStatCard({ icon, label, value, color, hoverBorder }) {
    return (
        <div className={`glass-card p-6 flex flex-col items-start text-left space-y-3.5 border border-slate-200/80 transition-all ${hoverBorder}`}>
            <div className={`p-2.5 rounded-2xl border ${color}`}>{icon}</div>
            <div className="space-y-1">
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{label}</p>
                <p className="text-2xl font-black text-slate-800 tracking-tight">{value}</p>
            </div>
        </div>
    );
}

function WeatherIcon({ condition, size }) {
    const cond = condition.toLowerCase();
    if (cond.includes("rain") || cond.includes("drizzle") || cond.includes("shower")) {
        return <CloudRain size={size} className="text-blue-500" />;
    }
    if (cond.includes("sun") || cond.includes("clear") || cond.includes("fair")) {
        return <Sun size={size} className="text-amber-500 animate-pulse" />;
    }
    if (cond.includes("thunder") || cond.includes("lightning") || cond.includes("storm")) {
        return <CloudLightning size={size} className="text-indigo-600 animate-bounce" />;
    }
    return <Cloud size={size} className="text-slate-400" />;
}