'use client'

import { useState, useEffect } from "react";
import { formatPrice } from "@/app/common";

const API_URL = process.env.NEXT_PUBLIC_URL_API;


interface TopDestination {
    destination_id: string;
    name: string;
    country: string;
    region: string;
    booking_count: number;
    total_revenue: number;
}

interface TopRegion {
    region: string;
    booking_count: number;
    total_revenue: number;
}

interface DestinationStats {
    top_destinations: TopDestination[];
    top_regions: TopRegion[];
    most_popular_region: TopRegion | null;
}

export default function TourStatics() {
    const [loading, setLoading] = useState(true);
    const [destinationStats, setDestinationStats] = useState<DestinationStats | null>(null);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                // Fetch destination stats
                const destRes = await fetch(`${API_URL}/statics/admin/destinations/top`, { credentials: "include" });
                const destResponse = await destRes.json();
                
                if (destResponse.success && destResponse.data) {
                    setDestinationStats(destResponse.data);
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

    if (!destinationStats) return <div className="p-8 text-center text-lg">Không có dữ liệu thống kê</div>;

    return (
        <div className="space-y-6">
            {/* Destination Statistics */}
            {destinationStats && (
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-2xl font-bold mb-6 text-gray-800">Thống kê Điểm đến</h2>
                    
                    {/* Most Popular Region */}
                    {destinationStats.most_popular_region && (
                        <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-lg border-l-4 border-purple-500 mb-6">
                            <p className="text-sm text-gray-600 mb-2">Miền được quan tâm nhất</p>
                            <div className="flex justify-between items-end">
                                <div>
                                    <p className="text-3xl font-bold text-purple-600">{destinationStats.most_popular_region.region}</p>
                                    <p className="text-sm text-gray-600 mt-2">{destinationStats.most_popular_region.booking_count} booking</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm text-gray-600">Doanh thu</p>
                                    <p className="text-xl font-bold text-purple-600">{formatPrice(destinationStats.most_popular_region.total_revenue)}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Top Regions */}
                    {destinationStats.top_regions.length > 0 && (
                        <div className="mb-8">
                            <h3 className="text-xl font-bold mb-4 text-gray-800">Thống kê theo miền</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {destinationStats.top_regions.map((region, index) => (
                                    <div key={index} className="bg-gray-50 p-4 rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
                                        <p className="font-semibold text-gray-800 mb-2">{region.region}</p>
                                        <div className="space-y-1">
                                            <p className="text-sm text-gray-600">
                                                <span className="font-medium">{region.booking_count}</span> booking
                                            </p>
                                            <p className="text-sm text-gray-600">
                                                Doanh thu: <span className="font-medium">{formatPrice(region.total_revenue)}</span>
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Top 8 Destinations */}
                    {destinationStats.top_destinations.length > 0 && (
                        <>
                            <h3 className="text-xl font-bold mb-4 text-gray-800">Top 8 tỉnh thành được quan tâm nhất</h3>
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">STT</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tỉnh thành</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Miền</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Số booking</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Doanh thu</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {destinationStats.top_destinations.map((destination, index) => (
                                            <tr key={destination.destination_id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{index + 1}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{destination.name}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{destination.region || 'N/A'}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{destination.booking_count}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatPrice(destination.total_revenue)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </>
                    )}
                </div>
            )}
        </div>
    );
}