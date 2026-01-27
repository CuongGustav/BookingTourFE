'use client';

import { useState, useEffect, DragEvent, useCallback } from "react";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { BookingResponse } from "@/app/types/booking";
import { formatPrice } from "@/app/common";
import Image from "next/image";

const API_URL = process.env.NEXT_PUBLIC_URL_API;

type PaymentMethod = "QR" | "TRANSFER" | "CASH";
type PaymentType = "FULL" | "DEPOSIT";

interface BankInfo {
    bank_name: string;
    account_no: string;
    account_name: string;
    amount: number;
    description: string;
}

interface QRCodeResponse {
    message: string;
    qr_code: string;
    payment_type: string;
    bank_info: BankInfo;
}

export default function PaymentPage() {
    const [method, setMethod] = useState<PaymentMethod>("TRANSFER");
    const [paymentType, setPaymentType] = useState<PaymentType>("FULL");
    const params = useParams();
    const router = useRouter();
    const booking_id = params.booking_id as string;

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [booking, setBooking] = useState<BookingResponse | null>(null);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string>("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);
    const [submitSuccess, setSubmitSuccess] = useState(false);

    // QR Code state
    const [qrCode, setQrCode] = useState<string | null>(null);
    const [qrLoading, setQrLoading] = useState(false);
    const [qrError, setQrError] = useState<string | null>(null);
    const [qrBankInfo, setQrBankInfo] = useState<BankInfo | null>(null);

    // Calculate payment amount based on booking status and payment type
    const calculatePaymentAmount = useCallback((): number => {
        if (!booking) return 0;

        const bookingData = booking.booking;

        if (paymentType === "FULL") {
            return bookingData.final_price;
        } else {
            return bookingData.final_price * 0.4;
        }
    }, [booking, paymentType]);

    useEffect(() => {
        const fetchBooking = async () => {
            try {
                const response = await fetch(
                    `${API_URL}/booking/admin/${booking_id}`,
                    { credentials: 'include' }
                );

                const result = await response.json();

                if (response.ok) {
                    setBooking({ booking: result });
                } else {
                    setError("Không thể tải thông tin booking");
                    router.push("/admin/dashboard/bookings");
                }
            } catch (err) {
                setError("Lỗi khi tải dữ liệu");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchBooking();
    }, [booking_id, router]);

    // Fetch QR Code - Reload when payment type changes
    useEffect(() => {
        const fetchQRCode = async () => {
            if (!booking || method !== "QR") return;

            setQrLoading(true);
            setQrError(null);

            // Calculate current payment amount based on payment type
            const amount = calculatePaymentAmount();

            try {
                // Pass payment type as query parameter
                const url = `${API_URL}/payment/generate-qr/${booking_id}?payment_type=${paymentType}&amount=${amount}`;
                const response = await fetch(url, {
                    credentials: 'include',
                });

                if (response.ok) {
                    const result: QRCodeResponse = await response.json();
                    setQrCode(result.qr_code);
                    setQrBankInfo(result.bank_info);
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
    }, [booking, method, booking_id, paymentType, calculatePaymentAmount]);

    const setImage = (file: File) => {
        setImageFile(file);
        setPreview(URL.createObjectURL(file));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) setImage(file);
    };

    const [dragOver, setDragOver] = useState(false);

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

    const handleConfirmPayment = async () => {
        if (!imageFile || !booking) return;

        setIsSubmitting(true);
        setSubmitError(null);

        const paymentAmount = calculatePaymentAmount();

        const formData = new FormData();
        formData.append("booking_id", booking_id);
        formData.append("payment_method", "bank_transfer");
        formData.append("amount", paymentAmount.toString());
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
                router.push("/admin/dashboard/bookings");
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

    if (loading ) {
        return (
            <div className=" mx-auto py-6 relative flex justify-center items-center h-screen">
                <p>Đang tải...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className=" mx-auto py-6 text-center">
                <p className="text-red-500 mb-4">{error}</p>
                <button onClick={() => router.back()} className="text-blue-500 underline">Quay lại</button>
            </div>
        );
    }

    if (!booking) {
        return (
            <div className=" mx-auto py-6 relative flex justify-center items-center h-screen">
                <p>Đang tải thông tin booking...</p>
            </div>
        );
    }

    const paymentAmount = calculatePaymentAmount();

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
            {/* Payment Type Selection - Only show if booking is PENDING and not deposited */}
            
                <div className="border rounded-lg p-6 bg-gray-50">
                    <h2 className="text-xl font-bold mb-4">Chọn hình thức thanh toán</h2>
                    <div className="grid grid-cols-2 gap-4">
                        {/* Full Payment Option */}
                        <button
                            onClick={() => setPaymentType("FULL")}
                            className={`cursor-pointer p-6 rounded-lg border-2 transition-all ${
                                paymentType === "FULL"
                                    ? "border-blue-900 bg-blue-50 shadow-lg"
                                    : "border-gray-300 hover:border-blue-400"
                            }`}
                        >
                            <div className="text-center">
                                <h3 className="font-bold text-lg mb-2">Thanh toán 100%</h3>
                                <p className="text-3xl font-bold text-blue-900 mb-2">
                                    {formatPrice(booking.booking.final_price)}
                                </p>
                                <p className="text-sm text-gray-600">Thanh toán toàn bộ ngay</p>
                            </div>
                        </button>

                        {/* Deposit Option */}
                        <button
                            onClick={() => setPaymentType("DEPOSIT")}
                            className={`cursor-pointer p-6 rounded-lg border-2 transition-all ${
                                paymentType === "DEPOSIT"
                                    ? "border-orange-600 bg-orange-50 shadow-lg"
                                    : "border-gray-300 hover:border-orange-400"
                            }`}
                        >
                            <div className="text-center">
                                <h3 className="font-bold text-lg mb-2">Đặt cọc 40%</h3>
                                <p className="text-3xl font-bold text-orange-600 mb-2">
                                    {formatPrice(booking.booking.final_price * 0.4)}
                                </p>
                                <p className="text-sm text-gray-600">
                                    Còn lại: {formatPrice(booking.booking.final_price * 0.6)}
                                </p>
                            </div>
                        </button>
                    </div>
                </div>
            

            {/* Payment Method Tabs */}
            <div className="flex gap-4 px-2 py-4 border-b">
                <button
                    onClick={() => setMethod("TRANSFER")}
                    className={`pb-2 font-bold transition cursor-pointer ${
                        method === "TRANSFER"
                            ? "border-b-2 border-blue-900 text-blue-900"
                            : "hover:text-blue-600"
                    }`}
                >
                    Chuyển khoản
                </button>

                <button
                    onClick={() => setMethod("QR")}
                    className={`pb-2 font-bold transition cursor-pointer ${
                        method === "QR"
                            ? "border-b-2 border-blue-900 text-blue-900"
                            : "hover:text-blue-600"
                    }`}
                >
                    Quét QR
                </button>

                <button
                    onClick={() => setMethod("CASH")}
                    className={`pb-2 font-bold transition cursor-pointer ${
                        method === "CASH"
                            ? "border-b-2 border-blue-900 text-blue-900"
                            : "hover:text-blue-600"
                    }`}
                >
                    Tiền mặt
                </button>
            </div>

            {/* Content */}
            <div className="p-4 border rounded-lg">
                <div>
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
                                        <span className="font-bold text-lg text-blue-900">
                                            {formatPrice(paymentAmount)}
                                        </span>
                                    </div>
                                    <div className="flex justify-between border-b-1 p-2">
                                        <span>Nội dung chuyển khoản</span>
                                        <span>{booking.booking.booking_code}</span>
                                    </div>
                                </>
                            )}
                            {method === "QR" && (
                                <div className="flex flex-col items-center gap-4">
                                    <h3 className="font-semibold mb-2">Thanh toán bằng QR</h3>
                                    {qrLoading && (
                                        <div className="flex flex-col items-center justify-center h-64 gap-3">
                                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900"></div>
                                            <p className="text-gray-600">Đang tạo mã QR...</p>
                                        </div>
                                    )}
                                    {qrError && (
                                        <div className="text-red-500 text-center p-4 bg-red-50 rounded-lg">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 mx-auto mb-2">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
                                            </svg>
                                            <p>{qrError}</p>
                                        </div>
                                    )}
                                    {qrCode && !qrLoading && (
                                        <div className="flex flex-col items-center gap-3">
                                            <div className="relative">
                                                <Image
                                                    src={qrCode}
                                                    alt="QR Code thanh toán"
                                                    width={300}
                                                    height={300}
                                                    className="border-2 border-gray-200 rounded-lg shadow-lg"
                                                />
                                                {/* Badge showing payment type */}
                                                {paymentType === "DEPOSIT" && (
                                                    <div className="absolute -top-3 -right-3 bg-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                                                        Đặt cọc 40%
                                                    </div>
                                                )}
                                                {paymentType === "FULL"  && (
                                                    <div className="absolute -top-3 -right-3 bg-blue-900 text-white px-3 py-1 rounded-full text-xs font-bold">
                                                        Thanh toán 100%
                                                    </div>
                                                )}
                                            </div>
                                            <div className="text-sm text-center bg-gray-50 p-4 rounded-lg w-full">
                                                <p className="font-semibold text-lg mb-3">Quét mã QR để chuyển khoản</p>
                                                {qrBankInfo && (
                                                    <>
                                                        <div className="space-y-1 text-gray-700">
                                                            <p>Tên tài khoản: <span className="font-medium">{qrBankInfo.account_name}</span></p>
                                                            <p className="font-bold text-2xl text-blue-900 my-2">
                                                                {formatPrice(qrBankInfo.amount)}
                                                            </p>
                                                            <p>Nội dung: <span className="font-medium">{qrBankInfo.description}</span></p>
                                                        </div>
                                                    </>
                                                )}
                                                <p className="text-orange-400 mt-3 text-xs">
                                                    Nếu không quét được QR, hãy chuyển sang tab Chuyển khoản
                                                </p>
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
                                        <span>{formatPrice(paymentAmount)}</span>
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
                        className={`w-full py-4 px-2 rounded-xl mt-4 font-bold text-lg transition ${
                            imageFile && !isSubmitting
                                ? "bg-blue-900 text-white cursor-pointer hover:bg-blue-800"
                                : "bg-gray-300 text-gray-500 cursor-not-allowed"
                        }`}
                    >
                        {isSubmitting ? "Đang xử lý..." : `Xác nhận thanh toán ${formatPrice(paymentAmount)}`}
                    </button>
                    {submitError && <p className="text-red-500 mt-2 text-center">{submitError}</p>}
                    {submitSuccess && <p className="text-green-500 mt-2 text-center">Thanh toán thành công!</p>}
                </div>
            </div>
        </div>
    );
}