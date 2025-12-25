'use client'

import { useRouter } from "next/navigation";
import { useState, useEffect, DragEvent } from "react";
import Image from "next/image";
import { formatPrice } from "@/app/common";
import { parseFormattedNumber } from "@/app/common";

const API_URL = process.env.NEXT_PUBLIC_URL_API;

export default function CreateCouponPage() {
    const router = useRouter();
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
    const [loading, setLoading] = useState(false)
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string>("");

    const [dateError, setDateError] = useState<string | null>(null);
    const [discountError, setDiscountError] = useState<string | null>(null);
    const [priceError, setPriceError] = useState<string|null>(null)

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
        let value = Number(rawValue);

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

    //check discount
    useEffect(() => {
        if (!discountType || discountValue === 0 || discountValue === null) {
            setDiscountError(null);
            return;
        }

        if (discountType === "percentage") {
            if (discountValue <= 0 || discountValue > 100) {
                setDiscountError("Giảm giá theo phần trăm phải > 0 và ≤ 100");
                return;
            }
        }

        if (discountType === "fixed") {
            if (discountValue <= 0) {
                setDiscountError("Giảm giá cố định phải lớn hơn 0");
                return;
            }
        }

        setDiscountError(null);
    }, [discountType, discountValue]);

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
    const isMissingRequiredFields = !code ||!discountType ||discountValue === null ||discountValue === undefined ||
                                        minOrderAmount === null ||maxDiscountAmount === null ||usageLimit === null ||!validFrom ||!validTo;
    const isInvalidUsageLimit =
        usageLimit <= 0 || usageLimit > MAX_USAGE_LIMIT;
    const isInvalid = isMissingRequiredFields || isInvalidDiscountValue || isInvalidUsageLimit ||
                        !!dateError || !!discountError || !!priceError;
    
    //image
    const setImage = (file: File) => {
        setImageFile(file);
        setPreview(URL.createObjectURL(file)); 
    };
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) setImage(file);
    };
    const [dragOver, setDragOver] = useState(false);
    const handleDrop = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setDragOver(false);
        const file = e.dataTransfer.files?.[0];
        if (file) setImage(file);
    };
    const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setDragOver(true);
    };
    const handleDragLeave = () => {
        setDragOver(false);
    };
    const handleRemoveImage = () => {
        setImageFile(null);
        setPreview("");
    };

    useEffect(() => {
        const handlePaste = (e: ClipboardEvent) => {
            const item = e.clipboardData?.items[0];
            if (!item) return;

            if (item.type.startsWith("image/")) {
                const file = item.getAsFile();
                if (file) setImage(file);
            }
        };
        window.addEventListener("paste", handlePaste);
        return () => window.removeEventListener("paste", handlePaste);
    }, []);

    //fetch create tour
    const handleCreateCoupon = async () => {
        if (isInvalid) return;

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

            if (imageFile) {
                formData.append("coupon_image", imageFile);
            }

            const res = await fetch(`${API_URL}/coupon/admin/add`, {
                method: "POST",
                credentials: "include",
                body: formData,
            });

            const data = await res.json();

            if (res.ok) {
                alert(data.message)
                router.push("/admin/dashboard/coupons");
            } else {
                alert(data.message || "Tạo mã giảm giá thất bại");
            }

        } catch (error) {
            console.error(error);
            alert("Có lỗi xảy ra");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-w-100 px-8 mx-auto py-6 h-98/100 overflow-y-auto relative">
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
                <h1 className="text-3xl font-bold mb-6 text-main">Tạo mã giảm giá mới</h1>
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
                                    <option >-- Chọn loại giảm giá --</option>
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
                                    value={discountValue === 0 ? '' : discountValue}
                                    onChange={(e) => handleDiscountValueChange(e.target.value)}
                                    type="number"
                                    min={0}
                                    max={discountType === "percentage" ? 100 : MAX_VALUE}
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
                            <label className="font-medium">Mức tối thiểu để áp cụng giảm giá:</label>
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
                <div className="mb-8">
                    <label className="block font-medium mb-2">Hình ảnh:</label>
                    <div
                        onDrop={handleDrop}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition ${
                            dragOver ? "border-blue-500 bg-blue-50" : "border-gray-400"
                        }`}
                    >
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="hidden"
                            id="fileUpload"
                        />
                        {!preview && (
                            <label htmlFor="fileUpload" className="cursor-pointer">
                                <p className="text-gray-600">Chọn file hoặc kéo thả ảnh vào</p>
                                <p className="text-gray-400 mt-1">Hoặc Ctrl+V để dán ảnh</p>
                            </label>
                        )}
                        <div className="flex justify-center">
                            {preview && (
                                <div className="flex gap-2 relative">
                                    <Image
                                        src={preview}
                                        alt="Preview"
                                        width={0}
                                        height={300}
                                        style={{ width: 'auto', height: 300 }}
                                        className="rounded border object-cover "
                                    />
                                    {preview && (
                                        <button
                                            onClick={handleRemoveImage}
                                            className="absolute top-0 right-4 cursor-pointer p-2 text-red-600"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                            </svg>
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>  
            </div>
            {/* button create */}
            <button
                onClick={handleCreateCoupon}
                disabled={isInvalid}
                className={`px-8 py-3 rounded-lg font-medium transition-colors w-full ${
                    !isInvalid
                        ? 'bg-blue-900 text-white'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
            >
                {loading
                    ? 'Đang xử lý...'
                    : isMissingRequiredFields || isInvalidDiscountValue
                        ? 'Chưa đủ điều kiện'
                        : 'Tạo mã giảm giá'}
            </button>

        </div>
    )
}