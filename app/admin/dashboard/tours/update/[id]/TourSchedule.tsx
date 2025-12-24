'use client'

import { useEffect, useState, useCallback } from "react";
import { UpdateTourSchedule } from "@/app/types/tour_schedule";
import { formatPrice, parseFormattedNumber } from "@/app/common";
import { v4 as uuidv4 } from 'uuid';

interface TourScheduleProps {
    schedules: UpdateTourSchedule[];
    setSchedules: (schedules: UpdateTourSchedule[]) => void;
    originalSchedules: UpdateTourSchedule[];
    setSchedulesChanged: (changed: boolean) => void;
    basePrice: number;
    childPrice: number;
    infantPrice: number;
    durationDays: number;
    durationNights: number;
    setHasScheduleError: (hasError: boolean) => void;
}

export default function TourSchedule({
    schedules,
    setSchedules,
    originalSchedules,
    setSchedulesChanged,
    basePrice,
    childPrice,
    infantPrice,
    durationNights,
    setHasScheduleError
}: TourScheduleProps) {
    const [scheduleError, setScheduleError] = useState<string | null>(null);

    // 1. Kiểm tra thay đổi so với dữ liệu gốc
    useEffect(() => {
        const hasChanged = JSON.stringify(schedules) !== JSON.stringify(originalSchedules);
        setSchedulesChanged(hasChanged);
    }, [schedules, originalSchedules, setSchedulesChanged]);

    // 2. Logic Validation cho từng đợt tour
    const validateSchedules = useCallback(() => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const departureDates = schedules.map(s => s.departure_date);

        for (let i = 0; i < schedules.length; i++) {
            const schedule = schedules[i];

            const pAdult = Number(schedule.price_adult);
            const pChild = Number(schedule.price_child || 0);
            const pInfant = Number(schedule.price_infant || 0);

            if (pAdult > 0) {
                if (pChild >= pAdult) {
                    setScheduleError(`Lịch đợt ${i + 1}: Giá trẻ em phải nhỏ hơn giá người lớn`);
                    setHasScheduleError(true);
                    return false;
                }
                if (pInfant >= pChild && pChild > 0) {
                    setScheduleError(`Lịch đợt ${i + 1}: Giá sơ sinh phải nhỏ hơn giá trẻ em`);
                    setHasScheduleError(true);
                    return false;
                }
                if (pInfant >= pAdult) {
                    setScheduleError(`Lịch đợt ${i + 1}: Giá sơ sinh phải nhỏ hơn giá người lớn`);
                    setHasScheduleError(true);
                    return false;
                }
            }

            if (!schedule.departure_date) continue;

            const depDate = new Date(schedule.departure_date);
            depDate.setHours(0, 0, 0, 0);

            // Ngày trong quá khứ
            if (depDate < today) {
                setScheduleError(`Lịch đợt ${i + 1}: Ngày khởi hành không được trong quá khứ`);
                setHasScheduleError(true);
                return false;
            }

            // Trùng ngày khởi hành
            const duplicates = departureDates.filter((d, idx) => d === schedule.departure_date && idx !== i);
            if (duplicates.length > 0 && schedule.departure_date !== "") {
                setScheduleError(`Lịch đợt ${i + 1}: Ngày khởi hành đã tồn tại ở lịch khác`);
                setHasScheduleError(true);
                return false;
            }

            // Kiểm tra ngày kết thúc
            if (schedule.return_date) {
                const retDate = new Date(schedule.return_date);
                retDate.setHours(0, 0, 0, 0);

                if (retDate <= depDate) {
                    setScheduleError(`Lịch đợt ${i + 1}: Ngày kết thúc phải sau ngày khởi hành`);
                    setHasScheduleError(true);
                    return false;
                }

                if (durationNights > 0) {
                    const diffDays = Math.round((retDate.getTime() - depDate.getTime()) / (1000 * 60 * 60 * 24));
                    if (diffDays !== durationNights) {
                        setScheduleError(`Lịch đợt ${i + 1}: Phải đúng ${durationNights} đêm (hiện tại ${diffDays} ngày)`);
                        setHasScheduleError(true);
                        return false;
                    }
                }
            }
        }

        setScheduleError(null);
        setHasScheduleError(false);
        return true;
    }, [schedules, durationNights, setHasScheduleError]);

    useEffect(() => {
        validateSchedules();
    }, [validateSchedules]);

    // Thêm lịch mới
    const addSchedule = () => {
        const newSchedule: UpdateTourSchedule = {
            schedule_id: uuidv4(),
            departure_date: '',
            return_date: '',
            available_seats: 30,
            price_adult: basePrice || 0,
            price_child: childPrice || 0,
            price_infant: infantPrice || 0,
        };
        setSchedules([...schedules, newSchedule]);
    };

    // Xóa lịch
    const removeSchedule = (index: number) => {
        if (!confirm("Bạn có chắc muốn xóa lịch khởi hành này?")) return;
        const updated = schedules.filter((_, i) => i !== index);
        setSchedules(updated);
    };

    // Cập nhật field
    const updateSchedule = <K extends keyof UpdateTourSchedule>(
        index: number,
        field: K,
        value: UpdateTourSchedule[K]
    ) => {
        const updated = [...schedules];
        updated[index] = { ...updated[index], [field]: value };

        if (field === 'departure_date' && durationNights > 0 && value) {
            const dateStr = value as string;
            if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
                const depDate = new Date(dateStr);
                if (!isNaN(depDate.getTime())) {
                    const retDate = new Date(depDate);
                    retDate.setDate(retDate.getDate() + durationNights);
                    updated[index].return_date = retDate.toISOString().split('T')[0];
                }
            }
        }
        setSchedules(updated);
    };

    return (
        <div className="flex flex-col gap-2 w-full mt-6">
            <div className="flex justify-between items-center">
                <label className="font-medium w-[120px] pt-2">Lịch khởi hành:</label>
                <button
                    type="button"
                    onClick={addSchedule}
                    className="bg-blue-900 text-white px-4 py-2 rounded-lg hover:bg-blue-600 flex items-center gap-2 cursor-pointer"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                    Thêm lịch khởi hành
                </button>
            </div>

            {scheduleError && (
                <p className="text-red-600 text-sm bg-red-50 p-3 rounded-lg font-medium italic">{scheduleError}</p>
            )}

            <div className="flex flex-col gap-4">
                {schedules.length === 0 ? (
                    <div className="text-center text-gray-400 py-8 border-2 border-dashed rounded-lg">
                        Chưa có lịch khởi hành nào.
                    </div>
                ) : (
                    schedules.map((schedule, index) => (
                        <div key={schedule.schedule_id || `temp-${index}`} className="border rounded-lg p-5 bg-gradient-to-r from-gray-50 to-white shadow-sm hover:shadow-md transition">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="font-bold text-lg text-blue-900">Đợt {index + 1}</h3>
                                <button type="button" onClick={() => removeSchedule(index)} className="text-red-500 hover:text-red-700">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-6 h-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                    </svg>
                                </button>
                            </div>

                            <div className="flex gap-2">
                                <div className="flex flex-col w-1/2 gap-2">
                                    <div className="flex gap-2">
                                        <label className="font-medium w-[120px] pt-2">Ngày khởi hành:</label>
                                        <input type="date" value={schedule.departure_date} min={new Date().toISOString().split('T')[0]} onChange={(e) => updateSchedule(index, 'departure_date', e.target.value)} className="border px-3 py-2 rounded-lg bg-white flex-1 cursor-pointer" />
                                    </div>
                                    <div className="flex gap-2">
                                        <label className="font-medium w-[120px] pt-2">Giá người lớn:</label>
                                        <input type="text" value={formatPrice(schedule.price_adult)} onChange={(e) => updateSchedule(index, 'price_adult', parseFormattedNumber(e.target.value))} className="border px-3 py-2 rounded-lg bg-white flex-1" />
                                    </div>
                                    <div className="flex gap-2">
                                        <label className="font-medium w-[120px] pt-2">Giá trẻ em:</label>
                                        <input type="text" value={formatPrice(schedule.price_child)} onChange={(e) => updateSchedule(index, 'price_child', parseFormattedNumber(e.target.value))} className="border px-3 py-2 rounded-lg bg-white flex-1" />
                                    </div>
                                </div>
                                <div className="flex flex-col w-1/2 gap-2">
                                    <div className="flex gap-2">
                                        <label className="font-medium w-[120px] pt-2">Ngày kết thúc:</label>
                                        <input type="date" value={schedule.return_date} readOnly={durationNights > 0} className={`border px-3 py-2 rounded-lg bg-white flex-1 cursor-pointer ${durationNights > 0 ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : ''}`} />
                                    </div>
                                    <div className="flex gap-2">
                                        <label className="font-medium w-[120px] pt-2">Giá sơ sinh:</label>
                                        <input type="text" value={formatPrice(schedule.price_infant)} onChange={(e) => updateSchedule(index, 'price_infant', parseFormattedNumber(e.target.value))} className="border px-3 py-2 rounded-lg bg-white flex-1" />
                                    </div>
                                    <div className="flex gap-2">
                                        <label className="font-medium w-[120px] pt-2">Số chỗ:</label>
                                        <input type="number" min="1" value={schedule.available_seats} onChange={(e) => updateSchedule(index, 'available_seats', Number(e.target.value) || 0)} className="border px-3 py-2 rounded-lg bg-white flex-1" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}