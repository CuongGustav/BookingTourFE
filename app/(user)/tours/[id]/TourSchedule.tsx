'use client'

import { useState, useMemo, useEffect } from 'react'
import { ReadTourSchedule } from '@/app/types/tour_schedule'
import { formatPriceK } from '@/app/common'

interface TourScheduleProps {
    schedules: ReadTourSchedule[]
    onScheduleSelect: (schedule: ReadTourSchedule | null) => void
    selectedSchedule: ReadTourSchedule | null
}

export default function TourSchedule({ schedules, onScheduleSelect, selectedSchedule }: TourScheduleProps) {
    // Tính toán monthYearList trước
    const monthYearList = useMemo(() => {
        const map = new Map<string, { month: number; year: number }>()
        schedules.forEach(item => {
            // Fix: Parse date properly to avoid timezone issues
            const [year, month, day] = item.departure_date.split('-').map(Number)
            const d = new Date(year, month - 1, day)
            const key = `${d.getMonth() + 1}-${d.getFullYear()}`
            if (!map.has(key)) map.set(key, { month: d.getMonth() + 1, year: d.getFullYear() })
        })
        return Array.from(map.values()).sort((a, b) => {
            if (a.year !== b.year) return a.year - b.year
            return a.month - b.month
        })
    }, [schedules])

    // Khởi tạo với tháng đầu tiên có tour, hoặc tháng hiện tại nếu không có tour
    const today = new Date()
    const initialMonth = monthYearList.length > 0 ? monthYearList[0].month : today.getMonth() + 1
    const initialYear = monthYearList.length > 0 ? monthYearList[0].year : today.getFullYear()

    const [selectedMonth, setSelectedMonth] = useState<number>(initialMonth)
    const [selectedYear, setSelectedYear] = useState<number>(initialYear)

    // Update selected month/year when schedules change
    useEffect(() => {
        if (monthYearList.length > 0) {
            setSelectedMonth(monthYearList[0].month)
            setSelectedYear(monthYearList[0].year)
        }
    }, [monthYearList])

    const scheduleByDate = useMemo(() => {
        const map = new Map<string, ReadTourSchedule>()
        schedules.forEach(s => map.set(s.departure_date, s))
        return map
    }, [schedules])

    const daysOfWeek = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"]

    const calendarDays = useMemo(() => {
        const firstDay = new Date(selectedYear, selectedMonth - 1, 1)
        const lastDay = new Date(selectedYear, selectedMonth, 0)
        const daysInMonth = lastDay.getDate()
        const startDay = (firstDay.getDay() + 6) % 7 

        const days: { date: Date | null }[] = []
        for (let i = 0; i < startDay; i++) days.push({ date: null })
        for (let d = 1; d <= daysInMonth; d++) {
            days.push({ date: new Date(selectedYear, selectedMonth - 1, d) })
        }
        return days
    }, [selectedMonth, selectedYear])

    const minMonthYear = monthYearList[0]
    const maxMonthYear = monthYearList[monthYearList.length - 1]

    const isMin = minMonthYear && selectedMonth === minMonthYear.month && selectedYear === minMonthYear.year
    const isMax = maxMonthYear && selectedMonth === maxMonthYear.month && selectedYear === maxMonthYear.year

    return (
        <div className="flex flex-col gap-6">
            <h1 className='font-medium mx-auto text-xl'>LỊCH KHỞI HÀNH</h1>

            <div className="flex flex-col lg:flex-row gap-6">
                <div className="lg:w-48 bg-white rounded-xl shadow-lg p-5 border border-gray-200">
                    <h3 className="font-semibold text-center mb-4 text-gray-800">Chọn tháng</h3>
                    <div className="space-y-2 max-h-96 overflow-y-auto">
                        {monthYearList.map(({ month, year }) => {
                            const active = month === selectedMonth && year === selectedYear
                            return (
                                <button
                                    key={`${month}-${year}`}
                                    onClick={() => {
                                        setSelectedMonth(month)
                                        setSelectedYear(year)
                                    }}
                                    className={`w-full py-3 rounded-lg font-medium transition cursor-pointer
                                        ${active ? "bg-blue-900 text-white" : "bg-gray-100 text-gray-700 hover:bg-blue-100"}`}
                                >
                                    {month.toString().padStart(2, '0')}/{year}
                                </button>
                            )
                        })}
                    </div>
                </div>

                {/* Calendar*/}
                <div className="flex-1 bg-white rounded-xl shadow-lg p-6 border border-gray-200">
                    <div className="flex items-center justify-between mb-6">
                        <button
                            disabled={isMin}
                            onClick={() => {
                                if (isMin) return
                                if (selectedMonth === 1) {
                                    setSelectedMonth(12)
                                    setSelectedYear(y => y - 1)
                                } else {
                                    setSelectedMonth(m => m - 1)
                                }
                            }}
                            className={`w-10 h-10 rounded-full flex items-center justify-center 
                                ${isMin ? "opacity-40 cursor-not-allowed" : "hover:bg-blue-100 cursor-pointer"}`}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6 text-blue-900">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                            </svg>
                        </button>

                        <h2 className="text-xl font-bold text-blue-900">
                            THÁNG {selectedMonth}/{selectedYear}
                        </h2>

                        <button
                            disabled={isMax}
                            onClick={() => {
                                if (isMax) return
                                if (selectedMonth === 12) {
                                    setSelectedMonth(1)
                                    setSelectedYear(y => y + 1)
                                } else {
                                    setSelectedMonth(m => m + 1)
                                }
                            }}
                            className={`w-10 h-10 rounded-full flex items-center justify-center 
                                ${isMax ? "opacity-40 cursor-not-allowed" : "hover:bg-blue-100 cursor-pointer"}`}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6 text-blue-900">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                            </svg>
                        </button>
                    </div>

                    <div className="grid grid-cols-7 text-center font-semibold text-gray-600 mb-3">
                        {daysOfWeek.map(d => <div key={d}>{d}</div>)}
                    </div>

                    <div className="grid grid-cols-7 gap-2 text-center">
                        {calendarDays.map((item, index) => {
                            if (!item.date) return <div key={index} className="h-16" />

                            // Fix: Format date properly to match departure_date format (YYYY-MM-DD)
                            const year = item.date.getFullYear()
                            const month = String(item.date.getMonth() + 1).padStart(2, '0')
                            const day = String(item.date.getDate()).padStart(2, '0')
                            const dateStr = `${year}-${month}-${day}`
                            
                            const schedule = scheduleByDate.get(dateStr)
                            const isWeekend = item.date.getDay() === 0 || item.date.getDay() === 6
                            const isActive = selectedSchedule?.departure_date === dateStr

                            return (
                                <div
                                    key={index}
                                    onClick={() => schedule && onScheduleSelect(schedule)}
                                    className={`h-16 flex flex-col items-center justify-center rounded-xl transition-all border-2 cursor-pointer
                                        ${schedule ? "hover:border-blue-600 border-gray-200" : "border-transparent text-gray-400 cursor-not-allowed"}
                                        ${isActive ? "border-blue-900 bg-blue-50" : ""}
                                    `}
                                >
                                    <div className={`font-bold text-lg ${isWeekend ? "text-red-600" : "text-gray-800"}`}>
                                        {item.date.getDate()}
                                    </div>
                                    {schedule && (
                                        <div className="text-sm font-semibold text-blue-900 mt-1">
                                            {formatPriceK(Number(schedule.price_adult))}
                                        </div>
                                    )}
                                </div>
                            )
                        })}
                    </div>

                    <p className="mt-6 text-sm text-red-600 italic text-center">
                        Quý khách vui lòng chọn ngày khởi hành phù hợp
                    </p>
                </div>
            </div>
        </div>
    )
}