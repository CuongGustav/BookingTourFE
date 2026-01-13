import { useState } from "react";

const API_URL = process.env.NEXT_PUBLIC_URL_API;

interface ModalCancelBookingPendingProps {
    isOpen: boolean;
    onClose: () => void;
    booking_id: string;
    booking_code: string;
    onSuccess: () => void;
}

export default function CancelBookingPendingPage({
    isOpen,
    onClose,
    booking_id,
    booking_code,
    onSuccess
}: ModalCancelBookingPendingProps) {
    const [reason, setReason] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleCancel = async () => {
        if (!reason.trim()) {
            setError("Vui lòng nhập lý do hủy");
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const res = await fetch(
                `${API_URL}/booking/admin/cancel-booking-pending/${booking_id}`,
                {
                    method: "PATCH",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        cancellation_reason: reason,
                    }),
                }
            );

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || "Hủy booking thất bại");
            }
            onSuccess();
            onClose();
        } catch (err) {
            setError("Có lỗi xảy ra");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 bg-black/50 flex justify-center items-center z-50"
            onClick={onClose}
        >
            <div
                className="bg-white rounded-xl p-6 w-full max-w-lg mx-4 relative shadow-2xl"
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 cursor-pointer hover:text-red-600 transition"
                    disabled={loading}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
                    </svg>
                </button>

                <h2 className="text-2xl font-bold mb-4 text-red-600 text-center">
                    Xác nhận hủy booking
                </h2>

                <div className="mb-4">
                    <p className="mb-2 ">
                        Bạn có chắc chắn muốn hủy booking{" "}
                        <span className="font-bold text-main">{booking_code}</span>?
                    </p>

                </div>

                <div className="mb-4">
                    <label className="block text-sm font-semibold mb-2">
                        Lý do hủy <span className="text-red-500">*</span>
                    </label>
                    <textarea
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        placeholder="Nhập lý do hủy booking..."
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg min-h-[100px]"
                        disabled={loading}
                    />
                </div>

                {error && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-red-600 text-sm">{error}</p>
                    </div>
                )}

                <div className="flex gap-3 justify-end">
                    <button
                        onClick={onClose}
                        className="px-5 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition"
                        disabled={loading}
                    >
                        Đóng
                    </button>
                    <button
                        onClick={handleCancel}
                        className="px-5 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={loading}
                    >
                        {loading ? "Đang xử lý..." : "Xác nhận hủy"}
                    </button>
                </div>
            </div>
        </div>
    );
}