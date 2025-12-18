'use client'

import Image from "next/image"
import axios from "axios"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation";
import { destinationFavourite } from "../types/destination"

const API_URL = process.env.NEXT_PUBLIC_URL_API;

export default function DestinationFavourite () {

    const router = useRouter()
    const regionList = ["Miền Bắc", "Miền Trung", "Miền Nam"];
    const [region, setRegion]= useState("Miền Bắc")
    const [destinations, setDestinations] = useState<destinationFavourite[]>([])

    const fetchDestinations = async (regionName: string) => {
        try {
            const res = await axios.get<destinationFavourite[]>(
                `${API_URL}/destination/allByRegion`,
                { params: { region: regionName } }
            )
            setDestinations(res.data ?? [])
        } catch (error) {
            console.error("Lỗi lấy destination", error)
            setDestinations([])
        }
    }
    useEffect(() => {
        fetchDestinations(region)
    }, [region])

    const getImage = (index: number): string | null => {
        const item = destinations[index]
        if (!item) return null

        if (item.image_url && item.image_url.trim() !== "")
            return item.image_url

        return null
    }

    const ImageBox = ({src, title}: {src?: string | null ; title?: string}) => {
        if (!src) return null

        return (
            <div className="relative w-full h-full rounded overflow-hidden cursor-pointer group">
                {/* Image */}
                <Image
                    src={src}
                    alt={title || ""}
                    fill
                    className="object-cover"
                />
                <div
                    className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-colors duration-300
                                flex flex-col items-center justify-center gap-3 "
                >
                    {/* Title*/}
                    <span className="text-white font-bold text-xl drop-shadow-lg">
                        {title}
                    </span>
                    {/* Button */}
                    <button
                        className="px-6 py-2 bg-blue-900 text-white font-semibold rounded-lg opacity-0
                            group-hover:opacity-100 transition-opacity duration-300 hover:bg-blue-800 cursor-pointer"
                        onClick={() => {
                            router.push(`/tours?destination=${title}`);
                        }}
                    >
                        Khám phá
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className="w-full">
            <div className="flex relative">
                <h1 className="text-blue-900 font-bold mx-auto text-3xl py-2">ĐIỂM ĐẾN YÊU THÍCH</h1>
                <span className="absolute border-2 border-blue-900 left-1/2 -translate-x-1/2 bottom-0 w-1/8"/>
            </div>
            <div className="flex my-4">
                <p className="mx-auto">Hãy chọn một điểm đến du lịch nổi tiếng dưới đây để khám phá các chuyến đi độc quyền của chúng tôi với mức giá vô cùng hợp lý.</p>
            </div>
            <div className="flex flex-col">
                {/* button */}
                <div className="flex mx-auto gap-6">
                    {regionList.map((item) => (
                        <button
                        key={item}
                        onClick={() => setRegion(item)}
                        className={`px-2 pb-1 font-bold transition-all cursor-pointer
                            ${region === item
                            ? "border-b-2 border-blue-900 text-blue-900"
                            : "hover:text-blue-900"
                            }`}
                        >
                        {item}
                        </button>
                    ))}
                </div>
                {/* image */}
                <div className="flex w-full gap-2 mt-4">
                    <div className="flex flex-col w-1/2 rounded gap-2 ">
                        <div className="flex h-[600px] rounded gap-2">
                            <div className="w-6/10 rounded border-gray-300 border-2 relative">
                                <ImageBox
                                    src={getImage(0)}
                                    title={destinations[0]?.name}
                                />
                            </div>
                            <div className="flex flex-col w-4/10 rounded gap-2">
                                <div className="flex h-1/2 rounded border-gray-300 border-2 relative">
                                    <ImageBox
                                        src={getImage(1)}
                                        title={destinations[1]?.name}
                                    />
                                </div>
                                <div className="flex h-1/2 rounded border-gray-300 border-2 relative">
                                    <ImageBox
                                        src={getImage(3)}
                                        title={destinations[3]?.name}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="flex h-[300px] rounded gap-2">
                            <div className="w-4/10 rounded border-gray-300 border-2 relative">
                                <ImageBox
                                    src={getImage(5)}
                                    title={destinations[5]?.name}
                                />
                            </div>
                            <div className="w-6/10 rounded border-gray-300 border-2 relative">
                                <ImageBox
                                    src={getImage(7)}
                                    title={destinations[7]?.name}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col w-1/2 gap-2 rounded">
                        <div className="flex h-[296px] rounded border-gray-300 border-2 relative">
                            <ImageBox
                                src={getImage(2)}
                                title={destinations[2]?.name}
                            />
                        </div>
                        <div className="flex h-[600px] gap-2 rounded">
                            <div className="flex flex-col w-1/2 gap-2 rounded">
                                <div className="h-1/2 rounded border-gray-300 border-2 relative">
                                    <ImageBox
                                        src={getImage(4)}
                                        title={destinations[4]?.name}
                                    />
                                </div>
                                <div className="h-1/2 rounded border-gray-300 border-2 relative">
                                    <ImageBox
                                        src={getImage(6)}
                                        title={destinations[6]?.name}
                                    />
                                </div>
                            </div>
                            <div className="w-1/2 rounded border-gray-300 border-2 relative">
                                <ImageBox
                                    src={getImage(8)}
                                    title={destinations[8]?.name}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}