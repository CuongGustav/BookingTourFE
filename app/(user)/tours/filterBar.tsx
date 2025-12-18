"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { departDestinationData } from "@/app/data/departdestination";
import { provincesData } from "@/app/data/province";
import { ChevronDown, X } from "lucide-react"; 

export default function FilterBar() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [budget, setBudget] = useState(searchParams.get("budget") || "");
    const [departDestination, setDepartDestination] = useState(searchParams.get("departDestination") || "");
    const [destination, setDestination] = useState(searchParams.get("destination") || "");
    const [date, setDate] = useState(searchParams.get("date") || "");

    // State cho dropdown
    const [openDepartDestination, setOpenDepartDestination] = useState(false);
    const [openDestination, setOpenDestination] = useState(false);

    const departureRef = useRef<HTMLDivElement>(null);
    const destinationRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (departureRef.current && !departureRef.current.contains(event.target as Node)) {
                setOpenDepartDestination(false);
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
        if (departDestination) params.set("departDestination", departDestination);
        if (destination) params.set("destination", destination);
        if (date) params.set("date", date);
        router.push(`/tours?${params.toString()}`);
    };

    // clear filter
    const clearAllFilter = () => {
        setBudget("");
        setDepartDestination("");
        setDestination("");
        setDate("");
        router.push("/tours");
    };
    const hasActiveFilter = budget || departDestination || destination || date;

    const getDepartDisplay = () => {
        if (!departDestination) return "Tất cả";
        const found = departDestinationData.find(d => d.name === departDestination);
        return found ? found.name : "Tất cả";
    };

    const getDestinationDisplay = () => {
        if (!destination) return "Tất cả";
        const found = provincesData.find(p => p.name === destination);
        return found ? found.name : "Tất cả";
    };

    return (
        <div className="bg-white rounded-xl shadow-black shadow-sm p-4 space-y-4">
            {/* Budget */}
            <div className="relative">
                {hasActiveFilter && (
                    <button 
                        className="absolute top-0 right-2 text-red-500 outline-none active:outline-none cursor-pointer font-bold"
                        onClick={clearAllFilter}
                    >
                        Xóa
                    </button>
                )}
                <p className="font-semibold mb-2">Ngân sách</p>
                <div className="grid grid-cols-2 gap-2">
                    {["<5", "5-10", "10-20", ">20"].map((b) => (
                        <button
                            key={b}
                            onClick={() => setBudget(budget === b ? "" : b)}
                            className={`border rounded px-2 py-1 cursor-pointer transition  ${
                                budget === b
                                    ? "bg-blue-900 text-white border-blue-900"
                                    : "border-gray-300 hover:border-blue-100 hover:bg-blue-100"
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
            {/* derpart destiantion */}
            <div ref={departureRef} className="relative">
                <p className="font-semibold mb-2">Điểm khởi hành</p>
                <button
                    onClick={() => setOpenDepartDestination(!openDepartDestination)}
                    className="border rounded p-2 w-full text-left flex justify-between items-center cursor-pointer"
                >
                    <span>{getDepartDisplay()}</span>
                    <ChevronDown className={`w-5 h-5 transition ${openDepartDestination ? "rotate-180" : ""}`} />
                </button>

                {openDepartDestination && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-white border rounded-lg shadow-lg max-h-60 overflow-y-auto z-10 ">
                        <button
                            onClick={() => {
                                setDepartDestination("");
                                setOpenDepartDestination(false);
                            }}
                            className={`w-full flex items-center justify-between px-4 py-3 transition font-medium cursor-pointer ${
                                !departDestination
                                    ? "bg-blue-900 text-white"
                                    : "hover:bg-gray-100"
                            }`}
                        >
                            <span>Tất cả</span>
                        </button>

                        {departDestinationData.map((item) => (
                            <button
                                key={item.id}
                                onClick={() => {
                                    setDepartDestination(item.name);
                                    setOpenDepartDestination(false);
                                }}
                                className={`w-full flex items-center justify-between px-4 py-3 transition font-medium cursor-pointer ${
                                    departDestination === item.name
                                        ? "bg-blue-900 text-white"
                                        : "hover:bg-gray-100"
                                }`}
                            >
                                <span>{item.name}</span>
                            </button>
                        ))}
                    </div>
                )}
            </div>

            <div ref={destinationRef} className="relative">
                <p className="font-semibold mb-2">Điểm đến</p>
                <button
                    onClick={() => setOpenDestination(!openDestination)}
                    className="border rounded p-2 w-full text-left flex justify-between items-center cursor-pointer"
                >
                    <span>{getDestinationDisplay()}</span>
                    <ChevronDown className={`w-5 h-5 transition ${openDestination ? "rotate-180" : ""}`} />
                </button>

                {openDestination && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-white border rounded-lg shadow-lg max-h-60 overflow-y-auto z-10">
                        <button
                            onClick={() => {
                                setDestination("");
                                setOpenDestination(false);
                            }}
                            className={`w-full flex items-center justify-between px-4 py-3 transition font-medium cursor-pointer ${
                                !destination
                                    ? "bg-blue-900 text-white"
                                    : "hover:bg-gray-100"
                            }`}
                        >
                            <span>Tất cả</span>
                        </button>

                        {provincesData.map((item) => (
                            <button
                                key={item.id}
                                onClick={() => {
                                    setDestination(item.name);
                                    setOpenDestination(false);
                                }}
                                className={`w-full flex items-center justify-between px-4 py-3 transition font-medium cursor-pointer ${
                                    destination === item.name
                                        ? "bg-blue-900 text-white"
                                        : "hover:bg-gray-100"
                                }`}
                            >
                                <span>{item.name}</span>
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Ngày khởi hành */}
            <div>
                <div className=" flex items-center justify-between">
                    <p className="font-semibold mb-2">Ngày khởi hành</p>
                    {date && (
                        <button onClick={() => setDate("")} className="text-red-500 text-sm hover:text-red-600 font-bold, cursor-pointer">
                            <X className="font-bold"/>
                        </button>
                    )}
                </div>
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