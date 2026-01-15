'use client'

import { useState } from "react";
import Image from "next/image";
import Lightbox from "yet-another-react-lightbox";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import Fullscreen from "yet-another-react-lightbox/plugins/fullscreen";
import "yet-another-react-lightbox/styles.css";
import "yet-another-react-lightbox/plugins/thumbnails.css";

interface TourGalleryProps {
    images: { image_url: string }[];
}

export default function TourGallery({ images }: TourGalleryProps) {
    const [open, setOpen] = useState(false);
    const [index, setIndex] = useState(0);

    const imageUrls = images.map(img => img.image_url);
    const hasImages = imageUrls.length > 0;

    if (!hasImages) {
        return (
        <div className="h-[500px] flex items-center justify-center bg-gray-100 rounded-2xl">
            <p className="text-gray-500 text-lg">Chưa có ảnh tour</p>
        </div>
        );
    }

    const mainImage = imageUrls[0];
    const smallImages = imageUrls.slice(1, 5);
    const remainingCount = Math.max(0, imageUrls.length - 5);

    return (
        <div>
        {/* Grid Gallery */}
            <div className="flex flex-col md:flex-row gap-4 h-[500px] rounded-2xl overflow-hidden mt-4">
                {/* Ảnh chính (bên trái - chiếm 60%) */}
                <div
                    onClick={() => {
                        setIndex(0);
                        setOpen(true);
                    }}
                    className="relative flex-1 cursor-pointer group overflow-hidden rounded-2xl"
                >
                    <Image
                        src={mainImage}
                        alt="Ảnh chính tour"
                        fill
                        priority
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 768px) 100vw, 60vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="absolute bottom-5 left-5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <span className="bg-white/95 backdrop-blur-sm text-gray-900 px-5 py-2.5 rounded-full text-sm font-semibold shadow-lg">
                            Xem tất cả {imageUrls.length} ảnh
                        </span>
                    </div>
                </div>

                <div className="flex-1 flex flex-col gap-4">
                    <div className="flex flex-1 gap-4">
                        <div className="flex-1 flex flex-col gap-4">
                            {smallImages.slice(0, 2).map((src, i) => (
                                <div
                                    key={i}
                                    onClick={() => {
                                        setIndex(i + 1);
                                        setOpen(true);
                                    }}
                                    className="relative flex-1 overflow-hidden cursor-pointer group shadow-md hover:shadow-xl transition-all rounded-2xl"
                                >
                                    <Image
                                        src={src}
                                        alt={`Ảnh tour ${i + 2}`}
                                        fill
                                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                                        sizes="(max-width: 768px) 50vw, 20vw"
                                    />
                                </div>
                            ))}
                        </div>

                        <div className="flex-1 flex flex-col gap-4">
                            {smallImages.slice(2, 4).map((src, i) => {
                                const actualIndex = i + 2; 
                                const isLastSmall = i === 1;
                                return (
                                    <div
                                        key={actualIndex}
                                        onClick={() => {
                                        setIndex(actualIndex + 1);
                                        setOpen(true);
                                        }}
                                        className="relative flex-1 overflow-hidden cursor-pointer group shadow-md hover:shadow-xl transition-all rounded-2xl"
                                    >
                                        <Image
                                        src={src}
                                        alt={`Ảnh tour ${actualIndex + 2}`}
                                        fill
                                        className="object-cover group-hover:scale-110 transition-transform duration-700"
                                        sizes="(max-width: 768px) 50vw, 20vw"
                                        />
                                        {isLastSmall && remainingCount > 0 && (
                                            <div
                                                className="absolute inset-0 bg-black/70 flex items-center justify-center rounded-2xl transition-opacity group-hover:bg-black/80"
                                                onClick={(e) => {
                                                e.stopPropagation();
                                                setIndex(5);
                                                setOpen(true);
                                                }}
                                            >
                                                <span className="text-white text-5xl font-bold tracking-wider">
                                                    +{remainingCount}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>

            {/* Lightbox */}
            <Lightbox
                open={open}
                close={() => setOpen(false)}
                index={index}
                slides={imageUrls.map(src => ({ src }))}
                on={{ view: ({ index }) => setIndex(index) }}
                styles={{
                    container: { backgroundColor: "rgba(0,0,0,0.95)" },
                }}
                plugins={[Thumbnails, Zoom, Fullscreen]}
                thumbnails={{
                    width: 100,
                    height: 70,
                    border: 3,
                    borderColor: "#fff",
                    borderRadius: 8,
                    gap: 16,
                    vignette: true,
                }}
                zoom={{ maxZoomPixelRatio: 5 }}
                carousel={{ finite: imageUrls.length <= 1 }}
                controller={{ closeOnBackdropClick: true }}
                render={{
                    buttonPrev: imageUrls.length <= 1 ? () => null : undefined,
                    buttonNext: imageUrls.length <= 1 ? () => null : undefined,
                }}
            />
        </div>
    );
}