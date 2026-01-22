'use client'

import { useRouter } from "next/navigation";
import { useState, useMemo, useEffect, useRef } from "react";
import { ReadCouponAdmin } from "@/app/types/coupon";
import { formatPrice } from "@/app/common";
import ModalDeleteCouponAdmin from "./coupon.modalDeleteAdmin";


const API_URL = process.env.NEXT_PUBLIC_URL_API

const SortIcon = ({isActive, direction}: {isActive: boolean; direction: "asc" | "desc" | null}) => {
    if(!isActive) {
        return (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="size-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 15 12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9" />
            </svg>
        );
    }
    return direction === "asc" ? (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="size-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 15.75 7.5-7.5 7.5 7.5" />
        </svg>

    ):(
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="size-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
        </svg>
    )
}

export default function CouponPage () {  
    const router = useRouter();

    const [coupons, setCoupons] = useState<ReadCouponAdmin[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [sortBy, setSortBy] = useState<keyof ReadCouponAdmin>("created_at");
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
    const [page, setPage] = useState(1);
    const pageSize = 7;
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedCoupon, setSelectedCoupon] = useState<ReadCouponAdmin | null>(null);
    const calledRef = useRef(false)

    const fetchListCoupon = async () => {
        try {
            const res = await  fetch(`${API_URL}/coupon/admin/getAll`, { credentials: "include" })
            const data = await res.json()
            setCoupons(Array.isArray(data) ? data : data.data || []);
            setLoading(false);
        } catch (e) {
            console.error(e);
            alert("Lỗi tải dữ liệu");
            setLoading(false);  
        }
        finally {
            setLoading(false);
        }
    }
    
    useEffect(() => {
        if (calledRef.current) return
        calledRef.current = true
        fetchListCoupon()
    }, []);

    const filteredAndSorted = useMemo(() => { //lưu kết quả xử lý từ dữ liệu API, không cần gọi lại
        let result = [...coupons];
        // search 
        if (search.trim()) {
            const term = search.toLowerCase().trim();
            result = result.filter(acc =>
                acc.code.toLowerCase().includes(term) ||
                acc.description.toLowerCase().includes(term)
            )
        }
        //sort by result search, sortBy, sortOrder
        result.sort((a, b) => {
            const aVal = a[sortBy];
            const bVal = b[sortBy];
            if (aVal === null || aVal === undefined) return 1;
            if (bVal === null || bVal === undefined) return -1;
            if (typeof aVal === "string" && typeof bVal === "string") {
                return sortOrder === "asc"
                ? aVal.localeCompare(bVal)
                : bVal.localeCompare(aVal);
            }
            if (aVal < bVal) return sortOrder === "asc" ? -1 : 1;
            if (aVal > bVal) return sortOrder === "asc" ? 1 : -1;
            return 0;
        });
        return result;
    }, [coupons, search, sortBy, sortOrder]);
    // navigation page
    const paginated = filteredAndSorted.slice((page - 1) * pageSize, page * pageSize);
    const totalPages = Math.ceil(filteredAndSorted.length / pageSize);

    //sort
    const handleSort = (field: keyof ReadCouponAdmin) => {
        if (sortBy === field) {
        setSortOrder(prev => prev === "asc" ? "desc" : "asc");
        } else {
        setSortBy(field);
        setSortOrder("asc");
        }
        setPage(1);
    };

    if (loading) return <div className="p-8 text-center text-lg">Đang tải danh sách tài khoản...</div>;

    return (
        <div className="py-2 max-w-7xl mx-auto h-screen relative">
            <div className="w-full max-w-[96%] mx-auto">
                {/* title */}
                <h1 className="text-3xl font-bold mb-2 text-main">Quản lý mã giảm giá</h1>
                <div className="flex gap-4 items-center">
                    {/* button create */}
                    <button 
                        className="bg-white px-8 py-4 rounded-xl border-1 border-gray-300 mb-4 cursor-pointer hover:bg-blue-800 hover:text-white"
                        onClick={() => router.push("/admin/dashboard/coupons/create")}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="size-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                        </svg>
                    </button>
                    {/* search */}
                    <div className="bg-white p-2 rounded-xl border-1 border-gray-300 mb-4 flex-1">
                        <input
                            type="text"
                            placeholder="Tìm điểm đến, khu vực, vùng miền, mô tả."
                            value={search}
                            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                            className="w-full px-5 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                        />
                    </div>
                </div>    
                {/* table */}
                <div className="bg-white rounded-xl order-1 border-gray-300 overflow-x-auto">
                    <table className="w-full min-w-max">
                        <thead className="bg-gray-50 border-b">
                            <tr>
                                <th className="px-6 py-4 text-left font-semibold cursor-pointer hover:bg-gray-100 transition">
                                    <div className="flex items-center gap-2">                                      
                                    </div>
                                </th>
                                <th 
                                    onClick={() => handleSort("code")} 
                                    className="px-6 py-4 text-left font-semibold cursor-pointer hover:bg-gray-100 transition"
                                >
                                    <div className="flex items-center gap-2">
                                        CODE
                                        <SortIcon isActive={sortBy === "code"} direction={sortBy === "code" ? sortOrder : null} />
                                    </div>
                                </th>
                                <th 
                                    onClick={() => handleSort("description")} 
                                    className="px-6 py-4 text-left font-semibold cursor-pointer hover:bg-gray-100 transition"
                                >
                                    <div className="flex items-center gap-2">
                                        Mô tả
                                        <SortIcon isActive={sortBy === "description"} direction={sortBy === "description" ? sortOrder : null} />
                                    </div>
                                </th>
                                <th    
                                    onClick={() => handleSort("discount_type")} 
                                    className="px-6 py-4 text-left font-semibold cursor-pointer hover:bg-gray-100 transition"
                                >
                                    <div className="flex items-center gap-2">
                                        Loại giảm giá
                                        <SortIcon isActive={sortBy === "discount_type"} direction={sortBy === "discount_type" ? sortOrder : null} />
                                    </div>
                                </th>
                                <th 
                                    onClick={() => handleSort("discount_value")} 
                                    className="px-6 py-4 text-left font-semibold cursor-pointer hover:bg-gray-100 transition"
                                >
                                    <div className="flex items-center gap-2">
                                        Mức giảm giá
                                        <SortIcon isActive={sortBy === "discount_value"} direction={sortBy === "discount_value" ? sortOrder : null} />
                                    </div>
                                </th>
                                <th 
                                    onClick={() => handleSort("usage_limit")} 
                                    className="px-6 py-4 text-left font-semibold cursor-pointer hover:bg-gray-100 transition"
                                >
                                    <div className="flex items-center gap-2">
                                        Số lượng
                                        <SortIcon isActive={sortBy === "usage_limit"} direction={sortBy === "usage_limit" ? sortOrder : null} />
                                    </div>
                                </th>
                                <th onClick={() => handleSort("used_count")} className="px-6 py-4 text-left font-semibold cursor-pointer hover:bg-gray-100 transition">
                                    <div className="flex items-center gap-2">
                                        Đã dùng
                                        <SortIcon isActive={sortBy === "used_count"} direction={sortBy === "used_count" ? sortOrder : null} />
                                    </div>
                                </th>
                                <th onClick={() => handleSort("used_count")} className="px-6 py-4 text-left font-semibold cursor-pointer hover:bg-gray-100 transition">
                                    <div className="flex items-center gap-2">
                                        Ngày bắt đầu
                                        <SortIcon isActive={sortBy === "used_count"} direction={sortBy === "used_count" ? sortOrder : null} />
                                    </div>
                                </th>
                                <th onClick={() => handleSort("used_count")} className="px-6 py-4 text-left font-semibold cursor-pointer hover:bg-gray-100 transition">
                                    <div className="flex items-center gap-2">
                                        Ngày kết thúc
                                        <SortIcon isActive={sortBy === "used_count"} direction={sortBy === "used_count" ? sortOrder : null} />
                                    </div>
                                </th>
                                <th>
                                    <div className="flex items-center gap-2">
                                        Trạng thái 
                                        <SortIcon isActive={sortBy === "is_active"} direction={sortBy === "is_active" ? sortOrder : null} />
                                    </div>
                                </th>
                                <th 
                                    onClick={() => handleSort("created_at")} 
                                    className="px-6 py-4 text-left font-semibold cursor-pointer hover:bg-gray-100 transition"
                                >
                                    <div className="flex items-center gap-2">
                                        Ngày tạo 
                                        <SortIcon isActive={sortBy === "created_at"} direction={sortBy === "created_at" ? sortOrder : null} />
                                    </div>
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {paginated.map(coupon => (
                                <tr key={coupon.coupon_id} className="hover:bg-gray-50 transition">
                                    <td className="px-2 py-4 font-medium flex gap-2">
                                        <button 
                                            className="p-1 border-1 border-gray-400 rounded cursor-pointer hover:bg-blue-600 hover:text-white"
                                            onClick={()=>router.push(`/admin/dashboard/coupons/update/${coupon.coupon_id}`)}                            
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                                            </svg>
                                        </button>
                                        <button 
                                            className="p-1 border-1 border-gray-400 rounded cursor-pointer hover:bg-red-600 hover:text-white"
                                            onClick={() => {
                                                setSelectedCoupon(coupon);
                                                setShowDeleteModal(true);
                                            }} 
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                            </svg>

                                        </button>
                                    </td>
                                    <td className="px-6 py-4 font-medium">
                                        <a 
                                            onClick={() => router.push(`/admin/dashboard/coupons/read/${coupon.coupon_id}`)}
                                            className="cursor-pointer hover:text-blue-600"
                                        >
                                            {coupon.code}
                                        </a>
                                    </td>
                                    <td className="px-6 py-4 w-[380px]">
                                        <p className="line-clamp-2 text-sm text-gray-700">
                                            {coupon.description || "—"}
                                        </p>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${coupon.discount_type === "PERCENTAGE" ? "bg-purple-100 text-purple-800" : "bg-green-100 text-green-800"}`}>
                                            {coupon.discount_type === "PERCENTAGE" ? "Phần trăm" : "Cố định"}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">{formatPrice(coupon.discount_value)|| "—"}</td>
                                    <td className="px-6 py-4">{coupon.usage_limit || "—"}</td>
                                    <td className="px-6 py-4">{coupon.used_count || "—"}</td>
                                    <td className="px-6 py-4 text-sm">
                                        {new Date(coupon.valid_from).toLocaleDateString("vi-VN")}
                                    </td>
                                    <td className="px-6 py-4 text-sm ">
                                        {new Date(coupon.valid_to).toLocaleDateString("vi-VN")}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${coupon.is_active ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                                            {coupon.is_active ? "Hoạt động" : "Bị khóa"}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm ">
                                        {new Date(coupon.created_at).toLocaleDateString("vi-VN")}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {/* navigation */}
                <div className="absolute bottom-4 left-0 right-0">
                    {totalPages > 1 && (
                        <div className="mt-4 flex justify-center items-center gap-2 flex-wrap">
                            {/* arrow left */}
                            <button
                                onClick={() => setPage(prev => Math.max(1, prev - 1))}
                                disabled={page === 1}
                                className={`px-3 py-2 rounded-lg font-medium transition ${
                                    page === 1 
                                        ? "bg-gray-100 text-gray-400 cursor-not-allowed" 
                                        : "bg-gray-200 hover:bg-gray-300 cursor-pointer"
                                }`}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                                </svg>
                            </button>
                            {/* number page */}
                            {(() => {
                                const maxVisible = 5;
                                let startPage = Math.max(1, page - Math.floor(maxVisible / 2));
                                const endPage = Math.min(totalPages, startPage + maxVisible - 1);
                                
                                // Điều chỉnh lại nếu không đủ 5 số
                                if (endPage - startPage + 1 < maxVisible) {
                                    startPage = Math.max(1, endPage - maxVisible + 1);
                                }
                                
                                return Array.from(
                                    { length: endPage - startPage + 1 }, 
                                    (_, i) => startPage + i
                                ).map(p => (
                                    <button 
                                        key={p} 
                                        onClick={() => setPage(p)}
                                        className={`px-5 py-2 rounded-lg font-medium transition cursor-pointer ${
                                            page === p 
                                                ? "bg-blue-600 text-white" 
                                                : "bg-gray-200 hover:bg-gray-300"
                                        }`}
                                    >
                                        {p}
                                    </button>
                                ));
                            })()}
                            {/* arrow right */}
                            <button
                                onClick={() => setPage(prev => Math.min(totalPages, prev + 1))}
                                disabled={page === totalPages}
                                className={`px-3 py-2 rounded-lg font-medium transition ${
                                    page === totalPages 
                                        ? "bg-gray-100 text-gray-400 cursor-not-allowed" 
                                        : "bg-gray-200 hover:bg-gray-300 cursor-pointer"
                                }`}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                                </svg>
                            </button>
                        </div>
                    )}
                </div>
            </div>
            {showDeleteModal && (
                <ModalDeleteCouponAdmin
                    coupon={selectedCoupon}
                    onClose={() => {
                        setShowDeleteModal(false);
                        setSelectedCoupon(null);
                    }}
                    onDeleted={() => fetchListCoupon()}
                />
            )}

        </div>
    )
}