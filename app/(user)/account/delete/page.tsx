'use client';

import { useState } from "react"

export default function DeleteAccountPage () { 
    
    const [isOpenModal, setIsOpenModal] =  useState(false);

    const openModal = () => {
        setIsOpenModal(true);
    }
    const closeModal = () => {
        setIsOpenModal(false);
    }

    const handelDeleteAccount = () => {
        closeModal();
    }

    return (
        <div className="w-full border border-gray-300 rounded pt-2 pb-4 px-4">
            <div className="flex flex-col border-b-2 border-gray-300 mb-4 pb-2">
                <h1 className="text-lg font-semibold mb-1">Yêu cầu xóa tài khoản</h1>
                <p>Bạn muốn xóa tài khoản, hãy cân nhắc khi lại làm điều đó nhé</p>
            </div>
            <div className="flex justify-center">
                <button 
                    className="button-red py-4 px-8"
                    onClick={openModal}
                >
                    Xóa tài khoản
                </button>
            </div>
            {isOpenModal && (
                <div
                    className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
                    onClick={closeModal}
                >
                    <div
                        className="bg-white rounded-lg p-6 w-96 relative"
                        onClick={(e)=>e.stopPropagation()}
                    >
                        <h2 className="text-xl font-semibold mb-4">Xác nhận xóa tài khoản</h2>
                        <p className="mb-6">Bạn có chắc chắn muốn xóa tài khoản của mình? Hành động này không thể hoàn tác.</p>
                        <div className="flex justify-center gap-4">
                            <button
                                className="py-2 px-4 border rounded hover:bg-gray-100"
                                onClick={closeModal}
                            >
                                Không
                            </button>
                            <button
                                className="py-2 px-4 bg-red-500 text-white rounded hover:bg-red-600"
                                onClick={handelDeleteAccount}
                            >
                                Có
                            </button>
                        </div>
                        <div className="absolute top-[20px] right-[20px]">
                            <button className="cursor-pointer hover:text-red-500" onClick={closeModal}>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}