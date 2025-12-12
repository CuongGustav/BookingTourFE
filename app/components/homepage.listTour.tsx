'use client'

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { TourInfo } from "../types/tour";
import Image from "next/image";

const API_URL = process.env.NEXT_PUBLIC_URL_API;

export default function ListTour ()  {

    const router = useRouter()
    const [tours, setTours] = useState<TourInfo[]>([])
    const [loading, setLoading] = useState(true)

    const fetchListTour = async () => {
        try {
            const res = await  fetch(`${API_URL}/tour/8tour`)
            const data = await res.json();
            const tourList = Array.isArray(data) ? data : data.data || [];
            setTours(tourList.slice(0, 8));
            setLoading(false);
        } catch (e) {
            console.error(e);
            alert("Lỗi tải dữ liệu");
            setLoading(false);  
        }
        finally {
            setLoading(false);
        }
    }
    useEffect(() => {
        fetchListTour()
    }, []);

    //format price
    const formatPrice = (price: number | string | null | undefined): string => {
        if (price === null || price === undefined || price === "") return "—";
        let num: number;
        if (typeof price === "string") {
            num = parseFloat(price.replace(/,/g, '')); 
        } else {
            num = price;
        }
        if (isNaN(num)) return "—";
        const fixed = Number(num.toFixed(2));
        const integerPart = Math.floor(fixed); 
        const decimalPart = (fixed - integerPart).toFixed(2).slice(2); 
        const formattedInteger = integerPart.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
        if (decimalPart === "00") {
            return formattedInteger;
        }
        return `${formattedInteger},${decimalPart}`;
    };
    //format day
    const formatDate = (dateString: string): string => {
        if (!dateString) return '';
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        return `${day}/${month}`;
    };

    if (loading) return <div className="p-8 text-center text-lg">Đang tải danh sách tour...</div>;

    return (
        <div className="w-full py-4">
            <div className="flex relative">
                <h1 className="text-blue-900 font-bold float-left text-3xl py-2">Tour du lịch</h1>
                <span className="absolute border-2 border-blue-900 bottom-0 w-1/8"/>
            </div>
            <div className="flex my-4">
                <p className="">Hãy chọn một tour du lịch nổi tiếng dưới đây. Đặt ngay để không bỏ lỡ!</p>
            </div>
            {/* list tour */}
            <div className="flex flex-wrap">
                {tours.map((tour)=> (
                    <div
                        key={tour.tour_id}
                        className="w-full sm:w-1/2 lg:w-1/4 px-2 mb-10"
                    >
                        <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 h-full flex flex-col hover:scale-105">
                            <div className="relative h-64">
                                <Image
                                    src={tour.main_image_url || tour.main_image_local_path}
                                    alt={tour.title}
                                    fill
                                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                                />
                            </div>   
                            <div className="p-2 flex flex-col">
                                <div className="mb-1 cursor-pointer">
                                    <p className="font-bold line-clamp-2">{tour.title}</p>
                                </div>
                                <div className="flex flex-col gap-2">
                                    <div className="flex gap-1">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M14.25 9.75 16.5 12l-2.25 2.25m-4.5 0L7.5 12l2.25-2.25M6 20.25h12A2.25 2.25 0 0 0 20.25 18V6A2.25 2.25 0 0 0 18 3.75H6A2.25 2.25 0 0 0 3.75 6v12A2.25 2.25 0 0 0 6 20.25Z" />
                                        </svg>
                                        <span className="font-bold">{tour.tour_code}</span>
                                    </div>
                                    <div className="flex gap-1 items-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                                        </svg>
                                        <span className="text-sm">Khởi hành:</span> 
                                        <span className="font-bold text-blue-900">{tour.depart_destination}</span>
                                    </div>
                                    <div className="flex gap-1">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                        </svg>
                                        <span className="font-bold">{tour.duration_days}N{tour.duration_nights}Đ</span>
                                    </div>
                                    <div className="flex gap-1 items-center justify-between">
                                        <span className="text-sm whitespace-nowrap">Ngày khởi hành:</span>
                                        <div className="flex gap-1">
                                            {tour.upcoming_schedules.map((tour_schedule) => (
                                                <span 
                                                    className="px-2 py-1 border-1 border-red-600 text-red-600 rounded font-bold" 
                                                    key={tour_schedule.schedule_id}>
                                                        {formatDate(tour_schedule.departure_date)}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="flex justify-between">
                                        <div className="flex gap-1 items-center">
                                            <span className="text-sm">Giá: </span>
                                            <p className="font-bold">{formatPrice(tour.base_price)}</p>
                                        </div>
                                        <button className="px-4 py-2 border-1 border-red-600 text-red-600 cursor-pointer rounded font-bold">
                                            Đặt Ngay
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            {/* button */}
            <div className="w-full flex justify-center mt-4">
                <button 
                    className="px-8 py-4 text-xl border-2 border-blue-900 text-blue-900 font-bold rounded-2xl cursor-pointer hover:bg-blue-900 hover:text-white"
                    onClick={()=>router.push("/tours")}
                >
                    Xem tất cả
                </button>
            </div>
        </div>
    )
}