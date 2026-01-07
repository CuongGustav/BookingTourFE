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
    contact_name: string;
    contact_email: string;
    contact_phone: string;
    contact_address: string;
    status: 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED';
    cancellation_reason: string;
    created_at: string;
    tour_title: string;
}