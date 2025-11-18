'use client'

import { AccountLogin } from "../types/account";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

interface NavbarAdminProps {
    account: AccountLogin;
}

const API_URL = process.env.NEXT_PUBLIC_URL_API;

export default function NavbarAdmin({ account }: NavbarAdminProps) {

    const [activeSelectOption, setSelectOption] = useState<string | null>('statics');

    const handleClickOption = (option: string) => {
            setSelectOption(option)    
    }

    const logoutHandled = async () => {
        try{
            const res = await fetch(`${API_URL}/auth/logout`, {
                method: "POST",
                credentials: 'include',
            });
            if (res.ok) {
                window.location.href = "/admin";
            } else {
                const errorData = await res.json();
                alert(errorData.message || 'Đăng xuất thất bại');
            }
        } catch  (err){
            console.error('Lỗi kết nối server:', err);
        }
    }

    return (
        <div className="flex flex-col justify-between border-r-2 border-gray-300 p-2">
            <div className="flex">
                <ul className="flex flex-col p-2 gap-4">
                    <Link 
                        onClick={() => handleClickOption('accounts')}
                        href="/admin/dashboard/accounts"
                        className={`flex items-center gap-1 font-bold cursor-pointer transition-transform hover:scale-105
                            ${activeSelectOption === 'accounts' ? 'text-main' : ''}  
                        `}   
                    >
                        <Image 
                            src="/account.png" alt="account-icon" width={28} height={28}
                            className={`transition-all ${activeSelectOption === 'accounts' ? 'icon-active' : ''}`}
                        /> 
                        Quản Lý Tài Khoản
                    </Link>
                    <Link 
                        onClick={() => handleClickOption('destinations')}
                        href="/admin/dashboard/destinations"
                        className={`flex items-center gap-1 font-bold cursor-pointer transition-transform hover:scale-105
                            ${activeSelectOption === 'destinations' ? 'text-main' : ''}   
                        `} 
                    >     
                        <Image 
                            src="/destination.png" alt="account-icon" width={28} height={28}
                            className={`transition-all ${activeSelectOption === 'destinations' ? 'icon-active' : ''}`}
                        />                   
                        Quản Lý Điểm Đến
                    </Link>
                    <Link 
                        onClick={() => handleClickOption('tours')}
                        href="/admin/dashboard/tours"
                        className={`flex items-center gap-1 font-bold cursor-pointer transition-transform hover:scale-105
                            ${activeSelectOption === 'tours' ? 'text-main' : ''}   
                        `} 
                    >
                        <Image 
                            src="/tour.png" alt="account-icon" width={28} height={28}
                            className={`transition-all ${activeSelectOption === 'tours' ? 'icon-active' : ''}`}
                        /> 
                        Quản Lý Chuyến Du Lịch
                    </Link>
                    <Link 
                        onClick={() => handleClickOption('coupons')}
                        href="/admin/dashboard/coupons"
                        className={`flex items-center gap-1 font-bold cursor-pointer transition-transform hover:scale-105
                            ${activeSelectOption === 'coupons' ? 'text-main' : ''}   
                        `} 
                    >
                        <Image 
                            src="/coupon.png" alt="account-icon" width={28} height={28}
                            className={`transition-all ${activeSelectOption === 'coupons' ? 'icon-active' : ''}`}
                        /> 
                        Quản Lý Mã Giảm Giá
                    </Link>
                    <Link 
                        onClick={() => handleClickOption('bookings')}
                        href="/admin/dashboard/bookings"
                        className={`flex items-center gap-1 font-bold cursor-pointer transition-transform hover:scale-105
                            ${activeSelectOption === 'bookings' ? 'text-main' : ''}   
                        `}
                    >
                        <Image 
                            src="/booking.png" alt="account-icon" width={28} height={28}
                            className={`transition-all ${activeSelectOption === 'bookings' ? 'icon-active' : ''}`}
                        /> 
                        Quản Lý Đặt Vé
                    </Link>
                    <Link 
                        onClick={() => handleClickOption('payments')}
                        href="/admin/dashboard/payments"
                        className={`flex items-center gap-1 font-bold cursor-pointer transition-transform hover:scale-105
                            ${activeSelectOption === 'payments' ? 'text-main' : ''}   
                        `}
                    >
                        <Image 
                            src="/payment.png" alt="account-icon" width={28} height={28}
                            className={`transition-all ${activeSelectOption === 'payments' ? 'icon-active' : ''}`}
                        /> 
                        Quản Lý Thanh Toán
                    </Link>
                    <Link 
                        onClick={() => handleClickOption('reviews')}
                        href="/admin/dashboard/reviews"
                        className={`flex items-center gap-1 font-bold cursor-pointer transition-transform hover:scale-105
                            ${activeSelectOption === 'reviews' ? 'text-main' : ''}   
                        `}
                    >
                        <Image 
                            src="/review.png" alt="account-icon" width={28} height={28}
                            className={`transition-all ${activeSelectOption === 'reviews' ? 'icon-active' : ''}`}
                        /> 
                        Quản Lý Đánh Giá
                    </Link>
                    <Link 
                        onClick={() => handleClickOption('statics')}
                        href="/admin/dashboard/statics"
                        className={`flex items-center gap-1 font-bold cursor-pointer transition-transform hover:scale-105
                            ${activeSelectOption === 'statics' ? 'text-main' : ''}   
                        `}
                    >
                        <Image 
                            src="/static.png" alt="account-icon" width={28} height={28}
                            className={`transition-all ${activeSelectOption === 'statics' ? 'icon-active' : ''}`}
                        /> 
                        Thống Kê
                    </Link>
                </ul>
            </div>
            <div className="flex">
                <ul className="flex flex-col p-2 gap-4 w-full">
                    <Link 
                        onClick={() => handleClickOption('account')}
                        href="/admin/dashboard/account"
                        className={`flex items-center gap-1 font-bold cursor-pointer transition-transform hover:scale-105
                            ${activeSelectOption === 'account' ? 'text-main' : ''}   
                        `}
                    >
                        <Image 
                            src="/account.png" alt="account-icon" width={28} height={28}
                            className={`transition-all ${activeSelectOption === 'account' ? 'icon-active' : ''}`}
                        />  
                        <p className="">
                            {account.full_name}
                        </p>
                    </Link>
                    <button 
                        onClick={logoutHandled}
                        className={`flex items-center gap-1 font-bold cursor-pointer transition-transform hover:scale-105`}
                    >
                        <Image src="/logout.png" alt="logout-icon" width={28} height={28} className=""/>
                        Đăng Xuất
                    </button>
                </ul>
            </div>
        </div>
        
    );
}