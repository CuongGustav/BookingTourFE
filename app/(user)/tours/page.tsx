'use client';

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { TourInfo } from "@/app/types/tour";
import FilterBar from "./filterBar";
import TourList from "./tourList";
import { ChevronDown } from "lucide-react"; 

const API_URL = process.env.NEXT_PUBLIC_URL_API;

export default function ToursPage () {
    const searchParams = useSearchParams();

    const [tours, setTours] = useState<TourInfo[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [destinationInfo, setDestinationInfo] = useState<{name: string;description: string;} | null>(null);
    const [sortOption, setSortOption] = useState<string>("");
    const [openSort, setOpenSort] = useState(false);

    const sortOptions = [
        { label: "Mới nhất", value: "newest" },
        { label: "Ngày khởi hành gần nhất", value: "departure_asc" },
        { label: "Giá từ thấp đến cao", value: "price_asc" },
        { label: "Giá từ cao đến thấp", value: "price_desc" },
    ];
    const getSortLabel = () => {
        const found = sortOptions.find(opt => opt.value === sortOption);
        return found ? found.label : "Sắp xếp theo";
    };
    const handleSort = (value: string) => {
        setSortOption(value);
        setOpenSort(false);

        const sorted = [...tours].sort((a, b) => {
            if (value === "newest") {
                return new Date(b.created_at || "").getTime() - new Date(a.created_at || "").getTime();
            }
            if (value === "departure_asc") {
                const dateA = a.upcoming_schedules?.[0]?.departure_date;
                const dateB = b.upcoming_schedules?.[0]?.departure_date;
                if (!dateA || !dateB) return 0;
                return new Date(dateA).getTime() - new Date(dateB).getTime();
            }
            if (value === "price_asc") {
                return (a.base_price || 0) - (b.base_price || 0);
            }
            if (value === "price_desc") {
                return (b.base_price || 0) - (a.base_price || 0);
            }
            return 0;
        });

        setTours(sorted);
    };


    useEffect(() => {
    const fetchTours = async () => {
        setLoading(true);
        setError("");

        try {
            const body = {
                budget: searchParams.get("budget"),
                departDestination: searchParams.get("departDestination"),
                destination: searchParams.get("destination"),
                date: searchParams.get("date"),
            };

            const res = await fetch(`${API_URL}/tour/filterTour`, {
                method: "POST",
                headers: {
                "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify(body),
            });

            const data = await res.json();

            if (res.ok) {
                setTours(data.tours || []);
                setDestinationInfo(data.destination || null);
            } else {
                setError(data.message || "Lỗi tải dữ liệu");
            }
            } catch (e) {
                setError("Không thể kết nối server"+ e);
            } finally {
                setLoading(false);
            }
        };

        fetchTours();
        setSortOption("");
    }, [searchParams]);


    useEffect(() => {
        if (!searchParams.get("destination")) {
            setDestinationInfo(null);
        }
    }, [searchParams]);


    if (loading) {
        return (
            <div className="flex justify-center items-center py-20 text-xl text-gray-500">
                Đang tải tour...
            </div>
        );
    }
    if (error) {
        return (
            <div className="flex justify-center items-center py-20 text-red-500 text-lg">
                {error}
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-2 w-8/10 mx-auto">
            <div className="flex flex-col gap-2 w-8/10 mx-auto">
                {destinationInfo ? (
                    <>
                        <h1 className="text-blue-900 font-bold items-center text-3xl mx-auto mb-4">
                            {destinationInfo.name}
                        </h1>
                        <span className="text-justify">
                            {destinationInfo.description}
                        </span>
                    </>
                ) : (
                    <>
                        <h1 className="text-blue-900 font-bold items-center text-3xl mx-auto mb-4">
                            Tất cả tour du lịch
                        </h1>
                        <span className="text-justify">
                            Du lịch trong nước luôn là lựa chọn tuyệt vời. 
                            Đường bờ biển dài hơn 3260km, những khu bảo tồn thiên nhiên tuyệt vời, 
                            những thành phố nhộn nhịp, những di tích lịch sử hào hùng, 
                            nền văn hóa độc đáo và hấp dẫn, cùng một danh sách dài những món ăn ngon nhất thế giới,
                            Việt Nam có tất cả những điều đó...
                        </span>
                    </>
                )}

            </div>
            <div className="flex gap-4 mt-8">
                {/* filter */}
                <div className="w-25/100 flex flex-col gap-2">
                    <h3 className="font-bold text-lg pb-4">BỘ LỌC TÌM KIẾM</h3>
                    <div className="sticky top-24">
                        <FilterBar/>
                    </div>
                </div>
                {/* content */}
                <div className="flex-1 flex flex-col gap-2">
                    <div className="flex justify-between">
                        <div>Tìm thấy {tours.length} tour</div>
                        <div className="relative">
                            <button
                                onClick={() => setOpenSort(!openSort)}
                                className="flex justify-between items-center gap-2 border border-gray-300 rounded-lg px-4 py-2 hover:border-gray-500 transition whitespace-nowrap w-[220px]"
                            >
                                <span>{getSortLabel()}</span>
                                <ChevronDown className={`w-5 h-5 transition-transform ${openSort ? "rotate-180" : ""}`} />
                            </button>

                            {openSort && (
                                <div className="absolute top-full mt-2 right-0 w-full bg-white border border-gray-300 rounded-lg shadow-lg z-10 overflow-hidden">
                                    {sortOptions.map((option) => (
                                        <button
                                            key={option.value}
                                            onClick={() => handleSort(option.value)}
                                            className={`w-full text-left px-4 py-3 hover:bg-blue-50 transition ${
                                                sortOption === option.value ? "bg-blue-900 text-white font-medium" : ""
                                            }`}
                                        >
                                            {option.label}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                    <TourList tours={tours} />
                </div>
            </div>
        </div>
        
    );
}
