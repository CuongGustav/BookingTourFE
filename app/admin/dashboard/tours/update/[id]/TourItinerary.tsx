'use client'

import { useEffect } from "react";
import { ItineraryInforFE } from "@/app/types/tour_itinerary";

interface TourItineraryProps {
    itineraries: ItineraryInforFE[];
    setItineraries: (itineraries: ItineraryInforFE[]) => void;
    originalItineraries: ItineraryInforFE[]; 
    setItinerariesChanged: (changed: boolean) => void;
}

export default function TourItinerary({itineraries,setItineraries,originalItineraries,setItinerariesChanged,}: TourItineraryProps) {
    //have change
    useEffect(() => {
        const hasChanged =
        JSON.stringify(itineraries.sort((a, b) => a.display_order - b.display_order)) !==
        JSON.stringify(originalItineraries.sort((a, b) => a.display_order - b.display_order));

        setItinerariesChanged(hasChanged);
    }, [itineraries, originalItineraries, setItinerariesChanged]);

    // create new day
    const addItinerary = () => {
        const newItin: ItineraryInforFE = {
        title: "",
        description: "",
        meals: "",
        display_order: itineraries.length + 1,
        };
        setItineraries([...itineraries, newItin]);
    };

    //remove day
    const removeItinerary = (index: number) => {
        if (!confirm("Bạn có chắc muốn xóa ngày này khỏi lịch trình?")) return;

    const updated = itineraries.filter((_, i) => i !== index);
        updated.forEach((item, idx) => {
        item.display_order = idx + 1;
        });
        setItineraries(updated);
    };

    const updateItinerary = <K extends keyof ItineraryInforFE>(
        index: number,
        field: K,
        value: ItineraryInforFE[K]
    ) => {
        const updated = [...itineraries];
        updated[index] = { ...updated[index], [field]: value };
        setItineraries(updated);
    };

    const sortedItineraries = [...itineraries].sort((a, b) => a.display_order - b.display_order);

    return (
        <div className="flex flex-col gap-2 w-full">
        <div className="flex justify-between items-center mb-2">
            <label className="font-medium w-[200px] pt-2">Lịch trình chi tiết:</label>
            <button
                type="button"
                onClick={addItinerary}
                className="bg-blue-900 text-white px-4 py-2 rounded-lg hover:bg-blue-600 flex items-center gap-2 font-medium shadow-md transition cursor-pointer"
            >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
                Thêm lịch trình
            </button>
        </div>
        {itineraries.length === 0 && (
            <p className="text-center text-gray-400 py-8 border-2 border-dashed rounded-lg">
            Chưa có lịch trình nào. Nhấn <p className="text-red-600">Thêm lịch trình</p> để bắt đầu.
            </p>
        )}
        <div className="flex flex-col gap-4">
            {sortedItineraries.map((itinerary, index) => (
                <div
                    key={index}
                    className="border border-gray-300 rounded-lg p-4 bg-gradient-to-r from-gray-50 to-white shadow-sm hover:shadow-lg transition"
                >

                    <div className="flex justify-between items-center mb-3">
                        <h3 className="font-bold text-lg text-blue-900">
                            Ngày {itinerary.display_order}
                        </h3>
                        <button
                            type="button"
                            onClick={() => removeItinerary(index)}
                            className="text-red-500 hover:text-red-700 p-1 rounded curdsor-pointer"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                            </svg>
                        </button>
                    </div>

                    <div className="flex flex-col gap-3">
                        <div className="flex items-center">
                            <label className="font-medium w-[120px]">Tiêu đề:</label>
                            <input
                                type="text"
                                value={itinerary.title}
                                onChange={(e) => updateItinerary(index, "title", e.target.value)}
                                className="flex-1 border px-3 py-2 rounded-lg bg-white"
                            />
                        </div>

                        <div className="flex items-start">
                            <label className="font-medium w-[120px] pt-3">Mô tả:</label>
                            <textarea
                                value={itinerary.description}
                                onChange={(e) => updateItinerary(index, "description", e.target.value)}
                                className="flex-1 border px-3 py-2 rounded-lg h-[120px] bg-white"
                            />
                        </div>

                        <div className="flex items-center">
                            <label className="font-medium w-[120px] pt-3">Bữa ăn:</label>
                            <input
                                type="text"
                                value={itinerary.meals}
                                onChange={(e) => updateItinerary(index, "meals", e.target.value)}
                                className="flex-1 border px-3 py-2 rounded-lg bg-white"
                            />
                        </div>
                    </div>
                </div>
            ))}
        </div>
        </div>
    );
}