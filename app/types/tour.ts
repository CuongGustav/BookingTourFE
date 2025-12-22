import { ReadTourSchedule, TourSchedule } from "./tour_schedule";
import { ReadTourImages } from "./tour_images";
import { destinationByTourID } from "./destination";
import {ItineraryInforFE} from "./tour_itinerary";

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
    tour_code: string;
    title: string;
    duration_days: number;
    duration_nights: number;
    hightlights: string;
    included_services: string;
    excluded_services: string;
    base_price: number;
    child_price: number;
    infant_price: number;
    main_image_url: string;
    main_public_id: string;
    rating_average: number;
    total_reviews: number;
    is_featured: 1 | 0;
    attractions: string;
    cuisine: string;
    suitable_for: string;
    ideal_time: string;
    transportation: string;
    promotions: string;
    depart_destination: string;
    images: ReadTourImages[];
    schedules: ReadTourSchedule[];
    destinations: destinationByTourID[];
    itineraries: ItineraryInforFE[];
}