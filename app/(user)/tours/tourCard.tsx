'use client'

import { TourInfo } from "@/app/types/tour";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { FavoriteButton } from "../favorite_tours/FavoriteButton";

export default function TourCard ({tour, isLoggedIn}:{tour:TourInfo, isLoggedIn?: boolean}){
    const router = useRouter();

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

    return(
        <div
            key={tour.tour_id}
            className="bg-white rounded-2xl shadow-black shadow-sm overflow-hidden hover:shadow-2xl transition transform hover:-translate-y-1 flex cursor-pointer"
            onClick={()=>router.push(`/tours/${tour.tour_id}`)} 
       >
            {/* IMAGE BLOCK */}
            <div className="w-3/10 flex-shrink-0 relative">
                <Image
                    src={tour.main_image_url}
                    alt={tour.title}
                    width={400}
                    height={300}
                    className="object-cover w-full h-full"
                />
                {isLoggedIn && (
                    <div className="absolute top-2 left-2 cursor-pointer z-5">
                        <FavoriteButton tourId={tour.tour_id} initialIsFavorite={tour.is_like ?? false} />
                    </div>
                )}
            </div>
            <div className="flex-1 p-4 flex flex-col justify-between gap-2">
                <div>
                    <p 
                        className="text-base font-bold text-blue-900 line-clamp-2"
                        onClick={()=>router.push(`/tours/${tour.tour_id}`)}     
                    >
                        {tour.title}
                    </p>
                </div>    
                <div className="space-y-2 text-gray-700">
                    <div className="flex items-center gap-2">
                        <span className="font-medium">Mã tour:</span>
                        <span className="text-blue-600 font-bold">{tour.tour_code}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span>Khởi hành:</span>
                        <span className="font-medium text-blue-900">{tour.depart_destination}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span>Thời gian:</span>
                        <span className="font-bold">{tour.duration_days} ngày {tour.duration_nights} đêm</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span>Phương tiện:</span>
                        <span className="capitalize">{tour.transportation || "Xe"}</span>
                    </div>
                </div>
                <div className="flex gap-2 items-center justify-between">
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
                    <div className="flex gap-2 items-center">
                        <span className="text-sm">Giá: </span>
                        <p className="font-bold">{formatPrice(tour.base_price)}</p>
                    </div>
                    <button 
                        className="px-4 py-2 border-1 bg-blue-900 text-white cursor-pointer rounded-xl font-bold"
                        onClick={()=>router.push(`/tours/${tour.tour_id}`)} 
                    >
                        Xem chi tiết
                    </button>
                </div>
            </div>
        </div> 
    )
}