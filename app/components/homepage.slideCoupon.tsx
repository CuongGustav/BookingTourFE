'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Coupon {
    image_coupon_url: string;
}

const API_URL = process.env.NEXT_PUBLIC_URL_API;
const SLIDES_PER_VIEW = 3;

export default function CouponSlide() {
    const [coupons, setCoupons] = useState<Coupon[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [loading, setLoading] = useState(true);
    const [isTransitioning, setIsTransitioning] = useState(true);

    const fetchCoupons = async () => {
        try {
            const res = await fetch(`${API_URL}/coupon/allImage`);
            const data = await res.json();
            const couponList = Array.isArray(data) ? data : data.data || [];
            setCoupons(couponList);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCoupons();
    }, []);

    // Auto slide
    useEffect(() => {
        if (coupons.length === 0) return;

        const interval = setInterval(() => {
            setCurrentIndex((prev) => prev + 1);
        }, 5000);

        return () => clearInterval(interval);
    }, [coupons.length]);

    // Infinite loop
    useEffect(() => {
        if (coupons.length === 0) return;

        if (currentIndex === coupons.length) {
            setTimeout(() => {
                setIsTransitioning(false);
                setCurrentIndex(0);
            }, 500);

            setTimeout(() => {
                setIsTransitioning(true);
            }, 550);
        }

        if (currentIndex === -1) {
            setTimeout(() => {
                setIsTransitioning(false);
                setCurrentIndex(coupons.length - 1);
            }, 500);

            setTimeout(() => {
                setIsTransitioning(true);
            }, 550);
        }
    }, [currentIndex, coupons.length]);

    const goToPrevious = () => {
        setCurrentIndex((prev) => prev - 1);
    };

    const goToNext = () => {
        setCurrentIndex((prev) => prev + 1);
    };

    const goToSlide = (index: number) => {
        setCurrentIndex(index);
    };

    if (loading) {
        return (
            <div className="p-8 text-center text-lg">
                Đang tải danh sách mã giảm giá...
            </div>
        );
    }

    if (coupons.length === 0) return null;

    return (
        <div className="w-full py-4">
            {/* Title */}
            <div className="flex relative mb-4">
                <h1 className="text-blue-900 font-bold mx-auto text-3xl py-2">
                    MÃ GIẢM GIÁ
                </h1>
                <span className="absolute border-2 border-blue-900 left-1/2 -translate-x-1/2 bottom-0 w-1/8" />
            </div>

            {/* Coupon Slider */}
            <div className="relative group px-12">
                <div
                    className="relative overflow-hidden"
                    style={{ height: '200px' }}
                >
                    <div
                        className={`flex h-full ${
                        isTransitioning
                            ? 'transition-transform duration-500 ease-out'
                            : ''
                        }`}
                        style={{
                        transform: `translateX(-${
                            (currentIndex + SLIDES_PER_VIEW) * (100 / SLIDES_PER_VIEW)
                        }%)`,
                        }}
                    >
                        {/* Clone last 3 */}
                        {coupons.slice(-SLIDES_PER_VIEW).map((coupon, index) => (
                        <div
                            key={`clone-last-${index}`}
                            className="min-w-1/3 h-full flex items-center justify-center relative px-1"
                        >
                            <Image
                            src={coupon.image_coupon_url}
                            alt="Coupon clone"
                            fill
                            className="object-contain rounded-lg"
                            />
                        </div>
                        ))}

                        {/* Original slides */}
                        {coupons.map((coupon, index) => (
                        <div
                            key={index}
                            className="min-w-1/3 h-full flex items-center justify-center relative px-1"
                        >
                            <Image
                            src={coupon.image_coupon_url}
                            alt={`Coupon ${index + 1}`}
                            fill
                            sizes="(max-width: 768px) 100vw, 33vw"
                            className="object-contain rounded-lg"
                            priority={index < 3}
                            />
                        </div>
                        ))}

                        {/* Clone first 3 */}
                        {coupons.slice(0, SLIDES_PER_VIEW).map((coupon, index) => (
                        <div
                            key={`clone-first-${index}`}
                            className="min-w-1/3 h-full flex items-center justify-center relative px-1"
                        >
                            <Image
                            src={coupon.image_coupon_url}
                            alt="Coupon clone"
                            fill
                            className="object-contain rounded-lg"
                            />
                        </div>
                        ))}
                    </div>

                    {/* Previous */}
                    <button
                        onClick={goToPrevious}
                        className="absolute left-0 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                        <ChevronLeft className="w-6 h-6 text-gray-800" />
                    </button>

                    {/* Next */}
                    <button
                        onClick={goToNext}
                        className="absolute right-0 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                        <ChevronRight className="w-6 h-6 text-gray-800" />
                    </button>
                </div>

                {/* Dots */}
                <div className="flex justify-center gap-2 mt-4">
                    {coupons.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => goToSlide(index)}
                            className={`w-3 h-3 rounded-full transition-all duration-300 ${
                                index === currentIndex ||
                                (currentIndex === -1 && index === coupons.length - 1) ||
                                (currentIndex === coupons.length && index === 0)
                                ? 'bg-blue-600 w-8'
                                : 'bg-gray-300 hover:bg-gray-400'
                            }`}
                        />
                    ))}
                </div>

                {/* Counter */}
                <div className="text-center mt-2 text-sm text-gray-600">
                    {((currentIndex % coupons.length) + coupons.length) %
                        coupons.length +
                        1}{' '}
                    / {coupons.length}
                </div>
            </div>
        </div>
    );
}
