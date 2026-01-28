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

export interface PaymentBreakdown {
    payment_id: string;
    amount: number;
    payment_method: string;
    created_at: string;
}

export interface RefundInfo {
    cancellation_date: string;        
    days_before_departure: number;    
    departure_date: string;           
    refund_amount: number;             
    refund_percentage: number;     
    total_paid?: number;
    payment_count?: number;
    payment_breakdown?: PaymentBreakdown[];    
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
    cancellation_reason?: string;
    refund_info?: RefundInfo;
    money_paid?: number;
    status_booking?: 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED' | 'CANCEL_PENDING' | 'PAID' | 'DEPOSIT';
}