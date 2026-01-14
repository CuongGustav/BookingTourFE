'use client'

import { useState, useEffect } from "react";
import Image from "next/image";
import ReadReviewUser from "@/app/types/reviews";

const API_URL = process.env.NEXT_PUBLIC_URL_API;

interface ReadReviewProps {
    isOpen: boolean;
    onClose: () => void;
    reviewId: string;
}

export default function ReadReview({ isOpen, onClose, reviewId}: ReadReviewProps) {

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [review, setReview] = useState<ReadReviewUser | null>(null);

    useEffect(() => {
        if (!isOpen || !reviewId) return;

        const fetchReviewDetail = async () => {
            try {
                setLoading(true);
                setError(null);

                const res = await fetch(`${API_URL}/reviews/admin/${reviewId}`, {
                    method: "GET",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json",
                    },
                });

                if (!res.ok) {
                    throw new Error("Không thể tải thông tin đánh giá");
                }

                const data = await res.json();
                setReview({
                    ...data.review,
                    images: data.images || [],
                    account: data.account ||"",
                });

            } catch (err) {
                setError( "Có lỗi xảy ra khi tải đánh giá");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchReviewDetail();
    }, [isOpen, reviewId]);

    if (!isOpen) return null;

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString("vi-VN", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    return (
        <div
            className="fixed inset-0 bg-black/50 flex justify-center items-center z-50"
            onClick={onClose}
        >
            <div
                className="bg-white rounded-xl w-full max-w-3xl mx-4 shadow-2xl max-h-[90vh] overflow-y-auto relative"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Nút đóng */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 hover:text-red-600 transition text-2xl font-bold cursor-pointer"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                <div className="p-6">
                    <h1 className="text-2xl font-bold text-blue-900 mb-6">
                        Chi tiết đánh giá của bạn
                    </h1>

                    {loading ? (
                        <div className="text-center py-12">
                            <p className="text-gray-500">Đang tải thông tin đánh giá...</p>
                        </div>
                    ) : error ? (
                        <div className="text-center py-8">
                            <p className="text-red-600 font-medium">{error}</p>
                        </div>
                    ) : review ? (
                        <>
                            {/* Thông tin cơ bản */}
                            <div className="mb-6">
                                <div className="flex justify-between items-center mb-4">
                                    <div>
                                        <h3 className="font-semibold text-lg text-gray-800">
                                            Đánh giá tour
                                        </h3>
                                        <p className="text-sm text-gray-500">
                                            Mã booking: {review.booking_code || "Không có"}
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            Họ tên: {review.account?.full_name || "Không có"}
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            Số điện thoại: {review.account?.phone || "Không có"}
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            Email: {review.account?.email || "Không có"}
                                        </p>
                                    </div>
                                    <div className="text-sm text-gray-500">
                                        {formatDate(review.created_at)}
                                    </div>
                                </div>

                                {/* Rating */}
                                <div className="mb-6">
                                    <label className="block font-medium mb-2 text-gray-700">
                                        Điểm đánh giá
                                    </label>
                                    <div className="flex gap-1">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <svg
                                                key={star}
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="h-8 w-8"
                                                fill={star <= review.rating ? "currentColor" : "none"}
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                                color={star <= review.rating ? "#FFD700" : "#D1D5DB"}
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25 L7 14.14 2 9.27l6.91-1.01L12 2z"
                                                />
                                            </svg>
                                        ))}
                                    </div>
                                </div>

                                {/* Bình luận */}
                                <div className="mb-6">
                                    <label className="block font-medium mb-2 text-gray-700">
                                        Nội dung đánh giá
                                    </label>
                                    <div className="w-full border rounded-lg px-4 py-3 bg-gray-50 min-h-[120px] whitespace-pre-wrap text-gray-800">
                                        {review.comment || "Không có nội dung bình luận"}
                                    </div>
                                </div>

                                {/* Hình ảnh */}
                                <div className="mb-6">
                                    <h3 className="font-semibold mb-3 text-gray-800">
                                        Hình ảnh đính kèm ({review.images?.length || 0})
                                    </h3>

                                    {review.images && review.images.length > 0 ? (
                                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                            {review.images.map((img) => (
                                                <div
                                                    key={img.image_id}
                                                    className="relative aspect-square rounded-lg overflow-hidden border shadow-sm"
                                                >
                                                    <Image
                                                        src={img.image_url}
                                                        alt="Hình ảnh đánh giá"
                                                        fill
                                                        className="object-cover hover:scale-105 transition-transform duration-300"
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-10 bg-gray-50 rounded-lg border border-dashed">
                                            <p className="text-gray-500">Bạn chưa đính kèm hình ảnh nào</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </>
                    ) : null}

                    {/* Nút hành động */}
                    <div className="flex justify-end gap-3 mt-6 border-t pt-4">
                        <button
                            onClick={onClose}
                            className="px-6 py-2 rounded-lg border border-gray-300 hover:bg-gray-100 transition cursor-pointer"
                        >
                            Đóng
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}