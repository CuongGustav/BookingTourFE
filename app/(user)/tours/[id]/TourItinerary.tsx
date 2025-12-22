'use client'

import React, { useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'


interface ItineraryDay {
    display_order?: number         
    title?: string        
    meals?: string        
    description?: string      
    isExpanded?: boolean
}

interface TourItineraryProps {
    itineraries: ItineraryDay[]
}

export default function TourItinerary({ itineraries }: TourItineraryProps) {
    const [expandedDays, setExpandedDays] = useState<Set<number>>(new Set([0]))

    const toggleDay = (index: number) => {
        setExpandedDays(prev => {
        const newSet = new Set(prev)
        if (newSet.has(index)) {
            newSet.delete(index)
        } else {
            newSet.add(index)
        }
        return newSet
        })
    }

    return (
        <div className="flex flex-col gap-2">
            <h1 className='font-medium mx-auto text-xl'>LỊCH TRÌNH</h1>

            <div className="flex flex-col gap-2">
                {itineraries.map((day, index) => (
                    <div
                        key={index}
                        className="border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                    >
                        <button
                            onClick={() => toggleDay(index)}
                            className="cursor-pointer w-full px-6 py-2 flex items-center justify-between bg-blue-50 hover:bg-blue-100 transition-colors text-left"
                        >
                            <div className="flex gap-2 items-center justify-center">
                                <h3 className="text-base font-bold text-blue-900">
                                    Ngày {day.display_order}: {day.title}
                                </h3>
                                <span className="text-sm font-medium">
                                    ( {day.meals} )
                                </span>
                            </div>

                            {expandedDays.has(index) ? (
                            <ChevronUp className="w-6 h-6 text-blue-900" />
                            ) : (
                            <ChevronDown className="w-6 h-6 text-blue-900" />
                            )}
                        </button>
                        {/* discription */}
                        <div className={`overflow-hidden transition-all duration-500 ease-in-out ${expandedDays.has(index) ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'}`}>
                            <div className="px-6 py-5 bg-white">
                                <div className="prose prose-blue max-w-none text-gray-700 leading-relaxed">
                                    {day.description?.split('\n').map((line, i) => {
                                        return (
                                            <p key={i} className="mb-3">
                                                {line}
                                            </p>
                                        )
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}