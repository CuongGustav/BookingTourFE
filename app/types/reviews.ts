import ReviewImagesInfo from "./review_images";

export default interface ReviewInfo {
    account_id: string;
    booking_code: string;
    booking_id: string;
    comment: string;
    created_at: string;
    rating: number;
    review_id: string;
    tour_id: string;
    images?: ReviewImagesInfo[];
}
