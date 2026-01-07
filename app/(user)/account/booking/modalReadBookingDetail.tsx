import { formatPrice } from '@/app/common';
import { ReadBookingDetail } from '@/app/types/booking';
import { ReadBookingPassenger } from '@/app/types/booking_passengers';

interface ModalReadBookingDetailProps {
    isOpen: boolean;
    onClose: () => void;
    bookingData: ReadBookingDetail;
}

const ModalReadBookingDetail: React.FC<ModalReadBookingDetailProps> = ({ isOpen, onClose, bookingData }) => {
    if (!isOpen) return null;

    const {
        booking_code,
        tour,
        schedule,
        contact_name,
        contact_email,
        contact_phone,
        contact_address,
        passengers,
        total_price,
        discount_amount,
        final_price,
        coupon,
    } = bookingData;

    // Categorize passengers
    const adults: ReadBookingPassenger[] = passengers.filter(p => p.passenger_type === 'ADULT');
    const children: ReadBookingPassenger[] = passengers.filter(p => p.passenger_type === 'CHILD');
    const infants: ReadBookingPassenger[] = passengers.filter(p => p.passenger_type === 'INFANT');

    return (
        <div
            className="fixed inset-0 bg-black/50 flex justify-center items-center z-50"
            onClick={onClose}
        >
            <div
                className="bg-white rounded-xl p-6 w-full max-w-2xl mx-4 relative shadow-2xl max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
            >
                <h1 className="text-2xl font-bold mb-2 text-main text-center">Chi tiết đơn đặt - {booking_code}</h1>
                <button
                    onClick={onClose}
                    className="absolute top-6 right-6 cursor-pointer hover:text-red-600 transition"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
                <div className="flex flex-col my-2 gap-2 px-2">
                    {/* Tour */}
                    <div>
                        <h3 className="font-bold text-lg mb-3">TÓM TẮT CHUYẾN ĐI</h3>
                        <div className="bg-gray-50 p-4 rounded-lg flex gap-4">
                
                        <div>
                            <p className="font-bold">{tour.title}</p>
                
                            <p className="text-sm">Ngày khởi hành: {new Date(schedule.departure_date).toLocaleDateString('vi-VN')}</p>
                        </div>
                        </div>
                    </div>
                {/* Contact */}
                    <div>
                        <h3 className="font-bold text-lg mb-3">THÔNG TIN LIÊN LẠC</h3>
                        <div className="bg-gray-50 p-4 rounded-lg grid grid-cols-2 gap-4">
                        <div><p className="text-sm text-gray-600">Họ tên</p><p className="font-semibold">{contact_name}</p></div>
                        <div><p className="text-sm text-gray-600">Email</p><p className="font-semibold">{contact_email}</p></div>
                        <div><p className="text-sm text-gray-600">Số điện thoại</p><p className="font-semibold">{contact_phone}</p></div>
                        <div><p className="text-sm text-gray-600">Địa chỉ</p><p className="font-semibold">{contact_address || 'Không có'}</p></div>
                        </div>
                    </div>
                {/* Passengers */}
                <div>
                    <h3 className="font-bold text-lg mb-3">DANH SÁCH HÀNH KHÁCH</h3>
                    <div className="space-y-6">
                    {adults.length > 0 && (
                        <div>
                        <p className="font-semibold mb-2">Người lớn ({adults.length})</p>
                        {adults.map((p, i) => (
                            <div key={i} className="bg-gray-50 p-3 rounded mb-2">
                            <p><strong>{i + 1}.</strong> {p.full_name} ({p.gender === 'MALE' ? 'Nam' : p.gender === 'FEMALE' ? 'Nữ' : 'Khác'})</p>
                            <p className="text-sm text-gray-600">Ngày sinh: {new Date(p.date_of_birth).toLocaleDateString('vi-VN')} | CCCD: {p.id_number || 'Không có'}</p>
                            {p.single_room && <p className="text-sm text-orange-600">Yêu cầu phòng đơn (+{p.single_room === true ? "1" : "0"})</p>}
                            </div>
                        ))}
                        </div>
                    )}
                    {children.length > 0 && (
                        <div>
                        <p className="font-semibold mb-2">Trẻ em ({children.length})</p>
                        {children.map((p, i) => (
                            <div key={i} className="bg-gray-50 p-3 rounded mb-2">
                            <p><strong>{i + 1}.</strong> {p.full_name} ({p.gender === 'MALE' ? 'Nam' : p.gender === 'FEMALE' ? 'Nữ' : 'Khác'})</p>
                            <p className="text-sm text-gray-600">Ngày sinh: {new Date(p.date_of_birth).toLocaleDateString('vi-VN')}</p>
                            </div>
                        ))}
                        </div>
                    )}
                    {infants.length > 0 && (
                        <div>
                        <p className="font-semibold mb-2">Em bé ({infants.length})</p>
                        {infants.map((p, i) => (
                            <div key={i} className="bg-gray-50 p-3 rounded mb-2">
                            <p><strong>{i + 1}.</strong> {p.full_name} ({p.gender === 'MALE' ? 'Nam' : p.gender === 'FEMALE' ? 'Nữ' : 'Khác'})</p>
                            <p className="text-sm text-gray-600">Ngày sinh: {new Date(p.date_of_birth).toLocaleDateString('vi-VN')}</p>
                            </div>
                        ))}
                        </div>
                    )}
                    </div>
                </div>
                {/* Total Payment */}
                <div className="bg-gray-50 p-6 rounded-lg">
                    <h3 className="font-bold text-lg mb-4">TỔNG THANH TOÁN</h3>
                    <div className="space-y-2 text-lg">
                    <div className="flex justify-between"><span>Tạm tính</span><span>{formatPrice(total_price)}</span></div>
                    {discount_amount > 0 && (
                        <div className="flex justify-between text-green-600">
                        <span>Giảm giá {coupon ? `(${coupon.code})` : ''}</span>
                        <span>-{formatPrice(discount_amount)}</span>
                        </div>
                    )}
                    <div className="flex justify-between font-bold text-xl border-t-2 pt-3">
                        <span>TỔNG TIỀN</span>
                        <span className="text-main">{formatPrice(final_price)}</span>
                    </div>
                    </div>
                </div>
                </div>
                <div className="flex justify-end mt-8">
                <button 
                    onClick={onClose} 
                    className="px-6 py-3 border border-gray-400 rounded-xl hover:bg-gray-100"
                >
                    Đóng
                </button>
                </div>
            </div>
        </div>
    );
};

export default ModalReadBookingDetail;