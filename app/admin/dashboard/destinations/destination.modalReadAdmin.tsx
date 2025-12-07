'use client'

import { destinationInfo } from "@/app/types/destination";
import { useState } from "react";
import Image from "next/image";

interface modalReadDestinationAdminProps {
    onClose: () => void;
    des: destinationInfo | null;
}

const API_URL = process.env.NEXT_PUBLIC_URL_API

export default function ModalReadDestinationAdmin ({onClose, des}:modalReadDestinationAdminProps) {

    const [imgSrc, setImgSrc] = useState(des?.image_url || "");

    const handleImageError = () => {
        if (des?.image_public_id) {
            const fallback = `${API_URL}/static/destination/${des.image_public_id}`;
            setImgSrc(fallback);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50" onClick={onClose}>
            <div
                className="bg-white rounded-xl p-6 w-full max-w-2xl mx-4 relative shadow-2xl"
                onClick={(e) => e.stopPropagation()}
            >
                <h1 className="text-2xl font-bold mb-2 text-main">Chi tiết điểm đến</h1>
                <button
                    onClick={onClose}
                    className="absolute top-6 right-6 cursor-pointer hover:text-red-600 transition"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
                {/* content */}
                <div className="flex flex-col my-2 gap-2 px-2 ">
                    <div className="flex flex-col">
                        <div className="flex gap-4 h-[220px]">
                            <div className="flex flex-col gap-2 w-1/2 h-full">
                                {/* NAME */}
                                <div>
                                    <label className="block font-medium mb-1">Tên điểm đến:</label>
                                    <label className="w-full py-2 pl-2 rounded-lg"> {des?.name}</label>
                                </div>
                                {/* COUNTRY */}
                                <div>
                                    <label className="block font-medium mb-1">Quốc gia:</label>
                                    <label className="w-full py-2 pl-2 rounded-lg"> {des?.country}</label>
                                </div>
                                {/* REGION */}
                                <div>
                                    <label className="block font-medium mb-1">Khu vực:</label>
                                    <label className="w-full py-2 pl-2 rounded-lg"> {des?.region}</label>
                                </div>
                                {/* IS_ACTIVE */}
                                <div>
                                    <label className="block font-medium mb-1">Trạng thái:</label>
                                    <label className="w-full py-2 pl-2 rounded-lg"> {des?.is_active? "Hoạt động" : "Bị khóa"}</label>
                                </div>
                            </div>
                            <div className="w-1/2 h-full">
                                <label className="block font-medium mb-1">Mô tả:</label>
                                <div className="h-full">
                                    <textarea className="w-full p-2 h-[200px] outline-none hover:outline-none">
                                        {des?.description}
                                    </textarea>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* Image */}
                    <div className="flex flex-col gap-2 mt-2">
                        <label className="font-medium">Ảnh điểm đến:</label>

                        {imgSrc ? (
                            <Image
                                src={imgSrc}
                                alt={des?.name || "Destination"}
                                width={300}
                                height={300}
                                className="rounded-xl border object-cover"
                                onError={handleImageError}
                                style={{ width: "auto", height: "300px",  maxWidth: "100%" }} 
                            />
                        ) : (
                            <p className="text-gray-500 italic">Không có ảnh</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}