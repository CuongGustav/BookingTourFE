'use client'

import { useParams, useRouter } from "next/navigation"
import { useEffect, useState, useCallback } from "react";
import { TourDetailInfo } from "@/app/types/tour";
import { ReadTourSchedule } from "@/app/types/tour_schedule";
import TourGallery from "./TourGallery";
import TourSchedule from "./TourSchedule";
import TourAdditionalInfo from "./TourAdditionalInfo";
import TourItinerary from "./TourItinerary";
import TourInfoNote from "./TourInfoNote";
import BookingBar from "./bookingBar";

const API_URL = process.env.NEXT_PUBLIC_URL_API;

export default function TourDetailPage () {
    const router = useRouter();
    const params = useParams();
    const tour_id = params.id as string;

    const [loading, setLoading] = useState(true);
    const [tourInfo, setTourInfo] = useState<TourDetailInfo | null>(null);
    const [selectedSchedule, setSelectedSchedule] = useState<ReadTourSchedule | null>(null);
    const handleClearSchedule = () => {
        setSelectedSchedule(null)
    }
    
    const fetchTourDetail = useCallback(async () => {
        if (!tour_id) {
            alert("Không tìm thấy ID tour!");
            router.push("/tours");
            return;
        }

        setLoading(true)
        try {
            const res = await fetch(`${API_URL}/tour/${tour_id}`, {
                method: "GET",
            })

            if (!res.ok) throw new Error("Không thể tải tour")

            const data = await res.json()
            setTourInfo(data.data)
        } catch (e) {
            console.error("Lỗi khi tải tour:", e);
            alert("Không tải được thông tin tour. Tour có thể đã bị xóa hoặc không tồn tại!");
            router.push("/tours");
        } finally {
            setLoading(false)
        }
    }, [tour_id, router])

    useEffect(() => {
        fetchTourDetail()
    }, [fetchTourDetail])


    if (loading) {
        return <div className="text-center py-10 w-8/10 mx-auto">Đang tải chi tiết tour...</div>;
    } else
    if (!tourInfo) {
        return null;
    } 

    return (
        <div className="w-8/10 mx-auto">
            {/* title */}
            <h1 className="text-2xl font-bold">{tourInfo.title}</h1>
            <div className="flex gap-4">
                <div className="flex flex-col gap-8 w-75/100">
                    {/* <TourGallery images={tourInfo.images || []} /> */}
                    <TourSchedule 
                        schedules={tourInfo.schedules || []} 
                        onScheduleSelect={setSelectedSchedule}
                        selectedSchedule={selectedSchedule}
                    />
                    {/* hight light */}
                    { tourInfo.highlights && (
                        <div className="bg-blue-100 rounded-2xl p-4">
                            <h2 className="font-semibold text-lg">Điểm nhấn chương trình</h2>
                            <p className="px-6">{tourInfo.highlights}</p>
                        </div>
                    )}
                    {/* attractions, cuisine, suitable_for, ideal_time, transportation, promotions */}
                    <TourAdditionalInfo tour={tourInfo} />
                    {/* tour itinerary */}
                    <TourItinerary itineraries={tourInfo.itineraries} />
                    {/* Information to note */}
                    <TourInfoNote included_service={tourInfo.included_services} excluded_service={tourInfo.excluded_services} />
                </div>
                <div className="hidden lg:block">
                    <div className="sticky top-24">
                        <BookingBar 
                            tourInfo={tourInfo}
                            selectedSchedule={selectedSchedule}
                            onClearSchedule={handleClearSchedule}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}