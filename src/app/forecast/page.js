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

        // Naya: LocalStorage se unit preference uthana (Celsius/Fahrenheit ke liye)
        const savedUnit =
            typeof window !== "undefined"
                ? localStorage.getItem("weatherUnit") || "metric"
                : "metric";

        try {
            // Updated fetch: units parameter ab dynamically pass ho raha hai
            const res = await fetch(
                `/api/weather?city=${targetCity}&type=forecast&units=${savedUnit}`
            );
            const data = await res.json();

            if (!res.ok || data.error) {
                throw new Error(
                    data.error || "City not found. Please check spelling."
                );
            }

            if (data.list) {
                const daily = data.list
                    .filter((_, i) => i % 8 === 0)
                    .map((item) => ({
                        name: new Date(item.dt_txt).toLocaleDateString(
                            "en-US",
                            { weekday: "short" }
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
        <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in duration-500 pb-10">
            <header className="flex flex-col sm:flex-row justify-between items-center gap-4">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-blue-500/10 rounded-2xl text-blue-500">
                        <CloudSun size={28} />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-white">
                            Extended Forecast
                        </h1>
                        <p className="text-slate-500 text-xs italic">
                            Trends for {displayCity}
                        </p>
                    </div>
                </div>

                <form
                    onSubmit={fetchForecast}
                    className="flex gap-2 w-full sm:w-auto"
                >
                    <div className="relative flex-1 sm:w-64">
                        <input
                            className={`w-full bg-white/5 border ${
                                error ? "border-red-500/50" : "border-white/10"
                            } p-2.5 pl-9 rounded-xl text-sm outline-none focus:ring-1 focus:ring-blue-500/50 transition-all text-white`}
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
                        className="bg-blue-600 hover:bg-blue-500 p-2.5 rounded-xl font-semibold text-sm transition-all flex items-center gap-2 active:scale-95 disabled:opacity-50 text-white"
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

            <div
                className={`glass-card p-6 h-[320px] w-full relative transition-opacity ${
                    loading ? "opacity-50" : "opacity-100"
                }`}
            >
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                        data={forecast}
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
                                    stopOpacity={0.2}
                                />
                                <stop
                                    offset="95%"
                                    stopColor="#3b82f6"
                                    stopOpacity={0}
                                />
                            </linearGradient>
                        </defs>
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
                            tick={{ fontSize: 10 }}
                        />
                        <YAxis
                            stroke="#475569"
                            unit="°"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 10 }}
                        />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: "#0f172a",
                                border: "1px solid #1e293b",
                                borderRadius: "12px",
                                fontSize: "11px",
                            }}
                        />
                        <Area
                            type="monotone"
                            dataKey="temp"
                            stroke="#3b82f6"
                            strokeWidth={3}
                            fillOpacity={1}
                            fill="url(#colorTemp)"
                            animationDuration={800}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>

            <div
                className={`grid grid-cols-2 sm:grid-cols-5 gap-3 transition-opacity ${
                    loading ? "opacity-50" : "opacity-100"
                }`}
            >
                {forecast.map((day, i) => (
                    <div
                        key={i}
                        className={`glass-card p-4 flex flex-col items-center gap-2 transition-all duration-300 border-b-2 ${
                            activeIndex === i
                                ? "border-blue-500 bg-blue-500/5 translate-y-[-4px]"
                                : "border-transparent opacity-80"
                        }`}
                        onMouseEnter={() => setActiveIndex(i)}
                    >
                        <span className="text-slate-500 text-[9px] font-bold uppercase">
                            {day.name}
                        </span>
                        <div className="text-2xl font-bold text-white">
                            {day.temp}°
                        </div>
                        <div className="text-[9px] text-blue-400 font-bold uppercase px-2 py-0.5 bg-blue-500/10 rounded-md truncate w-full text-center">
                            {day.condition}
                        </div>
                        <div className="w-full flex justify-between mt-2 pt-2 border-t border-white/5 text-slate-500">
                            <div className="flex items-center gap-1">
                                <Wind size={10} />
                                <span className="text-[9px]">{day.wind}k</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <Droplets size={10} />
                                <span className="text-[9px]">
                                    {day.humidity}%
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
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
