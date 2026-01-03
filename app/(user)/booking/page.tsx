'use client'

import { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { TourDetailInfo } from "@/app/types/tour";
import { ReadTourSchedule } from "@/app/types/tour_schedule";
import { AccountWhoAmI } from "@/app/types/account";
import BookingPassenger from "./BookingPassenger";
import Image from "next/image";
import { Code } from "lucide-react";
import { formatPrice } from "@/app/common";
import ModalReadListCoupon from "./booking.couponModal";
import { ReadCoupon } from "@/app/types/coupon";

const API_URL = process.env.NEXT_PUBLIC_URL_API;

export default function BookingPage () {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [loading, setLoading] = useState(true);
    const [tourInfo, setTourInfo] = useState<TourDetailInfo | null>(null);
    const [selectedSchedule, setSelectedSchedule] = useState<ReadTourSchedule | null>(null);
    const [numPassengerData, setNumPassengerData] = useState(
        {numAdults: 1, numChildren: 0,numInfants: 0, numSingleRooms: 0 }
    )

    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("")
    const [address, setAddress] = useState("")

    const [isModalOpen, setIsModalOpen] = useState(false); 
    const [selectedCoupon, setSelectedCoupon] = useState<ReadCoupon | null>(null); 
    const [discountAmount, setDiscountAmount] = useState(0); 

    const [isPassengerValid, setIsPassengerValid] = useState(false);

    const isFormValid = () => {
        const isContactValid = 
            fullName.trim() !== "" && 
            /^0\d{9}$/.test(phone) && 
            /^[^\s@]+@gmail\.com$/.test(email);
        
        return isContactValid && isPassengerValid;
    };

    // fetch data
    useEffect(() => {
        const checkLoginStatus = async () => {
            try {
                const response = await fetch(`${API_URL}/auth/whoami`, {
                    credentials: 'include'
                });
                const data: AccountWhoAmI = await response.json();
                setIsLoggedIn(true); 
                setFullName(data.full_name ?? "")
                setEmail(data.email ?? "")
                setPhone(data.phone ?? "")
                setAddress(data.address ?? "")
            } catch (error) {
                console.error('Error checking auth status:', error);
                setIsLoggedIn(false);
            } finally {
                setLoading(false);
            }
        };
        checkLoginStatus();
    }, []);

    useEffect ( () => {
        const fetchTourAndSchedule = async () => {
            const tour_id = searchParams.get('tour_id');
            const schedule_id = searchParams.get('schedule_id');

            if (!tour_id || !schedule_id) {
                router.push('/tours');
                return;
            }

            try {
                // fetch tour
                const resTour = await fetch(`${API_URL}/tour/${tour_id}`, {
                    credentials: "include"
                });
                const result = await resTour.json();
                if (resTour.ok && result.data) {
                    const tourData = result.data as TourDetailInfo;
                    setTourInfo(tourData);
                } else {
                    alert(result.message || "Không tải được thông tin tour");
                    router.back();
                }
                //fetch schedule
                const resSchedule = await fetch(`${API_URL}/tour_schedules/${schedule_id}`, {
                    credentials: "include"
                });
                const resultSchedule = await resSchedule.json();
                if (resSchedule.ok && resultSchedule.data) {
                    const tourScheduleData = resultSchedule.data as ReadTourSchedule;
                    setSelectedSchedule(tourScheduleData);
                } else {
                    alert(resultSchedule.message || "Không tải được thông tin lịch trình");
                    router.back();
                }        
            } catch (error) {
                console.error('lỗi khi lấy tour/schedule:', error);
                router.push('/tours');
            }
        }   
    
        if (!loading && isLoggedIn) {
            fetchTourAndSchedule();
        }
    }, [loading, isLoggedIn, router, searchParams]);

    useEffect(() => {
        if (!loading && !isLoggedIn) {
            router.push('/');
        }
    }, [loading, isLoggedIn, router]);

    //check infor account
    const [errors, setErrors] = useState({
        fullName: "",
        phone: "",
        email: ""
    });
    const [touched, setTouched] = useState({
        fullName: false,
        phone: false,
        email: false
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
        if (!selectedSchedule || !tourInfo) {
            return 0;
        }
        const adultTotal = numPassengerData.numAdults * selectedSchedule.price_adult;
        const childTotal = numPassengerData.numChildren * selectedSchedule.price_child;
        const infantTotal = numPassengerData.numInfants * selectedSchedule.price_infant;
        const singleRoomTotal = numPassengerData.numSingleRooms * tourInfo.single_room_surcharge;
        
        return adultTotal + childTotal + infantTotal + singleRoomTotal;
    }, [numPassengerData, selectedSchedule, tourInfo]);

    //check price when using coupon
    useEffect(() => {
        if (!selectedCoupon || !tourInfo || !selectedSchedule) {
            return;
        }
        const total = calculateTotalPrice();
        if (total < selectedCoupon.min_order_amount) {
            alert("Đơn hàng không còn đủ điều kiện áp dụng mã giảm giá. Mã sẽ được xóa.");
            setSelectedCoupon(null);
            setDiscountAmount(0);
        } else {
            // Recalculate discount if total changes
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
    }, [numPassengerData, selectedCoupon, selectedSchedule, tourInfo, calculateTotalPrice]);

    if (loading || !isLoggedIn || !tourInfo || !selectedSchedule) {
        return <div className="w-8/10 mx-auto">Đang tải trang...</div>;
    }

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
                <h1 className="text-3xl font-bold mb-6 text-main">ĐẶT TOUR</h1>
            </div>
            <div className="flex gap-6">
                {/* infor passenger */}
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
                                    value={fullName}
                                    onChange={(e)=>setFullName(e.target.value)}
                                    onBlur={() => {
                                        setTouched({...touched, fullName:true});
                                        validate();
                                    }}
                                />
                                {touched.fullName && errors.fullName && (
                                    <p className="text-red-600 text-sm pl-2">{errors.fullName}</p>
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
                                    value={email}
                                    type="email"
                                    onChange={(e) => setEmail(e.target.value)}
                                    onBlur={() => {
                                        setTouched({ ...touched, email: true });
                                        validate();
                                    }}
                                />
                                {touched.email && errors.email && (
                                    <p className="text-red-600 text-sm pl-2">{errors.email}</p>
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
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                        onBlur={() => {
                                            setTouched({ ...touched, phone: true });
                                            validate();
                                        }}
                                    />
                                    {touched.phone && errors.phone && (
                                        <p className="text-red-600 text-sm pl-2">{errors.phone}</p>
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
                                    value={address}
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
                        />
                    </div>
                    <h1 className="font-bold">GHI CHÚ</h1>
                    <div className="flex flex-col gap-2">
                        <span>Quý khách có ghi chú lưu ý gì, hãy nói với chúng tôi</span>
                        <textarea
                            rows={4}
                            maxLength={500}
                            className="border rounded-xl p-2"
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
                        {numPassengerData.numAdults>0 && (
                            <div className="flex justify-between">
                                <span>Người lớn</span>
                                <div>
                                    <span>{numPassengerData.numAdults}</span>
                                    <span> x </span>
                                    <span>{formatPrice(selectedSchedule.price_adult)}</span>
                                </div>
                            </div>
                        )}
                        {numPassengerData.numChildren>0 && (
                            <div className="flex justify-between">
                                <span>Trẻ em</span>
                                <div>
                                    <span>{numPassengerData.numChildren}</span>
                                    <span> x </span>
                                    <span>{formatPrice(selectedSchedule.price_child)}</span>
                                </div>
                            </div>
                        )}
                        {numPassengerData.numInfants>0 && (
                            <div className="flex justify-between">
                                <span>Em bé</span>
                                <div>
                                    <span>{numPassengerData.numInfants}</span>
                                    <span> x </span>
                                    <span>{formatPrice(selectedSchedule.price_infant)}</span>
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
                                        onClick={() => setIsModalOpen(true)}
                                        className="text-blue-600 hover:underline"
                                    >
                                        Thay đổi
                                    </button>
                                </div>
                            ) : (
                                <button 
                                    className="flex gap-2 items-center cursor-pointer text-red-600"
                                    onClick={() => setIsModalOpen(true)}
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
                            disabled={!isFormValid()}
                            className={`w-full py-4 rounded-xl font-bold mt-4 transition-all ${
                                isFormValid() 
                                ? 'bg-main text-white bg-blue-900 cursor-pointer hover:bg-blue-800' 
                                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            }`}
                            onClick={() => {
                                console.log("Tiến hành thanh toán...");
                            }}
                        >
                            THANH TOÁN NGAY
                        </button>
                    </div>
                </div>
            </div>
            <ModalReadListCoupon 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                onSelect={handleSelectCoupon} 
            />
        </div>
    )
}