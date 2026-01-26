'use client'
import { useState, useEffect } from "react";
import { formatPrice } from "@/app/common";

const API_URL = process.env.NEXT_PUBLIC_URL_API

interface RevenueData {
    date?: string;
    month?: number;
    year?: number;
    period_label: string;
    completed: number;
    refunded: number;
    net_revenue: number;
}

interface RevenueTrendResponse {
    success: boolean;
    message: string;
    data: {
        period_type: string;
        year?: number;
        month?: number;
        results: RevenueData[];
    }
}

interface CustomRevenueData {
    period_type: string;
    period_label: string;
    start_date: string;
    end_date: string;
    completed: number;
    refunded: number;
    net_revenue: number;
    total_transactions: number;
}

type PeriodType = 'daily' | 'monthly' | 'yearly' | 'custom';

export default function GeneralStaticsPage() {
    const [loading, setLoading] = useState(true);
    const [revenueData, setRevenueData] = useState<RevenueData[]>([]);
    const [periodType, setPeriodType] = useState<PeriodType>('monthly');
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [customRevenue, setCustomRevenue] = useState<CustomRevenueData | null>(null);

    useEffect(() => {
        const fetchRevenueTrend = async () => {
            try {
                let url = '';
                
                if (periodType === 'daily') {
                    url = `${API_URL}/statics/admin/revenue/trend/daily?year=${selectedYear}&month=${selectedMonth}`;
                } else if (periodType === 'monthly') {
                    url = `${API_URL}/statics/admin/revenue/trend/monthly?year=${selectedYear}`;
                } else if (periodType === 'yearly') {
                    url = `${API_URL}/statics/admin/revenue/trend/yearly`;
                } else if (periodType === 'custom') {
                    // Không fetch trend cho custom, chỉ fetch khi user nhấn nút
                    setLoading(false);
                    return;
                }

                const res = await fetch(url, { credentials: "include" });
                const response: RevenueTrendResponse = await res.json();
                
                if (response.success && response.data.results) {
                    setRevenueData(response.data.results);
                }
            } catch (e) {
                console.error(e);
                alert("Lỗi tải dữ liệu doanh thu");
            } finally {
                setLoading(false);
            }
        }

        fetchRevenueTrend();
    }, [periodType, selectedYear, selectedMonth]);

    const handleCustomRangeSubmit = async () => {
        if (!startDate || !endDate) {
            alert("Vui lòng chọn ngày bắt đầu và ngày kết thúc");
            return;
        }

        try {
            const url = `${API_URL}/statics/admin/revenue/range?start_date=${startDate}&end_date=${endDate}`;
            const res = await fetch(url, { credentials: "include" });
            const response = await res.json();
            
            if (response.success && response.data) {
                setCustomRevenue(response.data);
                setRevenueData([]); // Clear trend data
            }
        } catch (e) {
            console.error(e);
            alert("Lỗi tải dữ liệu doanh thu");
        }
    };

    // Tính toán chiều cao cho biểu đồ
    const maxRevenue = Math.max(...revenueData.map(d => d.completed), 0);
    const chartHeight = 300;

    if (loading) return <div className="p-8 text-center text-lg">Đang tải thống kê...</div>;

    return (
        <div className="bg-white rounded-lg pt-6 px-6">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Thống kê doanh thu</h2>
            
            {/* Filter Controls */}
            <div className="flex flex-wrap gap-4 mb-6">
                <div className="flex gap-2">
                    <button
                        onClick={() => {
                            setPeriodType('daily');
                            setCustomRevenue(null);
                        }}
                        className={`cursor-pointer px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                            periodType === 'daily'
                                ? 'bg-blue-600 text-white shadow-md'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                    >
                        Theo ngày
                    </button>
                    <button
                        onClick={() => {
                            setPeriodType('monthly');
                            setCustomRevenue(null);
                        }}
                        className={`cursor-pointer px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                            periodType === 'monthly'
                                ? 'bg-blue-600 text-white shadow-md'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                    >
                        Theo tháng
                    </button>
                    <button
                        onClick={() => {
                            setPeriodType('yearly');
                            setCustomRevenue(null);
                        }}
                        className={`cursor-pointer px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                            periodType === 'yearly'
                                ? 'bg-blue-600 text-white shadow-md'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                    >
                        Theo năm
                    </button>
                    <button
                        onClick={() => {
                            setPeriodType('custom');
                            setRevenueData([]);
                        }}
                        className={`cursor-pointer px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                            periodType === 'custom'
                                ? 'bg-blue-600 text-white shadow-md'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                    >
                        Tùy chọn
                    </button>
                </div>

                {periodType === 'daily' && (
                    <select
                        value={selectedMonth}
                        onChange={(e) => setSelectedMonth(Number(e.target.value))}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                    >
                        {Array.from({ length: 12 }, (_, i) => i + 1).map(month => (
                            <option key={month} value={month}>
                                Tháng {month}
                            </option>
                        ))}
                    </select>
                )}
                {periodType !== 'yearly' && periodType !== 'custom' && (
                    <select
                        value={selectedYear}
                        onChange={(e) => setSelectedYear(Number(e.target.value))}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                    >
                        {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i).map(year => (
                            <option key={year} value={year}>Năm {year}</option>
                        ))}
                    </select>
                )}

                {periodType === 'custom' && (
                    <div className="flex gap-2 items-center">
                        <input
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <span className="text-gray-500">đến</span>
                        <input
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <button
                            onClick={handleCustomRangeSubmit}
                            className="cursor-pointer px-6 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
                        >
                            Xem
                        </button>
                    </div>
                )}
            </div>

            {/* Legend */}
            <div className="flex flex-wrap gap-6 mb-6 justify-center bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-green-500 rounded"></div>
                    <span className="text-sm font-medium text-gray-700">Hoàn thành</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-red-500 rounded"></div>
                    <span className="text-sm font-medium text-gray-700">Hoàn trả</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-blue-500 rounded"></div>
                    <span className="text-sm font-medium text-gray-700">Doanh thu ròng</span>
                </div>
            </div>

            {/* Chart */}
            {periodType === 'custom' && customRevenue ? (
                // Custom range view - Card view
                <div className="space-y-6">
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg border border-blue-200">
                        <div className="text-center mb-4">
                            <p className="text-lg font-semibold text-gray-700 mb-2">
                                Khoảng thời gian: {new Date(customRevenue.start_date).toLocaleDateString('vi-VN')} - {new Date(customRevenue.end_date).toLocaleDateString('vi-VN')}
                            </p>
                            <p className="text-sm text-gray-500">
                                Tổng số giao dịch: {customRevenue.total_transactions}
                            </p>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="bg-white p-5 rounded-lg shadow-sm text-center">
                                <p className="text-sm text-gray-600 mb-2">Hoàn thành</p>
                                <p className="text-2xl font-bold text-green-600">
                                    {formatPrice(customRevenue.completed)}
                                </p>
                            </div>
                            <div className="bg-white p-5 rounded-lg shadow-sm text-center">
                                <p className="text-sm text-gray-600 mb-2">Hoàn trả</p>
                                <p className="text-2xl font-bold text-red-600">
                                    {formatPrice(customRevenue.refunded)}
                                </p>
                            </div>
                            <div className="bg-white p-5 rounded-lg shadow-sm text-center">
                                <p className="text-sm text-gray-600 mb-2">Doanh thu ròng</p>
                                <p className="text-2xl font-bold text-blue-600">
                                    {formatPrice(customRevenue.net_revenue)}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            ) : revenueData.length > 0 ? (
                <div className="overflow-x-auto">
                    <div 
                        className="inline-flex gap-3 px-4 py-4" 
                        style={{ minWidth: `${Math.max(revenueData.length * 90, 800)}px` }}
                    >
                        {revenueData.map((data, index) => {
                            const completedHeight = maxRevenue > 0 ? (data.completed / maxRevenue) * chartHeight : 0;
                            const refundedHeight = maxRevenue > 0 ? (data.refunded / maxRevenue) * chartHeight : 0;
                            const netHeight = maxRevenue > 0 ? (data.net_revenue / maxRevenue) * chartHeight : 0;

                            return (
                                <div key={index} className="flex flex-col items-center gap-3 flex-1 min-w-[80px]">
                                    {/* Chart bars container */}
                                    <div 
                                        className="flex items-end gap-1.5 w-full justify-center" 
                                        style={{ height: `${chartHeight}px` }}
                                    >
                                        {/* Completed bar */}
                                        <div className="relative group flex-1 max-w-[22px]">
                                            <div
                                                className="bg-green-500 rounded-t-md transition-all duration-300 hover:bg-green-600 cursor-pointer w-full"
                                                style={{ height: `${completedHeight}px`, minHeight: data.completed > 0 ? '4px' : '0' }}
                                            >
                                                {/* Tooltip */}
                                                <div className="invisible group-hover:visible absolute top-1/2 left-1/2 
                                                    -translate-x-1/2 -translate-y-1/2
                                                    px-3 py-2 bg-gray-900 text-white text-xs rounded-md 
                                                    whitespace-nowrap z-10 shadow-lg pointer-events-none"
                                                >
                                                    <div className="font-semibold mb-1">Hoàn thành</div>
                                                    <div>{formatPrice(data.completed)}</div>
                                                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full">
                                                        <div className="border-4 border-transparent border-t-gray-900"></div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Refunded bar */}
                                        <div className="relative group flex-1 max-w-[22px]">
                                            <div
                                                className="bg-red-500 rounded-t-md transition-all duration-300 hover:bg-red-600 cursor-pointer w-full"
                                                style={{ height: `${refundedHeight}px`, minHeight: data.refunded > 0 ? '4px' : '0' }}
                                            >
                                                <div className="invisible group-hover:visible absolute top-1/2 left-1/2 
                                                                -translate-x-1/2 -translate-y-1/2
                                                                px-3 py-2 bg-gray-900 text-white text-xs rounded-md 
                                                                whitespace-nowrap z-10 shadow-lg pointer-events-none"
                                                >
                                                    <div className="font-semibold mb-1">Hoàn trả</div>
                                                    <div>{formatPrice(data.refunded)}</div>
                                                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full">
                                                        <div className="border-4 border-transparent border-t-gray-400"></div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Net revenue bar */}
                                        <div className="relative group flex-1 max-w-[22px]">
                                            <div
                                                className="bg-blue-500 rounded-t-md transition-all duration-300 hover:bg-blue-600 cursor-pointer w-full"
                                                style={{ height: `${netHeight}px`, minHeight: data.net_revenue > 0 ? '4px' : '0' }}
                                            >
                                                <div className="invisible group-hover:visible absolute top-1/2 left-1/2 
                                                                -translate-x-1/2 -translate-y-1/2
                                                                px-3 py-2 bg-gray-900 text-white text-xs rounded-md 
                                                                whitespace-nowrap z-10 shadow-lg pointer-events-none"
                                                >
                                                    <div className="font-semibold mb-1">Doanh thu ròng</div>
                                                    <div>{formatPrice(data.net_revenue)}</div>
                                                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full">
                                                        <div className="border-4 border-transparent border-t-gray-400"></div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Label */}
                                    <div className="text-xs text-gray-600 text-center font-medium whitespace-nowrap px-1 max-w-[80px]">
                                        {data.period_label}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            ) : (
                <div className="text-center py-16 text-gray-500">
                    <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                    <p className="text-lg font-medium">Không có dữ liệu doanh thu</p>
                    <p className="text-sm mt-2">
                        {periodType === 'custom' 
                            ? 'Chọn khoảng thời gian và nhấn "Xem" để xem thống kê'
                            : 'Chọn khoảng thời gian khác để xem thống kê'
                        }
                    </p>
                </div>
            )}

            {/* Summary - Only show for trend data */}
            {revenueData.length > 0 && periodType !== 'custom' && (
                <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 pt-6 border-t-2 border-gray-300">
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                        <p className="text-sm text-black mb-2 font-medium">Tổng hoàn thành</p>
                        <p className="text-2xl font-bold text-green-600">
                            {formatPrice(revenueData.reduce((sum, d) => sum + d.completed, 0))}
                        </p>
                    </div>
                    <div className="text-center p-4 bg-red-50 rounded-lg">
                        <p className="text-sm text-black mb-2 font-medium">Tổng hoàn trả</p>
                        <p className="text-2xl font-bold text-red-600">
                            {formatPrice(revenueData.reduce((sum, d) => sum + d.refunded, 0))}
                        </p>
                    </div>
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                        <p className="text-sm text-black mb-2 font-medium">Tổng doanh thu ròng</p>
                        <p className="text-2xl font-bold text-blue-600">
                            {formatPrice(revenueData.reduce((sum, d) => sum + d.net_revenue, 0))}
                        </p>
                    </div>
                </div>
            )}
        </div>
    )
}