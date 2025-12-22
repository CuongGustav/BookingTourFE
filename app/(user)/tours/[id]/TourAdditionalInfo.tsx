import React from "react";
import { MapPin, Utensils, Users, Clock, Bus, Gift } from "lucide-react";

interface TourAdditionalInfoProps {
    tour: {
        attractions?: string;
        cuisine?: string;
        suitable_for?: string;
        ideal_time?: string;
        transportation?: string;
        promotions?: string;
    }
}

export default function TourAdditionalInfo({ tour }: TourAdditionalInfoProps) {
    return (
        <div className="flex flex-col gap-4">
            <h1 className='font-medium mx-auto text-xl'>THÔNG TIN THÊM VỀ CHUYẾN ĐI</h1>
            <div className="grid grid-cols-3 gap-6">
                <div className="flex flex-col gap-2">
                    <div className="flex gap-2">
                        <MapPin className="w-6 h-6 text-blue-900" />
                        <span className="font-bold">Điểm tham quan</span>
                    </div>
                    <span className="line-clamp-2 text-sm">{tour.attractions}</span>
                </div>
                <div className="flex flex-col gap-2">
                    <div className="flex gap-2">
                        <Utensils className="w-6 h-6 text-blue-900" />
                        <span className="font-bold">Ẩm thực</span>
                    </div>
                    <span className="line-clamp-2 text-sm">{tour.cuisine}</span>
                </div>
                <div className="flex flex-col gap-2">
                    <div className="flex gap-2">
                        <Users className="w-6 h-6 text-blue-900" />
                        <span className="font-bold">Đối tượng thích hợp</span>
                    </div>
                    <span className="line-clamp-2 text-sm">{tour.suitable_for}</span>
                </div>
                <div className="flex flex-col gap-2">
                    <div className="flex gap-2">
                        <Clock className="w-6 h-6 text-blue-900" />
                        <span className="font-bold">Thời gian lý tưởng</span>
                    </div>
                    <span className="line-clamp-2 text-sm">{tour.ideal_time}</span>
                </div>
                <div className="flex flex-col gap-2">
                    <div className="flex gap-2">
                        <Bus className="w-6 h-6 text-blue-900" />
                        <span className="font-bold">Phương tiện</span>
                    </div>
                    <span className="line-clamp-2 text-sm">{tour.promotions}</span>
                </div>
                <div className="flex flex-col gap-2">
                    <div className="flex gap-2">
                        <Gift className="w-6 h-6 text-blue-900" />
                        <span className="font-bold">Khuyến mãi</span>
                    </div>
                    <span className="line-clamp-2 text-sm">{tour.promotions}</span>
                </div>
            </div>
        </div>
    )
}