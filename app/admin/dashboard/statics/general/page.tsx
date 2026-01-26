'use client'

import { useState, useEffect } from "react";
import type GeneralStatics from "@/app/types/statics";
import { formatPrice } from "@/app/common";

const API_URL = process.env.NEXT_PUBLIC_URL_API



export default function GeneralStatics() {
    const [generalStatics, setGeneralStatics] = useState<GeneralStatics | null>(null)

    const fetchGeneralStatics = async () => {
            try {
                const res = await fetch(`${API_URL}/statics/admin/general-statics`, { credentials: "include" })
                const data = await res.json()
                setGeneralStatics(data)
            } catch (e) {
                console.error(e);
                alert("Lỗi tải dữ liệu");
            }
        }

    useEffect(() => {
        fetchGeneralStatics();
    }, []);

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Thống kê tổng quan</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
                    <p className="text-sm text-gray-600 mb-1">Tổng số booking</p>
                    <p className="text-2xl font-bold text-blue-600">{generalStatics?.total_bookings || 0}</p>
                </div>
                <div className="bg-red-50 p-4 rounded-lg border-l-4 border-red-500">
                    <p className="text-sm text-gray-600 mb-1">Tỷ lệ hủy booking</p>
                    <p className="text-2xl font-bold text-red-600">{generalStatics?.cancellation_rate || 0}%</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-500">
                    <p className="text-sm text-gray-600 mb-1">Tổng doanh thu</p>
                    <p className="text-2xl font-bold text-green-600">{formatPrice(generalStatics?.total_revenue)}</p>
                </div>
                <div className="bg-orange-50 p-4 rounded-lg border-l-4 border-orange-500">
                    <p className="text-sm text-gray-600 mb-1">Tổng khách hàng</p>
                    <p className="text-2xl font-bold text-orange-600">{generalStatics?.total_customers || 0}</p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg border-l-4 border-purple-500">
                    <p className="text-sm text-gray-600 mb-1">Tổng số tour</p>
                    <p className="text-2xl font-bold text-purple-600">{generalStatics?.total_tours || 0}</p>
                </div>
                <div className="bg-pink-50 p-4 rounded-lg border-l-4 border-pink-500">
                    <p className="text-sm text-gray-600 mb-1">Tổng số review</p>
                    <p className="text-2xl font-bold text-pink-600">{generalStatics?.total_reviews || 0}</p>
                </div>
            </div>
        </div>
    );
}