import { NextResponse } from "next/server";

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const city = searchParams.get("city");
    const lat = searchParams.get("lat");
    const lon = searchParams.get("lon");
    const type = searchParams.get("type") || "weather";
    const units = searchParams.get("units") || "metric";
    const API_KEY = process.env.NEXT_PUBLIC_WEATHER_API_KEY;

    try {
        let url;

        // 1. Agar type AQI hai to coordinates zaroori hain
        if (type === "aqi") {
            url = `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${API_KEY}`;
        } 
        // 2. Agar latitude aur longitude maujood hain to coordinates se fetch karo
        else if (lat && lon) {
            const endpoint = type === "forecast" ? "forecast" : "weather";
            url = `https://api.openweathermap.org/data/2.5/${endpoint}?lat=${lat}&lon=${lon}&units=${units}&appid=${API_KEY}`;
        } 
        // 3. Warna City name se fetch karo (Search box ke liye)
        else if (city) {
            const endpoint = type === "forecast" ? "forecast" : "weather";
            url = `https://api.openweathermap.org/data/2.5/${endpoint}?q=${city}&units=${units}&appid=${API_KEY}`;
        } 
        else {
            return NextResponse.json({ error: "Missing location parameters" }, { status: 400 });
        }

        const res = await fetch(url);
        const data = await res.json();

        if (!res.ok) {
            return NextResponse.json({ error: data.message }, { status: res.status });
        }

        return NextResponse.json(data);
    } catch (err) {
        return NextResponse.json({ error: "Network or Server Error" }, { status: 500 });
    }
}