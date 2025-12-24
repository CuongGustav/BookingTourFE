'use client'

import { destinationCreateTour } from "@/app/types/destination";

interface TourDestinationProps {
  allDestinations: destinationCreateTour[];
  selectedIds: string[];
  setSelectedIds: (ids: string[]) => void;
}

export default function TourDestination({ allDestinations, selectedIds, setSelectedIds }: TourDestinationProps) {
    const handleDestinationChange = (id: string) => {
        setSelectedIds(
        selectedIds.includes(id)
            ? selectedIds.filter((destId) => destId !== id)
            : [...selectedIds, id]
        );
    };
    return (
        <div className="flex gap-2 w-full">
            <div className="flex items-start">
                <label className="font-medium w-[120px] pt-2">Chọn điểm đến:</label>
                <div className="flex-1 border rounded-lg p-3 max-h-[180px] overflow-y-auto">
                    {allDestinations.length === 0 ? (
                        <p className="text-gray-400 text-sm">không có danh sách điểm đến...</p>
                    ) : (
                        <div className="grid grid-cols-6 gap-6">
                            {allDestinations.map((dest) => (
                                <label 
                                    key={dest.destination_id} 
                                    className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded "
                                >
                                    <input
                                        type="checkbox"
                                        id={dest.destination_id}
                                        checked={selectedIds.includes(dest.destination_id)}
                                        onChange={() => handleDestinationChange(dest.destination_id)}
                                        className="w-4 h-4 cursor-pointer"
                                    />
                                    <label htmlFor={dest.destination_id} className="cursor-pointer flex-1">{dest.name}</label>
                                </label>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}