'use client';

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { TourInfo } from "@/app/types/tour";
import FilterBar from "./filterBar";
import TourList from "./tourList";

const API_URL = process.env.NEXT_PUBLIC_URL_API;

export default function ToursPage () {
    const searchParams = useSearchParams();

    const [tours, setTours] = useState<TourInfo[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchTours = async () => {
        setLoading(true);
        setError("");

        try {
            const query = searchParams.toString();
            const res = await fetch(
                `${API_URL}/tour/all${query ? `?${query}` : ""}`,
                {
                    method: "GET",
                    credentials: "include", 
                }
            );

            const data = await res.json();
            if (res.ok) {
                setTours(data.data || []);
            } else {
                alert(data.message || "Không tải được danh sách tour!");
            }
        } catch (err) {
            console.error("Lỗi kết nối:", err);
            setError("Không thể kết nối với máy chủ!");
        } finally {
            setLoading(false);
        }
        };

        fetchTours();
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
            <div className="flex gap-4">
                {/* filter */}
                <div className="w-25/100">
                    <div className="sticky top-24">
                        <FilterBar/>
                    </div>
                </div>
                {/* content */}
                <div className="flex-1">
                    <TourList tours={tours} />
                </div>
            </div>
        </div>
        
    );
}
