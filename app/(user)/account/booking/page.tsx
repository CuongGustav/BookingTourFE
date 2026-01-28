'use client'

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { ReadBookingUser } from "@/app/types/booking";
import { formatPrice } from "@/app/common";
import ModalReadBookingDetail from "./modalReadBookingDetail";
import { ReadBookingDetail } from "@/app/types/booking";
import ModalCancelBookingPending from "./modalCancelBookingPending";
import ModalCancelBookingConfirm from "./CancelBookingConfirm";
import CreateReviewUser from "../review/CreateReview";

const API_URL = process.env.NEXT_PUBLIC_URL_API;

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

export default function BookingAccountPage () {

    const searchParams = useSearchParams();
    const status = searchParams.get("status");
    const router = useRouter();

    const [bookings, setBookings] = useState<ReadBookingUser[]>([]);
    const [loading, setLoading] = useState(true);
    const activeClass = "text-blue-900 font-bold";
    const normalClass = "hover:text-blue-600 font-bold";
    const [search, setSearch] = useState("");
    const [sortBy, setSortBy] = useState<keyof ReadBookingUser>("created_at");
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
    const [page, setPage] = useState(1);
    const pageSize = 4;
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedBooking, setSelectedBooking] = useState<ReadBookingDetail|null>(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [bookingToDelete, setBookingToDelete] = useState<ReadBookingUser | null>(null);
    const [isCancelling, setIsCancelling] = useState(false);
    const [selectBookingID, setSelectedBookingID] = useState("")
    const [selectBookingCode, setSelectedBookingCode] = useState("")
    const [selectedTourID, setSelectedTourID] = useState("")
    const [isOpenModalCanCelBookingConfirm, setIsOpenModalCanCelBookingConfirm] = useState(false);
    const [isOpenModalCreateReview, setIsOpenModalCreateReview] = useState(false)

    const filteredAndSorted = useMemo(() => { //lưu kết quả xử lý từ dữ liệu API, không cần gọi lại
            let result = [...bookings];
            // search 
            if (search.trim()) {
                const term = search.toLowerCase().trim();
                result = result.filter(bookings =>
                    bookings.booking_code.toLowerCase().includes(term) ||
                    bookings.contact_email.toLowerCase().includes(term) ||
                    bookings.contact_name.toLowerCase().includes(term) ||
                    bookings.contact_phone.toLowerCase().includes(term)
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


    const fetchBookings = useCallback(async () => {
        try {
            setLoading(true);
            const query = status ? `?status=${status.toLowerCase()}` : "";
            const res = await fetch(`${API_URL}/booking/all${query}`, {
                method: "GET",
                credentials: "include",
            });

            if (!res.ok) throw new Error("Fetch failed");

            const data = await res.json();
            setBookings(data.bookings || []);
        } catch (e) {
            console.error(e);
            alert("Lỗi tải dữ liệu");
        } finally {
            setLoading(false);
        }
    }, [status]);

    useEffect(() => {
        fetchBookings();
    }, [fetchBookings]);

    const renderActions = (booking: ReadBookingUser) => {
        const currentStatus = status?.toLowerCase();

        switch (currentStatus) {
            case "pending":
                return (
                    <div className="flex gap-2">
                        <button 
                            className="p-1 border-1 border-gray-400 rounded cursor-pointer hover:bg-blue-800 hover:text-white"
                            onClick={()=>router.push(`/booking/update/${booking.booking_id}`)}           
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                            </svg>
                        </button>
                        <button 
                            disabled={isDeleteModalOpen || isCancelling}
                            className={`p-1 border-1 border-gray-400 rounded hover:bg-red-600 hover:text-white ${isDeleteModalOpen || isCancelling ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                            onClick={() => {
                                if (!isDeleteModalOpen && !isCancelling) { 
                                    setBookingToDelete(booking);
                                    setIsDeleteModalOpen(true);
                                }
                            }}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                            </svg>
                        </button>
                        <button 
                            className="px-2 py-1 text-xs font-bold bg-green-600 text-white rounded hover:bg-green-700 transition cursor-pointer uppercase"
                            onClick={()=>router.push(`/payment/${booking.booking_id}`)}
                        >
                            Thanh toán
                        </button>
                    </div>
                );
            case "confirmed":
                return (
                    <div className="flex gap-2">
                        {!booking.is_full_payment && (
                            <button 
                                className="p-1 border-1 border-gray-400 rounded cursor-pointer hover:bg-green-600 hover:text-white"
                                onClick={() => {
                                    console.log('Thanh toán booking:', booking.booking_code);
                                }}
                                title="Thanh toán"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Z" />
                                </svg>
                            </button>
                        )}
                        <button 
                            className="p-1 border-1 border-gray-400 rounded cursor-pointer hover:bg-red-600 hover:text-white"
                            onClick={() => {
                                setIsOpenModalCanCelBookingConfirm(true)
                                setSelectedBookingID(booking.booking_id)
                                setSelectedBookingCode(booking.booking_code)
                            }}
                            title="Hủy booking"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                            </svg>
                        </button>
                    </div>
                );
            case "completed":
                if (booking.is_review === true ) {
                        return <span>Đã đánh giá</span>;
                    }
                return (
                    <button
                        className="px-3 py-1 text-xs font-bold bg-blue-600 text-white rounded hover:bg-blue-700 transition cursor-pointer uppercase"
                        onClick={() => {
                            setIsOpenModalCreateReview(true)
                            setSelectedBookingID(booking.booking_id)
                            setSelectedTourID(booking.tour_id)
                        }}
                    >
                        Đánh giá
                    </button>
                );
            case "cancelled":
                return (
                    <button 
                        className="px-3 py-1 text-xs font-bold bg-orange-500 text-white rounded hover:bg-orange-600 transition cursor-pointer uppercase"
                        onClick={()=>router.push(`/tours/${booking.tour_id}`)}   
                    >
                        Đặt lại
                    </button>
                );
            default:
                return <span></span>;
        }
    };

    //open read modal
    const handleOpenModal = async (bookingId: string) => {
        try {
            const res = await fetch(`${API_URL}/booking/${bookingId}`, {
                method: "GET",
                credentials: "include",
            });

            if (!res.ok) throw new Error("Failed to fetch booking details");

            const data = await res.json();
            const booking = data.booking;

            // Map to the expected structure for the modal
            const mappedData = {
                booking_code: booking.booking_code,
                tour: {
                    title: booking.tour_title,
                    tour_code: booking.tour_code || 'Unknown',  // Add these fields in backend schema if missing
                    main_image_url: booking.main_image_url || '/placeholder-image.jpg',
                    single_room_surcharge: booking.single_room_surcharge || 0,
                },
                schedule: {
                    departure_date: booking.departure_date || new Date().toISOString(),
                },
                contact_name: booking.contact_name,
                contact_email: booking.contact_email,
                contact_phone: booking.contact_phone,
                contact_address: booking.contact_address,
                passengers: booking.passengers || [],
                total_price: booking.total_price,
                discount_amount: booking.discount_amount,
                final_price: booking.final_price,
                coupon: booking.coupon_code ? { code: booking.coupon_code } : undefined,
                tour_id: booking.tour_id, 
                schedule_id: booking.schedule_id,
                paid_money: booking.paid_money,
                is_full_payment: booking.is_full_payment,
            };

            setSelectedBooking(mappedData);
            setIsModalOpen(true);
        } catch (e) {
            console.error(e);
            alert("Lỗi tải chi tiết booking");
        }
    };

    if (loading) return <div className="p-8 text-center text-lg">Đang tải danh sách booking...</div>;

    return (
        <div className="max-w-4xl mx-auto relative h-[calc(100vh-128px)]">
            <div className="w-full mx-auto">
                {/* title */}
                <div className="flex gap-4 px-2 py-4 border-b">
                    <Link
                        href="/account/booking"
                        className={!status ? activeClass : normalClass}
                    >
                        Tất cả
                    </Link>

                    <Link
                        href="/account/booking?status=pending"
                        className={status === "pending" ? activeClass : normalClass}
                    >
                        Chưa thanh toán
                    </Link>
                    <Link
                        href="/account/booking?status=deposit"
                        className={status === "deposit" ? activeClass : normalClass}
                    >
                        Đã đặt cọc
                    </Link>
                    <Link
                        href="/account/booking?status=paid"
                        className={status === "paid" ? activeClass : normalClass}
                    >
                        Đã thanh toán
                    </Link>
                    <Link
                        href="/account/booking?status=confirmed"
                        className={status === "confirmed" ? activeClass : normalClass}
                    >
                        Đã xác nhận
                    </Link>

                    <Link
                        href="/account/booking?status=completed"
                        className={status === "completed" ? activeClass : normalClass}
                    >
                        Đã hoàn thành
                    </Link>
                    <Link
                        href="/account/booking?status=cancel_pending"
                        className={status === "cancel_pending" ? activeClass : normalClass}
                    >
                        Chờ hủy
                    </Link>                 
                    <Link
                        href="/account/booking?status=cancelled"
                        className={status === "cancelled" ? activeClass : normalClass}
                    >
                        Đã hủy
                    </Link>
                </div>
                {/* search */}
                <div className="bg-white p-2 rounded-xl border-1 border-gray-300 my-4">
                    <input
                        type="text"
                        placeholder="Tìm theo booking code."
                        value={search}
                        onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                        className="w-full px-5 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                </div>
                {/* table */}
                <div className="bg-white rounded-xl order-1 border-gray-300 overflow-x-auto">
                    <table className="w-full min-w-max">
                        <thead className="bg-gray-50 border-b">
                            <tr>
                                <th className="py-4 text-left font-semibold cursor-pointer hover:bg-gray-100 transitio ">
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
                                    onClick={() => handleSort("tour_title")} 
                                    className="px-6 py-4 text-left font-semibold cursor-pointer hover:bg-gray-100 transition"
                                >
                                    <div className="flex items-center gap-2">
                                        Tên Tour
                                        <SortIcon isActive={sortBy === "tour_title"} direction={sortBy === "tour_title" ? sortOrder : null} />
                                    </div>
                                </th>
                                <th    
                                    onClick={() => handleSort("paid_money")} 
                                    className="px-6 py-4 text-left font-semibold cursor-pointer hover:bg-gray-100 transition"
                                >
                                    <div className="flex items-center gap-2">
                                        Tiền đã trã
                                        <SortIcon isActive={sortBy === "paid_money"} direction={sortBy === "paid_money" ? sortOrder : null} />
                                    </div>
                                </th>
                                <th 
                                    onClick={() => handleSort("final_price")} 
                                    className="px-6 py-4 text-left font-semibold cursor-pointer hover:bg-gray-100 transition"
                                >
                                    <div className="flex items-center gap-2">
                                        Giá cuối cùng
                                        <SortIcon isActive={sortBy === "final_price"} direction={sortBy === "final_price" ? sortOrder : null} />
                                    </div>
                                </th>
                                <th    
                                    onClick={() => handleSort("depart_date")} 
                                    className="px-6 py-4 text-left font-semibold cursor-pointer hover:bg-gray-100 transition"
                                >
                                    <div className="flex items-center gap-2">
                                        Ngày khởi hành
                                        <SortIcon isActive={sortBy === "depart_date"} direction={sortBy === "depart_date" ? sortOrder : null} />
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
                                    {renderActions(booking)}
                                </td>
                                <td className="px-6 py-4 font-medium">
                                    <a 
                                        className="cursor-pointer hover:text-blue-600"
                                        onClick={() => handleOpenModal(booking.booking_id)}
                                    >
                                        {booking.booking_code}
                                    </a>
                                </td>
                                <td className="px-6 py-4 text-gray-600 max-w-[350px]">
                                    <p className="line-clamp-2 text-sm text-gray-600">
                                        {booking.tour_title || "—"}
                                    </p>
                                </td>
                                <td className="px-6 py-4"> {formatPrice(booking.paid_money) || "0"}</td>
                                <td className="px-6 py-4">{formatPrice(booking.final_price) || "0"}</td>
                                <td className="px-6 py-4 text-sm text-gray-500">
                                    {booking.depart_date 
                                        ? new Date(booking.depart_date).toLocaleDateString("vi-VN")
                                        : "N/A"}
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-500">
                                    {new Date(booking.created_at).toLocaleDateString("vi-VN")}
                                </td>
                            </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {/* navigation */}
                <div className=" bottom-4 left-0 right-0">
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
            {selectedBooking && (
                <ModalReadBookingDetail
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    bookingData={selectedBooking}
                />
            )}
            {isDeleteModalOpen && (
                <ModalCancelBookingPending
                    booking={bookingToDelete}
                    onClose={() => {
                        setIsDeleteModalOpen(false);
                        setBookingToDelete(null);
                        setIsCancelling(false); 
                    }}
                    onDeleted={() => {
                        setIsCancelling(false); 
                        fetchBookings();
                    }}
                />
            )}
            {/* cancel booking confirm */}
            {isOpenModalCanCelBookingConfirm && selectBookingID &&(
                <ModalCancelBookingConfirm
                    isOpen={isOpenModalCanCelBookingConfirm}
                    onClose={()=>{
                        setIsOpenModalCanCelBookingConfirm(false)
                        setSelectedBookingID("");
                        setSelectedBookingCode("");
                    }}
                    booking_id={selectBookingID}
                    booking_code={selectBookingCode}
                    onSuccess={fetchBookings}
                /> 
            )}
            {/* create review */}
            {isOpenModalCreateReview && selectBookingID &&(
                <CreateReviewUser
                    isOpen={isOpenModalCreateReview}
                    onClose={()=>{
                        setIsOpenModalCreateReview(false)
                        setSelectedBookingID("");
                        setSelectedTourID("");
                    }}
                    booking_id={selectBookingID}
                    tour_id={selectedTourID}
                    onSuccess={fetchBookings}
                /> 
            )}
        </div>
    )
}