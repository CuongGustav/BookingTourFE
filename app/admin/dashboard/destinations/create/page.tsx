'use client';

import { useState, useEffect, DragEvent } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function CreateDestinationPage() {

    const router = useRouter();
    const [name, setName] = useState("");
    const [country, setCountry] = useState("");
    const [region, setRegion] = useState("");
    const [description, setDescription] = useState("");
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string>("");
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const setImage = (file: File) => {
        setImageFile(file);
        setPreview(URL.createObjectURL(file)); // preview local
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

    const handleSubmit = async () => {
        if (!name || !country || !region) {
            alert("Name, country, region là bắt buộc!");
            return;
        }
        const formData = new FormData();
        formData.append("name", name);
        formData.append("country", country);
        formData.append("region", region);
        formData.append("description", description);
        if (imageFile) {
            formData.append("image", imageFile);
        }
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/destination/admin/add`, {
                method: "POST",
                credentials: "include",
                body: formData
            });
            const data = await res.json();
            if (res.ok) {
                alert("Tạo điểm đến thành công!");
                router.push("/admin/dashboard/destinations");
            } else {
                setErrorMessage(data.message || "Lỗi khi tạo điểm đến");
            }
        } catch (err) {
            console.error(err);
            alert("Không thể kết nối server");
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
                <h1 className="text-3xl font-bold mb-6 text-main">Tạo điểm đến mới</h1>
            </div>
            <div className="flex flex-col">
                <div className="flex gap-4 h-[196px]">
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
                                <p className="text-red-600 text-sm mt-1">
                                    {errorMessage}
                                </p>
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
                    </div>
                    <div className="w-1/2 h-full">
                        <label className="block font-medium mb-1">Mô tả:</label>
                        <div className="h-full">
                            <textarea
                                className="w-full border px-4 py-2 rounded-lg h-full min-h-[160px]"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            />
                        </div>
                    </div>
                </div>
            </div>
            {/* IMAGE UPLOAD */}
            <div className="mb-8">
                <label className="block font-medium mt-10 mb-2">Hình ảnh:</label>

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
            {/* SUBMIT BUTTON */}
            <button
                className={`w-full cursor-pointer py-3 rounded-lg ${
                                loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-800'
                            } text-white`}
                onClick={handleSubmit}
                disabled={loading}
            >
                {loading ? 'Đang tạo...' : 'Tạo điểm đến'}
            </button>
        </div>
    );
}
