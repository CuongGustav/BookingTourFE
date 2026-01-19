'use client';
import { useState } from "react";

const API_URL = process.env.NEXT_PUBLIC_URL_API;

interface ModalUpdateAccountProps {
    onClose: () => void;
    onUpdated: () => void;
}

export default function ChangePasswordPage({ onClose, onUpdated }: ModalUpdateAccountProps) {
 
    const [password, setPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleChangePassword = async () => {
        setError('');

        if ( password.trim()  === "" || newPassword.trim() === "" || confirmNewPassword.trim() === "" ) {
            setSuccess('');
            setError('Vui lòng điền đầy đủ thông tin');
            return;
        }
        else if ( newPassword !== confirmNewPassword ) {
            setSuccess('');
            setError('Mật khẩu mới không khớp');
            return;
        }
        else if ( newPassword.trim() === password.trim() ) {
            setSuccess('');
            setError('Mật khẩu mới không được trùng với mật khẩu cũ');
            return;
        } 
        else {
            try {
                const res = await fetch(`${API_URL}/account/changepassword`,{
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include',
                    body: JSON.stringify({
                        "password": password,
                        "new_password": newPassword
                    }),
                })
                const data = await res.json();
                if( res.ok) {
                    onUpdated();
                    setError('');
                    setSuccess('Đổi mật khẩu thành công');
                } else{
                    setSuccess('');
                    setError(data.message || 'Đổi mật khẩu thất bại');
                }
            } catch (err) {
                setError('Đã có lỗi xảy ra. Vui lòng thử lại sau.' + err);
            }
        }

    }

    return (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50" onClick={onClose}>
            <div
                className="bg-white rounded-xl p-8 w-full max-w-4xl mx-4 relative shadow-2xl"
                onClick={(e) => e.stopPropagation()}
            >
                <h2 className="text-2xl font-bold text-blue-600 mb-6 text-center">Cập nhật mật khẩu</h2>
                <button
                    onClick={onClose}
                    className="absolute top-6 right-6 cursor-pointer hover:text-red-600 transition"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
                <div className="flex flex-col gap-4 max-w-4xl">
                    <div className="flex gap-4">
                        {/* password */}
                        <div className="flex w-1/2 items-center gap-2 relative">
                            <label className="w-[180px] font-medium">Mật khẩu cũ:</label>
                            <input 
                                type={showPassword ? "text" : "password"}
                                className="flex-1 outline-none focus:outline-none"
                                placeholder="Nhập mật khẩu cũ"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
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
                        </div>
                        {/* new password */}
                        <div className="flex w-1/2 items-center gap-2 relative">
                            <p className="w-[180px] font-medium">Mật khẩu mới:</p>
                            <input 
                                type={showNewPassword ? "text" : "password"}
                                className="flex-1 outline-none focus:outline-none"
                                placeholder="Nhập mật khẩu mới"
                                value={newPassword}
                                onChange={(e)=>{setNewPassword(e.target.value)}}
                            />
                            <div
                                onClick={() => setShowNewPassword(!showNewPassword)}
                                className="absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer"
                            >
                                {showNewPassword ? (
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
                    </div>
                    {/* re new password */}
                    <div className="flex gap-4">
                        <div className="flex w-1/2 items-center gap-2 relative">
                            <p className="w-[180px] font-medium">Nhập lại mật khẩu mới:</p> 
                            <input 
                                type={showConfirmNewPassword ? "text" : "password"}
                                className="flex-1 outline-none focus:outline-none"
                                placeholder="Nhập lại mật khẩu mới"
                                value={confirmNewPassword}
                                onChange={(e)=>{setConfirmNewPassword(e.target.value)}}
                            />
                            <div
                                onClick={() => setShowConfirmNewPassword(!showConfirmNewPassword)}
                                className="absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer"
                            >
                                {showConfirmNewPassword ? (
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
                        <div className="flex flex-col w-1/2 items-center">
                            <button 
                                className="flex-1 rounded button-blue px-4 py-2 w-full"
                                onClick={handleChangePassword}
                            >
                                ĐỔI MẬT KHẨU
                            </button>
                        </div>
                        
                    </div>
                    <div className="flex justify-between m-auto">
                        {error && (
                                <p className="text-red-600 ml-4">{error}</p>
                        )}
                        {success && (
                                <p className="text-green-600 ml-4">{success}</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}