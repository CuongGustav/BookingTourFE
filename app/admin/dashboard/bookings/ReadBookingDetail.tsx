import { useState, useEffect } from "react";
import { formatPrice } from '@/app/common';
import { ReadBookingDetail } from '@/app/types/booking';
import { ReadBookingPassenger } from '@/app/types/booking_passengers';

const API_URL = process.env.NEXT_PUBLIC_URL_API;

interface ModalReadBookingDetailProps {
    isOpen: boolean;
    onClose: () => void;
    booking_id: string;
}

export default function ReadBookingDetailPage ({isOpen, onClose, booking_id}: ModalReadBookingDetailProps) {
    const [bookingData, setBookingData] = useState<ReadBookingDetail | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (isOpen && booking_id) {
            const fetchBooking = async () => {
                setLoading(true);
                setError(null);
                try {
                    const res = await fetch(`${API_URL}/booking/admin/${booking_id}`, { credentials: "include" });
                    if (!res.ok) {
                        throw new Error("Failed to fetch booking details");
                    }
                    const data: ReadBookingDetail = await res.json();
                    setBookingData(data);
                } catch (err) {
                    setError("Lỗi tải chi tiết booking");
                    console.error(err);
                } finally {
                    setLoading(false);
                }
            };
            fetchBooking();
        }
    }, [isOpen, booking_id]);

    if (!isOpen) return null;

    return(
        <div
            className="fixed inset-0 bg-black/50 flex justify-center items-center z-50"
            onClick={onClose}
        >
            <div
                className="bg-white rounded-xl p-6 w-full max-w-2xl mx-4 relative shadow-2xl max-h-[90vh] overflow-y-auto"
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

                {loading ? (
                    <div className="text-center py-8">Đang tải dữ liệu...</div>
                ) : error ? (
                    <div className="text-center py-8 text-red-600">{error}</div>
                ) : !bookingData ? (
                    <div className="text-center py-8">Không tìm thấy booking</div>
                ) : (
                    <>
                        <h1 className="text-2xl font-bold mb-2 text-main text-center">Chi tiết đơn đặt - {bookingData.booking_code}</h1>
                        <div className="flex flex-col my-2 gap-2 px-2">
                            {bookingData?.cancellation_reason && (
                                <div className="flex flex-col">
                                    <span className=" text-lg mb-3">Lý do hủy: {bookingData?.cancellation_reason}</span>
                                </div>
                            )}
                            {/* Tour */}
                            <div>
                                <h3 className="font-bold text-lg mb-3">TÓM TẮT CHUYẾN ĐI</h3>
                                <div className="bg-gray-50 p-4 rounded-lg flex gap-4">
                                    <div>
                                        <p className="font-bold">{bookingData.tour_title}</p>
                                        {bookingData.schedule?.departure_date && (
                                            <p className="text-sm">Ngày khởi hành: {new Date(bookingData.schedule.departure_date).toLocaleDateString('vi-VN')}</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                            {/* Contact */}
                            <div>
                                <h3 className="font-bold text-lg mb-3">THÔNG TIN LIÊN LẠC</h3>
                                <div className="bg-gray-50 p-4 rounded-lg grid grid-cols-2 gap-4">
                                    <div><p className="text-sm text-gray-600">Họ tên</p><p className="font-semibold">{bookingData.contact_name}</p></div>
                                    <div><p className="text-sm text-gray-600">Email</p><p className="font-semibold">{bookingData.contact_email}</p></div>
                                    <div><p className="text-sm text-gray-600">Số điện thoại</p><p className="font-semibold">{bookingData.contact_phone}</p></div>
                                    <div><p className="text-sm text-gray-600">Địa chỉ</p><p className="font-semibold">{bookingData.contact_address || 'Không có'}</p></div>
                                </div>
                            </div>
                            {/* Passengers */}
                            <div>
                                <h3 className="font-bold text-lg mb-3">DANH SÁCH HÀNH KHÁCH</h3>
                                <div className="space-y-6">
                                    {(() => {
                                        const adults: ReadBookingPassenger[] = bookingData.passengers.filter(p => p.passenger_type === 'ADULT');
                                        return adults.length > 0 && (
                                            <div>
                                                <p className="font-semibold mb-2">Người lớn ({adults.length})</p>
                                                {adults.map((p, i) => (
                                                    <div key={i} className="bg-gray-50 p-3 rounded mb-2">
                                                        <p><strong>{i + 1}.</strong> {p.full_name} ({p.gender === 'MALE' ? 'Nam' : p.gender === 'FEMALE' ? 'Nữ' : 'Khác'})</p>
                                                        <p className="text-sm text-gray-600">Ngày sinh: {new Date(p.date_of_birth).toLocaleDateString('vi-VN')} | CCCD: {p.id_number || 'Không có'}</p>
                                                        {p.single_room && <p className="text-sm text-orange-600">Yêu cầu phòng đơn +1</p>}
                                                    </div>
                                                ))}
                                            </div>
                                        );
                                    })()}
                                    {(() => {
                                        const children: ReadBookingPassenger[] = bookingData.passengers.filter(p => p.passenger_type === 'CHILD');
                                        return children.length > 0 && (
                                            <div>
                                                <p className="font-semibold mb-2">Trẻ em ({children.length})</p>
                                                {children.map((p, i) => (
                                                    <div key={i} className="bg-gray-50 p-3 rounded mb-2">
                                                        <p><strong>{i + 1}.</strong> {p.full_name} ({p.gender === 'MALE' ? 'Nam' : p.gender === 'FEMALE' ? 'Nữ' : 'Khác'})</p>
                                                        <p className="text-sm text-gray-600">Ngày sinh: {new Date(p.date_of_birth).toLocaleDateString('vi-VN')}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        );
                                    })()}
                                    {(() => {
                                        const infants: ReadBookingPassenger[] = bookingData.passengers.filter(p => p.passenger_type === 'INFANT');
                                        return infants.length > 0 && (
                                            <div>
                                                <p className="font-semibold mb-2">Em bé ({infants.length})</p>
                                                {infants.map((p, i) => (
                                                    <div key={i} className="bg-gray-50 p-3 rounded mb-2">
                                                        <p><strong>{i + 1}.</strong> {p.full_name} ({p.gender === 'MALE' ? 'Nam' : p.gender === 'FEMALE' ? 'Nữ' : 'Khác'})</p>
                                                        <p className="text-sm text-gray-600">Ngày sinh: {new Date(p.date_of_birth).toLocaleDateString('vi-VN')}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        );
                                    })()}
                                </div>
                            </div>
                            {/* Total Payment */}
                            <div className="bg-gray-50 p-6 rounded-lg">
                                <h3 className="font-bold text-lg mb-4">TỔNG THANH TOÁN</h3>
                                <div className="space-y-2 text-lg">
                                    <div className="flex justify-between"><span>Tạm tính</span><span>{formatPrice(bookingData.total_price)}</span></div>
                                    {bookingData.discount_amount > 0 && (
                                        <div className="flex justify-between text-green-600">
                                            <span>Giảm giá {bookingData.coupon?.code ? `(${bookingData.coupon.code})` : ''}</span>
                                            <span>-{formatPrice(bookingData.discount_amount)}</span>
                                        </div>
                                    )}
                                    <div className="flex justify-between font-bold text-xl border-t-2 pt-3">
                                        <span>TỔNG TIỀN</span>
                                        <span className="text-main">{formatPrice(bookingData.final_price)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-end mt-8">
                            <button 
                                onClick={onClose} 
                                className="px-6 py-3 border border-gray-400 rounded-xl hover:bg-gray-100 cursor-pointer"
                            >
                                Đóng
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}