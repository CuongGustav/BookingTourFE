import { PaymentImageInfo } from "./payment_image";

export interface PaymentInfo{
    payment_id: string,
    booking_id: string,
    booking_code: string,
    payment_method: "CASH" | "BANK_TRANSFER",
    amount: number,
    status: "PENDING" | "COMPLETED" | "FAILED" | "REFUNDED",
    created_at: string,
}

export interface ReadPaymentAdminInfo {
    payment_id: string,
    booking_id: string,
    booking_code: string,
    payment_method: "CASH" | "BANK_TRANSFER",
    amount: number,
    status: "PENDING" | "COMPLETED" | "FAILED" | "REFUNDED",
    created_at: string,
    payment_images: PaymentImageInfo[],
}