export interface AccountLogin {
    account_id: string;
    email: string;
    full_name: string;
}

export interface AccountInfo {
    account_id: string;
    email: string;
    phone:string;
    full_name: string;
    date_of_birth: string;
    address: string;
    cccd: string;
    gender: string
    tour_booked: number;
}

export interface AccountInfoUpdate {
    account_id: string;
    email: string;
    phone:string;
    full_name: string;
    date_of_birth: string;
    address: string;
    cccd: string;
    gender: string
}