import { TourInfo } from "@/app/types/tour";
import TourCard from "./tourCard";

export default function TourList({ tours }: { tours: TourInfo[] }) {
    if (!tours || tours.length === 0) {
        return (
            <div className="text-center text-gray-500 text-xl py-20">
                Hiện chưa có tour nào
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-4">
            {tours.map((tour) => (
                <TourCard key={tour.tour_id} tour={tour} />
            ))}
        </div>
    );
}
