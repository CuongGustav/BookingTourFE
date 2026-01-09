export interface CreateBookingPassenger {
    passenger_type: "ADULT" | "CHILD" |"INFANT";
    full_name: string;
    date_of_birth: string;
    gender: "MALE" | "FEMALE" | "OTHER";
    id_number: string;
    single_room: 1 | 0;
}

export interface ReadBookingPassenger {
    passenger_id: string;
    passenger_type: 'ADULT' | 'CHILD' | 'INFANT';
    full_name: string;
    gender: 'MALE' | 'FEMALE' | 'OTHER' | null;
    date_of_birth: string;
    id_number: string | null;
    single_room: boolean;
}