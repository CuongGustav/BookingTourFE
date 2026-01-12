'use client'

import { useRouter } from "next/navigation";
import { useState, useMemo, useEffect } from "react";
import { ReadBookingUser } from "@/app/types/booking";
import { formatPrice } from "@/app/common";
import ReadBookingDetailPage from "./ReadBookingDetail";
import CancelBookingPendingPage from "./CancelBookingPending";
import CancelBookingPaidPage from "./CancelBookingPaid";


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


export default function AdminPage () {
    const router = useRouter();
    
    const [bookings, setBookings] = useState<ReadBookingUser[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [sortBy, setSortBy] = useState<keyof ReadBookingUser>("created_at");
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
    const [page, setPage] = useState(1);
    const pageSize = 7;
    const [isOpenModalRead, setIsOpenModalRead] = useState(false);
    const [selectedBookingId, setSelectedBookingId] = useState<string | null>(null);
    const [selectedBookingCode, setSelectedBookingCode] = useState("");
    const [isOpenModalCancelBookingPending, setIsOpenModalCancelBookingPending] = useState(false);
    const [isOpenModalCancelBookingPaid, setIsOpenModalCancelBookingPaid] = useState(false);


   
    const fetchListBooking = async () => {
        try {
            const res = await  fetch(`${API_URL}/booking/admin/all`, { credentials: "include" })
            const data = await res.json()
            setBookings(Array.isArray(data) ? data : data.data || []);
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
        fetchListBooking()
    }, []);
    
        const filteredAndSorted = useMemo(() => { //lưu kết quả xử lý từ dữ liệu API, không cần gọi lại
            let result = [...bookings];
            // search 
            if (search.trim()) {
                const term = search.toLowerCase().trim();
                result = result.filter(booking =>
                    booking.booking_code.toLowerCase().includes(term) ||
                    booking.contact_email.toLowerCase().includes(term) ||
                    booking.contact_phone.toLowerCase().includes(term)
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
        }, [bookings, search, sortBy, sortOrder]);
        // navigation page
        const paginated = filteredAndSorted.slice((page - 1) * pageSize, page * pageSize);
        const totalPages = Math.ceil(filteredAndSorted.length / pageSize);
    
        //sort
        const handleSort = (field: keyof ReadBookingUser) => {
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
                <h1 className="text-3xl font-bold mb-2 text-main">Quản lý booking</h1>
                <div className="flex gap-4 items-center">
                    {/* button create */}
                    <button 
                        className="bg-white px-8 py-4 rounded-xl border-1 border-gray-300 mb-4 cursor-pointer hover:bg-blue-800 hover:text-white"
                        onClick={()=>router.push(`/admin/dashboard/bookings/create`)}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="size-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                        </svg>
                    </button>
                    {/* search */}
                    <div className="bg-white p-2 rounded-xl border-1 border-gray-300 mb-4 flex-1">
                        <input
                            type="text"
                            placeholder="Tìm mã code, email, số điện thoại."
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
                                    onClick={() => handleSort("booking_code")} 
                                    className="px-6 py-4 text-left font-semibold cursor-pointer hover:bg-gray-100 transition"
                                >
                                    <div className="flex items-center gap-2">
                                        CODE
                                        <SortIcon isActive={sortBy === "booking_code"} direction={sortBy === "booking_code" ? sortOrder : null} />
                                    </div>
                                </th>
                                <th 
                                    onClick={() => handleSort("contact_email")} 
                                    className="px-6 py-4 text-left font-semibold cursor-pointer hover:bg-gray-100 transition"
                                >
                                    <div className="flex items-center gap-2">
                                        Email
                                        <SortIcon isActive={sortBy === "contact_email"} direction={sortBy === "contact_email" ? sortOrder : null} />
                                    </div>
                                </th>
                                <th 
                                    onClick={() => handleSort("contact_phone")} 
                                    className="px-6 py-4 text-left font-semibold cursor-pointer hover:bg-gray-100 transition"
                                >
                                    <div className="flex items-center gap-2">
                                        Số điện thoại
                                        <SortIcon isActive={sortBy === "contact_phone"} direction={sortBy === "contact_phone" ? sortOrder : null} />
                                    </div>
                                </th>
                                <th    
                                    onClick={() => handleSort("final_price")} 
                                    className="px-6 py-4 text-left font-semibold cursor-pointer hover:bg-gray-100 transition"
                                >
                                    <div className="flex items-center gap-2">
                                        Giá cuối
                                        <SortIcon isActive={sortBy === "final_price"} direction={sortBy === "final_price" ? sortOrder : null} />
                                    </div>
                                </th>
                                <th
                                    onClick={() => handleSort("status")} 
                                    className="px-6 py-4 text-left font-semibold cursor-pointer hover:bg-gray-100 transition"
                                >
                                    <div className="flex items-center gap-2">
                                        Trạng thái 
                                        <SortIcon isActive={sortBy === "status"} direction={sortBy === "status" ? sortOrder : null} />
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
                            {paginated.map(booking => (
                                <tr key={booking.booking_id} className="hover:bg-gray-50 transition">
                                    <td className="px-2 py-4 font-medium flex gap-2">
                                        {booking.status === "PENDING" && (
                                            <>
                                                <button 
                                                    className="p-1 border-1 border-gray-400 rounded cursor-pointer hover:bg-red-600 hover:text-white"
                                                    onClick={ () => {
                                                        setSelectedBookingId(booking.booking_id)
                                                        setSelectedBookingCode(booking.booking_code)
                                                        setIsOpenModalCancelBookingPending(true)
                                                        }
                                                    }
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                                    </svg>
                                                </button>
                                                <button 
                                                    className="p-1 border-1 border-gray-400 rounded cursor-pointer hover:bg-green-600 hover:text-white"
                                                    onClick={() => router.push(`/admin/dashboard/payments/create/${booking.booking_id}`)}
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 0 1 3 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 0 0-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 0 1-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 0 0 3 15h-.75M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm3 0h.008v.008H18V10.5Zm-12 0h.008v.008H6V10.5Z" />
                                                    </svg>
                                                </button>
                                            </>
                                        )}
                                        {booking.status === "PAID" && (
                                            <>
                                                <button 
                                                    className="p-1 border-1 border-gray-400 rounded cursor-pointer hover:bg-red-600 hover:text-white"
                                                    onClick={ () => {
                                                        setSelectedBookingId(booking.booking_id)
                                                        setIsOpenModalCancelBookingPaid(true)
                                                        }
                                                    }
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                                    </svg>
                                                </button>
                                                <button 
                                                    className="p-1 border-1 border-gray-400 rounded cursor-pointer hover:bg-green-600 hover:text-white"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                                    </svg>
                                                </button>
                                            </>
                                        )}
                                        {booking.status === "CONFIRMED" && (
                                            <button 
                                                className="p-1 border-1 border-gray-400 rounded cursor-pointer hover:bg-red-600 hover:text-white"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                                </svg>
                                            </button>
                                        )}
                                        {booking.status === "CANCEL_PENDING" && (
                                            <button 
                                                className="p-1 border-1 border-gray-400 rounded cursor-pointer hover:bg-green-600 hover:text-white"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                                </svg>
                                            </button>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 font-medium">
                                        <a 
                                            className="cursor-pointer hover:text-blue-600"
                                            onClick={()=>{
                                                setSelectedBookingId(booking.booking_id)
                                                setIsOpenModalRead(true);
                                            }}
                                        >
                                            {booking.booking_code}
                                        </a>
                                    </td>
                                    <td className="px-6 py-4">{booking.contact_email || "—"}</td>
                                    <td className="px-6 py-4">{booking.contact_phone || "—"}</td>
                                    <td className="px-6 py-4">{formatPrice(booking.final_price)|| "—"}</td>
                                    <td className="px-6 py-4">
                                        <span
                                            className={`px-3 py-1 rounded-full text-xs font-bold
                                            ${
                                                booking.status === "PENDING"
                                                    ? "bg-yellow-100 text-yellow-800"
                                                    : booking.status === "PAID"
                                                    ? "bg-purple-100 text-purple-800"
                                                    : booking.status === "CONFIRMED"
                                                    ? "bg-blue-100 text-blue-800"
                                                    : booking.status === "COMPLETED"
                                                    ? "bg-green-100 text-green-800"
                                                    : booking.status === "CANCEL_PENDING"
                                                    ? "bg-orange-100 text-orange-800"
                                                    : "bg-red-100 text-red-800"
                                            }`}
                                        >
                                            {
                                                booking.status === "PENDING"
                                                    ? "Chờ xử lý"
                                                    : booking.status === "PAID"
                                                    ? "Đã thanh toán"
                                                    : booking.status === "CONFIRMED"
                                                    ? "Đã xác nhận"
                                                    : booking.status === "COMPLETED"
                                                    ? "Hoàn thành"
                                                    : booking.status === "CANCEL_PENDING"
                                                    ? "Chờ hủy"
                                                    : "Đã hủy"
                                            }
                                        </span>
                                    </td>

                                    <td className="px-6 py-4 text-sm ">
                                        {new Date(booking.created_at).toLocaleDateString("vi-VN")}
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
            {/* read booking   */}
            {isOpenModalRead && selectedBookingId && (
                <ReadBookingDetailPage 
                    isOpen={isOpenModalRead}
                    onClose={() => {
                        setIsOpenModalRead(false);
                        setSelectedBookingId(null);
                    }}
                    booking_id={selectedBookingId}
                />
            )}
            {/* cancel booking pending */}
            {isOpenModalCancelBookingPending && selectedBookingId &&(
                <CancelBookingPendingPage
                    isOpen={isOpenModalCancelBookingPending}
                    onClose={()=>{
                        setIsOpenModalCancelBookingPending(false)
                        setSelectedBookingId(null);
                        setSelectedBookingCode("");
                    }}
                    booking_id={selectedBookingId}
                    booking_code={selectedBookingCode}
                    onSuccess={fetchListBooking}
                /> 
            )}
            {/* cancel booking paid */}
            {isOpenModalCancelBookingPaid && selectedBookingId &&(
                <CancelBookingPaidPage
                    isOpen={isOpenModalCancelBookingPaid}
                    onClose={()=>{
                        setIsOpenModalCancelBookingPaid(false)
                        setSelectedBookingId(null);
                        setSelectedBookingCode("");
                    }}
                    booking_id={selectedBookingId}
                    onSuccess={fetchListBooking}
                /> 
            )}
        </div>     
    )
}