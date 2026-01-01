'use client'

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { TourDetailInfo } from "@/app/types/tour";
import { ReadTourSchedule } from "@/app/types/tour_schedule";
import { AccountWhoAmI } from "@/app/types/account";
import BookingPassenger from "./BookingPassenger";

const API_URL = process.env.NEXT_PUBLIC_URL_API;

export default function BookingPage () {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [loading, setLoading] = useState(true);
    const [tourInfo, setTourInfo] = useState<TourDetailInfo | null>(null);
    const [selectedSchedule, setSelectedSchedule] = useState<ReadTourSchedule | null>(null);

    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("")
    const [address, setAddress] = useState("")

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






    if (loading || !isLoggedIn || !tourInfo || !selectedSchedule) {
        return <div className="w-8/10 mx-auto">Đang tải trang...</div>;
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
                    <h1 className="font-bold">HÀNH KHÁCH</h1>
                    {/* booking passenger infor */}
                    <div>
                        <BookingPassenger singleRoomSurCharge={tourInfo.single_room_surcharge}/>
                    </div>
                </div>
                {/* infor tour */}
                <div className="flex flex-1 flex-col">
                   
                </div>

            </div>
        </div>
    )
}