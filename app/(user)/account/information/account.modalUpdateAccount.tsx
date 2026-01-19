'use client'

import React, { useState, useEffect, useRef } from "react";
import { AccountInfo } from "@/app/types/account";
import { gendersData} from "@/app/data/gender";
import { provincesData } from "@/app/data/province";

interface ModalUpdateAccountProps {
    accountInfo: AccountInfo;
    onClose: () => void;
    onUpdated: () => void;
}

const API_URL = process.env.NEXT_PUBLIC_URL_API;

export default function ModalUpdateAccount({ accountInfo, onClose, onUpdated }: ModalUpdateAccountProps) {

    const getGenderName = (value: string) => {
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

    const [fullName, setFullName] = useState(accountInfo.full_name || "");
    const [email, setEmail] = useState(accountInfo.email || "");
    const [phone, setPhone] = useState(accountInfo.phone || "");
    const [cccd, setCCCD] = useState(accountInfo.cccd || "");
    
    const [selectGender, setSelectGender] = useState(
        accountInfo.gender ? getGenderName(accountInfo.gender) : ""
    );
    const [genderValue, setGenderValue] = useState(
        accountInfo.gender ? accountInfo.gender.toLowerCase() : ""
    );

    const [isOpenGender, setIsOpenGender] = useState(false);
    const genderRef = useRef<HTMLDivElement>(null);

    const [selectedProvince, setSelectedProvince] = useState(accountInfo.address || "");
    const [provinceSearch, setProvinceSearch] = useState("");
    const [isOpenProvince, setIsOpenProvince] = useState(false);
    const provinceRef = useRef<HTMLDivElement>(null);

    const [selectDay, setSelectDay] = useState<number | null>(null);
    const [selectMonth, setSelectMonth] = useState<number | null>(null);
    const [year, setYear] = useState<string>("");
    const [days, setDays] = useState<number[]>([]);
    
    const [isOpenDay, setIsOpenDay] = useState(false);
    const [isOpenMonth, setIsOpenMonth] = useState(false);
    const dayRef = useRef<HTMLDivElement>(null);
    const monthRef = useRef<HTMLDivElement>(null);

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (accountInfo.date_of_birth) {
            const [y, m, d] = accountInfo.date_of_birth.split("-").map(Number);
            setYear(String(y));
            setSelectMonth(m);
            setSelectDay(d);
        }
    }, [accountInfo]);

    const yearNum = parseInt(year)
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

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (genderRef.current && !genderRef.current.contains(e.target as Node)) setIsOpenGender(false);
            if (provinceRef.current && !provinceRef.current.contains(e.target as Node)) setIsOpenProvince(false);
            if (dayRef.current && !dayRef.current.contains(e.target as Node)) setIsOpenDay(false);
            if (monthRef.current && !monthRef.current.contains(e.target as Node)) setIsOpenMonth(false);
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const filteredProvinces = provincesData.filter(p =>
        p.name.toLowerCase().includes(provinceSearch.toLowerCase())
    );

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
            full_name: fullName,
            email,
            phone,
            cccd,
            gender: genderValue,
            address: selectedProvince,
            date_of_birth: `${yearNum}-${String(selectMonth).padStart(2, "0")}-${String(selectDay).padStart(2, "0")}`,
        };

        setLoading(true);
        try {
            const res = await fetch(`${API_URL}/account/update`, {
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
                className="bg-white rounded-xl p-8 w-full max-w-2xl mx-4 relative shadow-2xl"
                onClick={(e) => e.stopPropagation()}
            >
                <h2 className="text-2xl font-bold text-blue-600 mb-6 text-center">Cập nhật thông tin tài khoản</h2>
                <button
                    onClick={onClose}
                    className="absolute top-6 right-6 cursor-pointer hover:text-red-600 transition"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
                <div className="flex flex-col pb-2 gap-2">
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
                        <label className="w-[120px] font-medium">Số điện thoại:</label>
                        <input
                            type="tel"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 11))}
                            maxLength={11}
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
                    {/* Ngày sinh */}
                    <div className="flex items-center gap-2 border-b-2 border-gray-300 pb-2">
                        <label className="w-[120px] font-medium">Ngày Sinh:</label>
                        <div className="flex gap-3 flex-1">
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
                    {/* Gender */}
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
                </div>
                {/* button */}
                <div className="flex justify-end gap-4 mt-8">
                    <button
                        onClick={onClose}
                        className="cursor-pointer px-6 py-3 border border-gray-400 rounded-lg hover:bg-gray-100 transition"
                    >
                        Hủy
                    </button>
                    <button
                        onClick={handleUpdate}
                        disabled={loading}
                        className={`cursor-pointer px-8 py-3 bg-blue-800 text-white rounded-lg hover:bg-blue-600 transition ${loading ? "opacity-70 cursor-not-allowed" : ""}`}
                    >
                        {loading ? "Đang cập nhật..." : "Cập nhật"}
                    </button>
                </div>
            </div>
        </div>
    );
}