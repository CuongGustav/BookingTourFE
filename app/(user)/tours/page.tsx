'use client'

import { TourInfo } from "@/app/types/tour"
import { useState, useEffect } from "react";
import Image from "next/image";

const API_URL = process.env.NEXT_PUBLIC_URL_API;

export default function ToursPage () {

    const [listTour , setListTour] = useState<TourInfo[]>([])
    const [loading, setLoading] = useState(true);

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

    useEffect(() => {
        const fetchTours = async () => {
            try {
                const res = await fetch(`${API_URL}/tour/all`);
                
                const data = await res.json();

                if (res.ok) {
                    setListTour(data.data);
                } else {
                    alert(data.message || "Không tải được danh sách tour");
                }
            } catch (err) {
                console.error(err);
                alert("Lỗi kết nối server");
            } finally {
                setLoading(false);
            }
        };
        fetchTours();
    }, []);

    if (loading) {
        return (
        <div className="flex items-center justify-center w-8/10 mx-auto">
            <div className="text-2xl text-gray-600">Đang tải tour...</div>
        </div>
        );
    }
    return (
        <div className="flex flex-col gap-2 w-8/10 mx-auto">
            <div className="flex flex-col gap-2 w-8/10 mx-auto">
                <h1 className="text-blue-900 font-bold items-center text-3xl mx-auto mb-4">Tất cả tour du lịch</h1>
                <span className="text-justify">Du lịch trong nước luôn là lựa chọn tuyệt vời. 
                    Đường bờ biển dài hơn 3260km, những khu bảo tồn thiên nhiên tuyệt vời, những thành phố nhộn nhịp, 
                    những di tích lịch sử hào hùng, nền văn hóa độc đáo và hấp dẫn, 
                    cùng một danh sách dài những món ăn ngon nhất thế giới, 
                    Việt Nam có tất cả những điều đó. Với lịch trình dày, khởi hành đúng thời gian cam kết,
                    chúng tôi là công ty lữ hành uy tín nhất hiện nay tại Việt Nam, 
                    luôn sẵn sàng phục vụ du khách mọi lúc, mọi nơi, 
                    đảm bảo tính chuyên nghiệp và chất lượng dịch vụ tốt nhất thị trường.
                </span>
            </div>
            <div className="flex gap-2">
                {/* filter */}
                <div className="w-25/100 py-2">
                    Filter
                </div>
                {/* content */}
                <div className="min-h-screen bg-gray-50 flex-1 py-2">
                    <div className="flex flex-1">
                        {listTour.length === 0 ? (
                            <div className="text-center text-gray-500 text-xl py-20">
                                Hiện chưa có tour nào
                            </div>
                        ) : (
                        <div className="flex flex-col flex-1 gap-4">
                            {listTour.map((tour) => (
                                <div
                                    key={tour.tour_id}
                                    className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition transform hover:-translate-y-1 flex cursor-pointer"
                                >
                                    {/* IMAGE BLOCK */}
                                    <div className="w-3/10 h-full relative">
                                        <Image
                                            src={tour.main_image_url}
                                            alt={tour.title}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                    <div className="flex-1 p-4 flex flex-col justify-between gap-2">
                                        <div>
                                            <p className="text-base font-bold text-blue-900 line-clamp-2">
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
                                            <button className="px-4 py-2 border-1 bg-blue-900 text-white cursor-pointer rounded-xl font-bold">
                                                Xem chi tiết
                                            </button>
                                        </div>
                                    </div>
                                </div> 
                            ))}
                        </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
        
    );
}
