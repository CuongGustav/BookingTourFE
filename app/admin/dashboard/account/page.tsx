'use client'

import { useEffect, useState} from "react"
import { AccountInfo } from "../../../types/account"
import ModalUpdateAccount from "@/app/(user)/account/information/account.modalUpdateAccount";
import ChangePasswordPage from "./ChangPassword";

const API_URL = process.env.NEXT_PUBLIC_URL_API;

export default function InformationAccoutPage () {

    const [accountInfo, setAccountInfo] = useState<AccountInfo | null>(null);
    const [day, setDay] = useState("");
    const [month, setMonth] = useState("");
    const [year, setYear] = useState("");
    const [isModalUpdateOpen, setIsModalUpdateOpen] = useState(false)
    const [isModalChangePasswordOpen, setIsModalChangePasswordOpen] = useState(false)


    const getGenderName = (value: string) => {
        if (!value) return "Chưa xác định";
        switch (value.toLowerCase()) {
            case "male":
                return "Nam";
            case "female":
                return "Nữ";
            case "other":
                return "Khác";
            default:
                return value; 
        }
    };

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

    useEffect(() => {
        fetchAccountInfo();
    }, []);

    const formatDate = () => {
        return day && month && year ? `${day}/${month}/${year}` : "";
    };

    if (!accountInfo) {
        return <div>Đang tải thông tin...</div>;
    }

    return (
        <div className="w-ful rounded py-2 px-4">
            <div className="flex flex-col border-b-2 border-gray-300 pb-2">
                <h1 className="text-lg font-semibold">Thông tin cá nhân</h1>
                <p>Hãy quản lý thông tin cá nhân của bạn một cách cẩn thận</p>
            </div>
            <div className="flex flex-col gap-4 py-4">
                <div className="flex border-b-2 border-gray-300 pb-2 gap-2">
                    <div className="flex w-1/2 items-center gap-2 ">
                        <p className="w-[120px] font-medium">Họ Tên:</p>
                        <span>{accountInfo.full_name}</span>    
                    </div>
                    <div className="flex w-1/2 items-center gap-2">
                        <p className="w-[120px] font-medium">Email:</p>               
                        <span>{accountInfo.email}</span> 
                    </div>
                </div>
                <div className="flex border-b-2 border-gray-300 pb-2 gap-2">
                    <div className="flex w-1/2 items-center gap-2">
                        <p className="w-[120px] font-medium">Ngày Sinh:</p> 
                        <span>{formatDate()}</span>
                    </div>
                    <div className="flex w-1/2 items-center gap-2">
                        <p className="w-[120px] font-medium">Điện Thoại:</p>
                        <span>{accountInfo.phone}</span>
                    </div>
                </div>
                <div className="flex border-b-2 border-gray-300 pb-2 gap-2 ">
                    <div className="flex w-1/2 items-center gap-2">
                        <p className="w-[120px] font-medium">Địa Chỉ:</p>
                        <span>{accountInfo.address}</span>
                    </div>
                    <div className="flex w-1/2 items-center gap-2">
                        <p className="w-[120px] font-medium">CMND/CCCD:</p>
                        <span>{accountInfo.cccd}</span>
                    </div>
                </div>
                <div className="flex border-b-2 border-gray-300 pb-2 gap-2">
                    <div className="flex w-1/2 items-center gap-2">
                        <p className="w-[120px] font-medium">Giới Tính:</p>
                        <span>{getGenderName(accountInfo.gender)}</span>
                    </div>
                    <div className="flex w-1/2 items-center gap-2">
                        <p className="font-medium">Tổng Số Tour Đã Đi:</p>
                        <span>{accountInfo.tour_booked}</span>
                    </div>
                </div>
                <div className="float-left flex flex-col gap-4">
                    <button 
                        className="p-4 px-8 cursor-pointer button-blue w-[240px]" 
                        onClick={() => setIsModalUpdateOpen(true)}
                    >
                        Chỉnh Sửa Thông Tin
                    </button>
                    <button 
                        className="p-4 px-8 cursor-pointer button-blue w-[240px]" 
                        onClick={() => setIsModalChangePasswordOpen(true)}
                    >
                        Đổi Mật Khẩu
                    </button>
                </div>
            </div>
            {isModalUpdateOpen && (
                <ModalUpdateAccount
                    accountInfo={accountInfo}
                    onClose={() => setIsModalUpdateOpen(false)}
                    onUpdated={() => {
                        fetchAccountInfo()
                        setIsModalUpdateOpen(false)
                    }}
                />
            )}
            {isModalChangePasswordOpen && (
                <ChangePasswordPage
                    onClose={() => setIsModalChangePasswordOpen(false)}
                    onUpdated={() => {
                        fetchAccountInfo()
                        setIsModalUpdateOpen(false)
                    }}
                />
            )}
        </div>
    )
}