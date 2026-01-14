'use client'

import { useState, DragEvent } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

const API_URL = process.env.NEXT_PUBLIC_URL_API;

interface CreateReviewProps {
    isOpen: boolean;
    onClose: () => void;
    booking_id: string;
    tour_id: string;
    onSuccess: () => void;
}

export default function CreateReviewUser ({isOpen,onClose,booking_id,tour_id,onSuccess}: CreateReviewProps) {
    const router = useRouter();

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState("");
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [preview, setPreview] = useState("");
    const [dragOver, setDragOver] = useState(false);

    const isValid = rating > 0 && comment.trim().length > 0;

    if (!isOpen) return null;

    const setImage = (file: File) => {
        setImageFile(file);
        setPreview(URL.createObjectURL(file));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) setImage(file);
    };

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

    const handleSubmit = async () => {
        if (!isValid || loading) return;

        try {
            setLoading(true);
            setError(null);

            const formData = new FormData();
            formData.append("booking_id", booking_id);
            formData.append("tour_id", tour_id);
            formData.append("rating", rating.toString());
            formData.append("comment", comment);
            if (imageFile) formData.append("images", imageFile);

            const res = await fetch(`${API_URL}/reviews/create`, {
                method: "POST",
                body: formData,
                credentials: "include"
            });

            if (!res.ok) throw new Error("Tạo đánh giá thất bại");

            onSuccess();
            onClose();
            setTimeout(() => {
                router.push('/account/review');
            }, 0);
        } catch (err) {
            setError("Có lỗi xảy ra");
            console.error(err)
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            className="fixed inset-0 bg-black/50 flex justify-center items-center z-50"
            onClick={onClose}
        >
            <div
                className="bg-white rounded-xl w-full max-w-3xl mx-4 shadow-2xl max-h-[90vh] overflow-y-auto relative"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Close */}
                <button
                    onClick={onClose}
                    disabled={loading}
                    className="absolute top-4 right-4 hover:text-red-600 transition"
                >
                    ✕
                </button>

                <div className="p-6">
                    <h1 className="text-2xl font-bold text-blue-900 mb-6">
                        Đánh giá tour du lịch
                    </h1>

                    {/* Rating */}
                    <div className="mb-6">
                        <label className="block font-medium mb-2">
                            Đánh giá (1–5 sao)
                        </label>
                        <div className="flex gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    onClick={() => setRating(star)}
                                    disabled={loading}
                                    className="cursor-pointer"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-8 w-8"
                                        fill={star <= rating ? "currentColor" : "none"}
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                        color={star <= rating ? "#FFD700" : "#D1D5DB"}
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M12 2l3.09 6.26L22 9.27l-5 4.87
                                            1.18 6.88L12 17.77l-6.18 3.25
                                            L7 14.14 2 9.27l6.91-1.01L12 2z"
                                        />
                                    </svg>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Comment */}
                    <div className="mb-6">
                        <label className="block font-medium mb-2">Bình luận</label>
                        <textarea
                            rows={5}
                            className="w-full border rounded-lg px-4 py-2"
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            disabled={loading}
                        />
                    </div>

                    {/* Upload Image */}
                    <div className="flex flex-col flex-1">
                        <h3 className="font-semibold mb-2">Hình ảnh:</h3>
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
                                            width={300}
                                            height={300}
                                            style={{ width: 'auto', height: 300 }}
                                            className="rounded border object-cover"
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

                    {/* Error */}
                    {error && (
                        <p className="text-red-600 mb-4 text-sm">{error}</p>
                    )}

                    {/* Actions */}
                    <div className="flex justify-end gap-3 mt-4">
                        <button
                            onClick={onClose}
                            disabled={loading}
                            className="px-6 py-2 rounded-lg border hover:bg-gray-100 cursor-pointer"
                        >
                            Hủy
                        </button>

                        <button
                            onClick={handleSubmit}
                            disabled={!isValid || loading}
                            className={`px-6 py-2 rounded-lg text-white font-medium cursor-pointer
                                ${isValid
                                    ? "bg-blue-600 hover:bg-blue-700"
                                    : "bg-gray-400 cursor-not-allowed"
                                }`}
                        >
                            {loading ? "Đang gửi..." : "Tạo đánh giá"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
