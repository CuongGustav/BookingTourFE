import { useState } from "react";

const API_URL = process.env.NEXT_PUBLIC_URL_API;

interface ModalDeleteReviewProps {
    isOpen: boolean;
    onClose: () => void;
    review_id: string;
    onSuccess: ()=> void;
}

export default function DeleteReview ({review_id, isOpen, onClose, onSuccess}:ModalDeleteReviewProps) {

    const [isLoading, setIsLoading] = useState(false);

    if (!isOpen) return null;

    const handleDeleteReview = async () => {
        setIsLoading(true);
        try {
            const res = await fetch(`${API_URL}/reviews/delete/${review_id}`, {
                method: "DELETE",
                credentials: "include",
            });

            if (res.ok) {
                alert("Xóa bình luận thành công!");
                onClose();
                onSuccess();  
            } else {
                const data = await res.json().catch(() => null);
                alert(data?.message || "Xóa bình luận thất bại!");
            }
        } catch (err) {
            console.error(err);
            alert("Không thể kết nối tới server!");
        } finally {
            setIsLoading(false);
        }
    };

    return(
        <div
            className="fixed inset-0 bg-black/50 flex justify-center items-center z-50"
            onClick={onClose}
        >
            <div
                className="bg-white rounded-xl p-6 w-full max-w-2xl mx-4 relative shadow-2xl max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
            >
                <h1 className="text-2xl font-bold mb-2 text-center text-red-600">Xóa bình luận</h1>
                <button
                    onClick={onClose}
                    className="absolute top-6 right-6 cursor-pointer hover:text-red-600 transition"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
                <p className="text-gray-600 text-center mb-6">
                    Bạn có chắc chắn muốn xóa bình luận này không?  
                    Hành động này không thể hoàn tác.
                </p>
                <div className="flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        disabled={isLoading}
                        className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium disabled:opacity-50 cursor-pointer"
                    >
                        Hủy
                    </button>

                    <button
                        onClick={handleDeleteReview}
                        disabled={isLoading}
                        className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium disabled:opacity-50 cursor-pointer"
                    >
                        {isLoading ? "Đang xóa..." : "Xóa"}
                    </button>
                </div>
            </div>
        </div>
    )
}