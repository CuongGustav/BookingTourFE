'use client'

import { AccountInforListAdmin } from "@/app/types/account";

interface ModalReadAccountAdminProps {
    account: AccountInforListAdmin | null;
    onClose: () => void;
}

export default function ModalReadAccountAdmin({ account , onClose }: ModalReadAccountAdminProps) {


    //convert gender before display
    const formatGender = (gender: string | null | undefined) => {
        if (!gender) return <span className="text-gray-400">—</span>;
        const map: Record<string, string> = { MALE: "Nam", FEMALE: "Nữ", OTHER: "Khác" };
        return map[gender] || gender;
    };
    //convert date before display
    const formatDate = (dateStr: string | null | undefined) => {
        if (!dateStr) return <span className="text-gray-400">—</span>;
        try {
            return new Date(dateStr).toLocaleDateString("vi-VN");
        } catch {
            return dateStr;
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50" onClick={onClose}>
            <div
                className="bg-white rounded-xl p-6 w-full max-w-2xl mx-4 relative shadow-2xl"
                onClick={(e) => e.stopPropagation()}
            >
                <h1 className="text-2xl font-bold mb-2 text-main">Thông tin tài khoản</h1>
                <button
                    onClick={onClose}
                    className="absolute top-6 right-6 cursor-pointer hover:text-red-600 transition"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
                <div className="flex flex-col gap-4 py-4">
                    <div className="flex border-b-2 border-gray-300 pb-2 gap-2">
                        <div className="flex w-1/2 items-center gap-2 ">
                            <p className="w-[120px] font-medium">Họ Tên:</p>
                            <span>{account?.full_name}</span>    
                        </div>
                        <div className="flex w-1/2 items-center gap-2">
                            <p className="w-[120px] font-medium">Email:</p>               
                            <span>{account?.email}</span> 
                        </div>
                    </div>
                    <div className="flex border-b-2 border-gray-300 pb-2 gap-2">
                        <div className="flex w-1/2 items-center gap-2 ">
                            <p className="w-[120px] font-medium">Số điện thoại:</p>
                            <span>{account?.phone}</span>    
                        </div>
                        <div className="flex w-1/2 items-center gap-2">
                            <p className="w-[120px] font-medium">CCCD:</p>               
                            <span>{account?.cccd}</span> 
                        </div>
                    </div>
                    <div className="flex border-b-2 border-gray-300 pb-2 gap-2">
                        <div className="flex w-1/2 items-center gap-2 ">
                            <p className="w-[120px] font-medium">Giới tính:</p>
                            <span>{formatGender(account?.gender)}</span>    
                        </div>
                        <div className="flex w-1/2 items-center gap-2">
                            <p className="w-[120px] font-medium">Ngày sinh:</p>               
                            <span>{formatDate(account?.date_of_birth)}</span> 
                        </div>
                    </div>
                    <div className="flex border-b-2 border-gray-300 pb-2 gap-2">
                        <div className="flex w-1/2 items-center gap-2 ">
                            <p className="w-[120px] font-medium">Địa chỉ:</p>
                            <span>{account?.address}</span>    
                        </div>
                        <div className="flex w-1/2 items-center gap-2">
                            <p className="w-[120px] font-medium">Vai trò:</p>               
                            <span>{account?.role_account === "QCADMIN" ? "Quản trị viên" : "Người dùng"}</span> 
                        </div>
                    </div>
                    <div className="flex border-b-2 border-gray-300 pb-2 gap-2">
                        <div className="flex w-1/2 items-center gap-2 ">
                            <p className="w-[120px] font-medium">Trạng thái:</p>
                            <span>{account?.is_active ? "Hoạt động" : "Bị khóa"}</span>    
                        </div>
                        <div className="flex w-1/2 items-center gap-2">
                            <p className="w-[120px] font-medium">Ngày tạo:</p>               
                            <span>{formatDate(account?.created_at)}</span> 
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
