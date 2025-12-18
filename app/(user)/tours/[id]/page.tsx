'use client'

import { useParams, useRouter } from "next/navigation"
import { useEffect, useState, useCallback } from "react";
import { TourDetailInfo } from "@/app/types/tour";
import TourGallery from "./TourGallery";
import TourSchedule from "./TourSchedule";

const API_URL = process.env.NEXT_PUBLIC_URL_API;

export default function TourDetailPage () {
    const router = useRouter();
    const params = useParams();
    const tour_id = params.id as string;

    const [loading, setLoading] = useState(true);
    const [tourInfo, setTourInfo] = useState<TourDetailInfo | null>(null);
    
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
        <div className="flex flex-col gap-4 w-8/10 mx-auto">
            <div className="flex flex-col gap-4 w-75/100">
                <h1>aaaaaaaaaaa</h1>
                {/* <TourGallery images={tourInfo.images || []} /> */}
                <TourSchedule schedules={tourInfo.schedules || []} />

                
            </div>
            <div>

            </div>
        </div>
    )
}