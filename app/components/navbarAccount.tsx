'use client'

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AccountLogin } from "../types/account";

const API_URL = process.env.NEXT_PUBLIC_URL_API;

export default function NavbarAccount({ account }: { account: AccountLogin }) {
    const pathname = usePathname();
    
    const isAccountParentActive = pathname.startsWith("/account/information") || pathname.startsWith("/account/password") || pathname.startsWith("/account/delete");
    const isBookingActive = pathname.startsWith("/account/booking");
    const isReviewActive = pathname.startsWith("/account/review");
    const isFavoriteActive = pathname.startsWith("/account/favorite");

    const isInfoActive = pathname === "/account/information" || pathname === "/account"; 
    const isPasswordActive = pathname === "/account/password";
    const isDeleteActive = pathname === "/account/delete";

    const logoutHandled = async () => {
        try {
            const res = await fetch(`${API_URL}/auth/logout`, {
                method: "POST",
                credentials: 'include',
            });
            if (res.ok) {
                localStorage.removeItem('user');
                window.location.href = "/";
            } else {
                const errorData = await res.json();
                alert(errorData.message || 'Đăng xuất thất bại');
            }
        } catch (err) {
            console.error('Lỗi kết nối server:', err);
        }
    }

    return (
        <div className="flex flex-col border-2 border-gray-300 rounded-lg p-2 gap-2 h-[380px]">
            {/* User info */}
            <div className="flex flex-col border-b-2 border-gray-300 pb-2">
                <p className="font-bold">{account.full_name}</p>
                <p className="overflow-hidden w-[240px]">{account.email}</p>
            </div>

            {/* Account */}
            <div className="flex flex-col">
                <Link 
                    href="/account/information"
                    className={`flex gap-2 items-center hover:cursor-pointer transition-transform hover:scale-105`}
                >
                    <Image
                        src="/account.png" alt="account-icon" width={28} height={28}
                        className={`transition-all ${isAccountParentActive ? 'icon-active' : ''}`}
                    />
                    <p className={`text-lg font-bold ${isAccountParentActive ? 'text-main' : ''}`}>
                        Tài khoản
                    </p>
                </Link>

                <ul className="flex flex-col p-2 gap-4 pl-10">
                    <Link
                        href="/account/information"
                        className={`hover:cursor-pointer hover:scale-105 ${isInfoActive ? 'text-main' : ''}`}
                    >
                        Thông tin tài khoản
                    </Link>
                    <Link
                        href="/account/password"
                        className={`hover:cursor-pointer hover:scale-105 ${isPasswordActive ? 'text-main' : ''}`}
                    >
                        Đổi mật khẩu
                    </Link>
                    <Link
                        href="/account/delete"
                        className={`hover:cursor-pointer hover:scale-105 ${isDeleteActive ? 'text-main' : ''}`}
                    >
                        Yêu cầu xóa tài khoản
                    </Link>
                    <button
                        className="cursor-pointer text-hover-red hover:scale-105 text-left"
                        onClick={logoutHandled}
                    >
                        Đăng xuất
                    </button>
                </ul>
            </div>

            <Link
                href="/account/booking"
                className={`flex gap-2 items-center hover:cursor-pointer transition-transform hover:scale-105`}
            >
                <Image
                    src="/booking.png"
                    alt="booking-icon"
                    width={28}
                    height={28}
                    className={`transition-all ${isBookingActive ? 'icon-active' : ''}`}
                />
                <p className={`text-lg font-bold ${isBookingActive ? 'text-main' : ''}`}>
                    Quản lý booking
                </p>
            </Link>

            <Link
                href="/account/review"
                className={`flex gap-2 items-center hover:cursor-pointer transition-transform hover:scale-105`}
            >
                <Image
                    src="/review.png"
                    alt="review-icon"
                    width={28}
                    height={28}
                    className={`transition-all ${isReviewActive ? 'icon-active' : ''}`}
                />
                <p className={`text-lg font-bold ${isReviewActive ? 'text-main' : ''}`}>
                    Quản lý đánh giá
                </p>
            </Link>

            <Link
                href="/account/favorite"
                className={`flex gap-2 items-center hover:cursor-pointer transition-transform hover:scale-105`}
            >
                <Image
                    src="/heart.png"
                    alt="heart-icon"
                    width={28}
                    height={28}
                    className={`transition-all ${isFavoriteActive ? 'icon-active' : ''}`}
                />
                <p className={`text-lg font-bold ${isFavoriteActive ? 'text-main' : ''}`}>
                    Danh sách tour yêu thích
                </p>
            </Link>
        </div>
    )
}
