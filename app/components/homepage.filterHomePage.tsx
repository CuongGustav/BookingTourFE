'use client';

import { useState } from "react";
const API_URL = process.env.NEXT_PUBLIC_URL_API;

export default function FilterHomePage() {
    const [destination, setDestination] = useState("");
    const [departureDay, setDepartDay] = useState(""); 
    const [budget, setBudget] = useState("");
    const [loading, setLoading] = useState(false);

    const handleFilter = async () => {
        if (!destination.trim() && !departureDay && !budget) {
            alert("Vui lòng chọn ít nhất một tiêu chí tìm kiếm");
            return;
        }
        setLoading(true);
        const payload = {
            destination: destination,
            departure_day: departureDay,
            budget: budget
        };
        try {
            const res = await fetch(`${API_URL}/tour/filterTourHomepage`, {
                method: "POST",
                headers: {
                "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });
            const data = await res.json();
            if (res.ok) {
                alert("Thanh công")
            } else {
                alert(data.message || "Có lỗi xảy ra");
            }
        } catch (err) {
            console.error("Lỗi kết nối:", err);
            alert("Không thể kết nối đến server");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-full max-w-5xl px-4">
                <div className="bg-white rounded-2xl shadow-2xl p-6">
                    <div className="flex flex-wrap gap-4 items-end">
                        {/* destination */}
                        <div className="flex-1 min-w-[200px] flex flex-col gap-2">
                            <label className="block text-sm font-medium">
                                Bạn muốn đi đâu? <span className="text-red-500">*</span>
                            </label>
                            <input
                            type="text"
                            value={destination}
                            onChange={(e) => setDestination(e.target.value)}
                            placeholder="Ví dụ: Bắc Ninh, Hà Nội..."
                            className="w-full h-12 pl-4 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        {/* departure day */}
                        <div className="flex-1 min-w-[200px] flex flex-col gap-2">
                            <label className="block text-sm font-medium">
                                Ngày đi <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="date"
                                value={departureDay}
                                onChange={(e) => setDepartDay(e.target.value)}
                                className="w-full h-12 px-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                        </div>
                        {/* budget */}
                        <div className="flex-1 min-w-[200px] flex flex-col gap-2">
                            <label className="block text-sm font-medium">
                                Ngân sách <span className="text-red-500">*</span>
                            </label>
                            <select
                                value={budget}
                                onChange={(e) => setBudget(e.target.value)}
                                className="w-full h-12 px-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                            >
                                <option value="">Chọn mức giá</option>
                                <option value="under-5">Dưới 5 triệu</option>
                                <option value="5-10">Từ 5 - 10 triệu</option>
                                <option value="10-20">Từ 10 - 20 triệu</option>
                                <option value="over-20">Trên 20 triệu</option>
                            </select>
                        </div>
                        {/* button search */}
                        <button
                            onClick={handleFilter}
                            disabled={loading}
                            className="h-12 px-8 bg-blue-900 text-white rounded-lg font-bold hover:bg-blue-700 disabled:bg-gray-400 cursor-pointer transition flex items-center justify-center gap-2"
                        >
                            {loading ? (
                            <>Đang tìm...</>
                            ) : (
                            <>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                                </svg>
                            </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}