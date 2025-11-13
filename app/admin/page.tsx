'use client';
import React from "react";
import { useState } from "react";
import { useRouter} from "next/navigation";

const API_URL = process.env.NEXT_PUBLIC_URL_API;

export default function AdminPage() {

    const [email, setEmail] = useState("");
    const [emailTourched, setEmailTourched] = useState(false);
    const [password, setPassword] = useState("");
    const [passwordTourched, setPasswordTourched] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const router = useRouter()

    const handleEmailFocus = () => {
        setEmailTourched(true);
    }
    const handlePasswordFocus = () => {
        setPasswordTourched(true);
    }

    const handleLogin = async () => {
        if (!email || !password) {
            setEmailTourched(true);
            setPasswordTourched(true);
            return;
        }

        try {
            const res = await fetch(`${API_URL}/auth/admin/login`,{
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: 'include',
                body: JSON.stringify({email, password}),
            });

            const data = await res.json();
            if (res.ok) {
                const whoamiRes = await fetch(`${API_URL}/auth/admin/whoami`, {
                    credentials:'include',
                });
                if (whoamiRes.ok) {
                    const userData = await whoamiRes.json();
                    const accountData = userData.identity || userData; 

                    localStorage.setItem('admin', JSON.stringify(accountData));
                    window.dispatchEvent(new CustomEvent('accountUpdated', { 
                        detail: accountData 
                    }));
                    router.push("/admin/dashboard");
                } else {
                    setError("Không thể xác thực phiên đăng nhập!")
                }
            } else {
                setError(data.message || 'Đăng nhập thất bại!');
            }
        } catch (err) {
            setError('Không thể kết nối với máy chủ!');
            console.log("Lỗi kết nối: ", err)
        }
    }

    return(
        <div 
            className="relative bg-cover bg-center bg-no-repeat min-h-screen"
            style={{ backgroundImage: "url('/bgimg.png')"}}
        >
            <div className="absolute top-1/2 left-1/2 -translate-1/2 flex flex-col items-center bg-white/80 p-4 rounded-2xl">
                <div>
                    <p className="text-3xl font-medium text-main">Welcome to the Admin Dashboard</p>
                </div>
                <div className="relative loginInfor flex flex-col items-center p-8 mt-4">
                    <form
                        onSubmit={(e) =>{
                            e.preventDefault();
                            handleLogin()
                        }}
                    > 
                        {/*Email*/}
                        <div>
                            <label htmlFor="email" className="flex gap-1 font-bold">
                                Email hoặc Số điện thoại <p className="text-red-600">*</p>
                            </label>
                            <input
                                id="email"
                                type="text"
                                value= {email}
                                onChange = {(e) => setEmail(e.target.value)}
                                onBlur={handleEmailFocus}
                                placeholder="Email hoặc Số điện thoại"
                                className="min-w-[400px] focus:ring-0 focus:outline-none border-b-1 border-gray-200 text-sm py-2 "
                            />
                            {emailTourched && email === "" && (
                                <p className="text-red-600 text-sm mt-1">Vui lòng nhập email hoặc số điện thoại</p>
                            )}
                        </div>
                        {/* Password */}
                        <div className="relative">
                            <label htmlFor="password" className="flex gap-1 font-bold mt-6">
                                Mật khẩu <p className="text-red-600">*</p>
                            </label>
                            <input 
                                id="password"
                                placeholder="Email hoặc Số điện thoại"
                                type={showPassword ? "text" : "password"}
                                value = {password}
                                onChange={(e)=>{setPassword(e.target.value)}}
                                onBlur={handlePasswordFocus}
                                className=" min-w-[400px] focus:ring-0 focus:outline-none border-b-1 border-gray-200 text-sm py-2"
                            />
                            {passwordTourched && password === "" && (
                                <p className="text-red-600 text-sm mt-1">Vui lòng nhập mật khẩu</p>
                            )}
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
                            {/* Toggle Password */}
                            <div
                                className="absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer"
                            >
                            </div>
                        </div>
                        <div className="flex flex-col items-center">
                            {error && <p className="text-red-600 text-sm mt-4">{error}</p>}
                            <button className="p-4 px-12 mt-6 button-blue w-[200px]" type="submit" onClick={handleLogin}>ĐĂNG NHẬP</button> 
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}