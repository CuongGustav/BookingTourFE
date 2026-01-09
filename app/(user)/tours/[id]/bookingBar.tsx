'use client'

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { formatPrice } from "@/app/common"
import {TourDetailInfo } from "@/app/types/tour"
import { ReadTourSchedule } from "@/app/types/tour_schedule"
import { Calendar, MapPin, Clock, Users, Code } from "lucide-react"

interface BookingBarProps {
    tourInfo: TourDetailInfo
    selectedSchedule: ReadTourSchedule | null
    onClearSchedule?: () => void  
}

export default function BookingBar({ tourInfo, selectedSchedule, onClearSchedule }: BookingBarProps) {
    const minPrice = tourInfo.schedules && tourInfo.schedules.length > 0
        ? Math.min(...tourInfo.schedules.map(s => Number(s.price_adult)))
        : 0;
    const router = useRouter();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    
        useEffect(() => {
            const checkLoginStatus = async () => {
                try {
                    const response = await fetch('/api/auth/check', {
                        credentials: 'include'
                    });
                    const data = await response.json();
                    setIsLoggedIn(data.isLoggedIn);
                } catch (error) {
                    console.error('Error checking auth status:', error);
                    setIsLoggedIn(false);
                }
            };
            checkLoginStatus();
        }, []);

    if (!selectedSchedule) {
        return (
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
                <h3 className="font-bold text-gray-700 mb-2">Giá từ:</h3>
                <div className="text-3xl font-bold text-blue-900">
                    {formatPrice(minPrice)} ₫
                    <span className="text-lg font-normal"> / Khách</span>
                </div>
                <div className="mt-4 text-sm ">
                    Mã chương trình: <span className="font-bold">{tourInfo.tour_code}</span>
                </div>
                <button className=" cursor-pointer mt-6 w-full bg-blue-900 text-white py-4 rounded-xl font-bold text-lg hover:bg-blue-600 transition">
                    Chọn ngày khởi hành
                </button>
            </div>
        )
    }

    return (
        <div className="bg-white rounded-2xl shadow-xl p-6 border-2 border-gray-200">
            <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-blue-900">
                    {formatPrice(Number(selectedSchedule.price_adult))} ₫
                </span>
                <span className="text-lg font-normal"> / Khách</span>
            </div>

            <div className="mt-5 space-y-3 text-sm">
                <div className="flex items-center gap-3">
                    <Code className="w-5 h-5 text-blue-600" />
                    <div>
                        <div className="text-gray-600">Mã tour:</div>
                        <div className="font-bold">{tourInfo.tour_code}</div>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <MapPin className="w-5 h-5 text-blue-600" />
                    <div>
                        <div className="text-gray-600">Khởi hành:</div>
                        <div className="font-bold">TP. Hồ Chí Minh</div>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-blue-600" />
                    <div>
                        <div className="text-gray-600">Ngày khởi hành:</div>
                        <div className="font-bold">
                            {new Date(selectedSchedule.departure_date).toLocaleDateString('vi-VN')}
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-blue-600" />
                    <div>
                        <div className="text-gray-600">Thời gian:</div>
                        <div className="font-bold">{tourInfo.duration_days}N{tourInfo.duration_nights}Đ</div>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <Users className="w-5 h-5 text-blue-600" />
                    <div>
                        <div className="text-gray-600">Số chỗ còn:</div>
                        <div className="font-bold text-green-600">{selectedSchedule.available_seats-selectedSchedule.booked_seats}</div>
                    </div>
                </div>
            </div>

            <div className="mt-6 flex gap-3">
                <button 
                    className="flex-1 border border-gray-300 py-3 rounded-xl font-bold hover:bg-gray-100 transition cursor-pointer"
                    onClick={() => onClearSchedule?.()}
                >
                    Ngày khác
                </button>
                <button 
                    className="flex-1 bg-blue-900 text-white py-3 rounded-xl font-bold hover:bg-blue-600 transition cursor-pointer"
                    onClick={ () => {
                        if (isLoggedIn) {
                            router.push(`/booking?tour_id=${tourInfo.tour_id}&schedule_id=${selectedSchedule.schedule_id}`)
                        } else {
                            alert("Bạn cần phải đăng nhập")
                        }
                    }}
                >
                    Đặt ngay
                </button>
            </div>
        </div>
    )
}