'use client'

import { useState, useEffect} from "react"
import { CreateBookingPassenger } from "@/app/types/booking_passengers";
import { Circle, Plus, Minus } from "lucide-react";
import { formatPrice } from "@/app/common";

interface BookingPassengerProps {
    singleRoomSurCharge?: number;
    onNumPassengerChange?: (data: {
        numAdults: number;
        numChildren: number;
        numInfants: number;
        numSingleRooms: number;
    }) => void;
    onValidityChange?: (isValid: boolean) => void;
    onPassengersDataChange?: (data: {
        adults: CreateBookingPassenger[];
        children: CreateBookingPassenger[];
        infants: CreateBookingPassenger[];
    }) => void;
    initialData?: {
        adults: CreateBookingPassenger[];
        children: CreateBookingPassenger[];
        infants: CreateBookingPassenger[];
    };
}

const calculateAge = (birthDateString: string) => {
    if (!birthDateString) return 0;
    const today = new Date();
    const birthDate = new Date(birthDateString);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
};

export default function BookingPassenger({singleRoomSurCharge, onNumPassengerChange, onValidityChange, onPassengersDataChange, initialData}:BookingPassengerProps) {
    const [numAdults, setNumAdults] = useState(1);
    const [numChildren, setNumChildren] = useState(0);
    const [numInfants, setNumInfants] = useState(0);

    const [adultPassengers, setAdultPassengers] = useState<CreateBookingPassenger[]>([
        {
            passenger_type: "ADULT",
            full_name: '',
            date_of_birth: '',
            gender: 'MALE',
            id_number: '',
            single_room: 0
        }
    ])
    const [childPassengers, setChildPassengers] = useState<CreateBookingPassenger[]>([])
    const [infantPassengers, setInfantPassengers] = useState<CreateBookingPassenger[]>([])

    const [adultErrors, setAdultErrors] = useState<{full_name: string; gender: string; date_of_birth: string; id_number: string;} []>([]);
    const [childErrors, setChildErrors] = useState<{full_name: string; gender: string; date_of_birth: string} []>([])
    const [infantErrors, setInfantErrors] = useState<{full_name: string; gender: string; date_of_birth: string} []>([])

    const changeNumAdults = (delta: number) => {
        const newNum = Math.max(1, numAdults + delta);
        if (newNum === numAdults) return;

        const newPassengers = [...adultPassengers].slice(0, newNum);
        while (newPassengers.length < newNum) {
            newPassengers.push({
                passenger_type: "ADULT",
                full_name: '',
                date_of_birth: '',
                gender: 'MALE',
                id_number: '',
                single_room: 0
            });
        }
        setAdultPassengers(newPassengers);

        const newErrors = [...adultErrors].slice(0, newNum);
        while (newErrors.length < newNum) {
            newErrors.push({ full_name: '', gender: '', date_of_birth: '', id_number: '' });
        }
        setAdultErrors(newErrors);

        setNumAdults(newNum);
    };

    const changeNumChildren = (delta: number) => {
        const newNum = Math.max(0, numChildren + delta);
        if (newNum === numChildren) return;

        const newPassengers = [...childPassengers].slice(0, newNum);
        while (newPassengers.length < newNum) {
            newPassengers.push({
                passenger_type: "CHILD",
                full_name: '',
                date_of_birth: '',
                gender: 'MALE',
                id_number: '',
                single_room: 0
            });
        }
        setChildPassengers(newPassengers);

        const newErrors = [...childErrors].slice(0, newNum);
        while (newErrors.length < newNum) {
            newErrors.push({ full_name: '', gender: '', date_of_birth: '' });
        }
        setChildErrors(newErrors);

        setNumChildren(newNum);
    };

    const changeNumInfants = (delta: number) => {
        const newNum = Math.max(0, numInfants + delta);
        if (newNum === numInfants) return;

        const newPassengers = [...infantPassengers].slice(0, newNum);
        while (newPassengers.length < newNum) {
            newPassengers.push({
                passenger_type: "INFANT",
                full_name: '',
                date_of_birth: '',
                gender: 'MALE',
                id_number: '',
                single_room: 0
            });
        }
        setInfantPassengers(newPassengers);

        const newErrors = [...infantErrors].slice(0, newNum);
        while (newErrors.length < newNum) {
            newErrors.push({ full_name: '', gender: '', date_of_birth: '' });
        }
        setInfantErrors(newErrors);

        setNumInfants(newNum);
    };

    const updateAdult = (index: number, field: keyof CreateBookingPassenger, value: string | "MALE" | "FEMALE" | "OTHER" | 1 | 0) => {
        setAdultPassengers((prev) => prev.map((p, i) => (i === index ? { ...p, [field]: value } : p)));
    };
    const updateChild = (index: number, field: keyof CreateBookingPassenger, value: string | "MALE" | "FEMALE" | "OTHER" | 1 | 0) => {
        setChildPassengers((prev) => prev.map((p, i) => (i === index ? { ...p, [field]: value } : p)));
    };
    const updateInfant = (index: number, field: keyof CreateBookingPassenger, value: string | "MALE" | "FEMALE" | "OTHER" | 1 | 0) => {
        setInfantPassengers((prev) => prev.map((p, i) => (i === index ? { ...p, [field]: value } : p)));
    };
    
    const validateAdult = (index: number) => {
        const errors = { full_name: '', gender: '', date_of_birth: '', id_number: '' };
        const data = adultPassengers[index];
        if (!data.full_name || !data.full_name.trim()) {
            errors.full_name = 'Thông tin bắt buộc';
        }
        if (!data.date_of_birth) {
            errors.date_of_birth = 'Thông tin bắt buộc';
        } else {
            const age = calculateAge(data.date_of_birth);
            if (age < 12) {
                errors.date_of_birth = 'Người lớn phải từ 12 tuổi trở lên';
            }
        }
        if (!data.id_number || !data.id_number.trim()) {
            errors.id_number = 'Thông tin bắt buộc';
        } else if (!/^\d{12}$/.test(data.id_number)) {
            errors.id_number = 'Số CCCD phải là 12 chữ số';
        }
        setAdultErrors((prev) => {
            const newErrors = [...prev];
            newErrors[index] = errors;
            return newErrors;
        });
    };

    const validateChild = (index: number) => {
        const errors = { full_name: '', gender: '', date_of_birth: '' };
        const data = childPassengers[index];

        if (!data.full_name.trim()) errors.full_name = 'Thông tin bắt buộc';
        if (!data.date_of_birth.trim()) {
            errors.date_of_birth = 'Thông tin bắt buộc';
        } else {
            const age = calculateAge(data.date_of_birth);
            if (age < 2 || age > 11) {
                errors.date_of_birth = 'Trẻ em phải từ 2 đến 11 tuổi';
            }
        }
        setChildErrors((prev) => prev.map((e, i) => (i === index ? errors : e)));
    };

    const validateInfant = (index: number) => {
        const errors = { full_name: '', gender: '', date_of_birth: '' };
        const data = infantPassengers[index];

        if (!data.full_name.trim()) errors.full_name = 'Thông tin bắt buộc';
        if (!data.date_of_birth.trim()) {
            errors.date_of_birth = 'Thông tin bắt buộc';
        } else {
            const age = calculateAge(data.date_of_birth);
            if (age >= 2) {
                errors.date_of_birth = 'Em bé phải dưới 2 tuổi';
            }
        }
        setInfantErrors((prev) => prev.map((e, i) => (i === index ? errors : e)));
    };

    const handleIdNumberChange = (index: number, value: string) => {
        const numericValue = value.replace(/\D/g, '').slice(0, 12);
        updateAdult(index, 'id_number', numericValue);
    };

    useEffect(() => {
        if (onNumPassengerChange) {
            const numSingleRooms = adultPassengers.filter(p => p.single_room === 1).length;
            onNumPassengerChange({
                numAdults,
                numChildren,
                numInfants,
                numSingleRooms
            })
        }
    },[numAdults, numChildren, numInfants, adultPassengers, onNumPassengerChange])

    useEffect(() => {
        if (onPassengersDataChange) {
            onPassengersDataChange({
                adults: adultPassengers,
                children: childPassengers,
                infants: infantPassengers
            });
        }
    }, [adultPassengers, childPassengers, infantPassengers, onPassengersDataChange]);

    useEffect(() => {
        const validateAll = () => {
            const isAdultsFilled = adultPassengers.every(p => 
                p.full_name.trim() !== '' && 
                p.date_of_birth.trim() !== '' && 
                /^\d{12}$/.test(p.id_number)
            );
            const isChildrenFilled = childPassengers.every(p => 
                p.full_name.trim() !== '' && 
                p.date_of_birth.trim() !== ''
            );
            const isInfantsFilled = infantPassengers.every(p => 
                p.full_name.trim() !== '' && 
                p.date_of_birth.trim() !== ''
            );

            const hasAdultErrors = adultErrors.some(e => e.full_name || e.date_of_birth || e.id_number || e.gender);
            const hasChildErrors = childErrors.some(e => e.full_name || e.date_of_birth || e.gender);
            const hasInfantErrors = infantErrors.some(e => e.full_name || e.date_of_birth || e.gender);
            return isAdultsFilled && isChildrenFilled && isInfantsFilled && 
                !hasAdultErrors && !hasChildErrors && !hasInfantErrors;
        };
        if (onValidityChange) {
            onValidityChange(validateAll());
        }
    }, [adultPassengers, childPassengers, infantPassengers, adultErrors, childErrors, infantErrors, onValidityChange]); 

    //response --> update 
    const [isInitialLoaded, setIsInitialLoaded] = useState(false);
    useEffect(() => {
        if (initialData && !isInitialLoaded) {
            const hasData = 
                initialData.adults.length > 0 || 
                initialData.children.length > 0 || 
                initialData.infants.length > 0;

            if (hasData) {
                setAdultPassengers(initialData.adults);
                setNumAdults(initialData.adults.length);
                
                setChildPassengers(initialData.children);
                setNumChildren(initialData.children.length);
                
                setInfantPassengers(initialData.infants);
                setNumInfants(initialData.infants.length);
                
                setIsInitialLoaded(true); 
            }
        }
    }, [initialData, isInitialLoaded]);


    return (
        <div className="flex flex-col gap-6">
            <h1 className="font-bold uppercase">HÀNH KHÁCH</h1>
            <div className="flex flex-wrap gap-4">
                <div className="border rounded p-4 flex items-center justify-between w-[calc(50%-8px)]">
                    <div>
                        <p className="font-bold">Người lớn</p>
                        <div className="flex gap-1 items-center">
                            <Circle size={6} className="fill-current text-gray-500" />
                            <p className="text-sm text-gray-500">Từ 12 trở lên</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <button 
                            className="p-2 cursor-pointer" 
                            onClick={() => changeNumAdults(-1)}
                        >
                            <Minus size={12}/>
                        </button>
                        <span>{numAdults}</span>
                        <button 
                            className="p-2 cursor-pointer" 
                            onClick={() => changeNumAdults(1)}
                        >
                            <Plus size={12}/>
                        </button>
                    </div>
                </div>
                <div className="border rounded p-4 flex items-center justify-between w-[calc(50%-8px)]">
                    <div>
                        <p className="font-bold">Trẻ em</p>
                        <div className="flex gap-1 items-center">
                            <Circle size={6} className="fill-current text-gray-500" />
                            <p className="text-sm text-gray-500">Từ 2 - 11 tuổi</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <button 
                            className="p-2 cursor-pointer" 
                            onClick={() => changeNumChildren(-1)}
                        >
                            <Minus size={12}/>
                        </button>
                        <span>{numChildren}</span>
                        <button 
                            className="p-2 cursor-pointer"  
                            onClick={() => changeNumChildren(1)}
                        >
                            <Plus size={12}/>
                        </button>
                    </div>
                </div>
                <div className="border rounded p-4 flex items-center justify-between w-[calc(50%-8px)]">
                    <div>
                        <p className="font-bold">Em bé</p>
                        <div className="flex gap-1 items-center">
                            <Circle size={6} className="fill-current text-gray-500" />
                            <p className="text-sm text-gray-500">Dưới 2 tuổi</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <button 
                            className="p-2 cursor-pointer" 
                            onClick={() => changeNumInfants(-1)}
                        >
                            <Minus size={12}/>
                        </button>
                        <span>{numInfants}</span>
                        <button 
                            className="p-2 cursor-pointer" 
                            onClick={() => changeNumInfants(1)}
                        >
                            <Plus size={12}/>
                        </button>
                    </div>
                </div>
            </div>

            <h1 className="font-bold uppercase pb-2">THÔNG TIN HÀNH KHÁCH</h1>

            <div>
                <div className="flex items-center mb-2 border-t-1 pt-2 border-gray-500 ">
                    <span className="mr-2 font-bold">Người lớn</span>
                </div>
                {adultPassengers.map((passenger, index) => (
                    <div key={`adult-${index}`} className=" pb-4">
                        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-start">
                            <div className="col-span-1">
                                <div className="flex gap-1">
                                    <p>Họ tên: </p><p className="text-red-600">*</p>
                                </div>
                                <input
                                    className="p-2 w-full rounded border"
                                    value={passenger.full_name}
                                    onChange={(e) => updateAdult(index, 'full_name', e.target.value)}
                                    onBlur={() => validateAdult(index)}
                                />
                                {adultErrors[index]?.full_name && <p className="text-red-600 text-sm">{adultErrors[index].full_name}</p>}
                            </div>
                            <div className="col-span-1">
                                <div className="flex gap-1">
                                    <p>Số CCCD: </p><p className="text-red-600">*</p>
                                </div>
                                <input
                                    className="p-2 w-full border rounded"
                                    maxLength={12}
                                    value={passenger.id_number}
                                    onChange={(e) => handleIdNumberChange(index, e.target.value)}
                                    onBlur={() => validateAdult(index)}
                                />
                                {adultErrors[index]?.id_number && <p className="text-red-600 text-sm">{adultErrors[index].id_number}</p>}
                            </div>
                            <div>
                                <div className="flex gap-1">
                                    <p>Giới tính: </p>
                                </div>
                                <select
                                    className="border p-2 w-full rounded"
                                    value={passenger.gender}
                                    onChange={(e) => updateAdult(index, 'gender', e.target.value as "MALE" | "FEMALE" | "OTHER")}
                                    onBlur={() => validateAdult(index)}
                                >
                                <option value="MALE">Nam</option>
                                <option value="FEMALE">Nữ</option>
                                <option value="OTHER">Khác</option>
                                </select>
                                {adultErrors[index]?.gender && <p className="text-red-600 text-sm">{adultErrors[index].gender}</p>}
                            </div>
                            <div>
                                <div className="flex gap-1">
                                    <p>Ngày sinh: </p><p className="text-red-600">*</p>
                                </div>
                                <div className="relative">
                                    <input
                                        type="date"
                                        className="border p-2 w-full rounded"
                                        value={passenger.date_of_birth}
                                        onChange={(e) => updateAdult(index, 'date_of_birth', e.target.value)}
                                        onBlur={() => validateAdult(index)}
                                    />
                                </div>
                                {adultErrors[index]?.date_of_birth && <p className="text-red-600 text-sm">{adultErrors[index].date_of_birth}</p>}
                            </div>
                            <div className="flex flex-col gap-2">
                                <label htmlFor={`single-room-${index}`} className="cursor-pointer">Phòng đơn</label>
                                <div className="flex gap-2 items-center">
                                    <input
                                        type="checkbox"
                                        id={`single-room-${index}`} 
                                        checked={passenger.single_room === 1}
                                        onChange={(e) => {
                                            updateAdult(index, 'single_room', e.target.checked ? 1 : 0);
                                        }}
                                        className="cursor-pointer"  
                                    />
                                    <p>{formatPrice(singleRoomSurCharge)}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}

                {/* have children */}
                {numChildren > 0 && (
                    <div>
                        <div className="flex items-center mb-2 border-t-1 pt-2 border-gray-500 ">
                            <span className="mr-2 font-bold">Trẻ em</span>
                        </div>    
                        {childPassengers.map((passenger, index) => (
                            <div key={`child-${index}`} className="pb-4">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
                                    <div className="col-span-1">
                                        <div className="flex gap-1">
                                            <p>Họ tên: </p><p className="text-red-600">*</p>
                                        </div>
                                        <input
                                            className="border p-2 w-full rounded"
                                            value={passenger.full_name}
                                            onChange={(e) => updateChild(index, 'full_name', e.target.value)}
                                            onBlur={() => validateChild(index)}
                                        />
                                        {childErrors[index]?.full_name && <p className="text-red-600 text-sm">{childErrors[index].full_name}</p>}
                                    </div>
                                    <div>
                                        <div className="flex gap-1">
                                            <p>Giới tính: </p>
                                        </div>
                                        <select
                                            className="border p-2 w-full rounded"
                                            value={passenger.gender}
                                            onChange={(e) => updateChild(index, 'gender', e.target.value as "MALE" | "FEMALE" | "OTHER")}
                                            onBlur={() => validateChild(index)}
                                        >
                                            <option value="MALE">Nam</option>
                                            <option value="FEMALE">Nữ</option>
                                            <option value="OTHER">Khác</option>
                                        </select>
                                        {childErrors[index]?.gender && <p className="text-red-600 text-sm">{childErrors[index].gender}</p>}
                                    </div>
                                    <div>
                                        <div className="flex gap-1">
                                            <p>Ngày sinh: </p> <p className="text-red-600">*</p>
                                        </div>
                                        <div className="relative">
                                            <input
                                                type="date"
                                                className="border p-2 w-full rounded "
                                                value={passenger.date_of_birth}
                                                onChange={(e) => updateChild(index, 'date_of_birth', e.target.value)}
                                                onBlur={() => validateChild(index)}
                                            />
                                        </div>
                                        {childErrors[index]?.date_of_birth && <p className="text-red-600 text-sm">{childErrors[index].date_of_birth}</p>}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* have infant */}
                {numInfants > 0 && (
                    <div>
                        <div className="flex items-center mb-2 border-t-1 pt-2 border-gray-500 ">
                            <span className="mr-2 font-bold">Em bé</span>
                        </div>    
                        {infantPassengers.map((passenger, index) => (
                            <div key={`infant-${index}`} className="pb-4">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
                                    <div className="col-span-1">
                                        <div className="flex gap-1">
                                            <p>Họ tên: </p><p className="text-red-600">*</p>
                                        </div>
                                        <input
                                            className="border p-2 w-full rounded"
                                            value={passenger.full_name}
                                            onChange={(e) => updateInfant(index, 'full_name', e.target.value)}
                                            onBlur={() => validateInfant(index)}
                                        />
                                        {infantErrors[index]?.full_name && <p className="text-red-600 text-sm">{infantErrors[index].full_name}</p>}
                                    </div>
                                    <div>
                                        <div className="flex gap-1">
                                            <p>Giới tính: </p>
                                        </div>
                                        <select
                                            className="border p-2 w-full rounded"
                                            value={passenger.gender}
                                            onChange={(e) => updateInfant(index, 'gender', e.target.value as "MALE" | "FEMALE" | "OTHER")}
                                            onBlur={() => validateInfant(index)}
                                        >
                                            <option value="MALE">Nam</option>
                                            <option value="FEMALE">Nữ</option>
                                            <option value="OTHER">Khác</option>
                                        </select>
                                        {infantErrors[index]?.gender && <p className="text-red-600 text-sm">{infantErrors[index].gender}</p>}
                                    </div>
                                    <div>
                                        <div className="flex gap-1">
                                            <p>Ngày sinh: </p> <p className="text-red-600">*</p>
                                        </div>
                                        <div className="relative">
                                            <input
                                                type="date"
                                                className="border p-2 w-full rounded "
                                                value={passenger.date_of_birth}
                                                onChange={(e) => updateInfant(index, 'date_of_birth', e.target.value)}
                                                onBlur={() => validateInfant(index)}
                                            />
                                        </div>
                                        {infantErrors[index]?.date_of_birth && <p className="text-red-600 text-sm">{infantErrors[index].date_of_birth}</p>}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}