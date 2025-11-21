'use client'

import { useEffect, useState } from "react"
import { AccountInfo } from "../../../types/account"

const API_URL = process.env.NEXT_PUBLIC_URL_API;

export default function InformationAccoutPage () {

    const [isEditing, setIsEditing] =  useState(false);
    const [accountInfo, setAccountInfo] = useState<AccountInfo | null>(null);
    const [day, setDay] = useState("");
    const [month, setMonth] = useState("");
    const [year, setYear] = useState("");

    useEffect(() => {
        const fetchAccountInfo = async () => {
            try {
                const res = await fetch(`${API_URL}/account/information`, {
                    method: "GET",
                    credentials: 'include', // Thêm JWT token từ cookie
                })
                if (res.ok) {
                    const data = await res.json();
                    setAccountInfo(data);

                    if (data.date_of_birth) {
                        const [y,m,d] = data.date_of_birth.split('-');
                        setDay(d);
                        setMonth(m);
                        setYear(y);
                    }
                } else {
                    console.error("Lấy thông tin thất bại.");
                }
            } catch (err){
                console.error("Lỗi khi kết nối tới server.", err);
            }
        };
        fetchAccountInfo();
    }, []);

    const formatDate = () => {
        return day && month && year ? `${day}/${month}/${year}` : "";
    };

    if (!accountInfo) {
        return <div>Đang tải thông tin...</div>;
    }

    return (
        <div className="w-full border border-gray-300 rounded py-2 px-4">
            <div className="flex flex-col border-b-2 border-gray-300 pb-2">
                <h1 className="text-lg font-semibold">Thông tin cá nhân</h1>
                <p>Hãy quản lý thông tin cá nhân của bạn một cách cẩn thận</p>
            </div>
            <div className="flex flex-col gap-4 py-4">
                <div className="flex border-b-2 border-gray-300 pb-2 gap-2">
                    <div className="flex w-1/2 items-center gap-2 ">
                        <p className="w-[120px] font-medium">Họ Tên:</p>
                        {isEditing ? (
                            <input 
                                type="text" 
                                className="flex-1 outline-none focus:outline-none"
                            />
                        ) : (
                            <span>{accountInfo.full_name}</span>
                        )}     
                    </div>
                    <div className="flex w-1/2 items-center gap-2">
                        <p className="w-[120px] font-medium">Email:</p>
                        {isEditing ? (
                            <input 
                                type="text" 
                                className="flex-1 outline-none focus:outline-none"
                            />
                        ) : (
                            <span>{accountInfo.email}</span>
                        )}
                    </div>
                </div>
                <div className="flex border-b-2 border-gray-300 pb-2 gap-2">
                    <div className="flex w-1/2 items-center gap-2">
                        <p className="w-[120px] font-medium">Ngày Sinh:</p> 
                        {isEditing ? (
                            <input 
                                type="text" 
                                className="flex-1 outline-none focus:outline-none"
                            />
                        ) : (
                            <span>{formatDate()}</span>
                        )}
                    </div>
                    <div className="flex w-1/2 items-center gap-2">
                        <p className="w-[120px] font-medium">Điện Thoại:</p>
                        {isEditing ? (
                            <input 
                                type="text" 
                                value={accountInfo.phone}
                                className="flex-1 outline-none focus:outline-none"
                            />
                        ) : (
                            <span>{accountInfo.phone}</span>
                        )}
                    </div>
                </div>
                <div className="flex border-b-2 border-gray-300 pb-2 gap-2 ">
                    <div className="flex w-1/2 items-center gap-2">
                        <p className="w-[120px] font-medium">Địa Chỉ:</p>
                        {isEditing ? (
                            <input 
                                type="text" 
                                className="flex-1 outline-none focus:outline-none"
                            />
                        ) : (
                            <span>{accountInfo.address}</span>
                        )}
                    </div>
                    <div className="flex w-1/2 items-center gap-2">
                        <p className="w-[120px] font-medium">CMND/CCCD:</p>
                        {isEditing ? (
                            <input 
                                type="text" 
                                className="flex-1 outline-none focus:outline-none"
                            />
                        ) : (
                            <span>{accountInfo.cccd}</span>
                        )}
                    </div>
                </div>
                <div className="flex border-b-2 border-gray-300 pb-2 gap-2">
                    <div className="flex w-1/2 items-center gap-2">
                        <p className="w-[120px] font-medium">Giới Tính:</p>
                        {isEditing ? (
                            <input 
                                type="text" 
                                className="flex-1 outline-none focus:outline-none"
                            />
                        ) : (
                            <span>{accountInfo.gender}</span>
                        )}

                    </div>
                    <div className="flex w-1/2 items-center gap-2">
                        <p className="font-medium">Tổng Số Tour Đã Đi:</p>
                        <span>{accountInfo.tour_booked}</span>
                    </div>
                </div>
                <div className="float-left ">
                    {isEditing ? (
                        <div className="flex gap-4">
                            <button
                                onClick={() => setIsEditing(false)}
                                className="p-4 px-8 cursor-pointer button-red"
                            >
                                Hủy
                            </button>
                            <button 
                                className="p-4 px-8 cursor-pointer button-blue"
                            >
                                Cập Nhật
                            </button>
                        </div>
                    ) : (
                        <button 
                            className="p-4 px-8 cursor-pointer button-blue"
                            onClick={() => setIsEditing(true)}    
                        >
                            Chỉnh Sửa Thông Tin
                        </button>
                    )}
                </div>
            </div>
        </div>
    )
}