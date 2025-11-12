'use client';
import Link from "next/link";
import Image from "next/image";
import React, { useState } from "react";
import { useRouter} from "next/navigation";

const API_URL = process.env.NEXT_PUBLIC_URL_API;

export default function Login () {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [emailTouched, setEmailTouched] = useState(false);
    const [passwordTouched, setPasswordTouched] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const router = useRouter()

    const handleEmailFocus = () => {
        setEmailTouched(true);
    };
    const handlePasswordFocus = () => {
        setPasswordTouched(true);
    };

    // check before login
    const handleLogin = async (e: React.FormEvent) =>{
        e.preventDefault();

        setEmailTouched(true);
        setPasswordTouched(true);
        setError('')

        if (!email.trim() || !password.trim()) return;
        try {
            const res = await fetch(`${API_URL}/auth/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: 'include',
                body: JSON.stringify({ email, password }), 
            });

            const data = await res.json();
            if (res.ok) {
                await fetch(`${API_URL}/auth/whoami`, { credentials: 'include' });
                router.push("/");
            } else {
                setError(data.message || 'Đăng nhập thất bại!');
            }
        } catch (err){
            setError('Không thể kết nối với máy chủ!');
            console.log("Lỗi kết nối: ", err)
        }
    }

    return (
        <div className="w-4/5 mx-auto flex flex-col justify-center">
            <div className="relative loginInfor flex flex-col items-center mx-auto rounded-2xl shadow-[0_0_20px_rgba(0,0,0,0.2)] p-8 mt-10">
                <p className="text-3xl font-medium text-main">Đăng Nhập</p>
                <form className="flex flex-col mt-4">
                    {/*Email*/}
                    <div>
                        <label htmlFor="email" className="flex gap-1 font-bold">
                            Email hoặc Số điện thoại <p className="text-red-600">*</p>
                        </label>
                        <input
                            id="email"
                            type="text"
                            autoComplete="email"
                            value={email}
                            placeholder="Email hoặc Số điện thoại"
                            className="min-w-[400px] focus:ring-0 focus:outline-none border-b-1 border-gray-200 text-sm py-2 "
                            onChange={(e)=>setEmail(e.target.value)}
                            onBlur={handleEmailFocus}
                        />
                        {emailTouched && email === "" && (
                            <p className="text-red-600 text-sm">Thông tin bắt buộc</p>
                        )}
                    </div>
                    {/* Password */}
                    <div className="relative">
                        <label htmlFor="password" className="flex gap-1 font-bold mt-6">
                            Mật khẩu <p className="text-red-600">*</p>
                        </label>
                        <input 
                            id="password"
                            type={showPassword ? "text" : "password"}
                            autoComplete="current-password"
                            value={password}
                            placeholder="Nhập mật khẩu"
                            className=" min-w-[400px] focus:ring-0 focus:outline-none border-b-1 border-gray-200 text-sm py-2"
                            onChange={(e)=>setPassword(e.target.value)}
                            onBlur={handlePasswordFocus}
                        />
                        {/* Toggle Password */}
                        <div
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer"
                        >
                            {showPassword ? (
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
                                </svg>
                            ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                                </svg>
                            ) }
                        </div>
                        {passwordTouched && password === "" && (
                            <p className="text-red-600 text-sm">Thông tin bắt buộc</p>
                        )}
                    </div>
                </form>
                <div className="flex text-sm gap-1 mt-6">
                    <p className="font-bold">chưa là thành viên?</p>
                    <Link href="/auth/signup" className="text-main italic cursor-pointer">Đăng ký ngay</Link>
                </div>
                    {/* Error Message */}
                    {error && <p className="text-red-600 text-sm mt-4">{error}</p>}
                    <button 
                        className="p-4 px-12 mt-6 button-blue"
                        onClick={handleLogin}
                    >
                        ĐĂNG NHẬP
                    </button>
                    <p className="text-sm font-bold my-4 ">Hoặc</p>
                    <button className="p-4 px-8 bg-white border-2 border-gray-200 rounded-[10px] cursor-pointer hover:bg-gray-100">
                        <Image src="/google.png" alt="google-icon" width={20} height={20} className="inline-block mr-2 mb-1"/>
                        Đăng nhập với Google
                    </button>

            </div>
        </div>
    )
}