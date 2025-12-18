'use client'

import { useState } from 'react'
import { ReadTourSchedule } from "@/app/types/tour_schedule"

interface TourScheduleProps {
  schedules: ReadTourSchedule[]
}

export default function TourSchedule({ schedules }: TourScheduleProps) {
  const [selectedMonth, setSelectedMonth] = useState(1) // Tháng mặc định: 1/2026
  const currentYear = 2026

  // Nhóm schedules theo tháng
  const schedulesByMonth = schedules.reduce((acc, sch) => {
    const date = new Date(sch.departure_date)
    const month = date.getMonth() + 1 // 1-12
    const day = date.getDate()
    if (!acc[month]) acc[month] = []
    acc[month].push({ day, price: sch.price_adult, schedule: sch })
    return acc
  }, {} as Record<number, { day: number; price: number; schedule: ReadTourSchedule }[]>)

  // Các tháng có lịch
  const availableMonths = Object.keys(schedulesByMonth)
    .map(Number)
    .sort((a, b) => a - b)

  // Lấy dữ liệu của tháng đang chọn
  const currentSchedules = schedulesByMonth[selectedMonth] || []

  // Tạo mảng ngày trong tháng (giả sử tháng 1/2026 có 31 ngày)
  const daysInMonth = new Date(currentYear, selectedMonth, 0).getDate()
  const firstDayOfMonth = new Date(currentYear, selectedMonth - 1, 1).getDay() // 0 = CN, 1 = T2,...

  const calendarDays = Array.from({ length: daysInMonth }, (_, i) => i + 1)

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold text-center mb-6 text-blue-900">
        LỊCH KHỞI HÀNH
      </h2>

      {/* Chọn tháng */}
      <div className="flex flex-wrap gap-3 mb-8 justify-center">
        {availableMonths.map(month => (
          <button
            key={month}
            onClick={() => setSelectedMonth(month)}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              selectedMonth === month
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {month}/{currentYear}
          </button>
        ))}
      </div>

      {/* Lịch */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="flex items-center justify-between p-4 bg-blue-50">
          <button
            onClick={() => setSelectedMonth(prev => Math.max(1, prev - 1))}
            disabled={selectedMonth === availableMonths[0]}
            className="text-blue-600 disabled:opacity-30"
          >
            ←
          </button>
          <h3 className="text-lg font-bold text-blue-900">
            THÁNG {selectedMonth}/{currentYear}
          </h3>
          <button
            onClick={() => setSelectedMonth(prev => Math.min(12, prev + 1))}
            disabled={selectedMonth === availableMonths[availableMonths.length - 1]}
            className="text-blue-600 disabled:opacity-30"
          >
            →
          </button>
        </div>

        <div className="grid grid-cols-7 gap-1 p-4 text-center text-sm">
          {['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'].map(day => (
            <div key={day} className="font-medium text-gray-600">
              {day}
            </div>
          ))}

          {/* Ngày trống trước ngày 1 */}
          {Array.from({ length: firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1 }).map((_, i) => (
            <div key={`empty-${i}`} className="py-3"></div>
          ))}

          {calendarDays.map(day => {
            const schedule = currentSchedules.find(s => s.day === day)
            const hasTour = !!schedule
            const isSelected = day === 3 // Ví dụ ngày 3 có lịch (bạn có thể thay đổi logic)

            return (
              <div
                key={day}
                className={`py-3 rounded-lg cursor-pointer transition ${
                  hasTour
                    ? 'bg-red-50 border border-red-500 text-red-600 font-bold'
                    : 'text-gray-400'
                } ${isSelected ? 'ring-2 ring-red-500' : ''}`}
              >
                {day}
                {hasTour && (
                  <div className="text-xs mt-1">
                    {schedule.price.toLocaleString()}K
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      <p className="text-center text-gray-600 mt-6">
        Quý khách vui lòng chọn ngày phù hợp
      </p>
    </div>
  )
}