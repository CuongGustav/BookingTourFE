'use client'

import ReviewInfo from "@/app/types/reviews";
import { useState, useMemo, useEffect, useCallback } from "react";
import DeleteReview from "./DeleteReview";
import ReadReview from "./ReadReview";
import UpdateReviewUser from "./UpdateReview";

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
   
export default function ReviewPage () {
    const [reviews, setReviews] = useState<ReviewInfo[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [sortBy, setSortBy] = useState<keyof ReviewInfo>("created_at");
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
    const [page, setPage] = useState(1);
    const pageSize = 5;
    const [isOpenModelDelete, setIsOpenModelDelete] = useState(false)
    const [isOpenModelRead, setIsOpenModelRead] = useState(false)
    const [isOpenModelUpdate, setIsOpenModelUpdate] = useState(false)
    const [selectReviewID, setSelectReviewID] = useState("")

    const filteredAndSorted = useMemo(() => { //lưu kết quả xử lý từ dữ liệu API, không cần gọi lại
        let result = [...reviews];
        // search 
        if (search.trim()) {
            const term = search.toLowerCase().trim();
            result = result.filter(reviews =>
                reviews.comment.toLowerCase().includes(term)
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
    }, [reviews, search, sortBy, sortOrder]);
    // navigation page
    const paginated = filteredAndSorted.slice((page - 1) * pageSize, page * pageSize);
    const totalPages = Math.ceil(filteredAndSorted.length / pageSize);

    //sort
    const handleSort = (field: keyof ReviewInfo) => {
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
            const res = await fetch(`${API_URL}/reviews/all`, {
                method: "GET",
                credentials: "include",
            });

            if (!res.ok) throw new Error("Fetch failed");

            const data = await res.json();
            setReviews(data.reviews|| []);
        } catch (e) {
            console.error(e);
            alert("Lỗi tải dữ liệu");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchBookings();
    }, [fetchBookings]);

    if (loading) return <div className="p-8 text-center text-lg">Đang tải danh sách đánh giá...</div>;

    return (
        <div className="flex flex-col gap-2 w-full max-w-full overflow-x-hidden">
            {/* content */}
            <div className="py-2 w-full flex flex-col">
                <div className="w-full px-2">
                    {/* search section */}
                    <div className="bg-white p-2 rounded-xl border border-gray-300 mb-4 shadow-sm">
                        <input
                            type="text"
                            placeholder="Tìm nội dung."
                            value={search}
                            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                            className="w-full px-5 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all"
                        />
                    </div>

                    {/* table section*/}
                    <div className="bg-white rounded-xl border border-gray-300 overflow-hidden shadow-sm">
                        <div className="overflow-x-auto">
                            <table className="w-full min-w-[900px] border-collapse"> 
                                <thead className="bg-gray-50 border-b border-gray-300">
                                    <tr>
                                        <th className="px-4 py-4 text-left font-semibold text-gray-700 w-[120px]">Hành động</th>
                                        <th 
                                            onClick={() => handleSort("review_id")} 
                                            className="px-4 py-4 text-left font-semibold text-gray-700 cursor-pointer hover:bg-gray-100 transition"
                                        >
                                            <div className="flex items-center gap-2">
                                                ReviewID
                                                <SortIcon isActive={sortBy === "review_id"} direction={sortBy === "review_id" ? sortOrder : null} />
                                            </div>
                                        </th>
                                        <th 
                                            onClick={() => handleSort("comment")} 
                                            className="px-4 py-4 text-left font-semibold text-gray-700 cursor-pointer hover:bg-gray-100 transition"
                                        >
                                            <div className="flex items-center gap-2">
                                                Nội dung
                                                <SortIcon isActive={sortBy === "comment"} direction={sortBy === "comment" ? sortOrder : null} />
                                            </div>
                                        </th>
                                        <th 
                                            onClick={() => handleSort("rating")} 
                                            className="px-4 py-4 text-left font-semibold text-gray-700 cursor-pointer hover:bg-gray-100 transition"
                                        >
                                            <div className="flex items-center gap-2">
                                                Đánh giá
                                                <SortIcon isActive={sortBy === "rating"} direction={sortBy === "rating" ? sortOrder : null} />
                                            </div>
                                        </th>
                                        <th 
                                            onClick={() => handleSort("created_at")} 
                                            className="px-4 py-4 text-left font-semibold text-gray-700 cursor-pointer hover:bg-gray-100 transition"
                                        >
                                            <div className="flex items-center gap-2">
                                                Ngày tạo 
                                                <SortIcon isActive={sortBy === "created_at"} direction={sortBy === "created_at" ? sortOrder : null} />
                                            </div>
                                        </th>
                                    </tr>
                                </thead>  
                                <tbody className="divide-y divide-gray-200">
                                    {paginated.map(review => (
                                        <tr key={review.review_id} className="hover:bg-gray-50 transition">
                                            <td className="flex px-4 py-4 gap-2">
                                                <button 
                                                    className="p-1 border-1 border-gray-400 rounded cursor-pointer hover:bg-blue-600 hover:text-white"
                                                    onClick={() => {
                                                        setIsOpenModelUpdate(true)
                                                        setSelectReviewID(review.review_id)
                                                    }}
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                                                    </svg>
                                                </button>
                                                <button 
                                                    className="p-1 border-1 border-gray-400 rounded cursor-pointer hover:bg-red-600 hover:text-white" 
                                                    onClick={() => {
                                                        setIsOpenModelDelete(true)
                                                        setSelectReviewID(review.review_id)
                                                    }}
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                                    </svg>

                                                </button>
                                            </td>
                                            <td className="px-4 py-4 font-semibold text-gray-800 max-w-[100px]">
                                                <a 
                                                    className="block cursor-pointer hover:text-blue-600 
                                                            truncate whitespace-nowrap overflow-hidden"
                                                    onClick={()=>{
                                                        setIsOpenModelRead(true)
                                                        setSelectReviewID(review.review_id)
                                                    }}
                                                >
                                                    {review.review_id}
                                                </a>
                                            </td>

                                            <td className="px-4 py-4 max-w-[350px]">
                                                <p className="line-clamp-2 text-sm text-gray-600">
                                                    {review.comment || "—"}
                                                </p>
                                            </td>
                                            <td className="px-4 py-4 whitespace-nowrap font-medium text-gray-900">
                                                {review.rating}
                                            </td>
                                            <td className="px-4 py-4 text-sm text-gray-500 whitespace-nowrap">
                                                {new Date(review.created_at).toLocaleDateString("vi-VN")}
                                            </td>
                                        </tr>    
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* navigation section - Đã bỏ absolute để tránh lỗi layout */}
                    <div className="mt-8 mb-6">
                        {totalPages > 1 && (
                            <div className="flex justify-center items-center gap-2 flex-wrap">
                                {/* arrow left */}
                                <button
                                    onClick={() => setPage(prev => Math.max(1, prev - 1))}
                                    disabled={page === 1}
                                    className={`px-3 py-2 rounded-lg font-medium transition ${
                                        page === 1 
                                            ? "bg-gray-100 text-gray-400 cursor-not-allowed" 
                                            : "bg-gray-200 hover:bg-gray-300 cursor-pointer text-gray-700"
                                    }`}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                                    </svg>
                                </button>

                                {/* number pages */}
                                {(() => {
                                    const maxVisible = 5;
                                    let startPage = Math.max(1, page - Math.floor(maxVisible / 2));
                                    const endPage = Math.min(totalPages, startPage + maxVisible - 1);
                                    
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
                                            className={`px-4 py-2 rounded-lg font-bold transition cursor-pointer min-w-[45px] ${
                                                page === p 
                                                    ? "bg-blue-600 text-white shadow-md" 
                                                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
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
                                            : "bg-gray-200 hover:bg-gray-300 cursor-pointer text-gray-700"
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
            </div>
            {/* delete review */}
            {isOpenModelDelete && selectReviewID &&(
                <DeleteReview
                    isOpen={isOpenModelDelete}
                    onClose={()=>{
                        setIsOpenModelDelete(false)
                        setSelectReviewID("");
                    }}
                    review_id={selectReviewID}
                    onSuccess={fetchBookings}
                /> 
            )}
            {/* read review */}
            {isOpenModelRead && selectReviewID &&(
                <ReadReview
                    isOpen={isOpenModelRead}
                    onClose={()=>{
                        setIsOpenModelRead(false)
                        setSelectReviewID("");
                    }}
                    reviewId={selectReviewID}
                /> 
            )}
            {/* update review */}
            {isOpenModelUpdate && selectReviewID &&(
                <UpdateReviewUser
                    isOpen={isOpenModelUpdate}
                    onClose={()=>{
                        setIsOpenModelUpdate(false)
                        setSelectReviewID("");
                    }}
                    reviewId={selectReviewID}
                    onSuccess={fetchBookings}
                /> 
            )}
        </div>
    )
}