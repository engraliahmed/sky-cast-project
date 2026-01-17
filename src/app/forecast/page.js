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

    return (
        <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in duration-500 p-4 md:p-0 pb-24 md:pb-10 text-white">
            {/* Header Section */}
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-blue-500/10 rounded-2xl text-blue-500">
                        <CloudSun size={28} />
                    </div>
                    <div className="text-left">
                        <h1 className="text-2xl font-bold tracking-tight">
                            Extended Forecast
                        </h1>
                        <p className="text-slate-500 text-xs italic">
                            Trends for {displayCity}
                        </p>
                    </div>
                </div>

                <form
                    onSubmit={fetchForecast}
                    className="flex gap-2 w-full md:w-auto"
                >
                    <div className="relative flex-1 md:w-64">
                        <input
                            className={`w-full bg-white/5 border ${error ? "border-red-500/50" : "border-white/10"} p-2.5 pl-9 rounded-xl text-sm outline-none focus:ring-1 focus:ring-blue-500/50 transition-all`}
                            placeholder="Search city..."
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                        />
                        <Search
                            className="absolute left-3 top-3 text-slate-500"
                            size={16}
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-blue-600 hover:bg-blue-500 px-4 py-2.5 rounded-xl font-semibold text-sm transition-all flex items-center gap-2 active:scale-95 disabled:opacity-50"
                    >
                        {loading ? (
                            <RefreshCw className="animate-spin" size={16} />
                        ) : (
                            "Update"
                        )}
                    </button>
                </form>
            </header>

            {error && (
                <div className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 text-sm">
                    <AlertCircle size={18} />
                    <p>{error}</p>
                </div>
            )}

            {/* Chart Container */}
            {/* Chart Container - Optimized for Phone */}
            <div
                className={`glass-card p-2 md:p-6 h-[250px] md:h-[320px] w-full relative transition-opacity ${loading ? "opacity-50" : "opacity-100"}`}
            >
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                        data={forecast}
                        margin={{ top: 10, right: 10, left: -20, bottom: 0 }} // Left margin negative taake phone par space bache
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
                                    stopColor="#3b82f6"
                                    stopOpacity={0.4}
                                />
                                <stop
                                    offset="95%"
                                    stopColor="#3b82f6"
                                    stopOpacity={0}
                                />
                            </linearGradient>
                        </defs>

                        {/* Grid lines ko phone par mazeed halka kiya hai */}
                        <CartesianGrid
                            strokeDasharray="3 3"
                            stroke="#ffffff05"
                            vertical={false}
                        />

                        <XAxis
                            dataKey="name"
                            stroke="#475569"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 9, fontWeight: "bold" }} // Chota font for mobile
                            dy={10}
                        />

                        <YAxis
                            stroke="#475569"
                            unit="°"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 9 }}
                            hide={false} // Phone par numbers rehne diye hain par chote
                        />

                        <Tooltip
                            cursor={{ stroke: "#3b82f6", strokeWidth: 2 }}
                            contentStyle={{
                                backgroundColor: "#0f172a",
                                border: "1px solid #1e293b",
                                borderRadius: "8px",
                                fontSize: "10px",
                                padding: "8px",
                            }}
                        />

                        <Area
                            type="monotone"
                            dataKey="temp"
                            stroke="#3b82f6"
                            strokeWidth={3}
                            fillOpacity={1}
                            fill="url(#colorTemp)"
                            animationDuration={1500}
                            dot={{
                                r: 4,
                                fill: "#3b82f6",
                                strokeWidth: 2,
                                stroke: "#0f172a",
                            }} // Har point par dot add kiya hai
                            activeDot={{ r: 6, strokeWidth: 0 }}
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

                <div className="flex md:grid md:grid-cols-5 gap-4 overflow-x-auto md:overflow-visible pb-4 md:pb-0 scrollbar-hide">
                    {forecast.map((day, i) => (
                        <div
                            key={i}
                            className={`glass-card p-4 min-w-[140px] md:min-w-0 flex flex-col items-center gap-2 transition-all duration-300 border-b-2 text-center ${
                                activeIndex === i
                                    ? "border-blue-500 bg-blue-500/5 translate-y-[-4px]"
                                    : "border-transparent opacity-80"
                            }`}
                            onMouseEnter={() => setActiveIndex(i)}
                        >
                            <span className="text-slate-500 text-[9px] font-bold uppercase tracking-widest">
                                {day.name}
                            </span>
                            <div className="text-2xl font-bold">
                                {day.temp}°
                            </div>
                            <div className="text-[9px] text-blue-400 font-bold uppercase px-2 py-0.5 bg-blue-500/10 rounded-md w-full truncate">
                                {day.condition}
                            </div>
                            <div className="w-full flex justify-between mt-2 pt-2 border-t border-white/5 text-slate-500">
                                <div className="flex items-center gap-1">
                                    <Wind size={10} />
                                    <span className="text-[9px] font-bold">
                                        {day.wind}k
                                    </span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <Droplets size={10} />
                                    <span className="text-[9px] font-bold">
                                        {day.humidity}%
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
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
