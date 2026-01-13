import { useState, useEffect, DragEvent } from "react";
import { ReadPaymentAdminInfo } from "@/app/types/payment";
import { formatPrice } from "@/app/common";
import Image from "next/image";

const API_URL = process.env.NEXT_PUBLIC_URL_API;

interface CancelBookingConfirmProps {
    isOpen: boolean;
    onClose: () => void;
    booking_id: string;
    onSuccess: () => void;
}

export default function CancelBookingConfirmPage ({isOpen, onClose, booking_id, onSuccess}: CancelBookingConfirmProps) {
    const [reason, setReason] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [paymentData, setPaymentData] = useState<ReadPaymentAdminInfo | null>(null);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string>("");
    const [dragOver, setDragOver] = useState(false);
    const [refundMethod, setRefundMethod] = useState("");

    // Thêm computed value để check form valid (dùng để disable nút)
    const isFormValid = reason.trim() && refundMethod && imageFile;

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

    // Clear error khi input thay đổi (tùy chọn, để UX tốt hơn)
    useEffect(() => {
        setError(null);
    }, [reason, refundMethod, imageFile]);

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

    const getPaymentMethodBadge = (method: string) => {
        if (method === "CASH") {
            return <span className="px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">Tiền mặt</span>;
        }
        return <span className="px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">Chuyển khoản</span>;
    };

    const setImage = (file: File) => {
        setImageFile(file);
        setPreview(URL.createObjectURL(file)); // preview local
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) setImage(file);
    };

    const handleDrop = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setDragOver(false);
        const file = e.dataTransfer.files?.[0];
        if (file) setImage(file);
    };

    const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setDragOver(true);
    };

    const handleDragLeave = () => {
        setDragOver(false);
    };

    const handleRemoveImage = () => {
        setImageFile(null);
        setPreview("");
    };

    const handleCancel = async () => {
        // Validation giờ đã ở ngoài (disable nút), nhưng giữ để an toàn
        if (!isFormValid) {
            setError("Vui lòng nhập đầy đủ thông tin: lý do, phương thức hoàn trả, và upload ảnh.");
            return;
        }

        try {
            setLoading(true);
            setError(null);

            const formData = new FormData();
            formData.append("cancellation_reason", reason);
            formData.append("payment_method", refundMethod);
            formData.append("amount", paymentData!.amount.toString());

            if (imageFile) {
                formData.append("images", imageFile);
            }

            const res = await fetch(
                `${API_URL}/booking/admin/cancel-and-refund/${booking_id}`,
                {
                    method: "PATCH",
                    credentials: "include",
                    body: formData,
                }
            );

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || "Hoàn trả thất bại");
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

    return (
        <div
            className="fixed inset-0 bg-black/50 flex justify-center items-center z-50"
            onClick={onClose}
        >
            <div
                className="bg-white rounded-xl w-full max-w-4xl mx-4 relative shadow-2xl max-h-[90vh] flex flex-col"
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
                    <h1 className="text-2xl font-bold text-red-600 pr-10">Xác nhận hoàn trả</h1>
                </div>
                <div className="overflow-y-auto flex-1 p-6">
                    {loading ? (
                        <div className="text-center py-8">Đang tải dữ liệu...</div>
                    ) : error ? (
                        <div className="text-center py-8 text-red-600">{error}</div>
                    ) : !paymentData ? (
                        <div className="text-center py-8">Không tìm thấy thanh toán</div>
                    ) : (
                        <div className="flex gap-4">
                            <div className="flex flex-col gap-6 w-1/2">
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
                                        <span className="text-gray-600">Số tiền:</span>
                                        <span className="font-bold text-xl text-blue-900">
                                            {formatPrice(Number(paymentData.amount))}
                                        </span>
                                    </div>

                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-600">Trạng thái:</span>
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
                            </div>
                            <div className="flex flex-col flex-1">
                                <div className="mb-4">
                                    <label className="block text-sm font-semibold mb-2">
                                        Lý do hủy <span className="text-red-500">*</span>
                                    </label>
                                    <textarea
                                        value={reason}
                                        onChange={(e) => setReason(e.target.value)}
                                        placeholder="Nhập lý do hủy booking..."
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                                        rows={4}
                                        disabled={loading}
                                    />
                                </div>
                                {error && (
                                    <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                                        <p className="text-red-600 text-sm">{error}</p>
                                    </div>
                                )}
                                <div className="mb-4">
                                    <h3 className="font-semibold mb-2">Phương thức hoàn trả:</h3>
                                    <select
                                        value={refundMethod}
                                        onChange={(e) => setRefundMethod(e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="">-- Chọn phương thức hoàn trả --</option>
                                        <option value="cash">Tiền mặt</option>
                                        <option value="bank_transfer">Chuyển khoản</option>
                                    </select>

                                </div>
                                {/* upload image */}
                                <div className="flex flex-col">
                                    <h3 className="font-semibold mb-2">Hình ảnh hoàn trả: <span className="text-red-500">*</span></h3> {/* Thêm * để chỉ bắt buộc */}
                                    <div
                                        onDrop={handleDrop}
                                        onDragOver={handleDragOver}
                                        onDragLeave={handleDragLeave}
                                        className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition ${
                                            dragOver ? "border-blue-500 bg-blue-50" : "border-gray-400"
                                        }`}
                                    >
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleFileChange}
                                            className="hidden"
                                            id="fileUpload"
                                        />
                                        {!preview && (
                                            <label htmlFor="fileUpload" className="cursor-pointer">
                                                <p className="text-gray-600">Chọn file hoặc kéo thả ảnh vào</p>
                                                <p className="text-gray-400 mt-1">Hoặc Ctrl+V để dán ảnh</p>
                                            </label>
                                        )}
                                        <div className="flex justify-center">
                                            {preview && (
                                                <div className="flex gap-2 relative">
                                                    <Image
                                                        src={preview}
                                                        alt="Preview"
                                                        width={0}
                                                        height={300}
                                                        style={{ width: 'auto', height: 300 }}
                                                        className="rounded border object-cover "
                                                    />
                                                    {preview && (
                                                        <button
                                                            onClick={handleRemoveImage}
                                                            className="absolute top-0 right-4 cursor-pointer p-2 text-red-600"
                                                        >
                                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                                                <path strokeLinecap="round" strokeLinejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                                            </svg>
                                                        </button>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex gap-3 justify-end mt-4">
                                    <button
                                        onClick={onClose}
                                        className="px-5 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition"
                                        disabled={loading}
                                    >
                                        Đóng
                                    </button>
                                    <button
                                        onClick={handleCancel}
                                        className="cursor-pointer px-5 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                                        disabled={loading || !isFormValid} 
                                    >
                                        {loading ? "Đang xử lý..." : "Xác nhận hủy"}
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>           
    )
}