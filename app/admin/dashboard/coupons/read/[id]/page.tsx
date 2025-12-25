'use client'

import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { ReadCouponAdmin } from "@/app/types/coupon";
import { formatPrice } from "@/app/common";
import Image from "next/image";

const API_URL = process.env.NEXT_PUBLIC_URL_API;

export default function ReadCouponDetail() {

    const { id } = useParams(); 
    const router = useRouter();
    const [coupon, setCoupon] = useState<ReadCouponAdmin | null>(null)
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTour = async () => {
            try {
                const res = await fetch(`${API_URL}/coupon/admin/read/${id}`, {
                    credentials: "include"
                });
                const result = await res.json();
                if (res.ok && result.data) {
                    const couponData = result.data as ReadCouponAdmin;
                    setCoupon(couponData);
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
                Đang tải thông tin mã giảm giá...
            </div>
        );
    }

    if (!coupon) {
        return <div className="p-8 text-center text-red-600">Không tìm thấy mã giảm giá</div>;
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
                <h1 className="text-3xl font-bold mb-6 text-main">Chi tiết mã giảm giá</h1>
            </div>
            <div className="flex gap-6 flex-col">
                <div className="flex gap-6">
                    <div className="flex w-1/2 flex-col gap-6">
                        {/* CODE */}
                        <div className="flex flex-col w-full gap-1">
                            <label className="font-medium w-[120px]">Mã CODE:</label>
                            <div className="flex border rounded-lg w-full justify-between items-center">
                                <label className="flex-1 px-3 py-2 outline:none focus:outline-none">{coupon.code}</label>
                            </div>
                        </div>
                        {/* used limit */}
                        <div className="flex flex-col w-full gap-1">
                            <label className="font-medium w-[120px]">Số lượng:</label>
                            <div className="flex border rounded-lg w-full justify-between items-center">
                                <label className="flex-1 px-3 py-2 outline:none focus:outline-none">{coupon.usage_limit}</label>
                            </div>
                        </div>
                    </div>
                    {/* description */}
                    <div className="flex flex-col flex-1 gap-1">
                        <label className="font-medium w-[120px]">Mô tả:</label>
                        <textarea
                            className="w-full h-full border rounded-lg px-3 py-2 resize-none outline-none focus:outline-none"
                        >{coupon.description}</textarea>
                    </div>
                </div>
                <div className="flex flex-col w-full">
                    <div className="flex gap-6">
                        {/* discount_type */}
                        <div className="flex flex-col w-full gap-1">
                            <label className="font-medium w-[120px]">Đã sử dụng:</label>
                            <div className="flex border rounded-lg w-full justify-between items-center">
                                <label
                                    className="flex-1 px-3 py-2 outline:none focus:outline-none"
                                >
                                    {coupon.used_count}
                                </label>
                            </div>
                        </div>
                        {/* discount_value */}
                        <div className="flex flex-col w-full gap-1">
                            <label className="font-medium w-[120px]">Trạng thái:</label>
                            <div className="flex border rounded-lg w-full justify-between items-center">
                                <label 
                                    className={`flex-1 px-3 py-2 outline:none focus:outline-none ${coupon.is_active ? " text-green-800" :  "text-red-800"}`}
                                >
                                    {coupon.is_active ? "Hoạt động" : "Bị khóa"}   
                                </label>  
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col w-full">
                    <div className="flex gap-6">
                        {/* discount_type */}
                        <div className="flex flex-col w-full gap-1">
                            <label className="font-medium w-[120px]">Loại giảm giá:</label>
                            <div className="flex border rounded-lg w-full justify-between items-center">
                                <label
                                    className={`flex-1 px-3 py-2 outline:none focus:outline-none ${coupon.discount_type === "PERCENTAGE" ?  "text-purple-800" : " text-green-800"}`}
                                >
                                    {coupon.discount_type === "PERCENTAGE" ? "Phần trăm" : "Cố định"}
                                </label>
                            </div>
                        </div>
                        {/* discount_value */}
                        <div className="flex flex-col w-full gap-1">
                            <label className="font-medium w-[120px]">Mức giảm giá:</label>
                            <div className="flex border rounded-lg w-full justify-between items-center">
                                <label 
                                    className="flex-1 px-3 py-2 outline:none focus:outline-none"
                                >
                                    {formatPrice(coupon.discount_value)}    
                                </label>  
                                <span>
                                    {coupon.discount_type === "PERCENTAGE" ? (
                                        <p className="font-bold px-2">%</p>
                                    ) : (
                                        <p className="font-bold px-2">VND</p>
                                    )}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col w-full">
                    <div className="flex gap-6">
                        {/* min_order_amount */}
                        <div className="flex flex-col w-full gap-1">
                            <label className="font-medium">Mức tối thiểu để áp cụng giảm giá:</label>
                            <div className="flex border rounded-lg w-full justify-between items-center">
                                <label
                                    className="flex-1 px-3 py-2 outline:none focus:outline-none"
                                >{formatPrice(coupon.min_order_amount)}</label>
                                <p className="font-bold px-2">VND</p>
                            </div>
                        </div>
                        {/* max_discount_amount */}
                        <div className="flex flex-col w-full gap-1">
                            <label className="font-medium ">Mức giảm giá tối đa:</label>
                            <div className="flex border rounded-lg w-full justify-between items-center">
                                <label
                                    className="flex-1 px-3 py-2 outline:none focus:outline-none"
                                >{formatPrice(coupon.max_discount_amount)}</label>
                                <p className="font-bold px-2">VND</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col w-full">
                    <div className="flex gap-6">
                        {/* valid_from */}
                        <div className="flex flex-col w-full gap-1">
                            <label className="font-medium w-[120px]">Ngày bắt đầu:</label>
                            <div className="flex border rounded-lg w-full justify-between items-center">
                                <label
                                    className="flex-1 px-3 py-2 outline:none focus:outline-none"
                                >{new Date(coupon.valid_from).toLocaleDateString("vi-VN")}</label>
                            </div>
                        </div>
                        {/* valid_to */}
                        <div className="flex flex-col w-full gap-1">
                            <label className="font-medium w-[120px]">Ngày kết thúc:</label>
                            <div className="flex border rounded-lg w-full justify-between items-center">
                                <label 
                                    className="flex-1 px-3 py-2 outline:none focus:outline-none"
                                >{new Date(coupon.valid_to).toLocaleDateString("vi-VN")}</label>
                            </div>
                        </div>
                    </div>
                </div>
                {/* image */}
                <div className="flex flex-col gap-2 mt-2">
                    <label className="font-medium">Ảnh mã giảm giá:</label>
                    {coupon.image_coupon_url ? (
                        <Image
                            src={coupon.image_coupon_url}
                            alt={"ảnh coupon"}
                            width={300}
                            height={300}
                            className="rounded-xl border object-cover mx-auto"
                            style={{ width: "auto", height: "300px",  maxWidth: "100%" }} 
                        />
                    ) : (
                        <p className="text-gray-500 italic">Không có ảnh</p>
                    )}
                </div>            
            </div> 
        </div>   
    )
}