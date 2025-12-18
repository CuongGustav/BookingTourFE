'use client'

import { useState, useMemo } from 'react'
import { ReadTourSchedule } from "@/app/types/tour_schedule"
import { formatPriceK } from '@/app/common'

interface TourScheduleProps {
    schedules: ReadTourSchedule[]
}

export default function TourSchedule({ schedules }: TourScheduleProps) {
    const today = new Date()

    const [selectedMonth, setSelectedMonth] = useState<number>(today.getMonth() + 1)
    const [selectedYear, setSelectedYear] = useState<number>(today.getFullYear())
    const [selectedDate, setSelectedDate] = useState<string | null>(null)

    const monthYearList = useMemo(() => {
        const map = new Map<string, { month: number; year: number }>()

        schedules.forEach(item => {
            const d = new Date(item.departure_date)
            const month = d.getMonth() + 1
            const year = d.getFullYear()
            const key = `${month}-${year}`

            if (!map.has(key)) {
                map.set(key, { month, year })
            }
        })

        return Array.from(map.values()).sort((a, b) => {
            if (a.year !== b.year) return a.year - b.year
            return a.month - b.month
        })
    }, [schedules])

    const minMonthYear = monthYearList[0]
    const maxMonthYear = monthYearList[monthYearList.length - 1]

    const isMin =
        minMonthYear &&
        selectedMonth === minMonthYear.month &&
        selectedYear === minMonthYear.year

    const isMax =
        maxMonthYear &&
        selectedMonth === maxMonthYear.month &&
        selectedYear === maxMonthYear.year

    const scheduleByDate = useMemo(() => {
        const map = new Map<string, ReadTourSchedule>()
        schedules.forEach(item => {
            map.set(item.departure_date, item)
        })
        return map
    }, [schedules])

    const daysOfWeek = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"]

    const calendarDays = useMemo(() => {
        const firstDay = new Date(selectedYear, selectedMonth - 1, 1)
        const lastDay = new Date(selectedYear, selectedMonth, 0)

        const daysInMonth = lastDay.getDate()
        const startDay = (firstDay.getDay() + 6) % 7 

        const days: { date: Date | null }[] = []

        for (let i = 0; i < startDay; i++) {
            days.push({ date: null })
        }

        for (let d = 1; d <= daysInMonth; d++) {
            days.push({ date: new Date(selectedYear, selectedMonth - 1, d) })
        }

        return days
    }, [selectedMonth, selectedYear])

    return (
        <div className="flex gap-6 items-start">

            <div className="flex flex-col rounded-xl shadow-black shadow-sm gap-4 p-4 min-w-[160px]">
                <span className="font-semibold mx-auto">Chọn tháng</span>

                {monthYearList.map(({ month, year }) => {
                    const active = month === selectedMonth && year === selectedYear

                    return (
                        <button
                            key={`${month}-${year}`}
                            onClick={() => {
                                setSelectedMonth(month)
                                setSelectedYear(year)
                            }}
                            className={`
                                px-4 py-2 rounded-xl font-bold transition cursor-pointer text-blue-900 border-1 border-white
                                ${active
                                    ? "bg-blue-900 text-white"
                                    : "border hover:border-blue-900 "}
                            `}
                        >
                            {month}-{year}
                        </button>
                    )
                })}
            </div>

            {/* calendar */}
            <div className="w-[650px] rounded-xl shadow-black shadow-sm p-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
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
                        className={`
                            w-8 h-8 rounded-full shadow flex items-center justify-center cursor-pointer
                            ${isMin ? "opacity-40 cursor-not-allowed" : "hover:bg-blue-100"}
                        `}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 15.75 3 12m0 0 3.75-3.75M3 12h18" />
                        </svg>
                    </button>

                    <h2 className="text-blue-900 font-bold text-lg">
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
                        className={`
                            w-8 h-8 rounded-full shadow flex items-center justify-center cursor-pointer
                            ${isMax ? "opacity-40 cursor-not-allowed" : "hover:bg-blue-100"}
                        `}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3" />
                        </svg>
                    </button>
                </div>

                <div className="grid grid-cols-7 text-center font-semibold mb-2">
                    {daysOfWeek.map((d, i) => (
                        <div key={d} className={i >= 5 ? "text-blue-900" : ""}>
                            {d}
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-7 gap-2 text-center">
                    {calendarDays.map((item, index) => {
                        if (!item.date) {
                            return <div key={index} className="h-[72px]" />
                        }

                        const yyyyMmDd = item.date.toISOString().split("T")[0]
                        const schedule = scheduleByDate.get(yyyyMmDd)
                        const isWeekend =
                            item.date.getDay() === 0 || item.date.getDay() === 6
                        const isActive = selectedDate === yyyyMmDd

                        return (
                            <div
                                key={index}
                                onClick={() => schedule && setSelectedDate(yyyyMmDd)}
                                className={`
                                    h-[72px] flex flex-col items-center justify-center
                                    rounded-lg transition border-1
                                    ${schedule ? "cursor-pointer hover:border-blue-900 " : "text-gray-400"}
                                    ${isActive ? "border-blue-900" : "border-white"}
                                `}
                            >
                                <div className={`font-semibold ${isWeekend ? "text-blue-900" : ""}`}>
                                    {item.date.getDate()}
                                </div>

                                <div className="h-[18px] text-sm font-semibold text-blue-900">
                                    {schedule
                                        ? `${formatPriceK(schedule.price_adult)}`
                                        : ""}
                                </div>
                            </div>
                        )
                    })}
                </div>

                <p className="text-red-600 italic mt-4 text-sm">
                    Quý khách vui lòng chọn ngày phù hợp
                </p>
            </div>
        </div>
    )
}
