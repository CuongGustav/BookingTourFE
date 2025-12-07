'use client'

import { destinationInfo } from "@/app/types/destination";

interface ModalDeleteDestinationAdminProps {
    onClose: () => void;
    des: destinationInfo | null
    onDeleted: ()=> void;
}

const API_URL = process.env.NEXT_PUBLIC_URL_API

export default function ModalDeleteDestinationAdmin ({onClose,des, onDeleted}: ModalDeleteDestinationAdminProps) {
    const id = des?.destination_id
    const handleDelete = async () => {
        try {
            const res = await fetch(`${API_URL}/destination/admin/delete/${id}`, {
                method: "DELETE",
                credentials: "include",
            });

            const data = await res.json();
            if (res.ok) {
                alert("Xóa điểm đến thành công!");
                onDeleted();
                onClose();
            } else {
                alert(data.message || "Xóa thất bại!");
            }
        } catch (err) {
            console.error(err);
            alert("Không thể kết nối tới server!");
        } 
    }

    return (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50" onClick={onClose}>
            <div
                className="bg-white rounded-xl p-6 w-full max-w-2xl mx-4 relative shadow-2xl"
                onClick={(e) => e.stopPropagation()}
            >
                <h1 className="text-2xl font-bold mb-2 text-main">Xóa mềm tài khoản</h1>
                <p>Bạn muốn xóa mềm tài khoản {des?.name}</p>
                <button
                    onClick={onClose}
                    className="absolute top-6 right-6 cursor-pointer hover:text-red-600 transition"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
                <div className="flex gap-2 items-center justify-center mt-4">
                    <button
                        onClick={onClose}
                        className="py-2 px-4 border rounded hover:bg-gray-100 cursor-pointer"
                    >
                        Hủy
                    </button>
                    <button
                        onClick={handleDelete}
                        className="py-2 px-4 bg-red-500 text-white rounded hover:bg-red-600 cursor-pointer"
                    >
                        Xóa
                    </button>
                </div>
            </div>
        </div>    
    )
}