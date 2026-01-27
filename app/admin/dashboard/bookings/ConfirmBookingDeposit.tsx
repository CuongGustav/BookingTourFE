import { useState, useEffect } from "react";
import { ReadPaymentAdminInfo } from "@/app/types/payment";
import { formatPrice } from "@/app/common";
import Image from "next/image";

const API_URL = process.env.NEXT_PUBLIC_URL_API;


interface ConfirmBookingDepositProps {
    isOpen: boolean;
    onClose: () => void;
    booking_id: string;
    onSuccess: () => void;
}

export default function ConfirmBookingDepositPage ({isOpen, onClose, booking_id, onSuccess}: ConfirmBookingDepositProps) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [paymentData, setPaymentData] = useState<ReadPaymentAdminInfo | null>(null);

    useEffect(() => {
        if (isOpen && booking_id) {
            const fetchPayment = async () => {
                setLoading(true);
                setError(null);
                try {
                    const res = await fetch(`${API_URL}/payment/admin/booking/${booking_id}`, { credentials: "include" });
                    if (!res.ok) {
                        throw new Error("Failed to fetch payment details");
                    }
                    const data: ReadPaymentAdminInfo = await res.json();
                    setPaymentData(data);
                } catch (err) {
                    setError("Lỗi tải chi tiết thanh toán");
                    console.error(err);
                } finally {
                    setLoading(false);
                }
            };
            fetchPayment();
        }
    }, [isOpen, booking_id]);

    if (!isOpen) return null;

    const getStatusBadge = (status: string) => {
        const statusConfig = {
            'PENDING': { text: 'Chờ xử lý', bg: 'bg-yellow-100', color: 'text-yellow-800' },
            'COMPLETED': { text: 'Hoàn thành', bg: 'bg-green-100', color: 'text-green-800' },
            'FAILED': { text: 'Thất bại', bg: 'bg-red-100', color: 'text-red-800' },
            'REFUNDED': { text: 'Hoàn trả', bg: 'bg-blue-100', color: 'text-blue-800' }
        };
        const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.PENDING;
        return (
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${config.bg} ${config.color}`}>
                {config.text}
            </span>
        );
    };
    const getBookingStatusBadge = (status: string) => {
        const statusConfig = {
            'PENDING': { text: 'Chờ xử lý', bg: 'bg-yellow-100', color: 'text-yellow-800' },
            'PAID': { text: 'Đã thanh toán', bg: 'bg-purple-100', color: 'text-purple-800' },
            'CONFIRMED': { text: 'Đã xác nhận', bg: 'bg-blue-100', color: 'text-blue-800' },
            'DEPOSIT': { text: 'Đã đặt cọc', bg: 'bg-cyan-100', color: 'text-cyan-800' },
            'COMPLETED': { text: 'Hoàn trả', bg: 'bg-green-100', color: 'text-green-800' },
            'CANCEL_PENDING': { text: 'Hoàn trả', bg: 'bg-orange-100', color: 'text-orange-800' },
            'CANCELLED': { text: 'Hoàn trả', bg: 'bg-red-100', color: 'text-red-800' },
        };
        const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.PENDING;
        return (
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${config.bg} ${config.color}`}>
                {config.text}
            </span>
        );
    };

    const getPaymentMethodBadge = (method: string) => {
        if (method === "CASH") {
            return <span className="px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">Tiền mặt</span>;
        }
        return <span className="px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">Chuyển khoản</span>;
    };

    const handleConfirm = async () => {
        setLoading(true);
        setError(null);

        try {
            const res = await fetch(
                `${API_URL}/booking/admin/confirm-booking-deposit/${booking_id}`,
                {
                    method: "PUT",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || "Hủy booking thất bại");
            }
            onClose();
            onSuccess();
        } catch (err) {
            setError("Có lỗi xảy ra");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };
    
    return (
        <div
            className="fixed inset-0 bg-black/50 flex justify-center items-center z-50"
            onClick={onClose}
        >
            <div
                className="bg-white rounded-xl w-full max-w-md mx-4 relative shadow-2xl max-h-[90vh] flex flex-col"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="p-6 pb-4 border-b rounded-t-xl flex-shrink-0">
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 cursor-pointer hover:text-red-600 transition z-20"
                        disabled={loading}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
                        </svg>
                    </button>
                    <h1 className="text-2xl font-bold text-blue-900 pr-10">Xác nhận</h1>
                </div>
                <div className="overflow-y-auto flex-1 p-6">
                    {loading ? (
                        <div className="text-center py-8">Đang tải dữ liệu...</div>
                    ) : error ? (
                        <div className="text-center py-8 text-red-600">{error}</div>
                    ) : !paymentData ? (
                        <div className="text-center py-8">Không tìm thấy thanh toán</div>
                    ) : (
                        <div className="flex flex-col gap-6">
                            {/* Payment Info */}
                            <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                                <h3 className="font-bold text-lg mb-3">Thông tin thanh toán</h3>
                                
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600">Mã booking:</span>
                                    <span className="font-semibold">{paymentData.booking_code}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600">Phương thức:</span>
                                    {getPaymentMethodBadge(paymentData.payment_method)}
                                </div>

                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600">Số tiền đã cọc:</span>
                                    <span className="font-bold text-xl text-blue-900">
                                        {formatPrice(Number(paymentData.money_paid))}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600">Trạng thái booking:</span>
                                    {getBookingStatusBadge(paymentData.status_booking || 'PENDING')}
                                </div>

                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600">Trạng thái thanh toán:</span>
                                    {getStatusBadge(paymentData.status)}
                                </div>

                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600">Ngày tạo:</span>
                                    <span className="font-semibold">
                                        {new Date(paymentData.created_at).toLocaleString('vi-VN')}
                                    </span>
                                </div>
                            </div>
                            {/* Payment Images */}
                            {paymentData.payment_images && paymentData.payment_images.length > 0 && (
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <h3 className="font-bold text-lg mb-3">
                                        Hình ảnh minh chứng ({paymentData.payment_images.length})
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {paymentData.payment_images.map((img) => (
                                            <div key={img.image_id} className="relative group">
                                                <Image
                                                    src={img.image_url}
                                                    alt="Payment proof"
                                                    width={400}
                                                    height={300}
                                                    className="rounded-lg border-2 border-gray-200 object-cover w-full"
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                            {/* No Images Message */}
                            {(!paymentData.payment_images || paymentData.payment_images.length === 0) && (
                                <div className="bg-gray-50 p-4 rounded-lg text-center text-gray-500">
                                    Không có hình ảnh minh chứng
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
                                    onClick={handleConfirm}
                                    className="px-5 py-2 bg-blue-900 text-white rounded-lg hover:bg-blue-600 transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                                    disabled={loading}
                                >
                                    {loading ? "Đang xử lý..." : "Xác nhận"}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>           
    )
}