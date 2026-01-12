'use client';

import { useState, useEffect, DragEvent } from "react";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { BookingResponse } from "@/app/types/booking";
import { formatPrice } from "@/app/common";
import Image from "next/image";

const API_URL = process.env.NEXT_PUBLIC_URL_API;
type PaymentMethod = "QR" | "TRANSFER";

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

export default function PaymentPage() {
    const [method, setMethod] = useState<PaymentMethod>("QR"); 
    const params = useParams();
    const router = useRouter();
    const booking_id = params.booking_id as string;

    const [isLoggedIn, setIsLoggedIn] = useState(false);
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

    //check login
    useEffect(() => {
        const checkLoginStatus = async () => {
            try {
                const response = await fetch('/api/auth/check', {
                    credentials: 'include'
                });
                const data = await response.json();
                
                if (data.isLoggedIn) {
                    setIsLoggedIn(true);
                } else {
                    router.push('/');
                }
            } catch (error) {
                console.error('Error checking auth status:', error);
                router.push('/'); 
            } finally {
                setLoading(false);
            }
        };
        checkLoginStatus();
    }, [router]);

    useEffect(() => {
        const fetchBooking = async () => {
            try {
                const response = await fetch(`${API_URL}/booking/${booking_id}`, {
                    credentials: 'include',
                });
                const result: BookingResponse = await response.json();
                if (response.ok && result.booking) { 
                    setBooking(result)
                } else {
                    setError("Không thể tải thông tin booking");
                    router.push(`/`)
                }
                
            } catch (err) {
                setError("Lỗi khi tải dữ liệu");
                console.error(err);
            } finally {
                setLoading(false);
            }
        }
        if (!loading && isLoggedIn) {
            fetchBooking();
        }
    }, [booking_id, loading, isLoggedIn, router]);

    // Fetch QR Code
    useEffect(() => {
        const fetchQRCode = async () => {
            if (!booking || method !== "QR") return;
            
            setQrLoading(true);
            setQrError(null);
            
            try {
                const response = await fetch(`${API_URL}/payment/generate-qr/${booking_id}`, {
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
    }, [booking, method, booking_id]);

    const setImage = (file: File) => {
        setImageFile(file);
        setPreview(URL.createObjectURL(file)); // preview local
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

        const formData = new FormData();
        formData.append("booking_id", booking_id);
        formData.append("payment_method", "bank_transfer"); 
        formData.append("amount", booking.booking.final_price.toString());
        formData.append("images", imageFile);

        try {
            const response = await fetch(`${API_URL}/payment/create`, {
                method: "POST",
                body: formData,
                credentials: 'include',
            });

            const result = await response.json();

            if (response.ok) {
                setSubmitSuccess(true);
                router.push('/account/booking?status=paid')
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

    if (loading || !isLoggedIn) {
        return (
            <div className="w-8/10 mx-auto py-6 relative flex justify-center items-center h-screen">
                <p>Đang kiểm tra quyền truy cập...</p>
            </div>
        );
    }
    
    if (error) {
        return (
            <div className="w-8/10 mx-auto py-6 text-center">
                <p className="text-red-500 mb-4">{error}</p>
                <button onClick={() => router.back()} className="text-blue-500 underline">Quay lại</button>
            </div>
        );
    }

    return (
        <div className="w-8/10 mx-auto flex flex-col gap-4">
            {/* Tabs */}
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
            </div>

            {/* Content */}
            <div className="p-4 border rounded-lg">
                <div> 
                    <div className="flex gap-8 items-start">
                        {/* content */}
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
                                        <span>{formatPrice(booking?.booking.final_price)}</span>
                                    </div>
                                    <div className="flex justify-between border-b-1 p-2">
                                        <span>Nội dung chuyển khoản</span>
                                        <span>{booking?.booking.booking_code}</span>
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
                                                <p className="">Số tiền: {formatPrice(booking?.booking.final_price)}</p>
                                                <p>Nội dung: {booking?.booking.booking_code}</p>
                                                <p className="text-orange-400">Nếu không có mã QR hãy chuyển sang tab chuyển khoản</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                        
                        {/* upload image */}
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
        </div>
    );
}