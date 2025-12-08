'use client';

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Image from "next/image";

const API_URL = process.env.NEXT_PUBLIC_URL_API;

export default function UpdateDestinationPage() {
    const router = useRouter();
    const { id } = useParams(); //destiantion_id

    const [name, setName] = useState("");
    const [country, setCountry] = useState("");
    const [region, setRegion] = useState("");
    const [description, setDescription] = useState("");
    const [isActive, setIsActive] = useState(true);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string>("");
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [originalImageUrl, setOriginalImageUrl] = useState<string>("");


    useEffect(() => {
        const fetchDestination = async () => {
            try {
                const res = await fetch(`${API_URL}/destination/admin/${id}`, {
                    credentials: "include"
                });
                const data = await res.json();
                if (res.ok) {
                    setName(data.name);
                    setCountry(data.country);
                    setRegion(data.region || "");
                    setDescription(data.description || "");
                    setPreview(data.image_url || "");
                    setIsActive(Boolean(data.is_active));
                    setOriginalImageUrl(data.image_url || "")
                } else {
                    alert("Không tải được thông tin điểm đến");
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

    const handleSubmit = async () => {
        if (!name || !country || !region) {
            alert("Tên, quốc gia, khu vực là bắt buộc!");
            return;
        }

        setSubmitting(true);
        const formData = new FormData();
        formData.append("name", name);
        formData.append("country", country);
        formData.append("region", region);
        formData.append("is_active", isActive ? "1" : "0");
        if (description.trim()) formData.append("description", description.trim());
        
        const userDeletedImage = !preview && originalImageUrl;

        if (userDeletedImage) {
            formData.append("delete_image", "true");
        } else if (imageFile) {
            formData.append("image", imageFile);
        }

        try {
            const res = await fetch(`${API_URL}/destination/admin/update/${id}`, {
                method: "PUT",
                credentials: "include",
                body: formData,
            });

            const result = await res.json();

            if (res.ok) {
                alert("Cập nhật điểm đến thành công!");
                router.push("/admin/dashboard/destinations");
            } else {
                setErrorMessage(result.message || "Cập nhật thất bại");
            }
        } catch (err) {
            console.error(err);
            alert("Lỗi kết nối server");
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return <div className="p-8 text-center">Đang tải thông tin điểm đến...</div>;
    }

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
                <h1 className="text-3xl font-bold mb-6 text-main">Cập nhật điểm đến:</h1>
            </div>
            <div className="flex flex-col">
                <div className="flex gap-4 h-[300px]">
                    <div className="flex flex-col gap-2 w-1/2 h-full">
                        {/* NAME */}
                        <div>
                            <label className="block font-medium mb-1">Tên điểm đến:</label>
                            <input
                                type="text"
                                className="w-full border px-4 py-2 rounded-lg"
                                value={name}
                                onChange={(e) => {
                                    setName(e.target.value)
                                    setErrorMessage(null)
                                }}
                            />
                            {errorMessage && (
                                <p className="text-red-600 text-sm mt-1">{errorMessage}</p>
                            )}
                        </div>
                        {/* COUNTRY */}
                        <div>
                            <label className="block font-medium mb-1">Quốc gia:</label>
                            <input
                                type="text"
                                className="w-full border px-4 py-2 rounded-lg"
                                value={country}
                                onChange={(e) => setCountry(e.target.value)}
                            />
                        </div>
                        {/* REGION */}
                        <div>
                            <label className="block font-medium mb-1">Khu vực:</label>
                            <input
                                type="text"
                                className="w-full border px-4 py-2 rounded-lg"
                                value={region}
                                onChange={(e) => setRegion(e.target.value)}
                            />
                        </div>
                        {/* is active */}
                        <div>
                            <label className="block font-medium mb-1">Trạng thái:</label>
                            <select
                                value={isActive ? "1" : "0"}
                                onChange={(e) => setIsActive(e.target.value === "1")}
                                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="1" className="px-2 py-4">Hoạt động</option>
                                <option value="0"className="px-2 py-4">Bị khóa</option>
                            </select>
                        </div>
                    </div> 
                    {/* description */}
                    <div className="w-1/2 h-full">
                        <label className="block font-medium mb-1">Mô tả:</label>
                        <div className="h-full">
                            <textarea
                                className="w-full border px-4 py-2 rounded-lg h-[276px]"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            />
                        </div>
                    </div>
                </div>
                {/* Upload Image */}
                <div className="mb-8 mt-4">
                    <label className="block font-medium mb-3">Hình ảnh điểm đến</label>
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
                                <p className="text-gray-600">Chọn file hoặc kéo thả ảnh vào</p>
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
            {errorMessage && (
                    <div className="bg-red-50 border border-red-300 text-red-700 px-4 py-3 rounded mb-4">
                        {errorMessage}
                    </div>
                )}
            {/* button */}
            <button
                onClick={handleSubmit}
                disabled={submitting}
                className={`w-full py-4 rounded-lg text-white font-bold text-lg transition ${
                    submitting ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
                }`}
            >
                {submitting ? "Đang cập nhật..." : "Cập nhật điểm đến"}
            </button>
        </div>
    );
}