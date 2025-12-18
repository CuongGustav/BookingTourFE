import { ReadTourSchedule, TourSchedule } from "./tour_schedule";
import { ReadTourImages } from "./tour_images";

export interface TourInfo {
    tour_id: string;
    tour_code: string;
    title: string;
    duration_days: number;
    duration_nights: number;
    depart_destination: string;
    base_price: number;
    main_image_url: string;
    rating_average: number;
    total_reviews: number;
    is_featured: 1 | 0;
    is_active: 1 | 0
    created_at: string;
    transportation: string;
    slug: string;
    upcoming_schedules: TourSchedule[];
}

export interface TourDetailInfo {
    images: ReadTourImages[];
    schedules: ReadTourSchedule[];
}