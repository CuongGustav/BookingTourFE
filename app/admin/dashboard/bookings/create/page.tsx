// Updated File: app/admin/booking/create/page.tsx

'use client'

import { useState, useEffect, useMemo, useCallback } from "react"
import { TourInfo } from "@/app/types/tour"
import { useRouter } from "next/navigation";
import Select, { SingleValue } from "react-select";
import { ReadTourSchedule } from "@/app/types/tour_schedule";
import BookingPassengerAdmin from "./BookingPassengerAdmin";
import ModalReadListCoupon from "@/app/(user)/booking/booking.couponModal";
import { ReadCoupon } from "@/app/types/coupon";
import { CreateBookingPassenger } from "@/app/types/booking_passengers";
import { formatPrice } from "@/app/common";
import Image from "next/image";
import { Code } from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_URL_API;

interface TourOption {
    value: string;
    label: React.ReactNode;
    searchText: string; 
}

interface ScheduleOption {
    value: string;
    label: string;
}

export default function CreateBookingAdminPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [tours, setTours] = useState<TourInfo[]>([]);

    const [selectedTourId, setSelectedTourId] = useState<string>("");
    const [selectedScheduleId, setSelectedScheduleId] = useState<string>("");

    const [numPassengerData, setNumPassengerData] = useState(
        {numAdults: 1, numChildren: 0, numInfants: 0, numSingleRooms: 0 }
    )

    const [passengersData, setPassengersData] = useState<{
        adults: CreateBookingPassenger[];
        children: CreateBookingPassenger[];
        infants: CreateBookingPassenger[];
    }>({
        adults: [],
        children: [],
        infants: []
    });
    // Modal preview
    const [isPreviewOpen, setIsPreviewOpen] = useState(false);
    
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("")
    const [address, setAddress] = useState("")

    const [isModalOpen, setIsModalOpen] = useState(false); 
    const [selectedCoupon, setSelectedCoupon] = useState<ReadCoupon | null>(null); 
    const [discountAmount, setDiscountAmount] = useState(0); 
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [specialRequest, setSpecialRequest] = useState("")

    const [isPassengerValid, setIsPassengerValid] = useState(false);

    const isFormValid = () => {
        const isContactValid = 
            fullName.trim() !== "" && 
            /^0\d{9}$/.test(phone) && 
            /^[^\s@]+@gmail\.com$/.test(email);
        
        return isContactValid && isPassengerValid && selectedTourId && selectedScheduleId;
    };

    useEffect(() => {
        const fetchTours = async () => {
            setLoading(true);
            setError(null);
            try {
                const res = await fetch(`${API_URL}/tour/all`, {
                    credentials: "include"
                })
                if (!res.ok) throw new Error("lỗi lấy danh sách tour");
                const result = await res.json();
                setTours(result.data || []);
            } catch (err) {
                setError("Lỗi tải danh sách tour");
                console.error(err);
            } finally {
                setLoading(false);
            }
        }
        fetchTours()
    }, [])

    const selectedTour = tours.find(t => t.tour_id === selectedTourId);
    const selectedSchedule = selectedTour?.upcoming_schedules?.find(s => s.schedule_id === selectedScheduleId) as ReadTourSchedule | undefined;

    const tourOptions: TourOption[] = useMemo(() => {
        return tours.map(tour => ({
            value: tour.tour_id,
            searchText: `${tour.tour_code} ${tour.title}`,
            label: (
                <div className="flex flex-col py-1 overflow-hidden">
                    <span className="font-semibold text-gray-800 truncate">
                        {tour.tour_code} - {tour.title}
                    </span>
                    <span className="text-xs text-gray-500 italic truncate">
                        Điểm khởi hành: {tour.depart_destination}
                    </span>
                </div>
            )
        }));
    }, [tours]);

    const scheduleOptions: ScheduleOption[] = useMemo(() => {
        if (!selectedTour?.upcoming_schedules) return [];
        return selectedTour.upcoming_schedules.map(sch => ({
            value: sch.schedule_id,
            label: `Khởi hành: ${new Date(sch.departure_date).toLocaleDateString('vi-VN')} - Giá: ${Number(sch.price_adult).toLocaleString()}đ (Còn ${sch.available_seats - sch.booked_seats} chỗ)`
        }));
    }, [selectedTour]);

    const handleTourChange = (newValue: SingleValue<TourOption>) => {
        setSelectedTourId(newValue?.value || "");
        setSelectedScheduleId("");
    };

    //check infor account
    const [errors, setErrors] = useState({
        fullName: "",
        phone: "",
        email: ""
    });
    const validate = () => {
        const newErrors = {
            fullName: "",
            phone: "",
            email: ""
        };

        if (!fullName.trim()) {
            newErrors.fullName = "Thông tin bắt buộc";
        }

        if (!phone.trim()) {
            newErrors.phone = "Thông tin bắt buộc";
        } else if (!/^0\d{9}$/.test(phone)) {
            newErrors.phone = "Số điện thoại phải bắt đầu bằng 0 và có 10 chữ số";
        }

        if (!email.trim()) {
            newErrors.email = "Thông tin bắt buộc";
        } else if (!/^[^\s@]+@gmail\.com$/.test(email)) {
            newErrors.email = "Email phải có dạng @gmail.com";
        }

        setErrors(newErrors);
    };

    const calculateTotalPrice = useCallback(() => {
        if (!selectedSchedule || !selectedTour) {
            return 0;
        }
        const adultTotal = numPassengerData.numAdults * selectedSchedule.price_adult;
        const childTotal = numPassengerData.numChildren * selectedSchedule.price_child;
        const infantTotal = numPassengerData.numInfants * selectedSchedule.price_infant;
        const singleRoomTotal = numPassengerData.numSingleRooms * (selectedTour.single_room_surcharge ?? 0);
        
        return adultTotal + childTotal + infantTotal + singleRoomTotal;
    }, [numPassengerData, selectedSchedule, selectedTour]);

    //check price when using coupon
    useEffect(() => {
        if (!selectedCoupon || !selectedTour || !selectedSchedule) {
            return;
        }
        const total = calculateTotalPrice();
        if (total < selectedCoupon.min_order_amount) {
            alert("Đơn hàng không còn đủ điều kiện áp dụng mã giảm giá. Mã sẽ được xóa.");
            setSelectedCoupon(null);
            setDiscountAmount(0);
        } else {
            let discount = 0;
            if (selectedCoupon.discount_type === "FIXED") {
                discount = selectedCoupon.discount_value;
            } else {
                discount = total * (selectedCoupon.discount_value / 100);
                if (selectedCoupon.max_discount_amount) {
                    discount = Math.min(discount, selectedCoupon.max_discount_amount);
                }
            }
            setDiscountAmount(discount);
        }
    }, [numPassengerData, selectedCoupon, selectedSchedule, selectedTour, calculateTotalPrice]);

    if (loading) return <div className="text-center py-8">Đang tải dữ liệu...</div>;
    if (error) return <div className="text-center py-8 text-red-600">{error}</div>;

    // Handle selecting a coupon
    const handleSelectCoupon = (coupon: ReadCoupon) => {
        const total = calculateTotalPrice();
        if (total < coupon.min_order_amount) {
            alert("Đơn hàng chưa đủ giá trị tối thiểu để áp dụng mã giảm giá này.");
            return;
        }

        setSelectedCoupon(coupon);
        let discount = 0;
        if (coupon.discount_type === "FIXED") {
            discount = coupon.discount_value;
        } else {
            discount = total * (coupon.discount_value / 100);
            if (coupon.max_discount_amount) {
                discount = Math.min(discount, coupon.max_discount_amount);
            }
        }
        setDiscountAmount(discount);
        setIsModalOpen(false);
    };

    const removeCoupon = () => {
        setSelectedCoupon(null);
        setDiscountAmount(0);
    };

    const finalTotal = calculateTotalPrice() - discountAmount;

    const handleConfirmBooking = async () => {
        if (!isFormValid()) {
            alert("Vui lòng kiểm tra lại thông tin");
            return;
        }

        setIsSubmitting(true);
        try {
            const allPassengers = [
                ...passengersData.adults,
                ...passengersData.children,
                ...passengersData.infants
            ];

            const payload = {
                tour_id: selectedTourId,
                schedule_id: selectedScheduleId,
                coupon_id: selectedCoupon?.coupon_id || null,
                num_adults: numPassengerData.numAdults,
                num_children: numPassengerData.numChildren,
                num_infants: numPassengerData.numInfants,
                passengers: allPassengers,
                contact_name: fullName,
                contact_email: email,
                contact_phone: phone,
                contact_address: address || null,
                special_request: specialRequest || null
            };

            const response = await fetch(`${API_URL}/booking/create`, { 
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
                credentials: 'include'
            });

            const result = await response.json();
            if (response.ok) {
                alert("Tạo booking thành công!");
                router.push('/admin/dashboard/bookings'); 
            } else {
                alert(result.message || "Lỗi tạo booking");
            }
        } catch (err) {
            alert("Lỗi hệ thống");
            console.error(err);
        } finally {
            setIsSubmitting(false);
            setIsPreviewOpen(false);
        }
    };

    return (
         <div className="min-w-100 px-8 mx-auto py-6 h-98/100 overflow-y-auto relative">
            <button 
                className="bg-white px-4 py-2 rounded-xl border-1 border-gray-300 mb-4 cursor-pointer hover:bg-gray-300 hover:text-white
                            absolute top-4 left-8"
                onClick={() => router.back()}
            >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-8">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m11.25 9-3 3m0 0 3 3m-3-3h7.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>
            </button>
            <div className="flex justify-center">
                <h1 className="text-3xl font-bold mb-6 text-main">Tạo Booking</h1>
            </div>
            <div className="flex gap-6 flex-col">
                {/* select tour */}
                <div>
                    <label className="font-bold mb-2">
                        Chọn tour du lịch
                    </label>
                    <Select
                        options={tourOptions}
                        getOptionLabel={(option) => option.label as unknown as string}
                        formatOptionLabel={(option) => option.label}
                        filterOption={(option, inputValue) => 
                            option.data.searchText.toLowerCase().includes(inputValue.toLowerCase())
                        }
                        placeholder="-- Tìm kiếm hoặc chọn tour --"
                        onChange={handleTourChange}
                        isClearable
                        className="react-select-container"
                        classNamePrefix="react-select"
                        noOptionsMessage={() => "Không tìm thấy tour"}
                    />
                </div>

                {/* select schedule */}
                <div className={!selectedTourId ? 'opacity-50 pointer-events-none' : ''}>
                    <label className="font-bold mb-2">
                        Chọn ngày khởi hành
                    </label>
                    <Select
                        options={scheduleOptions}
                        value={scheduleOptions.find(opt => opt.value === selectedScheduleId) || null}
                        onChange={(opt) => setSelectedScheduleId(opt?.value || "")}
                        placeholder={selectedTourId ? "-- Chọn ngày khởi hành --" : "Vui lòng chọn tour trước"}
                        isDisabled={!selectedTourId}
                        noOptionsMessage={() => "Tour này hiện chưa có lịch khởi hành"}
                        className="react-select-container"
                        classNamePrefix="react-select"
                    />
                </div>
            </div>

            {selectedSchedule && selectedTour && (
                <>
                    {/* Tour Summary */}
                    <div className="flex gap-4 mb-8 mt-8">
                        <Image 
                            src={selectedTour.main_image_url} 
                            alt={selectedTour.title} 
                            width={200} 
                            height={150} 
                            className="rounded object-cover" 
                        />
                        <div>
                            <h1 className="text-2xl font-bold">{selectedTour.title}</h1>
                            <div className="flex items-center gap-2 mt-1">
                                <Code className="h-4 w-4" />
                                <p>Mã tour: {selectedTour.tour_code}</p>
                            </div>
                            <p>Ngày khởi hành: {new Date(selectedSchedule.departure_date).toLocaleDateString('vi-VN')}</p>
                        </div>
                    </div>
                    {/* Contact Info */}
                    <div className="mt-8">
                        <h2 className="text-2xl font-bold mb-4">Thông tin liên lạc</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <div className="flex gap-1">
                                    <p className="block mb-1">Họ tên</p><p className="text-red-600">*</p>
                                </div>
                                <input 
                                    className="border p-2 w-full rounded"
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    onBlur={validate}
                                />
                                {errors.fullName && <p className="text-red-600">{errors.fullName}</p>}
                            </div>
                            <div>
                                <div className="flex gap-1">
                                    <p className="block mb-1">Email</p><p className="text-red-600">*</p>
                                </div>
                                <input 
                                    className="border p-2 w-full rounded"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    onBlur={validate}
                                />
                                {errors.email && <p className="text-red-600">{errors.email}</p>}
                            </div>
                            <div>
                                <div className="flex gap-1">
                                    <p className="block mb-1">Số điện thoại</p><p className="text-red-600">*</p>
                                </div>
                                <input 
                                    className="border p-2 w-full rounded"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0,10))}
                                    onBlur={validate}
                                />
                                {errors.phone && <p className="text-red-600">{errors.phone}</p>}
                            </div>
                            <div>
                                <label className="block mb-1">Địa chỉ</label>
                                <input 
                                    className="border p-2 w-full rounded"
                                    value={address}
                                    onChange={(e) => setAddress(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Passenger Section */}
                    <div>
                        <h2 className="text-2xl font-bold mb-4">Thông tin hành khách</h2>
                        <BookingPassengerAdmin 
                            singleRoomSurCharge={selectedTour.single_room_surcharge ?? 0}
                            onNumPassengerChange={setNumPassengerData}
                            onPassengersDataChange={setPassengersData}
                            onValidityChange={setIsPassengerValid}
                        />
                    </div>

                    {/* Coupon */}
                    <div className="mt-8">
                        <h2 className="text-2xl font-bold mb-4">Mã giảm giá</h2>
                        {selectedCoupon ? (
                            <div className="border p-4 rounded flex justify-between items-center">
                                <div>
                                    <p className="font-bold">{selectedCoupon.code}</p>
                                    <p>Giảm {formatPrice(discountAmount)}</p>
                                </div>
                                <button onClick={removeCoupon} className="text-red-600">Xóa</button>
                            </div>
                        ) : (
                            <button 
                                onClick={() => setIsModalOpen(true)}
                                className="bg-blue-900 text-white px-4 py-2 rounded cursor-pointer hover:bg-blue-600"
                            >
                                Chọn mã giảm giá
                            </button>
                        )}
                    </div>

                    {/* Special Request */}
                    <div className="mt-8">
                        <h2 className="text-2xl font-bold mb-4">Yêu cầu đặc biệt</h2>
                        <textarea 
                            className="border p-2 w-full rounded h-32"
                            value={specialRequest}
                            onChange={(e) => setSpecialRequest(e.target.value)}
                            placeholder="Nhập yêu cầu đặc biệt nếu có..."
                        />
                    </div>

                    {/* Price and Total Integrated */}
                    <div className="mt-8">
                        <h2 className="text-2xl font-bold mb-4">Giá Tiền</h2>
                        <div className="space-y-2 mb-6">
                            <div className="flex justify-between">
                                <span>Người lớn x {numPassengerData.numAdults}</span>
                                <span>{formatPrice((selectedSchedule?.price_adult ?? 0) * numPassengerData.numAdults)}</span>
                            </div>
                            {numPassengerData.numChildren > 0 && (
                                <div className="flex justify-between">
                                    <span>Trẻ em x {numPassengerData.numChildren}</span>
                                    <span>{formatPrice((selectedSchedule?.price_child ?? 0) * numPassengerData.numChildren)}</span>
                                </div>
                            )}
                            {numPassengerData.numInfants > 0 && (
                                <div className="flex justify-between">
                                    <span>Em bé x {numPassengerData.numInfants}</span>
                                    <span>{formatPrice((selectedSchedule?.price_infant ?? 0) * numPassengerData.numInfants)}</span>
                                </div>
                            )}
                            {numPassengerData.numSingleRooms > 0 && (
                                <div className="flex justify-between">
                                    <span>Phòng đơn x {numPassengerData.numSingleRooms}</span>
                                    <span>{formatPrice((selectedTour?.single_room_surcharge ?? 0) * numPassengerData.numSingleRooms)}</span>
                                </div>
                            )}
                            <div className="space-y-2">
                                <div className="flex justify-between">
                                    <span>Tạm tính</span>
                                    <span>{formatPrice(calculateTotalPrice())}</span>
                                </div>
                                {discountAmount > 0 && (
                                    <div className="flex justify-between text-green-600">
                                        <span>Giảm giá</span>
                                        <span>-{formatPrice(discountAmount)}</span>
                                    </div>
                                )}
                                <div className="flex justify-between font-bold text-xl pt-2 border-t">
                                    <span>Tổng</span>
                                    <span>{formatPrice(finalTotal)}</span>
                                </div>
                                <button 
                                    onClick={() => setIsPreviewOpen(true)}
                                    disabled={!isFormValid()}
                                    className={`mt-4 px-6 py-3 rounded w-full text-white ${
                                        isFormValid() 
                                        ? 'bg-blue-900 hover:bg-blue-600 cursor-pointer'
                                        : 'bg-gray-400 cursor-not-allowed'
                                    }`}
                                >
                                    Xem trước và xác nhận
                                </button>
                            </div>
                        </div>
                    </div>
                </>
            )}

            {/* Coupon Modal */}
            <ModalReadListCoupon 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                onSelect={handleSelectCoupon} 
            />

            {/* Preview Modal */}
            {isPreviewOpen && selectedTour && selectedSchedule && (
                <div
                    className="fixed inset-0 bg-black/50 flex justify-center items-center z-50"
                    onClick={() => setIsPreviewOpen(false)}
                >

                    <div
                        className="bg-white rounded-xl p-6 w-full max-w-2xl mx-4 relative shadow-2xl
                                    max-h-[90vh] overflow-y-auto"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h1 className="text-2xl font-bold mb-2 text-main mx-auto items-center">Chi tiết đơn đặt</h1>
                        <button
                            onClick={() => setIsPreviewOpen(false)}
                            className="absolute top-6 right-6 cursor-pointer hover:text-red-600 transition"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                        <div className="flex flex-col my-2 gap-2 px-2 ">
                            {/* Tour */}
                            <div>
                                <h3 className="font-bold text-lg mb-3">TÓM TẮT CHUYẾN ĐI</h3>
                                <div className="bg-gray-50 p-4 rounded-lg flex gap-4">
                                    <Image src={selectedTour.main_image_url} alt={selectedTour.title} width={120} height={90} className="object-cover rounded" />
                                    <div>
                                        <p className="font-bold">{selectedTour.title}</p>
                                        <p className="text-sm text-gray-600">Mã tour: {selectedTour.tour_code}</p>
                                        <p className="text-sm">Ngày khởi hành: {new Date(selectedSchedule.departure_date).toLocaleDateString('vi-VN')}</p>
                                    </div>
                                </div>
                            </div>
                            {/* contact */}
                            <div>
                                <h3 className="font-bold text-lg mb-3">THÔNG TIN LIÊN LẠC</h3>
                                <div className="bg-gray-50 p-4 rounded-lg grid grid-cols-2 gap-4">
                                    <div><p className="text-sm text-gray-600">Họ tên</p><p className="font-semibold">{fullName}</p></div>
                                    <div><p className="text-sm text-gray-600">Email</p><p className="font-semibold">{email}</p></div>
                                    <div><p className="text-sm text-gray-600">Số điện thoại</p><p className="font-semibold">{phone}</p></div>
                                    <div><p className="text-sm text-gray-600">Địa chỉ</p><p className="font-semibold">{address || 'Không có'}</p></div>
                                </div>
                            </div>

                            {/* passenger */}
                            <div>
                                <h3 className="font-bold text-lg mb-3">DANH SÁCH HÀNH KHÁCH</h3>
                                <div className="space-y-6">
                                    {passengersData.adults.length > 0 && (
                                        <div>
                                            <p className="font-semibold mb-2">Người lớn ({passengersData.adults.length})</p>
                                            {passengersData.adults.map((p, i) => (
                                                <div key={i} className="bg-gray-50 p-3 rounded mb-2">
                                                    <p><strong>{i+1}.</strong> {p.full_name} ({p.gender === 'MALE' ? 'Nam' : p.gender === 'FEMALE' ? 'Nữ' : 'Khác'})</p>
                                                    <p className="text-sm text-gray-600">Ngày sinh: {new Date(p.date_of_birth).toLocaleDateString('vi-VN')} | CCCD: {p.id_number}</p>
                                                    {p.single_room === 1 && <p className="text-sm text-orange-600">Yêu cầu phòng đơn (+{formatPrice(selectedTour.single_room_surcharge ?? 0)})</p>}
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {passengersData.children.length > 0 && (
                                        <div>
                                            <p className="font-semibold mb-2">Trẻ em ({passengersData.children.length})</p>
                                            {passengersData.children.map((p, i) => (
                                                <div key={i} className="bg-gray-50 p-3 rounded mb-2">
                                                    <p><strong>{i+1}.</strong> {p.full_name} ({p.gender === 'MALE' ? 'Nam' : p.gender === 'FEMALE' ? 'Nữ' : 'Khác'})</p>
                                                    <p className="text-sm text-gray-600">Ngày sinh: {new Date(p.date_of_birth).toLocaleDateString('vi-VN')}</p>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {passengersData.infants.length > 0 && (
                                        <div>
                                            <p className="font-semibold mb-2">Em bé ({passengersData.infants.length})</p>
                                            {passengersData.infants.map((p, i) => (
                                                <div key={i} className="bg-gray-50 p-3 rounded mb-2">
                                                    <p><strong>{i+1}.</strong> {p.full_name} ({p.gender === 'MALE' ? 'Nam' : p.gender === 'FEMALE' ? 'Nữ' : 'Khác'})</p>
                                                    <p className="text-sm text-gray-600">Ngày sinh: {new Date(p.date_of_birth).toLocaleDateString('vi-VN')}</p>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="bg-gray-50 p-6 rounded-lg">
                                <h3 className="font-bold text-lg mb-4">TỔNG THANH TOÁN</h3>
                                <div className="space-y-2 text-lg">
                                    <div className="flex justify-between"><span>Tạm tính</span><span>{formatPrice(calculateTotalPrice())}</span></div>
                                    {discountAmount > 0 && (
                                        <div className="flex justify-between text-green-600">
                                            <span>Giảm giá {selectedCoupon ? `(${selectedCoupon.code})` : ''}</span>
                                            <span>-{formatPrice(discountAmount)}</span>
                                        </div>
                                    )}
                                    <div className="flex justify-between font-bold text-xl border-t-2 pt-3">
                                        <span>TỔNG TIỀN</span>
                                        <span className="text-main">{formatPrice(finalTotal)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end gap-4 mt-8">
                            <button 
                                onClick={() => setIsPreviewOpen(false)} 
                                className="px-6 py-3 border border-gray-400 rounded-xl hover:bg-gray-100"
                                disabled={isSubmitting}
                            >
                                Quay lại chỉnh sửa
                            </button>
                            <button
                                onClick={handleConfirmBooking}
                                disabled={isSubmitting}
                                className={`px-6 py-3 rounded-xl font-bold ${
                                    isSubmitting 
                                    ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                                    : 'bg-main text-white bg-blue-900 hover:bg-blue-60 cursor-pointer'
                                }`}
                            >
                                {isSubmitting ? 'ĐANG XỬ LÝ...' : 'XÁC NHẬN TẠO BOOKING'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}