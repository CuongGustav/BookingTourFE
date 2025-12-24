'use client'

import { TourInfo } from "@/app/types/tour";

interface ModalDeleteTourProps {
    tour: TourInfo | null
    onClose: () => void;
    onDeleted: () => void;
}

const API_URL = process.env.NEXT_PUBLIC_URL_API

export default function ModalDeleteTour({ tour, onClose, onDeleted }: ModalDeleteTourProps) {

    const handleDelete = async () => {
        if (!tour) return;

        try {
            const res = await fetch(`${API_URL}/tour/admin/delete/${tour.tour_id}`, {
                method: "POST",
                credentials: "include",
            });

            const data = await res.json();
            if (res.ok) {
                alert(data.message || "Xóa mềm tour thành công!");
                onDeleted();
                onClose();
            } else {
                alert(data.message || "Xóa tour thất bại!");
            }
        } catch (err) {
            console.error(err);
            alert("Không thể kết nối tới server!");
        }
    }

    if (!tour) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50" onClick={onClose}>
            <div
                className="bg-white rounded-xl p-6 w-full max-w-2xl mx-4 relative shadow-2xl"
                onClick={(e) => e.stopPropagation()}
            >
                <h1 className="text-2xl font-bold mb-4 text-red-600">Xóa mềm tour</h1>
                
                <div className="mb-6">
                    <p className="text-gray-700 mb-2">
                        Bạn có chắc chắn muốn xóa mềm tour sau không?
                    </p>
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                        <p className="font-semibold text-gray-800">
                            <span className="text-gray-600">Mã tour:</span> {tour.tour_code}
                        </p>
                        <p className="text-gray-700 mt-1">
                            <span className="text-gray-600">Tên tour:</span> {tour.title}
                        </p>
                    </div>
                    <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                        <p className="text-sm text-yellow-800">
                            <span className="font-semibold">Lưu ý:</span> Tour sẽ bị ẩn, 
                            không thể xóa nếu còn booking đang chờ xử lý hoặc đã xác nhận. 
                            Lịch sử booking và thanh toán sẽ được giữ nguyên.
                        </p>
                    </div>
                </div>

                <button
                    onClick={onClose}
                    className="absolute top-6 right-6 cursor-pointer hover:text-red-600 transition"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                <div className="flex gap-3 items-center justify-end mt-6">
                    <button
                        onClick={onClose}
                        className="py-2 px-6 border border-gray-300 rounded-lg hover:bg-gray-100 cursor-pointer transition"
                    >
                        Hủy
                    </button>
                    <button
                        onClick={handleDelete}
                        className="py-2 px-6 bg-red-500 text-white rounded-lg hover:bg-red-600 cursor-pointer transition"
                    >
                        Xác nhận xóa
                    </button>
                </div>
            </div>
        </div>
    )
}