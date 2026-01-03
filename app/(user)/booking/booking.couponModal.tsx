import { useState, useEffect } from "react";
import { ReadCoupon } from "@/app/types/coupon";
import { formatPrice } from "@/app/common";

const API_URL = process.env.NEXT_PUBLIC_URL_API;

interface ModalReadListCouponProps {
    isOpen: boolean;
    onClose: () => void;
    onSelect: (coupon: ReadCoupon) => void;
}

export default function ModalReadListCoupon ({ isOpen, onClose, onSelect }: ModalReadListCouponProps) {
    const [coupons, setCoupons] = useState<ReadCoupon[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (isOpen) {
            const fetchCoupons = async () => {
                try {
                    const response = await fetch(`${API_URL}/coupon/all`, {
                        credentials: 'include',
                    });
                    const result = await response.json();
                    if (response.ok && result.data) {
                        setCoupons(result.data as ReadCoupon[]);
                    } else {
                        setError(result.message || "Không thể tải danh sách mã giảm giá");
                    }
                } catch (err) {
                    setError("Lỗi khi tải dữ liệu");
                    console.error(err);
                } finally {
                    setLoading(false);
                }
            };
            fetchCoupons();
        }
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 bg-black/50 flex justify-center items-center z-50"
            onClick={onClose}
        >
            <div
                className="bg-white rounded-xl p-6 w-full max-w-2xl mx-4 max-h-[80vh] overflow-y-auto relative shadow-2xl"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <h2 className="text-2xl font-bold mb-4 text-main">
                    Danh sách mã giảm giá
                </h2>

                {/* Close button */}
                <button
                    onClick={onClose}
                    className="absolute top-6 right-6 cursor-pointer hover:text-red-600 transition"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
                    </svg>
                </button>

                {/* Content */}
                {loading && <p>Đang tải...</p>}
                {error && <p className="text-red-600">{error}</p>}
                {!loading && !error && coupons.length === 0 && (
                    <p>Không có mã giảm giá nào.</p>
                )}

                <div className="flex flex-col gap-4 mt-4">
                {coupons.map((coupon) => (
                    <div
                        key={coupon.code}
                        className="border p-4 rounded cursor-pointer hover:bg-gray-100 transition"
                        onClick={() => {
                            onSelect(coupon);
                            onClose();
                        }}
                    >
                        <p className="font-bold text-lg">{coupon.code}</p>
                        <p>{coupon.description}</p>
                        <p>
                            Giảm:{" "}
                            {coupon.discount_type === "PERCENTAGE"
                            ? `${coupon.discount_value}%`
                            : formatPrice(coupon.discount_value)}
                        </p>
                        <p>Đơn tối thiểu: {formatPrice(coupon.min_order_amount)}</p>
                        <p>
                            Tối đa giảm:{" "}
                            {coupon.max_discount_amount
                            ? formatPrice(coupon.max_discount_amount)
                            : "Không giới hạn"}
                        </p>
                        <p>
                            Hiệu lực: {coupon.valid_from} đến {coupon.valid_to}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    </div>
    )
}