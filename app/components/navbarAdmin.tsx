'use client'

import { AccountLogin } from "../types/account";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavbarAdminProps {
    account: AccountLogin;
}

const API_URL = process.env.NEXT_PUBLIC_URL_API;

export default function NavbarAdmin({ account }: NavbarAdminProps) {

    const pathname = usePathname();

    const isActive = (slug: string) => pathname.includes(slug);

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
        <div className="flex flex-col justify-between border-r-2 border-gray-300 p-2 lg:min-w-[248px]">
            <div className="flex">
                <ul className="flex flex-col p-2 gap-4">
                    <Link 
                        href="/admin/dashboard/accounts"
                        className={`flex items-center gap-1 font-bold cursor-pointer transition-transform hover:scale-105
                            ${isActive('accounts') ? 'text-main' : ''}  
                        `}   
                    >
                        <Image 
                            src="/account.png" alt="account-icon" width={28} height={28}
                            className={`transition-all ${isActive('accounts') ? 'icon-active' : ''}`}
                        /> 
                        Quản Lý Tài Khoản
                    </Link>
                    <Link 
                        href="/admin/dashboard/destinations"
                        className={`flex items-center gap-1 font-bold cursor-pointer transition-transform hover:scale-105
                            ${isActive('destinations') ? 'text-main' : ''}   
                        `} 
                    >     
                        <Image 
                            src="/destination.png" alt="account-icon" width={28} height={28}
                            className={`transition-all ${isActive('destinations') ? 'icon-active' : ''}`}
                        />                   
                        Quản Lý Điểm Đến
                    </Link>
                    <Link 
                        href="/admin/dashboard/tours"
                        className={`flex items-center gap-1 font-bold cursor-pointer transition-transform hover:scale-105
                            ${isActive('tours') ? 'text-main' : ''}   
                        `} 
                    >
                        <Image 
                            src="/tour.png" alt="account-icon" width={28} height={28}
                            className={`transition-all ${isActive('tours') ? 'icon-active' : ''}`}
                        /> 
                        Quản Lý Chuyến Du Lịch
                    </Link>
                    <Link 
                        href="/admin/dashboard/coupons"
                        className={`flex items-center gap-1 font-bold cursor-pointer transition-transform hover:scale-105
                            ${isActive('coupons') ? 'text-main' : ''}   
                        `} 
                    >
                        <Image 
                            src="/coupon.png" alt="account-icon" width={28} height={28}
                            className={`transition-all ${isActive('coupons') ? 'icon-active' : ''}`}
                        /> 
                        Quản Lý Mã Giảm Giá
                    </Link>
                    <Link 
                        href="/admin/dashboard/bookings"
                        className={`flex items-center gap-1 font-bold cursor-pointer transition-transform hover:scale-105
                            ${isActive('bookings') ? 'text-main' : ''}   
                        `}
                    >
                        <Image 
                            src="/booking.png" alt="account-icon" width={28} height={28}
                            className={`transition-all ${isActive('bookings') ? 'icon-active' : ''}`}
                        /> 
                        Quản Lý Đặt Vé
                    </Link>
                    <Link 
                        href="/admin/dashboard/payments"
                        className={`flex items-center gap-1 font-bold cursor-pointer transition-transform hover:scale-105
                            ${isActive('payments') ? 'text-main' : ''}   
                        `}
                    >
                        <Image 
                            src="/payment.png" alt="account-icon" width={28} height={28}
                            className={`transition-all ${isActive('payments') ? 'icon-active' : ''}`}
                        /> 
                        Quản Lý Thanh Toán
                    </Link>
                    <Link 
                        href="/admin/dashboard/reviews"
                        className={`flex items-center gap-1 font-bold cursor-pointer transition-transform hover:scale-105
                            ${isActive('reviews') ? 'text-main' : ''}   
                        `}
                    >
                        <Image 
                            src="/review.png" alt="account-icon" width={28} height={28}
                            className={`transition-all ${isActive('reviews') ? 'icon-active' : ''}`}
                        /> 
                        Quản Lý Đánh Giá
                    </Link>
                    <Link 
                        href="/admin/dashboard/statics"
                        className={`flex items-center gap-1 font-bold cursor-pointer transition-transform hover:scale-105
                            ${isActive('statics') ? 'text-main' : ''}   
                        `}
                    >
                        <Image 
                            src="/static.png" alt="account-icon" width={28} height={28}
                            className={`transition-all ${isActive('statics') ? 'icon-active' : ''}`}
                        /> 
                        Thống Kê
                    </Link>
                </ul>
            </div>
            <div className="flex">
                <ul className="flex flex-col p-2 gap-4 w-full">
                    <Link 
                        href="/admin/dashboard/account"
                        className={`flex items-center gap-1 font-bold cursor-pointer transition-transform hover:scale-105
                            ${isActive('account') ? 'text-main' : ''}   
                        `}
                    >
                        <Image 
                            src="/account.png" alt="account-icon" width={28} height={28}
                            className={`transition-all ${isActive('account') ? 'icon-active' : ''}`}
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