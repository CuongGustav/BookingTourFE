'use client'

import { useState, useEffect } from "react";
import Image from "next/image";
import { CreateImageTourFE, ReadTourImages } from "@/app/types/tour_images";

interface TourImagesProps {
    existingImages: ReadTourImages[];
    setExistingImages: (images: ReadTourImages[]) => void;
    newImages: CreateImageTourFE[];
    setNewImages: (images: CreateImageTourFE[]) => void;
    imagesToDelete: string[];
    setImagesToDelete: (ids: string[]) => void;
    setImagesChanged: (changed: boolean) => void;
    originalImages: ReadTourImages[];
}

export default function TourImages({
    existingImages,
    setExistingImages,
    newImages,
    setNewImages,
    imagesToDelete,
    setImagesToDelete,
    setImagesChanged,
}: TourImagesProps) {
    const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);

    // Track changes
    useEffect(() => {
        const hasChanged = imagesToDelete.length > 0 || newImages.length > 0;
        setImagesChanged(hasChanged);
    }, [imagesToDelete, newImages, setImagesChanged]);

    // Get all images (existing + new) for display
    const getAllImages = () => {
        const existing = existingImages
            .filter(img => !imagesToDelete.includes(img.tour_image_id))
            .map(img => ({
                id: img.tour_image_id,
                preview: img.image_url,
                display_order: img.display_order,
                isExisting: true
            }));

        const newOnes = newImages.map((img, idx) => ({
            id: `new-${img.display_order}-${idx}`,
            preview: img.preview,
            display_order: img.display_order,
            isExisting: false
        }));

        return [...existing, ...newOnes].sort((a, b) => a.display_order - b.display_order);
    };

    const allImages = getAllImages();
    const totalImages = allImages.length;

    // Handle file upload
    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files) return;

        const remainingSlots = 9 - totalImages;
        if (remainingSlots <= 0) {
            alert("Đã đủ số lượng ảnh (tối đa 9 ảnh)");
            return;
        }

        const filesToAdd = Array.from(files).slice(0, remainingSlots);
        const invalidFiles = filesToAdd.filter(file => !file.type.startsWith('image/'));
        
        if (invalidFiles.length > 0) {
            alert("Chỉ chấp nhận file ảnh");
            return;
        }

        const maxOrder = allImages.length > 0 
            ? Math.max(...allImages.map(img => img.display_order))
            : 0;

        const newImageObjects: CreateImageTourFE[] = filesToAdd.map((file, idx) => ({
            file,
            preview: URL.createObjectURL(file),
            display_order: maxOrder + idx + 1
        }));

        setNewImages([...newImages, ...newImageObjects]);
        e.target.value = ""; 
    };

    // Remove image - Đã sửa lỗi xóa ảnh mới bằng cách cập nhật state đồng bộ
    const removeImage = (displayOrder: number) => {
        const imageToRemove = allImages.find(img => img.display_order === displayOrder);
        if (!imageToRemove) return;

        // 1. Nếu là ảnh cũ, đánh dấu xóa
        if (imageToRemove.isExisting) {
            setImagesToDelete([...imagesToDelete, imageToRemove.id]);
        } else {
            // Giải phóng bộ nhớ blob cho ảnh mới
            URL.revokeObjectURL(imageToRemove.preview);
        }

        // 2. Định nghĩa hàm cập nhật thứ tự
        const getNewOrder = (order: number) => (order > displayOrder ? order - 1 : order);

        // 3. Cập nhật đồng thời để tránh lỗi race condition
        setExistingImages(
            existingImages.map(img => ({
                ...img,
                display_order: getNewOrder(img.display_order)
            }))
        );

        setNewImages(
            newImages
                .filter(img => img.display_order !== displayOrder)
                .map(img => ({
                    ...img,
                    display_order: getNewOrder(img.display_order)
                }))
        );
    };

    // Set as cover image (display_order = 1)
    const setAsCoverImage = (currentOrder: number) => {
        if (currentOrder === 1) return;

        const swapOrder = (order: number) => {
            if (order === 1) return currentOrder;
            if (order === currentOrder) return 1;
            return order;
        };

        setExistingImages(existingImages.map(img => ({
            ...img,
            display_order: swapOrder(img.display_order)
        })));

        setNewImages(newImages.map(img => ({
            ...img,
            display_order: swapOrder(img.display_order)
        })));
    };

    return (
        <div className="flex flex-col gap-4 w-full mt-6">
            <div className="flex justify-between items-center w-full">
                <div className="flex gap-2 items-center">
                    <label className="font-medium text-lg">Hình ảnh tour:</label>
                    <span className="text-sm text-gray-600">
                        {totalImages}/9 ảnh
                    </span>
                </div>
                <div className="flex items-center gap-4">
                    <span className="text-sm text-gray-500">
                        {totalImages === 0 && 'Chưa có ảnh nào'}
                        {totalImages > 0 && totalImages < 9 && `Còn ${9 - totalImages} ảnh`}
                        {totalImages === 9 && 'Đã đủ số lượng ảnh'}
                    </span>
                    <label className={`px-4 py-2 rounded-lg flex items-center gap-2 font-medium shadow-md transition cursor-pointer ${
                        totalImages >= 9 
                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                            : 'bg-blue-900 text-white hover:bg-blue-600'
                    }`}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                        </svg>
                        Tải ảnh lên
                        <input
                            type="file"
                            multiple
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="hidden"
                            disabled={totalImages >= 9}
                        />
                    </label>
                </div>
            </div>

            {totalImages === 0 ? (
                <p className="text-center text-gray-400 py-8 border-2 border-dashed rounded-lg w-full">
                    Chưa có ảnh nào. Nhấn tải hình ảnh lên để bắt đầu.
                </p>
            ) : (
                <div className="grid grid-cols-6 gap-4">
                    {allImages.filter(img => img.display_order === 1).map((image) => {
                        const index = allImages.findIndex(i => i.display_order === image.display_order);
                        return (
                            <div key={image.id} className="col-span-2 row-span-2 relative rounded-lg overflow-hidden cursor-pointer group" onClick={() => setSelectedImageIndex(index)}>
                                <Image src={image.preview} alt="Ảnh bìa tour" width={600} height={600} className="w-full h-full object-cover" />
                                <div className="absolute top-3 left-3 bg-blue-600 text-white text-xs px-3 py-1 rounded-full font-medium">Ảnh bìa</div>
                                {!image.isExisting && (
                                    <div className="absolute top-3 right-3 bg-green-600 text-white text-xs px-3 py-1 rounded-full font-medium">Mới</div>
                                )}
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <button onClick={(e) => { e.stopPropagation(); removeImage(image.display_order); }} className="bg-red-600 hover:bg-red-700 text-white p-3 rounded-full shadow-lg">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                    
                    <div className="col-span-4 grid grid-cols-4 gap-3">
                        {allImages.filter(img => img.display_order > 1).map((image) => {
                            const actualIndex = allImages.findIndex(i => i.display_order === image.display_order);
                            return (
                                <div key={image.id} className="relative aspect-square rounded-lg overflow-hidden cursor-pointer group" onClick={() => setSelectedImageIndex(actualIndex)}>
                                    <Image src={image.preview} alt={`Ảnh tour ${image.display_order}`} width={300} height={300} className="w-full h-full object-cover" />
                                    {!image.isExisting && (
                                        <div className="absolute top-2 right-2 bg-green-600 text-white text-[10px] px-2 py-0.5 rounded-full font-medium">Mới</div>
                                    )}
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                        <button onClick={(e) => { e.stopPropagation(); setAsCoverImage(image.display_order); }} className="bg-blue-900 hover:bg-blue-600 text-white p-2 rounded-full shadow-lg" title="Đặt làm ảnh bìa">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                        </button>
                                        <button onClick={(e) => { e.stopPropagation(); removeImage(image.display_order); }} className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-full shadow-lg" title="Xóa ảnh">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Modal Lightbox */}
            {selectedImageIndex !== null && allImages[selectedImageIndex] && (
                <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4" onClick={() => setSelectedImageIndex(null)}>
                    <button onClick={() => setSelectedImageIndex(null)} className="absolute top-4 right-4 text-white bg-black/50 rounded-full p-2 hover:bg-black/70 z-10"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg></button>
                    {selectedImageIndex > 0 && (
                        <button onClick={(e) => { e.stopPropagation(); setSelectedImageIndex(selectedImageIndex - 1); }} className="absolute left-4 text-white bg-black/50 rounded-full p-3 hover:bg-black/70"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" /></svg></button>
                    )}
                    <div className="relative max-w-5xl max-h-[80vh]" onClick={(e) => e.stopPropagation()}>
                        <Image src={allImages[selectedImageIndex].preview} alt="Full size" width={1200} height={800} className="max-w-full max-h-[80vh] w-auto h-auto object-contain rounded-lg" />
                    </div>
                    {selectedImageIndex < allImages.length - 1 && (
                        <button onClick={(e) => { e.stopPropagation(); setSelectedImageIndex(selectedImageIndex + 1); }} className="absolute right-4 text-white bg-black/50 rounded-full p-3 hover:bg-black/70"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" /></svg></button>
                    )}
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 max-w-[90%] overflow-x-auto pb-2 px-4">
                        {allImages.map((image, index) => (
                            <Image key={image.id} src={image.preview} alt="Thumbnail" width={64} height={64} className={`h-16 w-16 min-w-[4rem] object-cover rounded cursor-pointer transition-all border-2 ${index === selectedImageIndex ? 'border-blue-500 scale-110' : 'border-transparent opacity-60 hover:opacity-100'}`} onClick={(e) => { e.stopPropagation(); setSelectedImageIndex(index); }} />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}