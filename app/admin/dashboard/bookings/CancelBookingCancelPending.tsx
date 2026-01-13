'use client'

import { useState } from "react";

interface CancelBookingCancelPendingProps {
    isOpen: boolean;
    onClose: () => void;
    booking_id: string;
    onSuccess: () => void;
}

const API_URL = process.env.NEXT_PUBLIC_URL_API;

export default function CancelBookingCancelPending({isOpen, onClose, booking_id, onSuccess }: CancelBookingCancelPendingProps) {
    const [isLoading, setIsLoading] = useState(false);

    const handleCancelBooking = async () => {
        if (!booking_id) return;
        setIsLoading(true);

        try {
            const res = await fetch(`${API_URL}/booking/admin/cancel-booking-cancel-pending/${booking_id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
            });

            const data = await res.json();
            if (res.ok) {
                alert("Yêu cầu hủy booking tour thành công!");
                onClose();
                onSuccess();
            } else {
                alert(data.message || "Hủy thất bại!");
            }
        } catch (err) {
            console.error(err);
            alert("Không thể kết nối tới server!");
        } finally {
            setIsLoading(false);
        }
    }

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4" onClick={onClose}>
            <div
                className="bg-white rounded-xl p-6 w-full max-w-md relative shadow-2xl"
                onClick={(e) => e.stopPropagation()}
            >
                <h1 className="text-2xl font-bold mb-2 text-red-600">Hủy yêu cầu hủy booking</h1>

                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Hãy điện cho khách hàng xác nhận trước khi hủy yêu cầu
                    </label>
                </div>
                
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-red-600 transition"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                <div className="flex gap-3 items-center justify-end mt-2">
                    <button
                        onClick={onClose}
                        disabled={isLoading}
                        className="py-2 px-6 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer font-medium disabled:opacity-50"
                    >
                        Quay lại
                    </button>
                    <button
                        onClick={handleCancelBooking}
                        disabled={isLoading}
                        className="py-2 px-6 border border-gray-300 text-white rounded-lg hover:bg-blue-700 bg-blue-600 cursor-pointer font-medium disabled:opacity-50"
                    >
                        {isLoading ? "Đang xử lý..." : "Từ chối yêu cầu hủy"}
                    </button>
                </div>
            </div>
        </div>
    )
}