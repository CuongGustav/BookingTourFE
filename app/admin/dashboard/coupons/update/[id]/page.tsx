'use client'

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { formatPrice } from "@/app/common";
import { parseFormattedNumber } from "@/app/common";
import Image from "next/image";

const API_URL = process.env.NEXT_PUBLIC_URL_API;

interface CouponData {
    code: string;
    usage_limit: number;
    description: string;
    is_active: boolean;
    discount_type: string;
    discount_value: number;
    min_order_amount: number;
    max_discount_amount: number;
    valid_from: string;
    valid_to: string;
    image_coupon_url: string;
}

export default function UpdateCouponPage () {
    const router = useRouter();
    const { id } = useParams(); //coupon_id
    const MAX_VALUE = 1000000001; //1 ty
    const MAX_USAGE_LIMIT = 10001;

    const [code, setCode] = useState("")
    const [usageLimit, setUsageLimit] = useState<number>(0)
    const [description, setDescription] = useState("")
    const [discountType, setDiscountType] = useState("")
    const [discountValue, setDiscountValue] = useState<number>(0)
    const [minOrderAmount, setMinOrderAmount] = useState<number>(0)
    const [maxDiscountAmount, setMaxDiscountAmount] = useState<number>(0)
    const [validFrom, setValidFrom] = useState("")
    const [validTo, setValidTo] = useState("")
    const [isActive, setIsActive] = useState(true)
    const [originalImageUrl, setOriginalImageUrl] = useState<string>("");
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string>("");

    const [originalData, setOriginalData] = useState<CouponData | null>(null);

    const [discountError, setDiscountError] = useState<string | null>(null);
    const [priceError, setPriceError] = useState<string|null>(null)
    const [dateError, setDateError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true)

    useEffect(() => {
            const fetchDestination = async () => {
                try {
                    const res = await fetch(`${API_URL}/coupon/admin/read/${id}`, {
                        credentials: "include"
                    });
                    const data = await res.json();
                    if (res.ok) {
                        const coupon = data.data
                        setCode(coupon.code);
                        setUsageLimit(coupon.usage_limit);
                        setDescription(coupon.description);
                        setIsActive(coupon.is_active);
                        setDiscountType(coupon.discount_type.toLowerCase());
                        setDiscountValue(coupon.discount_value);
                        setMinOrderAmount(coupon.min_order_amount);
                        setMaxDiscountAmount(coupon.max_discount_amount);
                        setValidFrom(coupon.valid_from ? new Date(coupon.valid_from).toISOString().split('T')[0] : '');
                        setValidTo(coupon.valid_to ? new Date(coupon.valid_to).toISOString().split('T')[0] : '');
                        const imageUrl = coupon.image_coupon_url || "";
                        setOriginalImageUrl(imageUrl);
                        setPreview(imageUrl);

                        setOriginalData({
                            code: coupon.code,
                            usage_limit: coupon.usage_limit,
                            description: coupon.description,
                            is_active: coupon.is_active,
                            discount_type: coupon.discount_type.toLowerCase(),
                            discount_value: coupon.discount_value,
                            min_order_amount: coupon.min_order_amount,
                            max_discount_amount: coupon.max_discount_amount,
                            valid_from: coupon.valid_from ? new Date(coupon.valid_from).toISOString().split('T')[0] : '',
                            valid_to: coupon.valid_to ? new Date(coupon.valid_to).toISOString().split('T')[0] : '',
                            image_coupon_url: imageUrl
                        });
                    } else {
                        alert("Không tải được thông tin mã giảm giá");
                        router.back();
                    }
                } catch (err) {
                    console.log(err)
                    alert("Lỗi kết nối server");
                } finally {
                    setLoading(false);
                }
            };
    
            if (id) fetchDestination();
        }, [id, router]);


    // check price
        const handlePriceChange = (
        rawValue: string,
        setter: (v: number) => void
        ) => {
            let value = parseFormattedNumber(rawValue);
    
            if (value < 0) value = 0;
    
            if (value > MAX_VALUE) {
                value = MAX_VALUE;
                setPriceError("Giá trị tối đa là 1.000.000.000 VND");
            } else {
                setPriceError(null);
            }
    
            setter(value);
        };
    //check price discount
    const handleDiscountValueChange = (rawValue: string) => {
        let value: number;
        if (discountType === "percentage") {
            value = Number(rawValue);
        } else {
            value = parseFormattedNumber(rawValue);
        }

        if (value < 0) value = 0;

        if (discountType === "fixed") {
            if (value > MAX_VALUE) {
                value = MAX_VALUE;
                setDiscountError("Mức giảm giá tối đa là 1.000.000.000 VND");
            } else {
                setDiscountError(null);
            }
        }
        if (discountType === "percentage") {
            if (value > 100) {
                value = 100;
                setDiscountError("Giảm giá theo phần trăm tối đa là 100%");
            } else {
                setDiscountError(null);
            }
        }
        setDiscountValue(value);
    };
    // check date
    useEffect(() => {
        if (!validFrom || !validTo) {
            setDateError(null);
            return;
        }
        const start = new Date(validFrom);
        const end = new Date(validTo);
        start.setHours(0, 0, 0, 0);
        end.setHours(0, 0, 0, 0);
    
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (end <= start) {
            setDateError("Ngày kết thúc phải sau ngày bắt đầu");
            return;
        }

        if (end < today) {
            setDateError("Ngày kết thúc phải nằm trong tương lai");
            return;
        }

        setDateError(null);
    }, [validFrom, validTo]);
    // logic validation submit
    const isInvalidDiscountValue = (() => {
        if (!discountType) return true;
        if (discountValue === null || discountValue === undefined || discountValue === 0) return true;
        if (discountType === "percentage") {
            return discountValue <= 0 || discountValue > 100;
        }
        if (discountType === "fixed") {
            return discountValue <= 0;
        }
        
        return true;
    })();

    const setImage = (file: File) => {
        setImageFile(file);
        setPreview(URL.createObjectURL(file));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) setImage(file);
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        const file = e.dataTransfer.files[0];
        if (file) setImage(file);
    };

    const handleRemoveImage = () => {
        setImageFile(null);
        setPreview("");
    };

    const isMissingRequiredFields = !code ||!discountType ||discountValue === null ||discountValue === undefined ||
                                        minOrderAmount === null ||maxDiscountAmount === null ||usageLimit === null ||!validFrom ||!validTo;
    const isInvalidUsageLimit =
        usageLimit <= 0 || usageLimit > MAX_USAGE_LIMIT;
    const isInvalid = isMissingRequiredFields || isInvalidDiscountValue || isInvalidUsageLimit ||
                        !!dateError || !!discountError || !!priceError;

    const hasChanges = () => {
        if (!originalData) return false;
        return (
            code !== originalData.code ||
            usageLimit !== originalData.usage_limit ||
            description !== originalData.description ||
            isActive !== originalData.is_active ||
            discountType !== originalData.discount_type ||
            discountValue !== originalData.discount_value ||
            minOrderAmount !== originalData.min_order_amount ||
            maxDiscountAmount !== originalData.max_discount_amount ||
            validFrom !== originalData.valid_from ||
            validTo !== originalData.valid_to ||
            preview !== originalData.image_coupon_url
        );
    };

    const handleUpdateCoupon = async () => {
        if (isInvalid || !hasChanges()) return;

        try {
            setLoading(true);

            const formData = new FormData();
            formData.append("code", code);
            formData.append("description", description || "");
            formData.append("discount_type", discountType);
            formData.append("discount_value", String(discountValue));
            formData.append("min_order_amount", String(minOrderAmount));
            formData.append("max_discount_amount", String(maxDiscountAmount));
            formData.append("usage_limit", String(usageLimit));
            formData.append("valid_from", validFrom);
            formData.append("valid_to", validTo);
            formData.append("is_active", isActive ? "1" : "0");

            const userDeletedImage = !preview && originalImageUrl;
            if (userDeletedImage) {
                formData.append("delete_image", "true");
            } else if (imageFile) {
                formData.append("coupon_image", imageFile);
            }

            const res = await fetch(`${API_URL}/coupon/admin/update/${id}`, {
                method: "PUT",
                credentials: "include",
                body: formData,
            });

            const data = await res.json();

            if (res.ok) {
                alert(data.message)
                router.push("/admin/dashboard/coupons");
            } else {
                alert(data.message || "Cập nhật mã giảm giá thất bại");
            }

        } catch (error) {
            console.error(error);
            alert("Có lỗi xảy ra");
        } finally {
            setLoading(false);
        }
    };

    return(
        <div className="min-w-100 px-8 mx-auto pt-6 h-98/100 overflow-y-auto relative">
            <button
                className="bg-white px-4 py-2 rounded-xl border-1 border-gray-300 mb-4 cursor-pointer hover:bg-gray-300 hover:text-white
                            absolute top-4 left-8"
                onClick={() => router.back()}
            >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-8">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m11.25 9-3 3m0 0 3 3m-3-3h7.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>
            </button>
            <div className="flex justify-center">
                <h1 className="text-3xl font-bold mb-6 text-main">Cập nhật mã giảm giá:</h1>
            </div>
            <div className="flex gap-6 flex-col">
                <div className="flex gap-6">
                    <div className="flex w-1/2 flex-col gap-6">
                        {/* CODE */}
                        <div className="flex flex-col w-full gap-1">
                            <label className="font-medium w-[120px]">Mã CODE:</label>
                            <div className="flex border rounded-lg w-full justify-between items-center">
                                <input 
                                    className="flex-1 px-3 py-2 outline:none focus:outline-none"
                                    value={code}
                                    onChange={(e)=>{
                                        setCode(e.target.value)
                                    }}
                                />
                            </div>
                        </div>
                        {/* used limit */}
                        <div className="flex flex-col w-full gap-1">
                            <label className="font-medium w-[120px]">Số lượng:</label>
                            <div className="flex border rounded-lg w-full justify-between items-center">
                                <input
                                    type="number"
                                    min={0}
                                    max={MAX_USAGE_LIMIT}
                                    className="flex-1 px-3 py-2 outline-none focus:outline-none"
                                    value={usageLimit === 0 ? '' : usageLimit}
                                    onChange={(e) => {
                                        let value = Number(e.target.value);
                                        if (isNaN(value)) {
                                            setUsageLimit(0);
                                            return;
                                        }
                                        if (value < 0) value = 0;
                                        if (value > MAX_USAGE_LIMIT) value = MAX_USAGE_LIMIT;
                                        setUsageLimit(value);
                                    }}
                                />
                            </div>
                        </div>
                        {usageLimit === MAX_USAGE_LIMIT && (
                            <p className="text-red-600 text-sm mt-1">
                                Số lượng tối đa là 10.000
                            </p>
                        )}
                    </div>
                    {/* description */}
                    <div className="flex flex-col flex-1 gap-1">
                        <label className="font-medium w-[120px]">Mô tả:</label>
                        <textarea
                            className="w-full h-full border rounded-lg px-3 py-2 resize-none outline-none focus:outline-none"
                            value={description}
                            onChange={(e)=>{
                                setDescription(e.target.value)
                            }}
                        />
                    </div>
                </div>
                <div className="flex flex-col w-full">
                    <div className="flex gap-6">
                        {/* discount_value */}
                        <div className="flex flex-col w-full gap-1">
                            <label className="font-medium w-[120px]">Trạng thái:</label>
                            <div className="flex border rounded-lg w-full justify-between items-center">
                                <select
                                    value={isActive ? "1" : "0"}
                                    onChange={(e) => setIsActive(e.target.value === "1")}
                                    className="flex-1 px-3 py-2 outline:none focus:outline-none"
                                >
                                    <option value="1">Hoạt động</option>
                                    <option value="0">Bị khóa</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col w-full">
                    <div className="flex gap-6">
                        {/* discount_type */}
                        <div className="flex flex-col w-full gap-1">
                            <label className="font-medium w-[120px]">Loại giảm giá:</label>
                            <div className="flex border rounded-lg w-full justify-between items-center">
                                <select
                                    value={discountType}
                                    onChange={(e) => {
                                        setDiscountValue(0);
                                        setDiscountError(null);
                                        setDiscountType(e.target.value)}
                                    }
                                    className="flex-1 px-3 py-2 outline:none focus:outline-none"
                                >
                                    <option value="percentage">Phần trăm</option>
                                    <option value="fixed">Cố định</option>
                                </select>
                            </div>
                        </div>
                        {/* discount_value */}
                        <div className="flex flex-col w-full gap-1">
                            <label className="font-medium w-[120px]">Mức giảm giá:</label>
                            <div className="flex border rounded-lg w-full justify-between items-center">
                                <input 
                                    className="flex-1 px-3 py-2 outline:none focus:outline-none"
                                    disabled={!discountType}
                                    value={discountValue === 0 ? '' : (discountType === "percentage" ? discountValue : formatPrice(discountValue))}
                                    onChange={(e) => handleDiscountValueChange(e.target.value)}
                                    type="text"
                                />
                                <span>
                                    {discountType === "percentage" ? (
                                        <p className="font-bold px-2">%</p>
                                    ) : (
                                        <p className="font-bold px-2">VND</p>
                                    )}
                                </span>
                            </div>
                        </div>
                    </div>
                    {!discountType && (
                        <p className="text-sm text-red-600 mt-1">
                            Vui lòng chọn loại giảm giá trước
                        </p>
                    )}
                    {discountError && (
                        <p className="text-red-600 text-sm mt-1 ">
                            {discountError}
                        </p>
                    )}
                </div>
                <div className="flex flex-col w-full">
                    <div className="flex gap-6">
                        {/* min_order_amount */}
                        <div className="flex flex-col w-full gap-1">
                            <label className="font-medium">Mức tối thiểu để áp dụng giảm giá:</label>
                            <div className="flex border rounded-lg w-full justify-between items-center">
                                <input 
                                    className="flex-1 px-3 py-2 outline:none focus:outline-none"
                                    value={minOrderAmount === 0 ? '' : formatPrice(minOrderAmount)}
                                    onChange={(e) =>
                                        handlePriceChange(e.target.value, setMinOrderAmount)
                                    }
                                />
                                <p className="font-bold px-2">VND</p>
                            </div>
                        </div>
                        {/* max_discount_amount */}
                        <div className="flex flex-col w-full gap-1">
                            <label className="font-medium ">Mức giảm giá tối đa:</label>
                            <div className="flex border rounded-lg w-full justify-between items-center">
                                <input 
                                    className="flex-1 px-3 py-2 outline:none focus:outline-none"
                                    value={maxDiscountAmount === 0 ? '' : formatPrice(maxDiscountAmount)}
                                    onChange={(e) =>
                                        handlePriceChange(e.target.value, setMaxDiscountAmount)
                                    }
                                />
                                <p className="font-bold px-2">VND</p>
                            </div>
                        </div>
                    </div>
                    {priceError && (
                        <p className="text-red-600 text-sm mt-1">
                            {priceError}
                        </p>
                    )}
                </div>
                <div className="flex flex-col w-full">
                    <div className="flex gap-6">
                        {/* valid_from */}
                        <div className="flex flex-col w-full gap-1">
                            <label className="font-medium w-[120px]">Ngày bắt đầu:</label>
                            <div className="flex border rounded-lg w-full justify-between items-center">
                                <input 
                                    className="flex-1 px-3 py-2 outline:none focus:outline-none"
                                    type="date"
                                    value={validFrom}
                                    onChange={(e) => {
                                        setValidFrom(e.target.value)
                                    }}
                                />
                            </div>
                        </div>
                        {/* valid_to */}
                        <div className="flex flex-col w-full gap-1">
                            <label className="font-medium w-[120px]">Ngày kết thúc:</label>
                            <div className="flex border rounded-lg w-full justify-between items-center">
                                <input 
                                    className="flex-1 px-3 py-2 outline:none focus:outline-none"
                                    type="date"
                                    value={validTo}
                                    onChange={(e) => {
                                        setValidTo(e.target.value)
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                    {dateError && (
                        <p className="text-red-600 text-sm mt-1 ">
                            {dateError}
                        </p>
                    )}
                </div>
                {/* image */}
                <div className="flex flex-col gap-2 mb-6">
                    <label className="font-medium">Ảnh mã giảm giá:</label>   
                    <div
                        onDrop={handleDrop}
                        onDragOver={(e) => e.preventDefault()}
                        className="border-2 border-dashed border-gray-400 rounded-xl p-8 text-center"
                    >
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="hidden"
                            id="imgUpload"
                        />
                        {!preview && (
                            <label htmlFor="imgUpload" className="cursor-pointer">
                                <p className="text-gray-600">Chọn file hoặc kéo thả ảnh vào (không có ảnh hiện tại)</p>
                            </label>
                        )}
                        <div className="flex justify-center ">
                            {preview && (
                                <div className="flex gap-2 relative">
                                    <Image
                                        src={preview}
                                        alt="Preview"
                                        width={0}
                                        height={300}
                                        className="rounded border object-cover"
                                        placeholder="empty"
                                        unoptimized
                                        style={{ width: 'auto', height: 300 }}
                                    />
                                    <button
                                        onClick={handleRemoveImage}
                                        className="absolute top-0 right-4 cursor-pointer p-2 text-red-600"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                        </svg>
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>              
            </div>
            {/* button create */}
            <button
                onClick={handleUpdateCoupon}
                disabled={isInvalid || loading || !hasChanges()}
                className={`px-8 py-3 rounded-lg font-medium transition-colors w-full ${
                    !(isInvalid || loading || !hasChanges())
                        ? 'bg-blue-900 text-white hover:bg-blue-800'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
            >
                {loading
                    ? 'Đang xử lý...'
                    : isInvalid
                        ? 'Chưa đủ điều kiện'
                        : !hasChanges()
                          ? 'Không có thay đổi'
                          : 'Cập nhật mã giảm giá'}
            </button>
        </div>                     
    )
}