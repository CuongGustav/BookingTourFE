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
  role: "qcuser" | "qcadmin";
  is_active: boolean;
  created_at: string;
}