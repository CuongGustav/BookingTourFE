'use client';
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { Province, Gender } from "../../../types/user";
import { useRouter} from "next/navigation";

const API_URL = process.env.NEXT_PUBLIC_URL_API

export default function Login () {

    const router = useRouter();

    const [provinces, setProvinces] = useState<Province[]>([]);
    const [selectedProvince, setSelectedProvince] = useState("");
    const [search, setSearch] = useState("");
    const [isOpenDropDownProvince, setIsOpenDropDownProvince] = useState(false);
    const provinceRef = useRef<HTMLDivElement>(null);

    const [genders, setGenders] = useState<Gender[]>([]);
    const [selectGender, setSelectGender] = useState("");
    const [isOpenDropDownGender, setIsOpenDropDownGender] = useState(false);
    const genderRef = useRef<HTMLDivElement>(null);

    const [selectDay, setSelectDay] = useState< number | null>(null)
    const [days, setDays] = useState<number[]>([])
    const [isOpenDropDownDay, setIsOpenDropDownDay] = useState(false)
    const dayRef = useRef<HTMLDivElement>(null)

    const [selectMonth, setSelectMonth] = useState< number | null>(null)
    const [isOpenDropDownMonth, setIsOpenDropDownMomth] = useState(false)
    const monthRef = useRef<HTMLDivElement>(null)

    const [year, setYear] = useState< number | null >(null)

    const [showPassword, setShowPassword] = useState(false);
    const [showRePassword, setShowRePassword] = useState(false);

    const [phone, setPhone] = useState("");
    const [phoneTouched, setPhoneTourched] = useState(false)
    const [email, setEmail] = useState("");
    const [emailTouched, setEmailTouched] = useState(false);
    const [name, setName] = useState("");
    const [nameTouched, setNameTouched] = useState(false)
    const [password, setPassword] = useState("")
    const [passwordTouched, setPasswordTouched] = useState(false)
    const [rePassword, setRePassword] = useState("")
    const [rePasswordTouched, setRePasswordTouched] = useState(false)

    const handleEmailFocus = () => {
        setEmailTouched(true)
    }
    const handleNameFocus = () => {
        setNameTouched(true)
    }
    const handlePasswordFocus = () => {
        setPasswordTouched(true)
    }
    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        if (/^\d*$/.test(value)) { //only number
            setPhone(value);
        }
    };
    const isPhoneValid = phone === "" || /^0\d*$/.test(phone)
    
    // Dropdown Gender
    useEffect(() => {
        const gendersData = [
            { id: 1, name: "Trai", value:"Male"},
            { id: 2, name: "Gái", value:"Female"},
            { id: 3, name: "Khác", value:"Other"}
        ]; setGenders(gendersData);
    }, []);
    // Dropdown Province
    useEffect(() => {
        const provincesData = [
            { id: 1, name: "An Giang" },
            { id: 2, name: "Bắc Ninh" },
            { id: 3, name: "Cà Mau" },
            { id: 4, name: "Cao Bằng" },
            { id: 5, name: "TP. Cần Thơ" },
            { id: 6, name: "Điện Biên" },
            { id: 7, name: "Đắk Lắk" },
            { id: 8, name: "Đồng Nai" },
            { id: 9, name: "Đồng Tháp" },
            { id: 10, name: "TP. Đà Nẵng" },
            { id: 11, name: "TP. Hà Nội" },
            { id: 12, name: "TP. Hải Phòng" },
            { id: 13, name: "TP. Hồ Chí Minh" },
            { id: 14, name: "TP. Huế" },
            { id: 15, name: "Gia Lai" },
            { id: 16, name: "Hà Tĩnh" },
            { id: 17, name: "Hưng Yên" },
            { id: 18, name: "Khánh Hòa" },
            { id: 19, name: "Lai Châu" },
            { id: 20, name: "Lạng Sơn" },
            { id: 21, name: "Lâm Đồng" },
            { id: 22, name: "Lào Cai" },
            { id: 23, name: "Nghệ An" },
            { id: 24, name: "Ninh Bình" },
            { id: 25, name: "Phú Thọ" },
            { id: 26, name: "Quảng Ngãi" },
            { id: 27, name: "Quảng Ninh" },
            { id: 28, name: "Quảng Trị" },
            { id: 29, name: "Sơn La" },
            { id: 30, name: "Thái Nguyên" },
            { id: 31, name: "Thanh Hóa" },
            { id: 32, name: "Tây Ninh" },
            { id: 33, name: "Tuyên Quang" },
            { id: 34, name: "Vĩnh Long" },
        ];
        setProvinces(provincesData);
    }, []);
    //setup day, month, year
    useEffect(() => {
        if (selectMonth && year) {
            const daysInMonth = new Date(year, selectMonth, 0).getDate();
            const newDays = Array.from({ length: daysInMonth }, (_, i) => i + 1);
            setDays(newDays);
            if (selectDay && selectDay > daysInMonth) setSelectDay(null);
        } else {
            setDays(Array.from({ length: 31 }, (_, i) => i + 1));
        }
    }, [selectMonth, year, selectDay]);
    //close dropdown when click outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (provinceRef.current && !provinceRef.current.contains(event.target as Node)) {
                setIsOpenDropDownProvince(false);
            }
            if (genderRef.current && !genderRef.current.contains(event.target as Node)) {
                setIsOpenDropDownGender(false);
            }
             if (dayRef.current && !dayRef.current.contains(event.target as Node)) {
                setIsOpenDropDownDay(false);
            }
            if (monthRef.current && !monthRef.current.contains(event.target as Node)){
                setIsOpenDropDownMomth(false);
            } 
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        }
    }, []);
    const filteredProvinces = provinces.filter(p => 
        p.name.toLowerCase().includes(search.toLowerCase())
    );

    //check before Register
    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();

        setEmailTouched(true);
        setNameTouched(true);
        setPasswordTouched(true);
        setPhoneTourched(true);
        setRePasswordTouched(true);

        const valid = email.trim() !== "" && name.trim() !== "" && password.trim()!== "" && isPhoneValid && rePassword === password;

        if (!valid){
            return;
        } 

        let date_of_birth = null;
        if (selectDay && selectMonth && year) {
            const paddedMonth = String(selectMonth).padStart(2, "0");
            const paddedDay = String(selectDay).padStart(2, "0");
            date_of_birth = `${year}-${paddedMonth}-${paddedDay}`;
        }
        const payload = {
            "email": email,
            "full_name": name,
            "phone": phone,
            "password": password,
            "date_of_birth": date_of_birth,
            "gender": selectGender,
            "address": selectedProvince,

        }
        try {
            const res = await fetch(`${API_URL}/auth/register`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            const data = await res.json();
            if (res.ok) {
                alert("Đăng ký thành công!");
                router.push("/auth/login");
            } else {
                alert(data.message || "Đăng ký thất bại!");
            }

        } catch (err) {
            alert("Không thể kết nối đến server!");
            console.error("Lỗi kết nối:", err);
        }

    }

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
                                Email <p className="text-red-600">(*)</p>
                            </label>
                            <div className="flex flex-col">
                                <input
                                    id="email"
                                    type="gmail"
                                    value={email}
                                    placeholder="Email"
                                    className=" flex-1 justify-center focus:ring-0 focus:outline-none border-b-1 border-gray-300 text-lg p-2"
                                    onBlur={handleEmailFocus}
                                    onChange={(e)=>setEmail(e.target.value)}
                                />
                                {emailTouched && email === "" && (
                                    <p className=" w-full text-red-600 text-sm">Thông tin bắt buộc</p>
                                )}
                            </div>
                        </div>
                        <div className="grid grid-cols-[200px_1fr] items-center gap-4">
                            <label htmlFor="username" className="flex gap-1 font-bold">
                                Họ và tên <p className="text-red-600">(*)</p>
                            </label>
                            <div className="flex flex-col">
                                <input
                                    id="email"
                                    type="text"
                                    value={name}
                                    placeholder="Họ và tên"
                                    className=" flex-1 justify-center focus:ring-0 focus:outline-none border-b-1 border-gray-300 text-lg p-2"
                                    onBlur={handleNameFocus}
                                    onChange={(e)=>setName(e.target.value)}
                                />
                                {nameTouched && name === "" && (
                                    <p className=" w-full text-red-600 text-sm">Thông tin bắt buộc</p>
                                )}
                            </div>
                        </div>
                        <div className="grid grid-cols-[200px_1fr] items-center gap-4">
                            <label htmlFor="phone" className="flex gap-1 font-bold">
                                Số điện thoại <p className="text-red-600">(*)</p>
                            </label>
                            <div className="flex flex-col">
                                <input
                                    id="phone"
                                    type="tel"
                                    value={phone}
                                    onChange={handlePhoneChange}
                                    onBlur={() => setPhoneTourched(true)}
                                    placeholder="Số điện thoại"
                                    maxLength={10}
                                    pattern="[0-9]*"
                                    className=" flex-1 justify-center focus:ring-0 focus:outline-none border-b-1 border-gray-300 text-lg p-2 "
                                />
                                {phoneTouched && !isPhoneValid && (
                                    <p className="text-red-600 text-sm">Số điện thoại phải bắt đầu bằng số 0</p>
                                )}
                            </div>
                        </div>
                        <div className="relative grid grid-cols-[200px_1fr] items-center gap-4">
                            <label htmlFor="password" className="flex gap-1 font-bold">
                                Mật khẩu <p className="text-red-600">(*)</p>
                            </label>
                            <div className="flex flex-col">
                                <input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    placeholder="Mật khẩu"
                                    className=" flex-1 justify-center focus:ring-0 focus:outline-none border-b-1 border-gray-300 text-lg p-2 "
                                    onBlur={handlePasswordFocus}
                                    onChange={(e)=>setPassword(e.target.value)}
                                />
                                {passwordTouched && password==="" && (
                                    <p className=" w-full text-red-600 text-sm">Thông tin bắt buộc</p>
                                )}
                            </div>
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
                                {/* Check Password and RePassword */}
                                
                            </div>
                        </div>
                        <div className="relative grid grid-cols-[200px_1fr] items-center gap-4">
                            <label htmlFor="rePassword" className="flex gap-1 font-bold">
                                Nhập lại mật khẩu <p className="text-red-600">(*)</p>
                            </label>
                            <div className="flex flex-col">
                                <input
                                    id="rePassword"
                                    type={showRePassword ? "text" : "password"}
                                    onBlur={() => setRePasswordTouched(true) }
                                    onChange={(e)=>setRePassword(e.target.value)}
                                    placeholder="Nhập lại mật khẩu"
                                    className=" flex-1 justify-center focus:ring-0 focus:outline-none border-b-1 border-gray-300 text-lg p-2 "
                                />
                                {rePasswordTouched && rePassword !== password && (
                                    <p className=" w-full text-red-600 text-sm">Mật khẩu nhập lại không khớp</p>
                                )}
                            </div>
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
                        <div className="flex justify-between">
                            {/* DateOfBirth */}
                            <div className="flex items-center">
                                <label htmlFor="dateOfBirth" className="flex gap-1 font-bold w-[200px] mr-4">
                                    Ngày Sinh <p className="text-red-600">(*)</p>
                                </label>
                                <div className="flex items-center gap-2">
                                    {/* Day */}
                                    <div className="relative" ref={dayRef}>
                                        <input
                                            id="day"
                                            type="number"
                                            placeholder="Ngày"
                                            value={selectDay ?? ""}
                                            onFocus={() => setIsOpenDropDownDay(true)}
                                            onChange={(e)=>{
                                                const val = parseInt(e.target.value);
                                                if (!isNaN(val) && val>=1 && val <= (selectMonth && year ? new Date(year, selectMonth, 0).getDate(): 31)){
                                                    setSelectDay(val);
                                                } else if (e.target.value === "") {
                                                    setSelectDay(null);
                                                }
                                            }}
                                            className="w-20 justify-center focus:ring-0 focus:outline-none border-b-1 border-gray-300 text-lg p-2"
                                        />
                                        {isOpenDropDownDay && (
                                            <ul className="absolute z-50 w-20 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                                            {days.map((day) => (
                                                <li
                                                key={day}
                                                onClick={() => {
                                                    setSelectDay(day);
                                                    setIsOpenDropDownDay(false);
                                                }}
                                                className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-center"
                                                >
                                                {day}
                                                </li>
                                            ))}
                                            </ul>
                                        )}
                                    </div>
                                    {/* Month */}
                                    <div className="relative" ref={monthRef}>
                                        <input
                                            id="month"
                                            type="number"
                                            placeholder="Tháng"
                                            value={selectMonth ?? ""}
                                            onFocus={()=>setIsOpenDropDownMomth(true)}
                                            onChange={(e) => {
                                                const val = parseInt(e.target.value);
                                                if (!isNaN(val) && val>=1 && val<=12){
                                                    setSelectMonth(val)
                                                } else if (e.target.value === "") {
                                                    setSelectMonth(null)
                                                }
                                            }}
                                            className="w-20 justify-center focus:ring-0 focus:outline-none border-b-1 border-gray-300 text-lg p-2 "
                                        />
                                        {isOpenDropDownMonth && (
                                            <ul className="absolute z-50 w-20 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                                                {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
                                                    <li
                                                    key={month}
                                                    onClick={() => {
                                                        setSelectMonth(month);
                                                        setIsOpenDropDownMomth(false);
                                                    }}
                                                    className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-center"
                                                    >
                                                    {month}
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                    </div>
                                    {/* Year */}
                                    <input
                                        id="year"
                                        type="number"
                                        placeholder="Năm"
                                        value={year ?? ""} 
                                        onChange={(e) => {
                                            const val = e.target.value;
                                            if (val === "") {
                                            setYear(null);
                                            return;
                                            }

                                            const num = parseInt(val);
                                            const currentYear = new Date().getFullYear();
                                            if (!isNaN(num)) {
                                            if (num <= currentYear) {
                                                    setYear(num);
                                                } else {
                                                    
                                                }
                                            }
                                        }}
                                        onBlur={(e) => {
                                            const val = parseInt(e.target.value);
                                            const currentYear = new Date().getFullYear();

                                            if (isNaN(val) || val < 1900 || val > currentYear) {
                                                setYear(null); 
                                            }
                                        }}
                                        className="w-20 justify-center focus:ring-0 focus:outline-none border-b-1 border-gray-300 text-lg p-2"
                                    />
                                </div>
                            </div>
                            {/*Gender*/}
                            <div className="flex items-center gap-4" ref={genderRef}>
                                <label htmlFor="gender" className="flex gap-1 font-bold">
                                    Giới Tính <p className="text-red-600">(*)</p>
                                </label>
                                <div className="relative">
                                    <input
                                        id="gender"
                                        type="text"
                                        value={selectGender}
                                        onClick={() => setIsOpenDropDownGender(!isOpenDropDownGender)}
                                        readOnly
                                        style={{ cursor: "pointer" }}
                                        placeholder="Chọn giới tính ..."
                                        className=" justify-center focus:ring-0 focus:outline-none border-b-1 border-gray-300 text-lg p-2 day-input"
                                    />    
                                    {isOpenDropDownGender && (
                                        <ul className="absolute left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                                            {genders.map((g) =>(
                                                <li
                                                    key={g.id}
                                                    onClick={() => {
                                                        setSelectGender(g.name);
                                                        setIsOpenDropDownGender(false)
                                                    }}
                                                    className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                                                >
                                                    {g.name}
                                                </li>
                                            ))}
                                        </ul>
                                    )}                        
                                </div>
                            </div>
                        </div>
                        <div className="grid grid-cols-[200px_1fr] items-center gap-4 relative" ref={provinceRef}>
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
                                        setIsOpenDropDownProvince(true);
                                    }}
                                    onFocus={() => setIsOpenDropDownProvince(true)}
                                    placeholder="Chọn tỉnh / thành..."
                                    className="w-full focus:ring-0 focus:outline-none border-b-1 border-gray-200 text-lg p-2 pr-8"
                                />                              
                               

                                {isOpenDropDownProvince && (
                                    <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-64 overflow-y-auto">
                                        {filteredProvinces.length > 0 ? (
                                            filteredProvinces.map((p) => (
                                                <div
                                                    key={p.id}
                                                    onClick={() => {
                                                        setSelectedProvince(p.name);
                                                        setSearch("");
                                                        setIsOpenDropDownProvince(false);
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
                    <button 
                        className="p-4 px-12 mt-4 button-blue"
                        onClick={handleRegister}
                    >
                        ĐĂNG KÝ
                    </button>
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