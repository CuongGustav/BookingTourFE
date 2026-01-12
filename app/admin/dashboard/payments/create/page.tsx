'use client'

import { useRouter } from "next/navigation"
import { useState, useEffect, DragEvent } from "react"
import Select, { SingleValue } from "react-select"
import { formatPrice } from "@/app/common"
import Image from "next/image"

const API_URL = process.env.NEXT_PUBLIC_URL_API;

type PaymentMethod = "QR" | "TRANSFER" | "CASH";

interface Booking {
    booking_id: string;
    booking_code: string;
    final_price: string;
    status: string;
}

interface BookingOption {
    value: string;
    label: string;
}

interface QRCodeResponse {
    message: string;
    qr_code: string;
    bank_info: {
        bank_name: string;
        account_no: string;
        account_name: string;
        amount: number;
        description: string;
    };
}

export default function CreatePaymentAdminPage () {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [bookings, setBookings] = useState<Booking[]>([])
    const [selectedBookingId, setSelectedBookingId] = useState<string>("")
    const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null)

    // Payment states
    const [method, setMethod] = useState<PaymentMethod>("QR")
    const [imageFile, setImageFile] = useState<File | null>(null)
    const [preview, setPreview] = useState<string>("")
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [submitError, setSubmitError] = useState<string | null>(null)
    const [submitSuccess, setSubmitSuccess] = useState(false)
    const [dragOver, setDragOver] = useState(false)

    // QR Code state
    const [qrCode, setQrCode] = useState<string | null>(null)
    const [qrLoading, setQrLoading] = useState(false)
    const [qrError, setQrError] = useState<string | null>(null)

    useEffect(() => {
        const fetchBookings = async () => {
            setLoading(true)
            setError(null)
            try {
                const res = await fetch(`${API_URL}/booking/admin/all`, {
                    credentials: "include",
                })

                if (!res.ok) throw new Error("Không thể tải danh sách booking")

                const result = await res.json()
                const filteredBookings = (result || []).filter(
                    (b: Booking) => b.status === 'PENDING'
                )
                setBookings(filteredBookings)
            } catch (err) {
                setError("Lỗi tải danh sách booking")
                console.error(err)
            } finally {
                setLoading(false)
            }
        }

        fetchBookings()
    }, [])

    // Fetch QR Code when booking selected and method is QR
    useEffect(() => {
        const fetchQRCode = async () => {
            if (!selectedBookingId || method !== "QR") return;
            
            setQrLoading(true);
            setQrError(null);
            
            try {
                const response = await fetch(`${API_URL}/payment/generate-qr/${selectedBookingId}`, {
                    credentials: 'include',
                });
                
                if (response.ok) {
                    const result: QRCodeResponse = await response.json();
                    setQrCode(result.qr_code);
                } else {
                    const errorData = await response.json();
                    setQrError(errorData.message || "Không thể tạo mã QR");
                }
            } catch (err) {
                setQrError("Lỗi kết nối server");
                console.error(err);
            } finally {
                setQrLoading(false);
            }
        };
        
        fetchQRCode();
    }, [selectedBookingId, method]);

    const bookingOptions: BookingOption[] = bookings.map(booking => ({
        value: booking.booking_id,
        label: `${booking.booking_code} - ${formatPrice(Number(booking.final_price))} - Chờ xử lý`
    }));

    const handleBookingChange = (newValue: SingleValue<BookingOption>) => {
        const bookingId = newValue?.value || "";
        setSelectedBookingId(bookingId);
        
        const booking = bookings.find(b => b.booking_id === bookingId);
        setSelectedBooking(booking || null);
        
        // Reset payment states
        setImageFile(null);
        setPreview("");
        setSubmitError(null);
        setSubmitSuccess(false);
    };

    const setImage = (file: File) => {
        setImageFile(file);
        setPreview(URL.createObjectURL(file));
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

    const getPaymentMethodValue = (method: PaymentMethod) => {
        if (method === "CASH") return "cash";
        return "bank_transfer";
    };

    const handleConfirmPayment = async () => {
        if (!imageFile || !selectedBooking) return;

        setIsSubmitting(true);
        setSubmitError(null);

        const formData = new FormData();
        formData.append("booking_id", selectedBookingId);
        formData.append("payment_method", getPaymentMethodValue(method));
        formData.append("amount", selectedBooking.final_price.toString());
        formData.append("images", imageFile);

        try {
            const response = await fetch(`${API_URL}/payment/admin/create`, {
                method: "POST",
                body: formData,
                credentials: 'include',
            });

            const result = await response.json();

            if (response.ok) {
                setSubmitSuccess(true);
                setTimeout(() => {
                    router.push("/admin/dashboard/payments");
                }, 1500);
            } else {
                setSubmitError(result.message || "Lỗi khi xác nhận thanh toán");
            }
        } catch (err) {
            setSubmitError("Lỗi kết nối server");
            console.error(err);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) return <div className="text-center py-8">Đang tải dữ liệu...</div>;
    if (error) return <div className="text-center py-8 text-red-600">{error}</div>;

    return (
        <div className="min-w-100 px-8 mx-auto py-6 h-98/100 overflow-y-auto relative">
            <button 
                className="bg-white px-4 py-2 rounded-xl border-1 border-gray-300 mb-4 cursor-pointer hover:bg-gray-300 hover:text-white absolute top-4 left-8"
                onClick={() => router.back()}
            >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-8">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m11.25 9-3 3m0 0 3 3m-3-3h7.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>
            </button>
            <div className="flex justify-center">
                <h1 className="text-3xl font-bold mb-6 text-main">Tạo Thanh Toán</h1>
            </div>
            
            <div className="mb-6">
                <label className="font-bold mb-2 block">Chọn booking</label>
                <Select
                    options={bookingOptions}
                    placeholder="-- Chọn booking --"
                    onChange={handleBookingChange}
                    isClearable
                    className="react-select-container"
                    classNamePrefix="react-select"
                    noOptionsMessage={() => "Không tìm thấy booking"}
                />
            </div>

            {selectedBooking && (
                <div>
                    {/* Tabs */}
                    <div className="flex gap-4 p-2 border-b border-t border-gray-400">
                        <button
                            onClick={() => setMethod("TRANSFER")}
                            className={`font-bold transition cursor-pointer ${
                                method === "TRANSFER"
                                    ? "border-blue-900 text-blue-900"
                                    : "hover:text-blue-600"
                            }`}
                        >
                            Chuyển khoản
                        </button>
                        <button
                            onClick={() => setMethod("QR")}
                            className={`font-bold transition cursor-pointer ${
                                method === "QR"
                                    ? "border-blue-900 text-blue-900"
                                    : "hover:text-blue-600"
                            }`}
                        >
                            Quét QR
                        </button>
                        <button
                            onClick={() => setMethod("CASH")}
                            className={`font-bold transition cursor-pointer ${
                                method === "CASH"
                                    ? "border-blue-900 text-blue-900"
                                    : "hover:text-blue-600"
                            }`}
                        >
                            Tiền mặt
                        </button>
                    </div>

                    {/* Content */}
                    <div className="p-4">
                        <div className="flex gap-8 items-start">
                            {/* Payment Info */}
                            <div className="flex flex-col gap-2 w-1/2">
                                {method === "TRANSFER" && (
                                    <>
                                        <h3 className="font-semibold mb-2">Thanh toán chuyển khoản</h3>
                                        <div className="flex justify-between border-b-1 p-2">
                                            <span>Tên ngân hàng</span>
                                            <span>MB - Ngân hàng TMCP Quân Đội</span>
                                        </div>
                                        <div className="flex justify-between border-b-1 p-2">
                                            <span>Số tài khoản</span>
                                            <span>88868668688668</span>
                                        </div>
                                        <div className="flex justify-between border-b-1 p-2">
                                            <span>Tên tài khoản</span>
                                            <span>NGUYEN QUOC CUONG</span>
                                        </div>
                                        <div className="flex justify-between border-b-1 p-2">
                                            <span>Số tiền</span>
                                            <span>{formatPrice(Number(selectedBooking.final_price))}</span>
                                        </div>
                                        <div className="flex justify-between border-b-1 p-2">
                                            <span>Nội dung chuyển khoản</span>
                                            <span>{selectedBooking.booking_code}</span>
                                        </div>
                                    </>
                                )}
                                {method === "QR" && (
                                    <div className="flex flex-col items-center gap-4">
                                        <h3 className="font-semibold mb-2">Thanh toán bằng QR</h3>
                                        {qrLoading && (
                                            <div className="flex items-center justify-center h-64">
                                                <p>Đang tạo mã QR...</p>
                                            </div>
                                        )}
                                        {qrError && (
                                            <div className="text-red-500 text-center">
                                                <p>{qrError}</p>
                                            </div>
                                        )}
                                        {qrCode && !qrLoading && (
                                            <div className="flex flex-col items-center gap-3">
                                                <Image
                                                    src={qrCode}
                                                    alt="QR Code thanh toán"
                                                    width={300}
                                                    height={300}
                                                    className="border-2 border-gray-200 rounded-lg"
                                                />
                                                <div className="text-sm text-center">
                                                    <p className="font-semibold">Quét mã QR để chuyển khoản</p>
                                                    <p className="mt-2">Tên tài khoản: NGUYEN QUOC CUONG</p>
                                                    <p>Số tiền: {formatPrice(Number(selectedBooking.final_price))}</p>
                                                    <p>Nội dung: {selectedBooking.booking_code}</p>
                                                    <p className="text-orange-400">Nếu không có mã QR hãy chuyển sang tab chuyển khoản</p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}
                                {method === "CASH" && (
                                    <>
                                        <h3 className="font-semibold mb-2">Thông tin thanh toán</h3>
                                        <div className="flex justify-between border-b-1 p-2">
                                            <span>Số tiền</span>
                                            <span>{formatPrice(Number(selectedBooking.final_price))}</span>
                                        </div>
                                    </>
                                )}
                            </div>

                            {/* Upload Image */}
                            <div className="flex flex-col flex-1">
                                <h3 className="font-semibold mb-2">Hình ảnh minh chứng:</h3>
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
                                                    className="rounded border object-cover"
                                                />
                                                <button
                                                    onClick={handleRemoveImage}
                                                    className="absolute top-0 right-4 cursor-pointer p-2 text-red-600"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                                    </svg>
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <button 
                            onClick={handleConfirmPayment}
                            disabled={!imageFile || isSubmitting}
                            className={`w-full py-3 px-2 border-b rounded-xl mt-4 transition ${
                                imageFile && !isSubmitting
                                    ? "bg-blue-900 text-white cursor-pointer hover:bg-blue-800" 
                                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                            }`}
                        >
                            {isSubmitting ? "Đang xử lý..." : "Xác nhận thanh toán"}
                        </button>
                        {submitError && <p className="text-red-500 mt-2">{submitError}</p>}
                        {submitSuccess && <p className="text-green-500 mt-2">Thanh toán thành công!</p>}
                    </div>
                </div>
            )}
        </div>    
    )
}