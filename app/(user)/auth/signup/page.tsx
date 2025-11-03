'use client';
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";

//interface province
interface Province {
    code: number;
    name: string;
    division_type: string;
    codename: string;
    phone_code: number;
}

export default function Login () {

    const [provinces, setProvinces] = useState<Province[]>([]); // Thêm type
    const [selectedProvince, setSelectedProvince] = useState("");
    const [search, setSearch] = useState("");
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const [showPassword, setShowPassword] = useState(false);
    const [showRePassword, setShowRePassword] = useState(false);
    const [phone, setPhone] = useState("");

    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        if (/^\d*$/.test(value)) { //only number
            setPhone(value);
        }
    };

    // Fetch danh sách tỉnh/thành
    useEffect(() => {
        fetch('https://provinces.open-api.vn/api/p/')
            .then(res => res.json())
            .then(data => setProvinces(data))
            .catch(err => console.error(err));
    }, []);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const filteredProvinces = provinces.filter(p => 
        p.name.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="w-4/5 mx-auto flex flex-col justify-center">
            <div className="loginInfor flex flex-col mx-auto rounded-2xl px-8">
                <div className="flex flex-col items-center">
                    <p className="text-3xl font-medium text-main mb-6">Đăng Ký</p>
                    <p className="text-center mx-auto">Để hoàn tất đăng ký, quý khách vui lòng điền đầy đủ thông tin vào mẫu dưới đây và nhấn vào nút đăng ký. Xin chân thành cảm ơn quý khách hàng.</p>
                </div>
                <div className="flex flex-col px-12">
                    <form className="flex flex-col mt-4 gap-2 text-lg ">
                        <div className="grid grid-cols-[200px_1fr] items-center gap-4">
                            <label htmlFor="username" className="flex gap-1 font-bold">
                                Họ và tên <p className="text-red-600">(*)</p>
                            </label>
                            <input
                                id="email"
                                type="text"
                                placeholder="Họ và tên"
                                className=" flex-1 justify-center focus:ring-0 focus:outline-none border-b-1 border-gray-300 text-lg p-2"
                            />
                        </div>
                        <div className="grid grid-cols-[200px_1fr] items-center gap-4">
                            <label htmlFor="phone" className="flex gap-1 font-bold">
                                Số điện thoại <p className="text-red-600">(*)</p>
                            </label>
                            <input
                                id="phone"
                                type="tel"
                                value={phone}
                                onChange={handlePhoneChange}
                                placeholder="Số điện thoại"
                                maxLength={10}
                                pattern="[0-9]*"
                                className=" flex-1 justify-center focus:ring-0 focus:outline-none border-b-1 border-gray-300 text-lg p-2 "
                            />
                        </div>
                        <div className="relative grid grid-cols-[200px_1fr] items-center gap-4">
                            <label htmlFor="password" className="flex gap-1 font-bold">
                                Mật khẩu <p className="text-red-600">(*)</p>
                            </label>
                            <input
                                id="password"
                                type={showPassword ? "text" : "password"}
                                placeholder="Mật khẩu"
                                className=" flex-1 justify-center focus:ring-0 focus:outline-none border-b-1 border-gray-300 text-lg p-2 "
                            />
                            {/*Toggle Password */}
                            <div 
                                className="absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? (
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
                                    </svg>
                                ):(
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                                    </svg>
                                )}
                            </div>
                        </div>
                        <div className="relative grid grid-cols-[200px_1fr] items-center gap-4">
                            <label htmlFor="rePassword" className="flex gap-1 font-bold">
                                Nhập lại mật khẩu <p className="text-red-600">(*)</p>
                            </label>
                            <input
                                id="rePassword"
                                type={showRePassword ? "text" : "password"}
                                placeholder="Nhập lại mật khẩu"
                                className=" flex-1 justify-center focus:ring-0 focus:outline-none border-b-1 border-gray-300 text-lg p-2 "
                            />
                            {/*Toggle RePassword */}
                            <div 
                                className="absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer"
                                onClick={() => setShowRePassword(!showRePassword)}
                            >
                                {showRePassword ? (
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
                                    </svg>
                                ):(
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                                    </svg>
                                )}
                            </div>
                        </div>
                        <div className="grid grid-cols-[200px_1fr] items-center gap-4">
                            <label htmlFor="dateOfBirth" className="flex gap-1 font-bold">
                                Ngày Sinh <p className="text-red-600">(*)</p>
                            </label>
                            <input
                                id="dateOfBirth"
                                type="date"
                                placeholder="mm/dd/yyyy"
                                className=" flex-1 justify-center focus:ring-0 focus:outline-none border-b-1 border-gray-300 text-lg p-2 date-input"
                            />
                        </div>
                        <div className="grid grid-cols-[200px_1fr] items-center gap-4 relative" ref={dropdownRef}>
                            <label htmlFor="province" className="flex gap-1 font-bold w-48">
                                Tỉnh/Thành <p className="text-red-600">(*)</p>
                            </label>
                            <div className="flex-1 relative">
                                <input
                                    type="text"
                                    value={selectedProvince || search}
                                    onChange={(e) => {
                                        setSearch(e.target.value);
                                        setSelectedProvince("");
                                        setIsOpen(true);
                                    }}
                                    onFocus={() => setIsOpen(true)}
                                    placeholder="Chọn tỉnh / thành..."
                                    className="w-full focus:ring-0 focus:outline-none border-b-1 border-gray-200 text-lg p-2 pr-8"
                                />                              
                               

                                {isOpen && (
                                    <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-64 overflow-y-auto">
                                        {filteredProvinces.length > 0 ? (
                                            filteredProvinces.map((p) => (
                                                <div
                                                    key={p.code}
                                                    onClick={() => {
                                                        setSelectedProvince(p.name);
                                                        setSearch("");
                                                        setIsOpen(false);
                                                    }}
                                                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-lg border-b border-gray-100 last:border-b-0"
                                                >
                                                    {p.name}
                                                </div>
                                            ))
                                        ) : (
                                            <div className="px-4 py-2 text-sm text-gray-500">
                                                Không tìm thấy kết quả
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>  
                    </form>
                    <div className="flex text-sm gap-1 mt-10 items-center justify-center">
                        <p className="font-bold">bạn đã có tài khoản?</p>
                        <Link href="/auth/login" className="text-main italic cursor-pointer">Đăng nhập ngay</Link>
                    </div>
                    <button className="p-4 px-12 mt-4 button-blue ">ĐĂNG KÝ</button>
                    <p className="flex text-sm font-bold my-4 items-center justify-center">Hoặc</p>
                    <button className="p-4 px-8 bg-white border-2 border-gray-300 rounded-[10px] cursor-pointer hover:bg-gray-100">
                        <Image src="/google.png" alt="google-icon" width={20} height={20} className="inline-block mr-2 mb-1"/>
                        Đăng ký với Google
                    </button>
                </div>
            </div>
        </div>
    )
}