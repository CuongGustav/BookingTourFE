export interface CreateBookingPassenger {
    passenger_type: "ADULT" | "CHILD" |"INFANT";
    full_name: string;
    date_of_birth: string;
    gender: "MALE" | "FEMALE" | "OTHER";
    id_number: string;
    single_room: 1 | 0;
}