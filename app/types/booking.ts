import { ReadBookingPassenger } from "./booking_passengers";

export interface ReadBookingUser {
    booking_id: string;
    booking_code: string;
    tour_id: string;
    schedule_id: string;
    coupon_id: string;
    num_adults: number;
    num_children: number;
    num_infants: number;
    total_price: number;
    discount_amount: number;
    final_price: number;
    paid_money?: number;
    is_full_payment?: number;
    remaining_amount?: number;
    contact_name: string;
    contact_email: string;
    contact_phone: string;
    contact_address: string;
    status: 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED' | 'CANCEL_PENDING' | 'PAID' | 'DEPOSIT';
    cancellation_reason: string;
    created_at: string;
    tour_title: string;
    special_request?: string;
    is_review?: boolean;
    depart_date?: string;
}

export interface TourDetail {
    title: string;
    tour_code: string;
    main_image_url: string;
    single_room_surcharge: number;
}

export interface ScheduleDetail {
    departure_date: string;
}

export interface CouponDetail {
    code: string;
}

export interface ReadBookingDetail {
    booking_code: string;
    tour: TourDetail;
    schedule: ScheduleDetail;
    contact_name: string;
    contact_email: string;
    contact_phone: string;
    contact_address: string | null;
    passengers: ReadBookingPassenger[];
    total_price: number;
    paid_money?: number;
    is_full_payment?: number;
    remaining_amount?: number;
    status?: 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED' | 'CANCEL_PENDING' | 'PAID' | 'DEPOSIT';
    discount_amount: number;
    final_price: number;
    coupon?: CouponDetail;
    special_request?: string;
    tour_id: string;
    schedule_id: string;
    tour_title?:string;
    cancellation_reason?: string;
    is_review?: boolean;
    depart_date?: string;
}

export interface BookingResponse {
    booking: ReadBookingUser & {
        passengers: ReadBookingPassenger[];
        special_request: string | null;
    };
}