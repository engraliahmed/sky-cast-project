"use client";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    CartesianGrid,
} from "recharts";
import {
    CloudSun,
    Search,
    RefreshCw,
    Wind,
    Droplets,
    AlertCircle,
    ArrowRight,
    Compass,
    TrendingUp
} from "lucide-react";

const dummyData = [
    { name: "Mon", temp: 22, condition: "Clear", wind: 5, humidity: 40 },
    { name: "Tue", temp: 25, condition: "Sunny", wind: 7, humidity: 35 },
    { name: "Wed", temp: 18, condition: "Rainy", wind: 12, humidity: 80 },
    { name: "Thu", temp: 21, condition: "Cloudy", wind: 8, humidity: 60 },
    { name: "Fri", temp: 24, condition: "Clear", wind: 6, humidity: 45 },
];

function ForecastContent() {
    const searchParams = useSearchParams();
    const urlCity = searchParams.get("city");

    const [city, setCity] = useState(urlCity || "Lahore");
    const [displayCity, setDisplayCity] = useState(urlCity || "Lahore");
    const [forecast, setForecast] = useState(dummyData);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [activeIndex, setActiveIndex] = useState(0);

    const fetchForecast = async (e, targetCity = city) => {
        if (e) e.preventDefault();
        if (!targetCity.trim()) return;
        setLoading(true);
        setError("");

        const savedUnit =
            typeof window !== "undefined"
                ? localStorage.getItem("weatherUnit") || "metric"
                : "metric";

        try {
            const res = await fetch(
                `/api/weather?city=${targetCity}&type=forecast&units=${savedUnit}`,
            );
            const data = await res.json();
            if (!res.ok || data.error)
                throw new Error(data.error || "City not found.");

            if (data.list) {
                const daily = data.list
                    .filter((_, i) => i % 8 === 0)
                    .map((item) => ({
                        name: new Date(item.dt_txt).toLocaleDateString(
                            "en-US",
                            { weekday: "short" },
                        ),
                        temp: Math.round(item.main.temp),
                        condition: item.weather[0].main,
                        wind: Math.round(item.wind.speed),
                        humidity: item.main.humidity,
                    }));
                setForecast(daily);
                setDisplayCity(targetCity);
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (urlCity) {
            setCity(urlCity);
            fetchForecast(null, urlCity);
        } else {
            fetchForecast();
        }
    }, [urlCity]);

    // Dynamic atmospheric analytics summary
    const getAtmosphericSummary = (forecastList) => {
        if (!forecastList || forecastList.length === 0) return null;
        let minTemp = Infinity;
        let maxTemp = -Infinity;
        let conditions = {};
        let totalHumidity = 0;
        
        forecastList.forEach(day => {
            if (day.temp < minTemp) minTemp = day.temp;
            if (day.temp > maxTemp) maxTemp = day.temp;
            conditions[day.condition] = (conditions[day.condition] || 0) + 1;
            totalHumidity += day.humidity;
        });
        
        const avgHumidity = Math.round(totalHumidity / forecastList.length);
        const uniqueConds = Object.keys(conditions);
        let dominantCondition = uniqueConds.reduce((a, b) => conditions[a] > conditions[b] ? a : b);
        
        let advisory = "Atmosphere stable. A great week for travel and outdoor arrangements!";
        if (dominantCondition.toLowerCase().includes("rain") || dominantCondition.toLowerCase().includes("drizzle") || dominantCondition.toLowerCase().includes("cloudy")) {
            advisory = "Precipitation or overcast expected. Commuters should verify rain forecasts.";
        } else if (dominantCondition.toLowerCase().includes("clear") || dominantCondition.toLowerCase().includes("sunny")) {
            advisory = "Skies clear. Ideal weather patterns for outdoor and physical training.";
        } else if (maxTemp > 30) {
            advisory = "High thermal heat forecasted. Ensure access to hydration systems.";
        }
        
        return { minTemp, maxTemp, dominantCondition, avgHumidity, advisory };
    };

    const summary = getAtmosphericSummary(forecast);

    return (
        <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in duration-500 p-4 md:p-0 pb-24 md:pb-10 text-slate-800">
            {/* Header Section */}
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="flex items-center gap-4 text-left">
                    <div className="p-3 bg-blue-50 border border-blue-100 rounded-2xl text-blue-600">
                        <CloudSun size={28} />
                    </div>
                    <div className="text-left">
                        <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">
                            Extended Forecast
                        </h1>
                        <p className="text-slate-400 text-xs font-semibold">
                            Atmospheric trends for <span className="text-blue-600 font-bold">{displayCity}</span>
                        </p>
                    </div>
                </div>

                <form
                    onSubmit={fetchForecast}
                    className="flex gap-2.5 w-full md:w-auto"
                >
                    <div className="relative flex-1 md:w-64">
                        <input
                            className={`w-full bg-white border ${error ? "border-red-400" : "border-slate-200"} p-2.5 pl-9.5 rounded-xl text-sm outline-none focus:border-blue-500 shadow-sm focus:ring-4 focus:ring-blue-100 transition-all text-slate-800 placeholder-slate-400`}
                            placeholder="Search city..."
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                        />
                        <Search
                            className="absolute left-3 top-3 text-slate-400"
                            size={16}
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-blue-600 hover:bg-blue-500 px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider text-white shadow-md shadow-blue-600/10 transition-all flex items-center gap-2 active:scale-95 disabled:opacity-50"
                    >
                        {loading ? (
                            <RefreshCw className="animate-spin" size={14} />
                        ) : (
                            "Update"
                        )}
                    </button>
                </form>
            </header>

            {error && (
                <div className="flex items-center gap-3 p-4 bg-rose-50 border border-rose-100 rounded-2xl text-rose-600 text-sm font-bold text-left animate-in slide-in-from-top-2">
                    <AlertCircle size={18} />
                    <p>{error}</p>
                </div>
            )}

            {/* Chart Container */}
            <div
                className={`glass-card p-3 md:p-6 h-[250px] md:h-[320px] w-full relative transition-opacity border border-slate-200/80 ${loading ? "opacity-50" : "opacity-100"}`}
            >
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                        data={forecast}
                        margin={{ top: 15, right: 10, left: -25, bottom: 5 }}
                        onMouseMove={(v) =>
                            v.activeTooltipIndex !== undefined &&
                            setActiveIndex(v.activeTooltipIndex)
                        }
                    >
                        <defs>
                            <linearGradient
                                id="colorTemp"
                                x1="0"
                                y1="0"
                                x2="0"
                                y2="1"
                            >
                                <stop
                                    offset="5%"
                                    stopColor="#2563eb"
                                    stopOpacity={0.2}
                                />
                                <stop
                                    offset="95%"
                                    stopColor="#2563eb"
                                    stopOpacity={0}
                                />
                            </linearGradient>
                        </defs>

                        <CartesianGrid
                            strokeDasharray="3 3"
                            stroke="#e2e8f0"
                            vertical={false}
                        />

                        <XAxis
                            dataKey="name"
                            stroke="#94a3b8"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 10, fontWeight: "bold" }}
                            dy={10}
                        />

                        <YAxis
                            stroke="#94a3b8"
                            unit="°"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 10, fontWeight: "bold" }}
                        />

                        <Tooltip
                            cursor={{ stroke: "#2563eb", strokeWidth: 2, strokeDasharray: "4 4" }}
                            contentStyle={{
                                backgroundColor: "#ffffff",
                                border: "1px solid #e2e8f0",
                                borderRadius: "12px",
                                fontSize: "11px",
                                padding: "10px",
                                color: "#1e293b",
                                boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.04)",
                            }}
                        />

                        <Area
                            type="monotone"
                            dataKey="temp"
                            stroke="#2563eb"
                            strokeWidth={3}
                            fillOpacity={1}
                            fill="url(#colorTemp)"
                            animationDuration={1000}
                            dot={{
                                r: 5,
                                fill: "#2563eb",
                                strokeWidth: 2.5,
                                stroke: "#ffffff",
                            }}
                            activeDot={{ r: 7, fill: "#2563eb", strokeWidth: 0 }}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>

            {/* Cards Section: Mobile Swipe + Desktop Grid */}
            <div className="relative">
                {/* Mobile Hint Arrow */}
                <div className="md:hidden absolute -right-2 top-1/2 -translate-y-1/2 z-10 animate-pulse text-blue-500/50">
                    <ArrowRight size={20} />
                </div>

                <div className="flex md:grid md:grid-cols-5 gap-5 overflow-x-auto md:overflow-visible pb-4 md:pb-0 scrollbar-hide">
                    {forecast.map((day, i) => (
                        <div
                            key={i}
                            className={`glass-card p-5 min-w-[145px] md:min-w-0 flex flex-col items-center gap-2.5 transition-all duration-300 border-b-4 text-center cursor-pointer ${
                                activeIndex === i
                                    ? "border-blue-600 bg-blue-50/50 shadow-md translate-y-[-4px]"
                                    : "border-transparent bg-white/60 hover:bg-white/90"
                            }`}
                            onMouseEnter={() => setActiveIndex(i)}
                        >
                            <span className="text-slate-400 text-[10px] font-black uppercase tracking-widest">
                                {day.name}
                            </span>
                            <div className="text-3xl font-extrabold text-slate-800">
                                {day.temp}°
                            </div>
                            <div className="text-[9px] text-blue-600 bg-blue-50 border border-blue-100/60 font-black uppercase px-2.5 py-1 rounded-lg w-full truncate">
                                {day.condition}
                            </div>
                            <div className="w-full flex justify-between mt-2.5 pt-2.5 border-t border-slate-100 text-slate-400">
                                <div className="flex items-center gap-1.5">
                                    <Wind size={12} className="text-slate-400" />
                                    <span className="text-[10px] font-bold text-slate-600">
                                        {day.wind}
                                    </span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <Droplets size={12} className="text-slate-400" />
                                    <span className="text-[10px] font-bold text-slate-600">
                                        {day.humidity}%
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Upscaled Real-Time Forecast Analysis */}
            {summary && (
                <div className="glass-card p-6 flex flex-col md:flex-row items-start md:items-center gap-6 border border-slate-200/80 hover:border-blue-300 text-left bg-gradient-to-tr from-white to-blue-50/20">
                    <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl shadow-inner border border-blue-100">
                        <TrendingUp size={24} className="animate-float" />
                    </div>
                    <div className="flex-1 space-y-1">
                        <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                            Atmospheric Weekly Outlook
                        </h3>
                        <p className="text-xs text-slate-500 leading-relaxed font-semibold">
                            {summary.advisory} We estimate an average barometric humidity of <span className="font-bold text-slate-700">{summary.avgHumidity}%</span>, with thermal intervals fluctuating between <span className="text-blue-600 font-bold">{summary.minTemp}°</span> and <span className="text-rose-600 font-bold">{summary.maxTemp}°</span>.
                        </p>
                    </div>
                    <div className="flex items-center gap-4 bg-white px-4 py-3 rounded-2xl border border-slate-200 shadow-sm">
                        <div className="text-center">
                            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block">Dominant</span>
                            <span className="text-xs font-bold text-blue-600 uppercase">{summary.dominantCondition}</span>
                        </div>
                        <div className="w-[1px] h-8 bg-slate-200"></div>
                        <div className="text-center">
                            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block">Humidity</span>
                            <span className="text-xs font-bold text-slate-800">{summary.avgHumidity}%</span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default function ForecastPage() {
    return (
        <Suspense
            fallback={
                <div className="p-20 text-center text-blue-500 font-bold animate-pulse">
                    Synchronizing Forecast...
                </div>
            }
        >
            <ForecastContent />
        </Suspense>
    );
}
