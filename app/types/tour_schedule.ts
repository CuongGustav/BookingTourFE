export interface TourSchedule {
    departure_date: string;
    return_date: string;
    available_seats: number;
    booked_seats: number;
    price_adult: number;
    price_child: number;
    price_infant: number;
    status: 'available' | 'full' | 'cancelled';
}