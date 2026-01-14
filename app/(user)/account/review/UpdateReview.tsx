'use client'

import { useState, useEffect, useCallback, DragEvent } from 'react'
import Image from 'next/image'
import ReviewImagesInfo from '@/app/types/review_images'

const API_URL = process.env.NEXT_PUBLIC_URL_API
const MAX_TOTAL_IMAGES = 2

interface UpdateReviewProps {
    isOpen: boolean
    onClose: () => void
    reviewId: string
    onSuccess: () => void
}

export default function UpdateReviewUser({isOpen,onClose,reviewId,onSuccess}: UpdateReviewProps) {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [rating, setRating] = useState(0)
    const [comment, setComment] = useState('')
    const [existingImages, setExistingImages] = useState<ReviewImagesInfo[]>([])
    const [deletedImageIds, setDeletedImageIds] = useState<string[]>([])
    const [newImages, setNewImages] = useState<File[]>([])
    const [newPreviews, setNewPreviews] = useState<string[]>([])
    const [dragOver, setDragOver] = useState(false)

    // sum images
    const totalCurrentImages = existingImages.length + newImages.length
    const canUploadMore = totalCurrentImages < MAX_TOTAL_IMAGES
    const remainingSlots = MAX_TOTAL_IMAGES - totalCurrentImages

    const fetchReview = useCallback(async () => {
        if (!reviewId) return

        try {
            setLoading(true)
            setError(null)
            const res = await fetch(`${API_URL}/reviews/${reviewId}`, {
                method: 'GET',
                credentials: 'include',
            })
            if (!res.ok) {
                const errData = await res.json()
                throw new Error(errData.message || 'Không thể tải thông tin đánh giá')
            }
            const data = await res.json()
            setRating(data.review?.rating || 0)
            setComment(data.review?.comment || '')
            setExistingImages(data.images || [])
            setDeletedImageIds([])
            setNewImages([])
            setNewPreviews([])
        } catch (err) {
            setError('Có lỗi khi tải đánh giá')
            console.error('Fetch review error:', err)
        } finally {
            setLoading(false)
        }
    }, [reviewId])

    useEffect(() => {
        if (isOpen) {
            fetchReview()
        } else {
            setRating(0)
            setComment('')
            setExistingImages([])
            setDeletedImageIds([])
            setNewImages([])
            setNewPreviews([])
            setError(null)
        }
    }, [isOpen, fetchReview])

    useEffect(() => {
        return () => {
        newPreviews.forEach(url => URL.revokeObjectURL(url))
        }
    }, [newPreviews])

    const handleFiles = (files: FileList | null) => {
        if (!files || !canUploadMore) return

        const validFiles = Array.from(files)
        .filter(file => file.type.startsWith('image/'))
        .slice(0, remainingSlots)

        if (validFiles.length === 0) return

        const newPrevs = validFiles.map(file => URL.createObjectURL(file))

        setNewImages(prev => [...prev, ...validFiles])
        setNewPreviews(prev => [...prev, ...newPrevs])
    }
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        handleFiles(e.target.files)
    }
    const handleDrop = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault()
        setDragOver(false)
        handleFiles(e.dataTransfer.files)
    }
    const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault()
        setDragOver(true)
    }
    const handleDragLeave = () => setDragOver(false)
    const handleRemoveExisting = (imageId: string) => {
        setExistingImages(prev => prev.filter(img => img.image_id !== imageId))
        setDeletedImageIds(prev => [...new Set([...prev, imageId])])
    }
    const handleRemoveNew = (index: number) => {
        const removedPreview = newPreviews[index]
        URL.revokeObjectURL(removedPreview)

        setNewImages(prev => prev.filter((_, i) => i !== index))
        setNewPreviews(prev => prev.filter((_, i) => i !== index))
    }
    const handleSubmit = async () => {
        if (loading) return
        try {
            setLoading(true)
            setError(null)
            const formData = new FormData()
            formData.append('rating', rating.toString())
            formData.append('comment', comment.trim())
            deletedImageIds.forEach(id => formData.append('delete_image_ids[]', id))
            newImages.forEach(file => formData.append('images', file))
            const res = await fetch(`${API_URL}/reviews/update/${reviewId}`, {
                method: 'PATCH',
                body: formData,
                credentials: 'include',
            })
            if (!res.ok) {
                const errData = await res.json()
                throw new Error(errData.message || 'Cập nhật đánh giá thất bại')
            }
            onSuccess()
            onClose()
        } catch (err) {
            setError('Có lỗi xảy ra khi cập nhật')
            console.error('Update review error:', err)
        } finally {
            setLoading(false)
        }
    }

    if (!isOpen) return null

    return (
        <div
            className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
            onClick={onClose}
        >
            <div
                className="bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl relative"
                onClick={e => e.stopPropagation()}
            >
                <button
                    onClick={onClose}
                    disabled={loading}
                    className="absolute top-4 right-5 text-gray-500 hover:text-gray-800 text-2xl"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                <div className="p-6 md:p-8">
                <h2 className="text-2xl font-bold text-blue-900 mb-6">
                    Cập nhật đánh giá của bạn
                </h2>

                {loading && (
                    <div className="absolute inset-0 bg-white/60 flex items-center justify-center z-10">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                    </div>
                )}

                {/* Rating */}
                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Đánh giá (1–5 sao)
                    </label>
                    <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map(star => (
                        <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        disabled={loading}
                        className="focus:outline-none"
                        >
                        <svg
                            className="h-9 w-9 transition-transform hover:scale-110"
                            fill={star <= rating ? 'currentColor' : 'none'}
                            viewBox="0 0 24 24"
                            stroke={star <= rating ? 'none' : 'currentColor'}
                            color={star <= rating ? '#FBBF24' : '#D1D5DB'}
                        >
                            <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={star <= rating ? 0 : 1.5}
                            d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.98 2.89a1 1 0 00-.364 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.364-1.118L2.98 10.001c-.783-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                            />
                        </svg>
                        </button>
                    ))}
                    </div>
                </div>

                {/* Comment */}
                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bình luận
                    </label>
                    <textarea
                    rows={4}
                    value={comment}
                    onChange={e => setComment(e.target.value)}
                    disabled={loading}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none"
                    placeholder="Chia sẻ cảm nhận của bạn về tour..."
                    />
                </div>

                {/* Gallery chung cho cả ảnh cũ + mới */}
                <div className="mb-6">
                    <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-medium text-gray-700">
                        Hình ảnh ({totalCurrentImages}/{MAX_TOTAL_IMAGES})
                    </h3>
                    {remainingSlots > 0 && (
                        <span className="text-xs text-gray-500">
                        Còn {remainingSlots} slot
                        </span>
                    )}
                    </div>

                    {/* Khu vực hiển thị tất cả ảnh */}
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mb-4">
                    {/* Ảnh cũ còn lại */}
                    {existingImages.map(img => (
                        <div key={img.image_id} className="relative group">
                        <Image
                            src={img.image_url}
                            alt="Existing review image"
                            width={160}
                            height={160}
                            className="rounded-lg object-cover border w-full aspect-square"
                        />
                        <button
                            onClick={() => handleRemoveExisting(img.image_id)}
                            disabled={loading}
                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                        </div>
                    ))}

                    {/* Ảnh mới preview */}
                    {newPreviews.map((preview, index) => (
                        <div key={`new-${index}`} className="relative group">
                        <Image
                            src={preview}
                            alt={`New preview ${index + 1}`}
                            width={160}
                            height={160}
                            className="rounded-lg object-cover border w-full aspect-square"
                        />
                        <button
                            onClick={() => handleRemoveNew(index)}
                            disabled={loading}
                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                        </div>
                    ))}
                    </div>

                    {/* Khu vực upload (chỉ hiện khi còn slot) */}
                    {canUploadMore ? (
                    <div
                        onDrop={handleDrop}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        className={`border-2 border-dashed rounded-xl p-6 text-center transition-colors ${
                        dragOver ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-400'
                        }`}
                    >
                        <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleFileChange}
                        className="hidden"
                        id="newImagesUpload"
                        />
                        <label htmlFor="newImagesUpload" className="cursor-pointer">
                        <p className="text-gray-600 font-medium">Thêm ảnh mới</p>
                        <p className="text-sm text-gray-400 mt-1">
                            Kéo thả hoặc nhấn để chọn (còn {remainingSlots} slot)
                        </p>
                        </label>
                    </div>
                    ) : (
                    <div className="border border-gray-300 rounded-xl p-4 text-center bg-gray-50">
                        <p className="text-gray-500 text-sm">
                        Đã đạt giới hạn {MAX_TOTAL_IMAGES} ảnh
                        </p>
                    </div>
                    )}
                </div>

                {/* Error */}
                {error && <p className="text-red-600 text-sm mb-4">{error}</p>}

                {/* Buttons */}
                <div className="flex justify-end gap-4 mt-8">
                    <button
                    type="button"
                    onClick={onClose}
                    disabled={loading}
                    className="px-6 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 transition"
                    >
                    Hủy
                    </button>
                    <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={loading}
                    className={`px-6 py-2.5 text-white rounded-lg font-medium transition ${
                        loading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
                    }`}
                    >
                    {loading ? 'Đang cập nhật...' : 'Cập nhật đánh giá'}
                    </button>
                </div>
                </div>
            </div>
        </div>
    )
}