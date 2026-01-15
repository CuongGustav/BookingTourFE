'use client';

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Lightbox from "yet-another-react-lightbox";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import "yet-another-react-lightbox/styles.css";

const API_URL = process.env.NEXT_PUBLIC_URL_API;
    
interface ReviewTourProps {
    tour_id: string;
    rating_average: number;
    total_reviews: number;
}
interface ReviewImage {
    image_id: string;
    image_url: string;
    image_public_id: string;
    created_at: string;
}
interface ReviewAccount {
    account_id: string;
    full_name: string;
    email: string;
    phone: string;
}
interface ReviewCore {
    review_id: string;
    rating: number;
    comment: string;
    created_at: string;
    booking_code: string;
}
interface ReviewInfo {
    account: ReviewAccount;
    images: ReviewImage[];
    review: ReviewCore;
}

export default function ReviewTourPage({tour_id,rating_average,total_reviews,}: ReviewTourProps) {
    const [reviews, setReviews] = useState<ReviewInfo[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const pageSize = 5;
    const [open, setOpen] = useState(false);
    const [index, setIndex] = useState(0);
    const [slides, setSlides] = useState<{ src: string }[]>([]);

    const fetchListReview = useCallback(async () => {
        if (!API_URL) return;
        try {
            setLoading(true);
            const res = await fetch(`${API_URL}/reviews/all/${tour_id}`, {
                credentials: "include",
            });
            const data = await res.json();
            setReviews(data.reviews ?? []);
            setPage(1);
        } catch (error) {
            console.error(error);
            alert("Lỗi tải danh sách đánh giá");
        } finally {
            setLoading(false);
        }
    }, [tour_id]);
    useEffect(() => {
        fetchListReview();
    }, [fetchListReview]);

    const totalPages = Math.ceil(reviews.length / pageSize);
    const paginatedReviews = reviews.slice(
        (page - 1) * pageSize,
        page * pageSize
    );

    if (loading) {
        return (
            <div className="p-8 text-center text-lg">
                Đang tải danh sách đánh giá...
            </div>
        );
    }

    return (
        <>
            <div className="flex flex-col gap-6">
                {/* Header */}
                <div className="text-center">
                    <h1 className="font-semibold text-xl">ĐÁNH GIÁ KHÁCH HÀNG</h1>
                    <div className="mt-2 flex justify-center gap-6 text-sm text-gray-600">
                        <span className="text-blue-900">Số bình luận: {total_reviews}</span>
                        <span className="flex gap-1 text-yellow-500">
                            Đánh giá trung bình: {rating_average}
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-5 text-yellow-500">
                                <path fillRule="evenodd" d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401Z" clipRule="evenodd" />
                            </svg>
                        </span>
                    </div>
                </div>
                {/* Review list */}
                <div className="flex flex-col gap-4">
                    {paginatedReviews.length === 0 && (
                        <div className="text-center text-gray-500">
                            Chưa có đánh giá nào
                        </div>
                    )}
                    {paginatedReviews.map((item) => (
                        <div
                            key={item.review.review_id}
                            className="border rounded-lg p-4 flex flex-col gap-3"
                        >
                            {/* User + rating */}
                            <div className="flex items-center justify-between">
                                <span className="font-medium">
                                    {item.account.full_name}
                                </span>
                                <span className="text-yellow-500 font-medium flex gap-1 items-center">
                                    {item.review.rating} 
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-5 text-yellow-500">
                                        <path fillRule="evenodd" d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401Z" clipRule="evenodd" />
                                    </svg>
                                </span>
                            </div>
                            {/* Comment */}
                            <p className="text-gray-700">{item.review.comment}</p>
                            {/* Images */}
                            {item.images.length > 0 && (
                                <div className="flex gap-2 flex-wrap">
                                    {item.images.map((img, imgIndex) => (
                                        <button
                                            key={img.image_id}
                                            onClick={() => {
                                                setSlides(
                                                    item.images.map((i) => ({
                                                    src: i.image_url,
                                                    }))
                                                );
                                                setIndex(imgIndex);
                                                setOpen(true);
                                            }}
                                            className="focus:outline-none cursor-pointer"
                                        >
                                            <div className="h-24 inline-block overflow-hidden rounded-md  hover:opacity-80 transition cursor-pointer">
                                                <Image
                                                    src={img.image_url}
                                                    alt="review image"
                                                    width={500}
                                                    height={500}
                                                    className="h-full w-auto object-cover"
                                                />
                                            </div>                                     
                                        </button>
                                    ))}
                                </div>
                            )}
                            {/* Time */}
                            <span className="text-xs text-gray-400">
                                {new Date(item.review.created_at).toLocaleString("vi-VN")}
                            </span>
                        </div>
                    ))}
                </div>
                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="flex justify-center items-center gap-2 mt-6">
                        <button
                            onClick={() => setPage((p) => Math.max(1, p - 1))}
                            disabled={page === 1}
                            className={`px-3 py-2 rounded-lg ${
                                page === 1
                                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                : "bg-gray-200 hover:bg-gray-300"
                            }`}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                            </svg>
                        </button>
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                            <button
                                key={p}
                                onClick={() => setPage(p)}
                                className={`px-4 py-2 rounded-lg font-medium ${
                                page === p
                                    ? "bg-blue-600 text-white"
                                    : "bg-gray-200 hover:bg-gray-300"
                                }`}
                            >
                                {p}
                            </button>
                        ))}
                        <button
                            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                            disabled={page === totalPages}
                            className={`px-3 py-2 rounded-lg ${
                                page === totalPages
                                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                : "bg-gray-200 hover:bg-gray-300"
                            }`}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                            </svg>
                        </button>
                    </div>
                )}
                {/* light box */}
                <Lightbox
                    open={open}
                    close={() => setOpen(false)}
                    index={index}
                    slides={slides}
                    on={{ view: ({ index }) => setIndex(index) }}
                    plugins={[Zoom]}
                    styles={{
                        container: { backgroundColor: "rgba(0,0,0,0.9)" },
                    }}
                    carousel={{
                        imageFit: "contain",
                        padding: "16px",
                    }}
                    zoom={{ 
                        maxZoomPixelRatio: 5,
                        scrollToZoom: true,
                        doubleClickDelay: 300,
                        doubleClickMaxStops: 2,
                    }}
                    controller={{ closeOnBackdropClick: true }}
                />
            </div>
        </>
    )
}