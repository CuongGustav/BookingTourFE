export interface TourSchedule {
    schedule_id: string
    departure_date: string;
    return_date: string;
    available_seats: number;
    booked_seats: number;
    price_adult: number;
    price_child: number;
    price_infant: number;
    status: 'available' | 'full' | 'cancelled';
    created_at: string;
}

export interface TourCreateSchedule {
    departure_date: string;
    return_date: string;
    available_seats: number;
    booked_seats: number;
    price_adult: number;
    price_child: number;
    price_infant: number;
    status: 'available' | 'full' | 'cancelled';
}

export interface ReadTourSchedule {
    schedule_id: string;
    departure_date:string;
    return_date: string;
    available_seats: number;
    booked_seats: number;
    price_adult: number;
    price_child: number;
    price_infant: number;
    status: 'available' | 'full' | 'cancelled' ;
}

export interface UpdateTourSchedule {
    schedule_id?: string;                   
    departure_date: string;
    return_date: string;
    available_seats: number;               
    price_adult: number;
    price_child: number;
    price_infant: number;           
}