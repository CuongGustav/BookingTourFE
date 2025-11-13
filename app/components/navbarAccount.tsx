'use client'

const API_URL = process.env.NEXT_PUBLIC_URL_API;

export default function NavbarAccount() {

    const logoutHandled = async () => {
        try{
            const res = await fetch(`${API_URL}/auth/logout`, {
                method: "POST",
                credentials: 'include',
            });
            if (res.ok) {
                localStorage.removeItem('user')
                window.location.href = "/";
            } else {
                const errorData = await res.json();
                alert(errorData.message || 'Đăng xuất thất bại');
            }
        } catch  (err){
            console.error('Lỗi kết nối server:', err);
        }
    }

    return (
        <div className="flex flex-col border-2 border-gray-300 rounded-sm p-2 gap-2 min-w-[200px]">
            <div className="flex flex-col border-b-2 border-gray-300">
                <p className="font-bold">username</p>
                <p className="overflow-hidden w-[200px]">emailádsdasdasdasdasdasdasdasdasdasdasdasdasd</p>
            </div>
            {/* RUD account */}
            <div className="flex flex-col">
                <div className="flex gap-2 items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                    </svg>
                    <p className="text-xl">
                        Tài khoản
                    </p>
                </div>
                <ul className="pl-8">
                    <li>Thông tin tài khoản</li>
                    <li>Đổi mật khẩu</li>
                    <button
                        className="cursor-pointer text-hover-red" 
                        onClick={logoutHandled}  
                    >
                        Đăng xuất
                    </button>
                    <li>Yêu cầu xóa tài khoản</li>
                </ul>

            </div>
        </div>
    )
}
