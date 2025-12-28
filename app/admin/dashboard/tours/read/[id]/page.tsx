'use client'

import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { TourDetailInfo } from "@/app/types/tour";
import Image from "next/image";
import { formatDateVN } from "@/app/common";
import { formatPrice } from "@/app/common";
import TourGallery from "@/app/(user)/tours/[id]/TourGallery";

const API_URL = process.env.NEXT_PUBLIC_URL_API;

export default function ReadTourDetail() {
    const { id } = useParams(); 
    const router = useRouter();
    const [tour, setTour] = useState<TourDetailInfo | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTour = async () => {
            try {
                const res = await fetch(`${API_URL}/tour/admin/${id}`, {
                    credentials: "include"
                });
                const result = await res.json();
                if (res.ok && result.data) {
                    const tourData = result.data as TourDetailInfo;
                    setTour(tourData);
                } else {
                    alert(result.message || "Không tải được thông tin tour");
                    router.back();
                }
            } catch (err) {
                console.error("Lỗi kết nối:", err);
                alert("Lỗi kết nối server");
                router.back();
            } finally {
                setLoading(false);
            }
        };

        fetchTour();
    }, [id, router]); 

    if (loading) {
        return (
            <div className="p-8 text-center text-lg">
                Đang tải thông tin tour...
            </div>
        );
    }

    if (!tour) {
        return <div className="p-8 text-center text-red-600">Không tìm thấy tour</div>;
    }

    return (
        <div className="min-w-100 px-8 mx-auto py-6 h-98/100 overflow-y-auto relative">
            <button 
                className="bg-white px-4 py-2 rounded-xl border-1 border-gray-300 mb-4 cursor-pointer hover:bg-gray-300 hover:text-white
                            absolute top-4 left-8"
                onClick={() => router.back()}
            >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-8">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m11.25 9-3 3m0 0 3 3m-3-3h7.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>
            </button>
            <div className="flex justify-center">
                <h1 className="text-3xl font-bold mb-6 text-main">Chi tiết tour</h1>
            </div>
            <div className="flex flex-col gap-2 pb-16">
                {/* title */}
                <div className="flex w-full">
                    <div className="flex w-full items-center">
                        <div className="flex items-center w-full">
                            <label className="font-medium w-[120px]">Tiêu đề tour:</label>
                            <span className="flex-1 border px-2 py-1 rounded-lg">{tour.title}</span>
                        </div>
                    </div>
                </div>
                <div className="flex gap-8 ">
                    {/* duration_days, duration_nights, is_feature , depart_destination*/}
                    <div className="flex w-1/3 gap-2 flex-col">
                        {/* duration_days */}
                        <div className="flex items-center w-full">
                            <label className="font-medium w-[120px]">Số Ngày:</label>
                            <label className="flex-1 border px-2 py-1 rounded-lg">{tour.duration_days}</label>
                        </div>
                        {/* duration_nights */}
                        <div className="flex items-center w-full">
                            <label className="font-medium w-[120px]">Số Đêm:</label>
                            <label className="flex-1 border px-2 py-1 rounded-lg">{tour.duration_nights}</label>
                        </div>
                        {/* tour hot */}
                        <div className="flex items-center w-full">
                            <label className="font-medium w-[120px]">Tour hot:</label>
                            <label className="flex-1 border px-2 py-1 rounded-lg">{tour.is_featured ? "Có" : "Không"}</label>
                        </div>
                        {/* tour active */}
                        <div className="flex items-center w-full">
                            <label className="font-medium w-[120px]">Hoạt động:</label>
                            <label className="flex-1 border px-2 py-1 rounded-lg">{tour.is_active ? "Có" : "Không"}</label>
                        </div>
                        {/* depart_destination */}
                        <div className="flex items-center w-full">
                            <label className="font-medium w-[120px]">Điểm xuất phát:</label>
                            <label className="flex-1 border px-2 py-1 rounded-lg">{tour.depart_destination}</label>
                        </div>
                    </div>
                    {/* price */}
                    <div className="flex flex-1 flex-col gap-2">
                        {/* base price */}
                        <div className="flex items-center w-full">
                            <label className="font-medium w-[140px]">Giá gốc:</label>
                            <div className="flex border rounded-lg w-full justify-between items-center">
                                <label className="flex-1 px-2 py-1">{formatPrice(tour.base_price)}</label>
                                <label className="font-bold px-4">VND</label>
                            </div>
                        </div>
                        {/* child price */}
                        <div className="flex items-center w-full">
                            <label className="font-medium w-[140px]">Giá trẻ em:</label>
                            <div className="flex border rounded-lg w-full justify-between items-center">
                                <label className="flex-1 px-2 py-1">{formatPrice(tour.child_price)}</label>
                                <label className="font-bold px-4">VND</label>
                            </div>
                        </div>
                        {/* infant price */}
                        <div className="flex items-center w-full">
                            <label className="font-medium w-[140px]">Giá sơ sinh:</label>
                            <div className="flex border rounded-lg w-full justify-between items-center">
                                <label className="flex-1 px-2 py-1">{formatPrice(tour.infant_price)}</label>
                                <label className="font-bold px-4">VND</label>
                            </div>
                        </div> 
                        {/* single_room_surcharge */}
                        <div className="flex items-center w-full">
                            <label className="font-medium w-[140px]">Phụ thu phòng đơn:</label>
                            <div className="flex border rounded-lg w-full justify-between items-center">
                                <label className="flex-1 px-2 py-1">{formatPrice(tour.single_room_surcharge)}</label>
                                <label className="font-bold px-4">VND</label>
                            </div>
                        </div>            
                    </div>
                </div>    
                {/* hightlight */}
                <div>
                    <div className="flex items-center w-full">
                        <label className="font-medium w-[120px]">Điểm Nhấn:</label>
                        <span className="flex-1 border px-2 py-1 rounded-lg h-[200px]">{tour.highlights}</span>
                    </div>              
                </div>
                {/* information bonus */}
                <div className="flex gap-8">
                    <div className="flex w-1/2 gap-2 flex-col">
                        {/* attractions */}
                        <div className="flex items-center">
                            <label className="font-medium w-[120px]">Điểm tham quan:</label>
                            <textarea   
                                value={tour.attractions}
                                className="flex-1 border px-2 py-1 rounded-lg"
                                readOnly
                            />
                            
                        </div>
                        {/* cuisine */}
                        <div className="flex items-center">
                            <label className="font-medium w-[120px]">Ẩm thực:</label>
                            <textarea   
                                value={tour.cuisine}
                                className="flex-1 border px-2 py-1 rounded-lg"
                                readOnly
                            />
                        </div>
                        {/* ideal_time */}
                        <div className="flex items-center">
                            <label className="font-medium w-[120px]">Thời gian lý tưởng:</label>
                            <textarea   
                                value={tour.ideal_time}
                                className="flex-1 border px-2 py-1 rounded-lg"
                                readOnly
                            />
                        </div>
                    </div>
                    <div className="flex w-1/2 gap-2 flex-col">
                        {/* suitable_for */}
                        <div className="flex items-center">
                            <label className="font-medium w-[120px]">Đối tượng thích hợp:</label>
                            <textarea   
                                value={tour.suitable_for}
                                className="flex-1 border px-2 py-1 rounded-lg"
                                readOnly
                            />
                        </div>
                        {/* transportation */}
                        <div className="flex items-center">
                            <label className="font-medium w-[120px]">Phương tiện:</label>
                            <textarea   
                                value={tour.transportation}
                                className="flex-1 border px-2 py-1 rounded-lg"
                                readOnly
                            />
                        </div>
                        {/* promotion */}
                        <div className="flex items-center">
                            <label className="font-medium w-[120px]">Khuyến mãi:</label>
                            <textarea   
                                value={tour.promotions}
                                className="flex-1 border px-2 py-1 rounded-lg"
                                readOnly
                            />
                        </div>
                    </div>
                </div>
                {/* service */}
                <div className="flex gap-8">
                    {/* included_services */}
                    <div className="flex w-1/2 gap-2 flex-col">
                        <div className="flex items-center">
                            <label className="font-medium w-[120px]">Dịch vụ đã bao gồm:</label>
                            <textarea   
                                value={tour.included_services}
                                className="flex-1 border px-2 py-1 rounded-lg h-[90px]"
                                readOnly
                            />
                        </div>
                    </div>
                    {/* excluded_services */}
                    <div className="flex w-1/2 gap-2 flex-col">
                        <div className="flex items-center">
                            <label className="font-medium w-[120px]">Dịch vụ không bao gồm:</label>
                            <textarea   
                                value={tour.excluded_services}
                                className="flex-1 border px-2 py-1 rounded-lg h-[90px]"
                                readOnly
                            />
                        </div>
                    </div>
                </div>
                {/* main image */}
                <div className="flex mb-8">
                    <label className="font-medium w-[120px]">Hình ảnh chính:</label>
                    <div  className= "flex-1 border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition">
                        <div className="flex justify-center">
                            <div className="relative w-[450px] h-[300px]">
                                <Image
                                    src={tour.main_image_url}
                                    alt="ảnh chính tour"
                                    fill
                                    className="rounded border object-cover"
                                    sizes="450px"
                                />
                            </div>
                        </div>
                    </div>
                </div>
                {/* tour destination */}
                <div className="flex gap-2 w-full">
                    <label className="font-medium w-[120px]">Danh sách điểm đến:</label>
                    {tour.destinations.length === 0 ? (
                        <p className="text-center text-gray-400 py-8 border-2 border-dashed rounded-lg">
                            Chưa có điểm đến nào được thêm vào tour.
                        </p>
                    ):(
                        <>
                        {tour.destinations.map((dest, index) => (
                            <div key={index} className="flex-1 border p-4 rounded-lg">
                                <p>{dest.name}</p>
                            </div>
                        ))}
                        </>
                    )}
                </div>
                {/* tour itinerary */}
                <div className="flex flex-col gap-2 w-full">
                    <label className="font-medium w-[300px]">Lịch trình chi tiết:</label>
                    {tour.itineraries.length === 0 ? (
                        <p className="text-center text-gray-400 py-8 border-2 border-dashed rounded-lg">
                            Chưa có lịch trình nào. Nhấn Thêm lịch trình để bắt đầu.
                        </p>
                    ):(
                        <>
                        {tour.itineraries.map((itinerary, index) => (
                            <div key={index} className="border rounded-lg p-4 bg-gray-50">
                                <div className="flex justify-between items-center mb-3">
                                    <h3 className="font-semibold text-lg text-blue-600">
                                        Ngày {itinerary.display_order}
                                    </h3>
                                </div>

                                <div className="flex flex-col gap-3">
                                    <div className="flex items-center">
                                        <label className="font-medium w-[120px]">Tiêu đề:</label>
                                        <label className="flex-1 border px-3 py-2 rounded-lg bg-white">
                                            {itinerary.title}
                                        </label>
                                    </div>
                                    <div className="flex items-start">
                                        <label className="font-medium w-[120px] pt-2">Mô tả:</label>
                                        <textarea
                                            value={itinerary.description}
                                            readOnly
                                            className="flex-1 border px-3 py-2 rounded-lg h-[120px] bg-white"
                                        />
                                    </div>
                                    <div className="flex items-center">
                                        <label className="font-medium w-[120px]">Bữa ăn:</label>
                                        <label className="flex-1 border px-3 py-2 rounded-lg bg-white">{itinerary.meals}</label>
                                    </div>
                                </div>
                            </div>
                        ))}
                        </>
                    )}
                </div>
                {/* tour schedule */}
                <div className="flex flex-col gap-2 w-full mt-6">
                    <label className="font-medium w-[200px] pt-2">Lịch khởi hành:</label>
                    {tour.itineraries.length === 0 ? (
                        <p className="text-center text-gray-400 py-8 border-2 border-dashed rounded-lg">
                            Chưa có lịch khởi hành nào
                        </p>
                    ):(
                        <>
                        {tour.schedules.map((schedule, index) => (
                            <div key={index} className="border rounded-lg p-4 bg-gray-50">
                                <div className="flex justify-between items-center mb-3">
                                    <h3 className="font-semibold text-lg text-blue-600">
                                        Ngày {formatDateVN(schedule.departure_date)}
                                    </h3>
                                </div>
                                <div className="flex gap-2">
                                    <div className="flex flex-col w-1/2 gap-2">
                                        {/* departure_date */}
                                        <div className="flex gap-2 ">
                                            <label className="font-medium w-[120px] pt-2">Ngày khởi hành:</label>
                                            <label className="border px-3 py-2 rounded-lg bg-white flex-1">{formatDateVN(schedule.departure_date)}</label>
                                        </div>
                                        {/* price_adult */}
                                        <div className="flex gap-2">
                                            <label className="font-medium w-[120px] pt-2">Giá vé gốc:</label>
                                            <label className="border px-3 py-2 rounded-lg bg-white flex-1">{formatPrice(schedule.price_adult)}</label>
                                        </div>
                                        {/* price_child */}
                                        <div className="flex gap-2">
                                            <label className="font-medium w-[120px] pt-2">Giá vé trẻ em:</label>
                                            <label className="border px-3 py-2 rounded-lg bg-white flex-1">{formatPrice(schedule.price_child)}</label>
                                        </div>

                                    </div>
                                    <div className="flex flex-col w-1/2 gap-2">
                                        {/* return_date */}
                                        <div className="flex gap-2 ">
                                            <label className="font-medium w-[120px] pt-2">Ngày kết thúc:</label>
                                            <label className="border px-3 py-2 rounded-lg bg-white flex-1 ">{formatDateVN(schedule.return_date)}</label>
                                        </div>
                                        {/* price_infant */}
                                        <div className="flex gap-2">
                                            <label className="font-medium w-[120px] pt-2">Giá vé em bé:</label>
                                            <label className="border px-3 py-2 rounded-lg bg-white flex-1">{formatPrice(schedule.price_infant)}</label>
                                        </div>
                                        {/* available_seats */}
                                        <div className="flex gap-2">
                                            <label className="font-medium w-[120px] pt-2">Số chỗ:</label>
                                            <label className="border px-3 py-2 rounded-lg bg-white flex-1">{schedule.available_seats}</label>
                                        </div>                                      
                                    </div>
                                </div>
                            </div>
                        ))}
                        </>
                    )}
                </div>
                {/* tour gallery */}
                <div className="flex flex-col gap-2 w-full mt-6">
                    <label className="font-medium w-[200px] pt-2">Thư viện ảnh tour:</label>
                    <TourGallery images={tour.images} />
                </div>
            </div>
        </div>    
    );
}