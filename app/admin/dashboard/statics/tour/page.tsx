'use client'

import { useState, useEffect } from "react";
import { formatPrice } from "@/app/common";

const API_URL = process.env.NEXT_PUBLIC_URL_API;

interface TopTour {
    tour_id: string;
    title: string;
    booking_count: number;
    total_revenue: number;
}

interface TourStats {
    top_tours: TopTour[];
    average_passengers_per_tour: number;
    average_fill_rate: number;
}


export default function TourStatics() {
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState<TourStats | null>(null);
    useEffect(() => {
        const fetchStats = async () => {
            try {
                // Fetch tour stats
                const tourRes = await fetch(`${API_URL}/statics/admin/tours/top`, { credentials: "include" });
                const tourResponse = await tourRes.json();
                
                if (tourResponse.success && tourResponse.data) {
                    setStats(tourResponse.data);
                }
            } catch (e) {
                console.error(e);
                alert("Lỗi tải dữ liệu thống kê");
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    if (loading) return <div className="p-8 text-center text-lg">Đang tải thống kê...</div>;

    if (!stats) return <div className="p-8 text-center text-lg">Không có dữ liệu thống kê</div>;

    return (
        <div className="space-y-6">
            {/* Tour Statistics */}
            {stats && (
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-2xl font-bold mb-6 text-gray-800">Thống kê Tour</h2>
                    
                    {/* Averages */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                        <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
                            <p className="text-sm text-gray-600 mb-1">Số khách trung bình mỗi tour</p>
                            <p className="text-2xl font-bold text-blue-600">{stats.average_passengers_per_tour.toFixed(1)}</p>
                        </div>
                        <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-500">
                            <p className="text-sm text-gray-600 mb-1">Tỷ lệ lấp đầy trung bình</p>
                            <p className="text-2xl font-bold text-green-600">{stats.average_fill_rate.toFixed(1)}%</p>
                        </div>
                    </div>

                    {/* Top Tours */}
                    <h3 className="text-xl font-bold mb-4 text-gray-800">Top 5 tour bán chạy</h3>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tiêu đề</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Số booking</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Doanh thu</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {stats.top_tours.map((tour) => (
                                    <tr key={tour.tour_id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 text-sm font-medium text-gray-900">{tour.title}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{tour.booking_count}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatPrice(tour.total_revenue)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}