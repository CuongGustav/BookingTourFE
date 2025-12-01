'use client'

import { AccountInforListAdmin } from "@/app/types/account";
import { useState, useRef, useEffect } from "react";
import { gendersData } from "@/app/data/gender";
import { provincesData } from "@/app/data/province";

interface ModalUpdateAccountAdminProps {
    account: AccountInforListAdmin | null;
    onClose: () => void;
    onUpdated: () => void;
}

const API_URL = process.env.NEXT_PUBLIC_URL_API;

export default function ModalUpdateAccountAdmin ({account, onClose, onUpdated} : ModalUpdateAccountAdminProps) {

    const uuid = account?.account_id || ""
    const [fullName, setFullName] = useState(account?.full_name || "" )
    const [email, setEmail] = useState(account?.email || "")
    const [phone, setPhone] = useState(account?.phone || "")
    const [cccd, setCCCD] = useState(account?.cccd || "")
    const [days, setDays] = useState<number[]>([]);
    const [selectDay, setSelectDay] = useState<number | null>(null);
    const [isOpenDay, setIsOpenDay] = useState(false);
    const dayRef = useRef<HTMLDivElement>(null);
    const [selectMonth, setSelectMonth] = useState<number | null>(null);
    const [isOpenMonth, setIsOpenMonth] = useState(false);
    const monthRef = useRef<HTMLDivElement>(null);
    const [year, setYear] = useState<string>("");
    const yearNum = parseInt(year)
    const [isActive, setIsActive] = useState<boolean | null>(null);
    const [isOpenActive, setIsOpenActive] = useState(false);
    const activeRef = useRef<HTMLDivElement>(null);
    
    const [selectGender, setSelectGender] = useState<string>("");      
    const [genderValue, setGenderValue] = useState<string>("");         
    const [isOpenGender, setIsOpenGender] = useState(false);
    const genderRef = useRef<HTMLDivElement>(null);
    const [selectedProvince, setSelectedProvince] = useState(account?.address || "");
    const [provinceSearch, setProvinceSearch] = useState("");
    const [isOpenProvince, setIsOpenProvince] = useState(false);
    const provinceRef = useRef<HTMLDivElement>(null);

    const [loading, setLoading] = useState(false);
    
    useEffect(() => {
        // set d,m,y when open modal
        if (account?.date_of_birth) {
            const [y, m, d] = account?.date_of_birth.split("-").map(Number);
            setYear(String(y));
            setSelectMonth(m);
            setSelectDay(d);
        }
        // set gender when open modal
        if (account?.gender) {
            const map: Record<string, string> = { MALE: "Nam", FEMALE: "Nữ", OTHER: "Khác" };

            setSelectGender(map[account.gender] || "");
            setGenderValue(account.gender); 
        }
        // set active when open modal
        if (account?.is_active !== undefined) {
            setIsActive(account.is_active);
        }
    }, [account]);
    useEffect(() => {
        if (selectMonth && year) {
            const daysInMonth = new Date(yearNum, selectMonth, 0).getDate();
            const newDays = Array.from({ length: daysInMonth }, (_, i) => i + 1);
            setDays(newDays);
            if (selectDay && selectDay > daysInMonth) {
                setSelectDay(null);
            }
        } else {
            setDays(Array.from({ length: 31 }, (_, i) => i + 1));
        }
    }, [selectDay, selectMonth, year, yearNum]);

    //convert date before display
    const formatDate = (dateStr: string | null | undefined) => {
        if (!dateStr) return <span className="text-gray-400">—</span>;
        try {
            return new Date(dateStr).toLocaleDateString("vi-VN");
        } catch {
            return dateStr;
        }
    };

    const filteredProvinces = provincesData.filter(p =>
        p.name.toLowerCase().includes(provinceSearch.toLowerCase())
    );

    //click outside
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (genderRef.current && !genderRef.current.contains(e.target as Node)) setIsOpenGender(false);
            if (provinceRef.current && !provinceRef.current.contains(e.target as Node)) setIsOpenProvince(false);
            if (dayRef.current && !dayRef.current.contains(e.target as Node)) setIsOpenDay(false);
            if (monthRef.current && !monthRef.current.contains(e.target as Node)) setIsOpenMonth(false);
            if (activeRef.current && !activeRef.current.contains(e.target as Node)) setIsOpenActive(false);
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleUpdate = async () => {
        if (!fullName || !email || !phone || !cccd || !selectGender || !selectedProvince || !selectDay || !selectMonth || !year) {
            alert("Vui lòng điền đầy đủ thông tin bắt buộc!");
            return;
        }
        if (!yearNum || yearNum < 1900 || yearNum > new Date().getFullYear()) {
            alert("Năm sinh không hợp lệ!");
            return;
        }

        const payload = {
            account_id: uuid,
            full_name: fullName,
            email,
            phone,
            cccd,
            gender: genderValue,
            address: selectedProvince,
            date_of_birth: `${yearNum}-${String(selectMonth).padStart(2, "0")}-${String(selectDay).padStart(2, "0")}`,
            is_active: isActive,
        };

        setLoading(true);
        try {
            const res = await fetch(`${API_URL}/account/admin/update`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify(payload),
            });

            const data = await res.json();
            if (res.ok) {
                alert("Cập nhật thông tin thành công!");
                onUpdated();
                onClose();
            } else {
                alert(data.message || "Cập nhật thất bại!");
            }
        } catch (err) {
            console.error(err);
            alert("Không thể kết nối tới server!");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50" onClick={onClose}>
            <div
                className="bg-white rounded-xl p-6 w-auto mx-4 relative shadow-2xl h-98/100"
                onClick={(e) => e.stopPropagation()}
            >
                <h1 className="text-2xl font-bold mb-2 text-main">Cập nhật tài khoản</h1>
                <button
                    onClick={onClose}
                    className="absolute top-6 right-6 cursor-pointer hover:text-red-600 transition"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
                {/* information */}
                <div className="flex flex-col my-2 gap-[6px] px-2 ">
                    {/* full name */}
                    <div className="flex items-center gap-2 border-b-2 border-gray-300">
                        <label className="w-[120px] font-medium">Họ Tên:</label>
                        <input
                            type="text"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            className="flex-1 p-3 rounded focus:outline-none"
                            placeholder="Nhập họ và tên"
                        />   
                    </div>
                    {/* Email */}
                    <div className="flex items-center gap-2 border-b-2 border-gray-300">
                        <label className="w-[120px] font-medium">Email:</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="flex-1 p-3 rounded focus:outline-none"
                            placeholder="Nhập email"
                        />
                    </div>
                    {/* Phone */}
                    <div className="flex items-center gap-2 border-b-2 border-gray-300">
                        <label className="w-[120px] font-medium">Phone:</label>
                        <input
                            type="tel"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 11))}
                            className="flex-1 p-3 rounded focus:outline-none"
                            placeholder="Nhập số điện thoại"
                        />
                    </div>
                    {/* CCCD */}
                    <div className="flex items-center gap-2 border-b-2 border-gray-300">
                        <label className="w-[120px] font-medium">CCCD/CMND:</label>
                        <input
                            type="text"
                            value={cccd}
                            onChange={(e) => setCCCD(e.target.value.replace(/\D/g, "").slice(0, 12))}
                            maxLength={12}
                            className="flex-1 p-3 rounded focus:outline-none"
                        />
                    </div>
                    {/* date of birth */}
                    <div className="flex items-center gap-2 border-b-2 border-gray-300 pb-2">
                        <label className="w-[120px] font-medium">Ngày Sinh:</label>
                        <div className="flex gap-3 flex-1">
                            {/* day */}
                            <div className="relative" ref={dayRef}>
                                <input
                                    type="text"
                                    placeholder="Ngày"
                                    value={selectDay ?? ""}
                                    onFocus={() => setIsOpenDay(true)}
                                    onChange={(e) => {
                                        const val = parseInt(e.target.value);
                                        if (!isNaN(val) && val >= 1 && val <= days.length) setSelectDay(val);
                                        else if (e.target.value === "") setSelectDay(null);
                                    }}
                                    className="w-24 p-3 border border-gray-300 rounded-lg text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                {isOpenDay && (
                                    <div className="absolute top-full mt-1 w-24 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto z-50">
                                        {days.map(d => (
                                            <div
                                                key={d}
                                                onClick={() => { setSelectDay(d); setIsOpenDay(false); }}
                                                className="px-4 py-2 hover:bg-blue-50 cursor-pointer text-center"
                                            >
                                                {d}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                            {/* month */}
                            <div className="relative" ref={monthRef}>
                                <input
                                    type="text"
                                    placeholder="Tháng"
                                    value={selectMonth ?? ""}
                                    onFocus={() => setIsOpenMonth(true)}
                                    onChange={(e) => {
                                        const val = parseInt(e.target.value);
                                        if (!isNaN(val) && val >= 1 && val <= 12) setSelectMonth(val);
                                        else if (e.target.value === "") setSelectMonth(null);
                                    }}
                                    className="w-24 p-3 border border-gray-300 rounded-lg text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                {isOpenMonth && (
                                    <div className="absolute top-full mt-1 w-24 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto z-50">
                                        {[...Array(12)].map((_, i) => i + 1).map(m => (
                                            <div
                                                key={m}
                                                onClick={() => { setSelectMonth(m); setIsOpenMonth(false); }}
                                                className="px-4 py-2 hover:bg-blue-50 cursor-pointer text-center"
                                            >
                                                {m}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                            {/* year */}
                            <input
                                type="text"
                                placeholder="Năm"
                                value={year}
                                onChange={(e) => {
                                    const val = e.target.value.replace(/\D/g, ""); // chỉ cho nhập số
                                    setYear(val);
                                }}
                                className="w-32 p-3 border border-gray-300 rounded-lg text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>
                    {/*gender*/} 
                    <div className="flex items-center gap-2 border-b-2 border-gray-300 pb-2">
                        <label className="w-[120px] font-medium">Giới tính:</label>
                        <div className="flex-1 relative" ref={genderRef}>
                            <input
                                type="text"
                                readOnly
                                value={selectGender}
                                placeholder="Chọn giới tính"
                                onClick={() => setIsOpenGender(!isOpenGender)}
                                className="w-full p-3 border border-gray-300 rounded-lg cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                            />
                            {isOpenGender && (
                                <div className="absolute top-full mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg z-50">
                                    {gendersData.map(g => (
                                        <div
                                            key={g.id}
                                            onClick={() => {
                                                setSelectGender(g.name);                
                                                setGenderValue(g.value.toLowerCase()); 
                                                setIsOpenGender(false);
                                            }}

                                            className="px-4 py-3 hover:bg-blue-50 cursor-pointer"
                                        >
                                            {g.name}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div> 
                    {/* Province */}
                    <div className="flex items-center gap-2 border-b-2 border-gray-300 pb-2">
                        <label className="w-[120px] font-medium">Tỉnh Thành:</label>
                        <div className="flex-1 relative" ref={provinceRef}>
                            <input
                                type="text"
                                readOnly
                                value={selectedProvince || provinceSearch}
                                onChange={(e) => {
                                    setProvinceSearch(e.target.value);
                                    setSelectedProvince("");
                                    setIsOpenProvince(true);
                                }}
                                onFocus={() => setIsOpenProvince(true)}
                                placeholder="Tìm và chọn tỉnh/thành..."
                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            {isOpenProvince && (
                                <div className="absolute bottom-full mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-64 overflow-y-auto z-50">
                                    {filteredProvinces.length > 0 ? (
                                        filteredProvinces.map(p => (
                                            <div
                                                key={p.id}
                                                onClick={() => {
                                                    setSelectedProvince(p.name);
                                                    setProvinceSearch("");
                                                    setIsOpenProvince(false);
                                                }}
                                                className="px-4 py-3 hover:bg-blue-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                                            >
                                                {p.name}
                                            </div>
                                        ))
                                    ) : (
                                        <div className="px-4 py-3 text-gray-500">Không tìm thấy tỉnh/thành</div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div> 
                    {/* is active */}
                    <div className="flex items-center gap-2 border-b-2 border-gray-300 pb-2">
                        <label className="w-[120px] font-medium">Trạng thái:</label>
                        <div className="flex-1 relative" ref={activeRef}>
                            <input
                                type="text"
                                readOnly
                                value={
                                    isActive === null
                                        ? ""
                                        : isActive
                                        ? "Hoạt động"
                                        : "Khóa"
                                }
                                placeholder="Chọn trạng thái"
                                onClick={() => setIsOpenActive(!isOpenActive)}
                                className="w-full p-3 border border-gray-300 rounded-lg cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                            />
                            {isOpenActive && (
                                <div className="absolute top-full mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg z-50">
                                    <div
                                        onClick={() => {
                                            setIsActive(true);
                                            setIsOpenActive(false);
                                        }}
                                        className="px-4 py-3 hover:bg-green-50 cursor-pointer text-green-700"
                                    >
                                        Hoạt động
                                    </div>

                                    <div
                                        onClick={() => {
                                            setIsActive(false);
                                            setIsOpenActive(false);
                                        }}
                                        className="px-4 py-3 hover:bg-red-50 cursor-pointer text-red-700"
                                    >
                                        Khóa
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                    {/* role */}
                    <div className="flex items-center gap-2 border-b-2 border-gray-300">
                        <label className="w-[120px] font-medium">Vai trò:</label>
                        <span className="p-3 cursor-not-allowed flex-1">{account?.role_account === "QCADMIN" ? "Quản trị viên" : "Người dùng"}</span>  
                    </div> 
                    {/* created_at */}
                    <div className="flex items-center gap-2 border-b-2 border-gray-300">
                        <label className="w-[120px] font-medium">Ngày tạo:</label>
                        <span className="p-3 cursor-not-allowed flex-1">{formatDate(account?.created_at)}</span> 
                    </div>  
                </div>
                {/* button */}
                <div className="float-right flex gap-2">
                    <button 
                        className="p-2 border-1 border-gray-400 rounded cursor-pointer hover:bg-gray-400"
                        onClick={onClose}                                   
                    >
                        Hủy
                    </button>
                    <button 
                        className="p-2 border-1 border-gray-400 rounded cursor-pointer hover:bg-blue-600"
                        onClick={handleUpdate}
                        disabled={loading}
                    >
                        {loading ? "Đang cập nhật..." : "Cập nhật"}
                    </button>
                </div>
            </div>
        </div>
    )
}