'use client'

import { useRouter } from "next/navigation";

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
                            // value={search}
                            // onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                            className="w-full px-5 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}