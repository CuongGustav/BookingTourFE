'use client'

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AccountLogin } from "../types/account";

const API_URL = process.env.NEXT_PUBLIC_URL_API;

export default function NavbarAccount({ account }: { account: AccountLogin }) {
    const pathname = usePathname();

    // --- Cấp 1 ---
    const isAccountParentActive = pathname.startsWith("/account/information") || pathname.startsWith("/account/password") || pathname.startsWith("/account/delete");
    const isBookingActive = pathname.startsWith("/account/booking");
    const isReviewActive = pathname.startsWith("/account/review");
    const isFavoriteActive = pathname.startsWith("/account/favorite");

    // --- Cấp 2 ---
    const isInfoActive = pathname === "/account/information" || pathname === "/account"; // <-- mặc định highlight
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
        <div className="flex flex-col border-2 border-gray-300 rounded-sm p-2 gap-2 min-w-[200px]">
            {/* User info */}
            <div className="flex flex-col border-b-2 border-gray-300">
                <p className="font-bold">{account.full_name}</p>
                <p className="overflow-hidden w-[200px]">{account.email}</p>
            </div>

            {/* Tài khoản (cha) */}
            <div className="flex flex-col">
                <div className={`flex gap-2 items-center hover:cursor-pointer transition-transform hover:scale-105`}>
                    <Image
                        src="/account.png"
                        alt="account-icon"
                        width={28}
                        height={28}
                        className={`transition-all ${isAccountParentActive ? 'icon-active' : ''}`}
                    />
                    <p className={`text-lg font-bold ${isAccountParentActive ? 'text-main' : ''}`}>
                        Tài khoản
                    </p>
                </div>

                {/* Cấp 2 */}
                <ul className="flex flex-col p-2 gap-4 pl-10">
                    <Link
                        href="/account/information"
                        className={`hover:cursor-pointer ${isInfoActive ? 'text-main' : ''}`}
                    >
                        Thông tin tài khoản
                    </Link>
                    <Link
                        href="/account/password"
                        className={`hover:cursor-pointer ${isPasswordActive ? 'text-main' : ''}`}
                    >
                        Đổi mật khẩu
                    </Link>
                    <li
                        className={`hover:cursor-pointer ${isDeleteActive ? 'text-main' : ''}`}
                    >
                        Yêu cầu xóa tài khoản
                    </li>
                    <button
                        className="cursor-pointer text-hover-red"
                        onClick={logoutHandled}
                    >
                        Đăng xuất
                    </button>
                </ul>
            </div>

            {/* Các mục cấp 1 khác */}
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
                    Đơn đã đặt
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
                    Đánh giá của quý khách
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
                    Yêu thích tour đã lưu
                </p>
            </Link>
        </div>
    )
}
