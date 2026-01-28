import { useState, useEffect } from "react";
import { ReadPaymentAdminInfo } from "@/app/types/payment";
import { formatPrice } from "@/app/common";
import Image from "next/image";

const API_URL = process.env.NEXT_PUBLIC_URL_API;

interface ModalReadPaymentDetailProps {
    isOpen: boolean;
    onClose: () => void;
    payment_id: string;
}

export default function ReadPaymentAdminPage ({isOpen, onClose, payment_id} : ModalReadPaymentDetailProps) {
    const [paymentData, setPaymentData] = useState<ReadPaymentAdminInfo | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (isOpen && payment_id) {
            const fetchPayment = async () => {
                setLoading(true);
                setError(null);
                try {
                    const res = await fetch(`${API_URL}/payment/admin/${payment_id}`, { credentials: "include" });
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
    }, [isOpen, payment_id]);

    if (!isOpen) return null;

    const getStatusBadge = (status: string) => {
        const statusConfig = {
            'PENDING': { text: 'Chờ xử lý', bg: 'bg-yellow-100', color: 'text-yellow-800' },
            'COMPLETED': { text: 'Hoàn thành', bg: 'bg-green-100', color: 'text-green-800' },
            'FAILED': { text: 'Thất bại', bg: 'bg-red-100', color: 'text-red-800' },
            'REFUNDED': { text: 'Hoàn trả', bg: 'bg-blue-100', color: 'text-blue-800' },
            'BONUS': { text: 'Bổ sung', bg: 'bg-purple-100', color: 'text-purple-800' }, 
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

    return (
        <div
            className="fixed inset-0 bg-black/50 flex justify-center items-center z-50"
            onClick={onClose}
        >
            <div
                className="bg-white rounded-xl p-6 w-full max-w-3xl mx-4 relative shadow-2xl max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    onClick={onClose}
                    className="absolute top-6 right-6 cursor-pointer hover:text-red-600 transition"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                <h1 className="text-2xl font-bold mb-6 text-main">Chi tiết thanh toán</h1>

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
                            {paymentData.cancellation_reason && (
                                <span>Lý do hủy: {paymentData.cancellation_reason}</span>
                            )}
                            <h3 className="font-bold text-lg mb-3">Thông tin thanh toán</h3>
                            
                            <div className="flex justify-between items-center">
                                <span className="text-gray-600">Mã booking:</span>
                                <span className="font-semibold">{paymentData.booking_code}</span>
                            </div>

                            <div className="flex justify-between items-center">
                                <span className="text-gray-600">Payment ID:</span>
                                <span className="font-mono text-sm">{paymentData.payment_id}</span>
                            </div>

                            <div className="flex justify-between items-center">
                                <span className="text-gray-600">Phương thức thanh toán:</span>
                                {getPaymentMethodBadge(paymentData.payment_method)}
                            </div>

                            <div className="flex justify-between items-center">
                                <span className="text-gray-600">Số tiền:</span>
                                <span className="font-bold text-xl text-blue-900">
                                    {formatPrice(Number(paymentData.amount))}
                                </span>
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
                                                className="rounded-lg border-2 border-gray-200 object-cover w-full "
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
                    </div>
                )}
            </div>
        </div>        
    )
}