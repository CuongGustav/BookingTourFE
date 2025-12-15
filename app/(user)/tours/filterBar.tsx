"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { departDestinationData } from "@/app/data/departdestination";
import { provincesData } from "@/app/data/province";
import { ChevronDown } from "lucide-react"; 

export default function FilterBar() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [budget, setBudget] = useState(searchParams.get("budget") || "");
    const [departure, setDeparture] = useState(searchParams.get("departure") || "");
    const [destination, setDestination] = useState(searchParams.get("destination") || "");
    const [date, setDate] = useState(searchParams.get("date") || "");

    // State cho dropdown
    const [openDeparture, setOpenDeparture] = useState(false);
    const [openDestination, setOpenDestination] = useState(false);

    const departureRef = useRef<HTMLDivElement>(null);
    const destinationRef = useRef<HTMLDivElement>(null);

    // Đóng dropdown khi click bên ngoài
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (departureRef.current && !departureRef.current.contains(event.target as Node)) {
                setOpenDeparture(false);
            }
            if (destinationRef.current && !destinationRef.current.contains(event.target as Node)) {
                setOpenDestination(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const applyFilter = () => {
        const params = new URLSearchParams();
        if (budget) params.set("budget", budget);
        if (departure) params.set("departure", departure);
        if (destination) params.set("destination", destination);
        if (date) params.set("date", date);
        router.push(`/tours?${params.toString()}`);
    };

    return (
        <div className="bg-white rounded-xl shadow-black shadow-sm p-4 space-y-4">
            <h3 className="font-bold text-lg">BỘ LỌC TÌM KIẾM</h3>

            {/* Budget */}
            <div>
                <p className="font-semibold mb-2">Ngân sách</p>
                <div className="grid grid-cols-2 gap-2">
                    {["<5", "5-10", "10-20", ">20"].map((b) => (
                        <button
                            key={b}
                            onClick={() => setBudget(b)}
                            className={`border rounded px-2 py-1 cursor-pointer transition ${
                                budget === b
                                    ? "bg-blue-900 text-white border-blue-900"
                                    : "border-gray-300 hover:border-gray-500"
                            }`}
                        >
                            {b === "<5" && "Dưới 5 triệu"}
                            {b === "5-10" && "5 - 10 triệu"}
                            {b === "10-20" && "10 - 20 triệu"}
                            {b === ">20" && "Trên 20 triệu"}
                        </button>
                    ))}
                </div>
            </div>

            {/* Điểm khởi hành (destination) */}
            <div ref={destinationRef} className="relative">
                <p className="font-semibold mb-2">Điểm khởi hành</p>
                <button
                    onClick={() => setOpenDestination(!openDestination)}
                    className="border rounded p-2 w-full text-left flex justify-between items-center hover:border-gray-500"
                >
                    <span className={destination ? "" : "text-gray-500"}>
                        {destination || "-- Chọn điểm khởi hành --"}
                    </span>
                    <ChevronDown className={`w-5 h-5 transition ${openDestination ? "rotate-180" : ""}`} />
                </button>

                {openDestination && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-white border rounded-lg shadow-lg max-h-60 overflow-y-auto z-10">
                        {departDestinationData.map((p) => (
                            <button
                                key={p.id}
                                onClick={() => {
                                    setDestination(p.name);
                                    setOpenDestination(false);
                                }}
                                className="block w-full text-left px-4 py-2 hover:bg-blue-50 transition"
                            >
                                {p.name}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Điểm đến (departure) */}
            <div ref={departureRef} className="relative">
                <p className="font-semibold mb-2">Điểm đến</p>
                <button
                    onClick={() => setOpenDeparture(!openDeparture)}
                    className="border rounded p-2 w-full text-left flex justify-between items-center hover:border-gray-500"
                >
                    <span className={departure ? "" : "text-gray-500"}>
                        {departure || "-- Chọn điểm đến --"}
                    </span>
                    <ChevronDown className={`w-5 h-5 transition ${openDeparture ? "rotate-180" : ""}`} />
                </button>

                {openDeparture && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-white border rounded-lg shadow-lg max-h-60 overflow-y-auto z-10">
                        {provincesData.map((p) => (
                            <button
                                key={p.id}
                                onClick={() => {
                                    setDeparture(p.name);
                                    setOpenDeparture(false);
                                }}
                                className="block w-full text-left px-4 py-2 hover:bg-blue-50 transition"
                            >
                                {p.name}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Ngày khởi hành */}
            <div>
                <p className="font-semibold mb-2">Ngày khởi hành</p>
                <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="border rounded p-2 w-full"
                />
            </div>

            <button
                onClick={applyFilter}
                className="w-full bg-blue-900 text-white py-2 rounded font-bold hover:bg-blue-800 transition"
            >
                Áp dụng
            </button>
        </div>
    );
}