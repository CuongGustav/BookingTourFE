'use client'

import { useState } from "react";

interface ModalCancelBookingPaidProps {
    isOpen: boolean;
    onClose: () => void;
    booking_id: string;
    booking_code: string;
    onSuccess: () => void;
}

const API_URL = process.env.NEXT_PUBLIC_URL_API;

export default function ModalCancelBookingPaid({isOpen, onClose, booking_id, booking_code, onSuccess }: ModalCancelBookingPaidProps) {
    const [reason, setReason] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const isReasonEmpty = reason.trim() === "";

    const handleCancelBooking = async () => {
        if (!booking_id) return;
        setIsLoading(true);

        try {
            const res = await fetch(`${API_URL}/booking/cancel-booking-paid/${booking_id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ cancellation_reason: reason }),
                credentials: "include",
            });

            const data = await res.json();
            if (res.ok) {
                alert("Yêu cầu hủy booking tour thành công!");
                onSuccess();
                onClose();
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
                <h1 className="text-2xl font-bold mb-2 text-red-600">Xác nhận hủy đơn</h1>
                <p className="text-gray-600 mb-4">
                    Bạn đang yêu cầu hủy booking <span className="font-bold text-black">{booking_code}</span>.
                </p>

                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Lý do hủy (bắt buộc phải ghi số tài khoản ngân hàng để hoàn tiền / đến quầy để nhận tiền).
                    </label>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Vì chưa xác nhận booking nên bạn sẽ nhận được 100% sô tiền đã chuyển.
                    </label>
                    <textarea
                        className="w-full border border-gray-300 rounded-lg p-2 text-sm outline-none"
                        rows={5}
                        placeholder="Nhập lý do bạn muốn hủy tour..."
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                    />
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
                        disabled={isLoading || isReasonEmpty}
                        className={`py-2 px-6 rounded-lg font-medium flex items-center
                            ${isReasonEmpty || isLoading
                                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                                : "bg-red-600 text-white hover:bg-red-700 cursor-pointer"}
                        `}
                    >
                        {isLoading ? "Đang xử lý..." : "Xác nhận hủy"}
                    </button>

                </div>
            </div>
        </div>
    )
}