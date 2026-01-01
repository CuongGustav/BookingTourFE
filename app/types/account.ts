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

export interface AccountInforListAdmin {
    account_id: string;
    full_name: string;
    email: string;
    phone: string | null;
    cccd: string | null;
    gender: "MALE" | "FEMALE" | "OTHER" | null;
    address: string | null;
    date_of_birth: string | null;
    role_account: "QCUSER" | "QCADMIN";
    is_active: boolean;
    created_at: string;
}

export interface AccountWhoAmI {
    account_id: string | null;
    address: string | null;
    cccd: string | null;
    date_of_birth: string | null;
    email: string;
    full_name: string | null;
    gender: "MALE" | "FEMALE" | "OTHER" | null;
    phone: string;
    role_account: "QCUSER" | "QCADMIN";
}