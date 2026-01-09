'use client'

import { useRouter, useParams } from "next/navigation"
import { useState, useEffect, useCallback } from "react";
import { BookingResponse } from "@/app/types/booking";
import { CreateBookingPassenger, ReadBookingPassenger } from "@/app/types/booking_passengers";
import BookingPassenger from "../../BookingPassenger";
import { TourDetailInfo } from "@/app/types/tour";
import { ReadTourSchedule } from "@/app/types/tour_schedule";
import Image from "next/image";
import { Code } from "lucide-react";
import { formatPrice } from "@/app/common";
import { ReadCoupon } from "@/app/types/coupon";
import ModalReadListCoupon from "../../booking.couponModal";

const API_URL = process.env.NEXT_PUBLIC_URL_API;

export default function UpdateBookingUserPage () {
    const router = useRouter();
    const params = useParams();
    const booking_id = params.id as string;

    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [loading, setLoading] = useState(true); 
    const [error, setError] = useState<string | null>(null);

    const [contactEmail, setContactEmail] = useState("")
    const [contactAddress, setContactAddress] = useState("")
    const [contactName, setContactName] = useState("")
    const [contactPhone, setContactPhone] = useState("")
    const [specialRequest, setSpecialRequest] = useState("")
    const [tourInfo, setTourInfo] = useState<TourDetailInfo|null>(null); 
    const [scheduleInfo, setScheduleInfo] = useState<ReadTourSchedule|null>(null); 
    const [selectedCoupon, setSelectedCoupon] = useState<ReadCoupon | null>(null);
    const [isCouponModalOpen, setIsCouponModalOpen] = useState(false);
    const [discountAmount, setDiscountAmount] = useState(0)

    const [adults, setAdults] = useState<CreateBookingPassenger[]>([]);
    const [children, setChildren] = useState<CreateBookingPassenger[]>([]);
    const [infants, setInfants] = useState<CreateBookingPassenger[]>([]);

    const [numPassengerData, setNumPassengerData] = useState({
        numAdults: 0, 
        numChildren: 0,
        numInfants: 0, 
        numSingleRooms: 0
    });

    const [passengersData, setPassengersData] = useState<{
        adults: CreateBookingPassenger[];
        children: CreateBookingPassenger[];
        infants: CreateBookingPassenger[];
    }>({
        adults: [],
        children: [],
        infants: []
    });

    const [isPassengerValid, setIsPassengerValid] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isPreviewOpen, setIsPreviewOpen] = useState(false);
    const [isDataFullyLoaded, setIsDataFullyLoaded] = useState(false);

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

    //fetch data
    useEffect(() => {
        const fetchBooking = async () => {
            try {
                const response = await fetch(`${API_URL}/booking/${booking_id}`, {
                    credentials: 'include',
                });
                const result: BookingResponse = await response.json();

                if (response.ok && result.booking) {                 
                    setContactAddress(result.booking.contact_address || "")
                    setContactName(result.booking.contact_name)
                    setContactEmail(result.booking.contact_email)
                    setContactPhone(result.booking.contact_phone)
                    setSpecialRequest(result.booking.special_request ?? "")
                    setDiscountAmount(Number(result.booking.discount_amount) || 0)

                    const allPassengers: ReadBookingPassenger[] = result.booking.passengers || []
                    const mapped: CreateBookingPassenger[] = allPassengers.map((p) => {
                        const validGenders = ["MALE", "FEMALE", "OTHER"];
                        const genderValue = (p.gender && validGenders.includes(p.gender)) 
                            ? (p.gender as "MALE" | "FEMALE" | "OTHER") 
                            : "MALE";

                        return {
                            passenger_type: p.passenger_type,
                            full_name: p.full_name,
                            date_of_birth: p.date_of_birth,
                            gender: genderValue, 
                            id_number: p.id_number || '',
                            single_room: p.single_room ? 1 : 0 
                        };
                    });

                    const adultsList = mapped.filter(p => p.passenger_type === "ADULT");
                    const childrenList = mapped.filter(p => p.passenger_type === "CHILD");
                    const infantsList = mapped.filter(p => p.passenger_type === "INFANT");

                    setAdults(adultsList);
                    setChildren(childrenList);
                    setInfants(infantsList);

                    // Fetch coupon nếu có
                    if (result.booking.coupon_id) {
                        try {
                            const couponRes = await fetch(`${API_URL}/coupon/read/${result.booking.coupon_id}`, {
                                credentials: 'include'
                            });
                            if (couponRes.ok) {
                                const couponData = await couponRes.json();
                                setSelectedCoupon(couponData.data);
                            }
                        } catch (err) {
                            console.error("Không thể tải thông tin coupon:", err);
                        }
                    }

                    const [tourRes, scheduleRes] = await Promise.all([
                        fetch(`${API_URL}/tour/${result.booking.tour_id}`, {
                            credentials: 'include'
                        }),
                        fetch(`${API_URL}/tour_schedules/${result.booking.schedule_id}`, {
                            credentials: 'include'
                        })
                    ]);

                    const tourData = await tourRes.json();
                    const scheduleData = await scheduleRes.json();

                    if (tourRes.ok) setTourInfo(tourData.data);
                    if (scheduleRes.ok) setScheduleInfo(scheduleData.data);

                    setIsDataFullyLoaded(true);

                } else {
                    setError("Không thể tải thông tin booking");
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
    }, [booking_id, loading, isLoggedIn]);

    //check infor account
    const [errors, setErrors] = useState({
        contactName: "",
        contactPhone: "",
        contactEmail: ""
    });
    const [touched, setTouched] = useState({
        contactName: false,
        contactPhone: false,
        contactEmail: false
    });

    const validate = () => {
        const newErrors = {
            contactName: "",
            contactPhone: "",
            contactEmail: ""
        };

        if (!contactName.trim()) {
            newErrors.contactName = "Thông tin bắt buộc";
        }

        if (!contactPhone.trim()) {
            newErrors.contactPhone = "Thông tin bắt buộc";
        } else if (!/^0\d{9}$/.test(contactPhone)) {
            newErrors.contactPhone = "Số điện thoại phải bắt đầu bằng 0 và có 10 chữ số";
        }

        if (!contactEmail.trim()) {
            newErrors.contactEmail = "Thông tin bắt buộc";
        } else if (!/^[^\s@]+@gmail\.com$/.test(contactEmail)) {
            newErrors.contactEmail = "Email phải có dạng @gmail.com";
        }

        setErrors(newErrors);
    };

    const isFormValid = () => {
        const isContactValid = 
            contactName.trim() !== "" && 
            /^0\d{9}$/.test(contactPhone) && 
            /^[^\s@]+@gmail\.com$/.test(contactEmail);
        
        return isContactValid && isPassengerValid;
    };

    const calculateTotalPrice = useCallback(() => {
        if (!scheduleInfo || !tourInfo) {
            return 0;
        }
        const adultTotal = numPassengerData.numAdults * scheduleInfo.price_adult;
        const childTotal = numPassengerData.numChildren * scheduleInfo.price_child;
        const infantTotal = numPassengerData.numInfants * scheduleInfo.price_infant;
        const singleRoomTotal = numPassengerData.numSingleRooms * tourInfo.single_room_surcharge;
        
        return adultTotal + childTotal + infantTotal + singleRoomTotal;
    }, [numPassengerData, scheduleInfo, tourInfo]);

    //check price when using coupon
    useEffect(() => {
        if (!tourInfo || !scheduleInfo || !selectedCoupon || isDataFullyLoaded) {
            return;
        }

        const totalPassengers = numPassengerData.numAdults + numPassengerData.numChildren + numPassengerData.numInfants;
        const hasInitialPassengers = adults.length + children.length + infants.length > 0;

        if (hasInitialPassengers && totalPassengers === 0) {
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
    }, [
        tourInfo,
        scheduleInfo,
        selectedCoupon,
        numPassengerData,
        adults.length,
        children.length,
        infants.length,
        calculateTotalPrice,
        isDataFullyLoaded
    ]);

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
        setIsCouponModalOpen(false);
    };

    const removeCoupon = () => {
        setSelectedCoupon(null);
        setDiscountAmount(0);
    };

    const finalTotal = calculateTotalPrice() - discountAmount;

    const handleConfirmUpdate = async () => {
        if (!isFormValid()) {
            alert("Vui lòng kiểm tra thông tin trước khi xác nhận.");
            return;
        }

        setIsSubmitting(true);
        try {
            const passengers = [
                ...passengersData.adults,
                ...passengersData.children,
                ...passengersData.infants
            ];

            const bookingData = {
                booking_id: booking_id,
                tour_id: tourInfo?.tour_id,
                schedule_id: scheduleInfo?.schedule_id,
                coupon_id: selectedCoupon?.coupon_id || null,
                num_adults: numPassengerData.numAdults,
                num_children: numPassengerData.numChildren,
                num_infants: numPassengerData.numInfants,
                contact_name: contactName,
                contact_email: contactEmail,
                contact_phone: contactPhone,
                contact_address: contactAddress,
                special_request: specialRequest,
                passengers: passengers
            };

            const response = await fetch(`${API_URL}/booking/update`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify(bookingData)
            });

            const result = await response.json();

            if (response.ok) {
                alert("Cập nhật booking thành công!");
                router.push('/account/booking?status=pending');
            } else {
                alert(result.message || "Cập nhật thất bại");
            }
        } catch (err) {
            console.error("Lỗi khi cập nhật:", err);
            alert("Lỗi khi cập nhật booking");
        } finally {
            setIsSubmitting(false);
            setIsPreviewOpen(false);
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

    if (!tourInfo || !scheduleInfo) {
        return (
            <div className="w-8/10 mx-auto py-6 text-center">
                <p>Đang tải thông tin...</p>
            </div>
        );
    }

    return (
        <div className="w-8/10 mx-auto py-6 relative">
            <button 
                className="bg-white px-4 py-2 rounded-xl border-1 border-gray-300 mb-4 cursor-pointer hover:bg-gray-300 hover:text-white
                            absolute top-4 left-4"
                onClick={() => router.back()}
            >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-8">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m11.25 9-3 3m0 0 3 3m-3-3h7.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>
            </button>
            <div className="flex justify-center">
                <h1 className="text-3xl font-bold mb-6 text-main">
                    CẬP NHẬT BOOKING 
                </h1>
            </div>
            <div className="flex gap-6">
                {/* info passenger */}
                <div className="flex flex-col gap-6 w-65/100">
                    <h1 className="font-bold">THÔNG TIN LIÊN LẠC</h1>
                    {/* account infor */}
                    <div className="grid grid-cols-2">
                        <div>
                            {/* full name */}
                            <div className="flex flex-col">
                                <div className="flex gap-1">
                                    <p className="font-bold">Họ tên</p><p className="text-red-600">*</p>
                                </div>
                                <input
                                    className="px-2 py-3 outline-none active:outline-none"
                                    placeholder="Nhập họ và tên"
                                    value={contactName}
                                    onChange={(e)=>setContactName(e.target.value)}
                                    onBlur={() => {
                                        setTouched({...touched, contactName:true});
                                        validate();
                                    }}
                                />
                                {touched.contactName && errors.contactName && (
                                    <p className="text-red-600 text-sm pl-2">{errors.contactName}</p>
                                )}
                            </div>
                            {/* email */}
                            <div className="flex flex-col">
                                <div className="flex gap-1">
                                    <p className="font-bold">Email</p><p className="text-red-600">*</p>
                                </div>
                                <input
                                    className="px-2 py-3 outline-none active:outline-none"
                                    placeholder="Nhập email"
                                    value={contactEmail}
                                    type="email"
                                    onChange={(e) => setContactEmail(e.target.value)}
                                    onBlur={() => {
                                        setTouched({ ...touched, contactEmail: true });
                                        validate();
                                    }}
                                />
                                {touched.contactEmail && errors.contactEmail && (
                                    <p className="text-red-600 text-sm pl-2">{errors.contactEmail}</p>
                                )}
                            </div>
                        </div>
                        <div>
                            {/* phone */}
                            <div className="flex flex-col">
                                <div className="flex flex-col">
                                    <div className="flex gap-1">
                                        <p className="font-bold">Số điện thoại</p><p className="text-red-600">*</p>
                                    </div>
                                    <input
                                        className="px-2 py-3 outline-none active:outline-none"
                                        placeholder="Nhập số điện thoại"
                                        value={contactPhone}
                                        onChange={(e) => setContactPhone(e.target.value)}
                                        onBlur={() => {
                                            setTouched({ ...touched, contactPhone: true });
                                            validate();
                                        }}
                                    />
                                    {touched.contactPhone && errors.contactPhone && (
                                        <p className="text-red-600 text-sm pl-2">{errors.contactPhone}</p>
                                    )}
                                </div>
                            </div>
                            {/* address */}
                            <div className="flex flex-col">
                                <div className="flex gap-1">
                                    <p className="font-bold">Địa chỉ</p>
                                </div>
                                <input
                                    className="px-2 py-3 outline-none active:outline-none"
                                    placeholder="Nhập địa chỉ"
                                    value={contactAddress}
                                    onChange={(e) => setContactAddress(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>
                    {/* booking passenger infor */}
                    <div>
                        <BookingPassenger 
                            singleRoomSurCharge={tourInfo.single_room_surcharge}
                            onNumPassengerChange={setNumPassengerData}
                            onValidityChange={setIsPassengerValid}
                            onPassengersDataChange={setPassengersData}
                            initialData={{ adults, children, infants }} 
                        />
                    </div>
                    <h1 className="font-bold">GHI CHÚ</h1>
                    <div className="flex flex-col gap-2">
                        <span>Quý khách có ghi chú lưu ý gì, hãy nói với chúng tôi</span>
                        <textarea
                            rows={4}
                            maxLength={500}
                            className="border rounded-xl p-2"
                            value={specialRequest}
                            onChange={(e) => setSpecialRequest(e.target.value)}
                        />
                    </div>
                </div>
                {/* infor tour */}
                <div className="flex flex-1 flex-col gap-6">
                    <h1 className="font-bold">TÓM TẮT CHUYẾN ĐI</h1>
                    <div className="flex gap-2">
                        <div className="flex-shrink-0">
                            <Image
                                src={tourInfo.main_image_url}
                                alt="ảnh tour"
                                width={120}
                                height={90}
                                className="object-cover rounded"
                            />
                        </div>
                        <div className="flex flex-col justify-center flex-1 min-w-0">
                            <span className="font-bold text-sm line-clamp-2 mb-1">
                                {tourInfo.title} 
                            </span>
                            <span className="flex gap-1 items-center text-xs text-gray-800">
                                <Code className="w-4 h-4"/>
                                {tourInfo.tour_code}
                            </span>
                        </div>
                    </div>
                    {/* total price */}
                    <h1 className="font-bold border-t pt-2">KHÁCH HÀNG + PHỤ THU</h1>
                    <div className="flex flex-col gap-1">
                        {numPassengerData.numAdults > 0 && (
                            <div className="flex justify-between">
                                <span>Người lớn</span>
                                <div>
                                    <span>{numPassengerData.numAdults}</span>
                                    <span> x </span>
                                    <span>{formatPrice(scheduleInfo.price_adult)}</span>
                                </div>
                            </div>
                        )}
                        {numPassengerData.numChildren > 0 && (
                            <div className="flex justify-between">
                                <span>Trẻ em</span>
                                <div>
                                    <span>{numPassengerData.numChildren}</span>
                                    <span> x </span>
                                    <span>{formatPrice(scheduleInfo.price_child)}</span>
                                </div>
                            </div>
                        )}
                        {numPassengerData.numInfants > 0 && (
                            <div className="flex justify-between">
                                <span>Em bé</span>
                                <div>
                                    <span>{numPassengerData.numInfants}</span>
                                    <span> x </span>
                                    <span>{formatPrice(scheduleInfo.price_infant)}</span>
                                </div>
                            </div>
                        )}
                        <div className="flex justify-between">
                            <span>Phụ thu tạm tính</span>
                            <div>
                                <span>{numPassengerData.numSingleRooms}</span>
                                <span> x </span>
                                <span>{formatPrice(tourInfo.single_room_surcharge)}</span>
                            </div>
                        </div>
                        <div className="flex justify-between">
                            <span>Tạm tính</span>
                            <span>{formatPrice(calculateTotalPrice())}</span>
                        </div>
                    </div>
                    {/* coupon */}
                    <div className="flex justify-between border-t pt-2">
                        <div className="flex items-center gap-3">
                            <Image 
                                src="/coupon.png" 
                                alt="mã giảm giá" 
                                width={20} 
                                height={20}
                                className="object-contain icon-active"
                            />
                            <span className="font-bold">MÃ GIẢM GIÁ</span>
                        </div>
                        <div>
                            {selectedCoupon ? (
                                <div className="flex items-center gap-2">
                                    <span className="text-green-600">{selectedCoupon.code}</span>
                                    <button 
                                        onClick={removeCoupon}
                                        className="text-red-600 hover:underline"
                                    >
                                        Xóa
                                    </button>
                                    <button 
                                        onClick={() => setIsCouponModalOpen(true)}
                                        className="text-blue-600 hover:underline"
                                    >
                                        Thay đổi
                                    </button>
                                </div>
                            ) : (
                                <button 
                                    className="flex gap-2 items-center cursor-pointer text-red-600"
                                    onClick={() => setIsCouponModalOpen(true)}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                    </svg>
                                    <span>Thêm mã giảm giá</span>
                                </button>
                            )}
                        </div>
                    </div>
                    {/* final price */}
                    <div className="flex flex-col gap-1">
                        <div className="flex justify-between">
                            <span>Giảm giá</span>
                            <span>{formatPrice(discountAmount)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Tổng tiền</span>
                            <span>{formatPrice(finalTotal)}</span>
                        </div>
                    </div>
                    {/* button */}
                    <div>
                        <button
                            disabled={!isFormValid() || isSubmitting}
                            className={`w-full py-4 rounded-xl font-bold mt-4 transition-all ${
                                isFormValid() && !isSubmitting
                                ? 'bg-main text-white bg-blue-900 cursor-pointer hover:bg-blue-800' 
                                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            }`}
                            onClick={() => {
                                if (isFormValid()) {
                                    setIsPreviewOpen(true);
                                }
                            }}
                        >
                            {isSubmitting ? 'ĐANG XỬ LÝ...' : 'CẬP NHẬT BOOKING'}
                        </button>
                    </div>
                </div>
            </div>
            {/* modal coupon */}
            <ModalReadListCoupon 
                isOpen={isCouponModalOpen} 
                onClose={() => setIsCouponModalOpen(false)} 
                onSelect={handleSelectCoupon} 
            />

            {/* Modal Preview*/}
            {isPreviewOpen && (
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
                                    <Image src={tourInfo.main_image_url} alt={tourInfo.title} width={120} height={90} className="object-cover rounded" />
                                    <div>
                                        <p className="font-bold">{tourInfo.title}</p>
                                        <p className="text-sm text-gray-600">Mã tour: {tourInfo.tour_code}</p>
                                        <p className="text-sm">Ngày khởi hành: {new Date(scheduleInfo.departure_date).toLocaleDateString('vi-VN')}</p>
                                    </div>
                                </div>
                            </div>
                            {/* contact */}
                            <div>
                                <h3 className="font-bold text-lg mb-3">THÔNG TIN LIÊN LẠC</h3>
                                <div className="bg-gray-50 p-4 rounded-lg grid grid-cols-2 gap-4">
                                    <div><p className="text-sm text-gray-600">Họ tên</p><p className="font-semibold">{contactName}</p></div>
                                    <div><p className="text-sm text-gray-600">Email</p><p className="font-semibold">{contactEmail}</p></div>
                                    <div><p className="text-sm text-gray-600">Số điện thoại</p><p className="font-semibold">{contactPhone}</p></div>
                                    <div><p className="text-sm text-gray-600">Địa chỉ</p><p className="font-semibold">{contactAddress || 'Không có'}</p></div>
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
                                                    {p.single_room === 1 && <p className="text-sm text-orange-600">Yêu cầu phòng đơn (+{formatPrice(tourInfo.single_room_surcharge)})</p>}
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
                                onClick={handleConfirmUpdate}
                                disabled={isSubmitting}
                                className={`px-6 py-3 rounded-xl font-bold ${
                                    isSubmitting 
                                    ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                                    : 'bg-main text-white bg-blue-900 hover:bg-blue-600'
                                }`}
                            >
                                {isSubmitting ? 'ĐANG XỬ LÝ...' : 'XÁC NHẬN CẬP NHẬT'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}    

            