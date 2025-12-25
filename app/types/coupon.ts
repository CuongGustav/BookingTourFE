export interface ReadCouponAdmin {
    coupon_id : string,
    code : string,
    description : string,
    discount_type :  "PERCENTAGE" | "FFIXED",
    discount_value : number,
    min_order_amount : number,
    max_discount_amount : number,
    usage_limit : number,
    used_count : number,
    valid_from : string,
    valid_to : string,
    is_active : true | false,
    created_by : string,
    created_at : string,
    updated_at : string,
    image_coupon_url : string,
    image_coupon_public_id : string
}