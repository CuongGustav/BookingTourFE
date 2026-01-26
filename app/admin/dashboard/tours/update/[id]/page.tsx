'use client'

import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { TourDetailInfo } from "@/app/types/tour";
import { formatPrice } from "@/app/common";
import { parseFormattedNumber } from "@/app/common";
import Image from "next/image";
import TourDestination from "./TourDestination";
import { destinationCreateTour } from "@/app/types/destination";
import TourItinerary from "./TourItinerary";
import { ItineraryInforFE } from "@/app/types/tour_itinerary";
import TourSchedule from "./TourSchedule";
import { UpdateTourSchedule } from "@/app/types/tour_schedule";
import TourImages from "./TourImages";
import { CreateImageTourFE, ReadTourImages } from "@/app/types/tour_images";

const API_URL = process.env.NEXT_PUBLIC_URL_API;

interface BackendError {
  index: number;
  message?: string;
  errors?: Record<string, string[]>;
}

export default function UpdateTourPage() {
    const { id } = useParams(); 
    const router = useRouter();
    const [tour, setTour] = useState<TourDetailInfo | null>(null);
    const [originalTour, setOriginalTour] = useState<TourDetailInfo | null>(null);
    const [loading, setLoading] = useState(true);

    const [title, setTitle] = useState("");
    const [durationDays, setDurationDays] = useState(0);
    const [durationNights, setDurationNights] = useState(0);
    const [isFeatured, setIsFeatured] = useState<0 | 1>(0);
    const [isActive, setIsActive] = useState<0 | 1>(0);
    const [departDestination, setDepartDestination] = useState("");
    const [basePrice, setBasePrice] = useState(0);
    const [childPrice, setChildPrice] = useState(0);
    const [infantPrice, setInfantPrice] = useState(0);
    const [singleRoomSurcharge, setSingleRoomSurcharge] = useState(0);
    const [highlights, setHighlights] = useState("");
    const [attractions, setAttractions] = useState("");
    const [cuisine, setCuisine] = useState("");
    const [idealTime, setIdealTime] = useState("");
    const [suitableFor, setSuitableFor] = useState("");
    const [transportation, setTransportation] = useState("");
    const [promotion, setPromotion] = useState("");
    const [includedServices, setIncludedServices] = useState("");
    const [excludedServices, setExcludedServices] = useState("");
    const [imageMainFile, setImageMainFile] = useState<File | null>(null); 
    const [preview, setPreview] = useState<string>(""); 
    const [dragOver, setDragOver] = useState(false);

    const [allDestinations, setAllDestinations] = useState<destinationCreateTour[]>([]);
    const [selectedDestinationIds, setSelectedDestinationIds] = useState<string[]>([]);
    const [originalDestinationIds, setOriginalDestinationIds] = useState<string[]>([]);

    const [itineraries, setItineraries] = useState<ItineraryInforFE[]>([]);
    const [originalItineraries, setOriginalItineraries] = useState<ItineraryInforFE[]>([]);

    const [schedules, setSchedules] = useState<UpdateTourSchedule[]>([]);
    const [originalSchedules, setOriginalSchedules] = useState<UpdateTourSchedule[]>([]);
    const [schedulesChanged, setSchedulesChanged] = useState(false);

    const [existingTourImages, setExistingTourImages] = useState<ReadTourImages[]>([]);
    const [originalTourImages, setOriginalTourImages] = useState<ReadTourImages[]>([]);
    const [newTourImages, setNewTourImages] = useState<CreateImageTourFE[]>([]);
    const [imagesToDelete, setImagesToDelete] = useState<string[]>([]);
    
    const [durationError, setDurationError]=useState<string|null>(null)
    const [priceError, setPriceError] = useState<string|null>(null)
    const [hasScheduleError, setHasScheduleError] = useState(false); 

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [tourInfoChanged, setTourInfoChanged] = useState(false);
    const [destinationsChanged, setDestinationsChanged] = useState(false);
    const [itinerariesChanged, setItinerariesChanged] = useState(false);
    const [imagesChanged, setImagesChanged] = useState(false);
    const hasChanges = tourInfoChanged || destinationsChanged || itinerariesChanged || schedulesChanged || imagesChanged;

    const [autoCalculateChildPrice, setAutoCalculateChildPrice] = useState<boolean>(true);
    const [autoCalculateInfantPrice, setAutoCalculateInfantPrice] = useState<boolean>(true);

    //auto calculate childPrice, infantPrice
    useEffect(() => {
        if (basePrice > 0) {
            if (autoCalculateChildPrice) {
                setChildPrice(Math.round(basePrice * 0.7)); 
            }
            if (autoCalculateInfantPrice) {
                setInfantPrice(Math.round(basePrice * 0.4)); 
            }
        }
    }, [basePrice, autoCalculateChildPrice, autoCalculateInfantPrice]);

    //auto calculate schedule childPrice, infantPrice
    

    //check duration_days, duration_nights
    useEffect(() => {
        const valDay = durationDays - durationNights;
        const valNight = durationNights - durationDays;
        if (valDay > 1) {
            setDurationError("Số ngày không được nhiều hơn số đêm quá 1");
        } else if (valNight > 1) {
            setDurationError("Số đêm không được nhiều hơn số ngày quá 1");
        } else {
            setDurationError(null);
        }
    }, [durationDays, durationNights]);

    //check price
    useEffect(() => {
        const basePriceNew = Number(basePrice);
        const childPriceNew = Number(childPrice);
        const infantPriceNew = Number(infantPrice);
        const singleRoomSurchargeNew = Number(singleRoomSurcharge)
        if (basePriceNew === 0 && childPriceNew === 0 && infantPriceNew === 0 && singleRoomSurchargeNew) {
            setPriceError(null);
            return;
        }
        if (childPriceNew > 0 && basePriceNew > 0 && childPriceNew >= basePriceNew) {
            setPriceError("Giá trẻ em phải nhỏ hơn giá gốc");
        } else if (infantPriceNew > 0 && childPriceNew > 0 && infantPriceNew >= childPriceNew) {
            setPriceError("Giá sơ sinh phải nhỏ hơn giá trẻ em");
        } else if (infantPriceNew > 0 && basePriceNew > 0 && infantPriceNew >= basePriceNew) {
            setPriceError("Giá sơ sinh phải nhỏ hơn giá gốc");
        } else {
            setPriceError(null);
        }
    }, [basePrice, childPrice, infantPrice, singleRoomSurcharge]);
    //image main
    const setImageMain = (file: File) => {
        setImageMainFile(file);
        setPreview(URL.createObjectURL(file)); // preview image
    };
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file && file.type.startsWith('image/')) {
            setImageMain(file);
        }
    };
    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setDragOver(false);
        const file = e.dataTransfer.files?.[0];
        if (file && file.type.startsWith('image/')) {
            setImageMain(file);
        }
    };
    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setDragOver(true);
    };
    const handleDragLeave = () => {
        setDragOver(false);
    };
    const handleRemoveImage = () => {
        setImageMainFile(null);
        setPreview(""); 
    };

    useEffect(() => {
        const fetchTour = async () => {
            try {
                const res = await fetch(`${API_URL}/tour/admin/${id}`, {
                    credentials: "include"
                });
                const result = await res.json();
                if (res.ok && result.data) {
                    const tourData = result.data as TourDetailInfo;
                    setTour(tourData);
                    setOriginalTour(tourData);
                    setTitle(tourData.title);
                    setDurationDays(tourData.duration_days);
                    setDurationNights(tourData.duration_nights);
                    setIsFeatured(tourData.is_featured ? 1 : 0);
                    setDepartDestination(tourData.depart_destination);
                    setBasePrice(tourData.base_price);
                    setChildPrice(tourData.child_price);
                    setInfantPrice(tourData.infant_price);
                    setIsActive(tourData.is_active ? 1 : 0);
                    setHighlights(tourData.highlights);
                    setAttractions(tourData.attractions);
                    setCuisine(tourData.cuisine);
                    setIdealTime(tourData.ideal_time);
                    setSuitableFor(tourData.suitable_for);
                    setTransportation(tourData.transportation);
                    setPromotion(tourData.promotions);
                    setIncludedServices(tourData.included_services);
                    setExcludedServices(tourData.excluded_services);
                    setSingleRoomSurcharge(tourData.single_room_surcharge);
                    if (tourData.main_image_url) {
                        setPreview(tourData.main_image_url); // URL from Cloudinary
                    }

                    const currentIds = tourData.destinations?.map(d => d.destination_id) || [];
                    setSelectedDestinationIds(currentIds);
                    setOriginalDestinationIds(currentIds);
                    //fetch all destinations
                    const destRes = await fetch(`${API_URL}/destination/allCreateTour`, { credentials: "include" });
                    const destResult = await destRes.json();
                    if (destRes.ok) {
                        setAllDestinations(destResult.data || destResult);
                    }

                    const currentItins: ItineraryInforFE[] = (tourData.itineraries || []).map((it) => ({
                        itinerary_id: it.itinerary_id,
                        title: it.title,
                        description: it.description ?? "",
                        meals: it.meals ?? "",
                        display_order: it.display_order,
                    }));

                    setItineraries(currentItins);
                    setOriginalItineraries(currentItins);

                    //schedules
                    const formattedSchedules: UpdateTourSchedule[] = (tourData.schedules || []).map(s => ({
                        schedule_id: s.schedule_id,
                        departure_date: s.departure_date,
                        return_date: s.return_date,
                        available_seats: s.available_seats,
                        price_adult: s.price_adult,
                        price_child: s.price_child || 0,
                        price_infant: s.price_infant || 0,
                    }));

                    setSchedules(formattedSchedules);
                    setOriginalSchedules(formattedSchedules);

                    //images
                    if (tourData.images) {
                        setExistingTourImages(tourData.images);
                        setOriginalTourImages(tourData.images);
                    }


                } else {
                    alert(result.message || "Không tải được thông tin tour");
                    router.back();
                }
            } catch (err) {
                console.error("Lỗi kết nối:", err);
                alert("Lỗi kết nối server");
                router.back();
            } finally {
                setLoading(false);
            }
        };

        fetchTour();
    }, [id, router]); 

    // change tour infor yet?
    useEffect(() => {
        if (!originalTour) return;
        const changed =
            title !== originalTour.title ||
            durationDays !== originalTour.duration_days ||
            durationNights !== originalTour.duration_nights ||
            isFeatured !== originalTour.is_featured ||
            isActive !== originalTour.is_active ||
            departDestination !== originalTour.depart_destination ||
            basePrice !== originalTour.base_price ||
            childPrice !== originalTour.child_price ||
            infantPrice !== originalTour.infant_price ||
            singleRoomSurcharge !== originalTour.single_room_surcharge ||
            highlights !== (originalTour.highlights || "") ||
            attractions !== (originalTour.attractions || "") ||
            cuisine !== (originalTour.cuisine || "") ||
            idealTime !== (originalTour.ideal_time || "") ||
            suitableFor !== (originalTour.suitable_for || "") ||
            transportation !== (originalTour.transportation || "") ||
            promotion !== (originalTour.promotions || "") ||
            includedServices !== (originalTour.included_services || "") ||
            excludedServices !== (originalTour.excluded_services || "") ||
            imageMainFile !== null;

        setTourInfoChanged(changed);
    }, [title, durationDays, durationNights, isFeatured, isActive, departDestination, basePrice, childPrice, infantPrice,
        highlights, attractions, cuisine, idealTime, suitableFor, transportation, promotion, includedServices, excludedServices,
        imageMainFile, singleRoomSurcharge, originalTour]);

    //change tour destinations yet?    
    useEffect(() => {
        const sortedCurrent = [...selectedDestinationIds].sort();
        const sortedOriginal = [...originalDestinationIds].sort();
        setDestinationsChanged(JSON.stringify(sortedCurrent) !== JSON.stringify(sortedOriginal));
    }, [selectedDestinationIds, originalDestinationIds]);

    // change tour itineraries yet?
    useEffect(() => {
        const changed = JSON.stringify(itineraries.sort((a,b) => a.display_order - b.display_order)) !==
                        JSON.stringify(originalItineraries.sort((a,b) => a.display_order - b.display_order));
        setItinerariesChanged(changed);
    }, [itineraries, originalItineraries]);

    // change tour schedule yet?
    useEffect(() => {
        const changed = JSON.stringify(schedules) !== JSON.stringify(originalSchedules);
        setSchedulesChanged(changed);
    }, [schedules, originalSchedules]);

    // update function
    const handleUpdateTour = async () => {
        if (!title.trim()) {
            alert("Vui lòng nhập tiêu đề tour");
            return;
        }
        if (durationError || priceError || hasScheduleError) {
            alert("Vui lòng sửa các lỗi trước khi cập nhật");
            return;
        }
        if (!hasChanges) {
            alert("Không có thay đổi nào để cập nhật");
            return;
        }
        if (!preview) {
            alert("Vui lòng giữ lại hoặc tải lên một hình ảnh chính cho tour");
            return;
        }


        setIsSubmitting(true);
        try {
            // 1. Cập nhật thông tin tour chính + ảnh
            if (tourInfoChanged || imageMainFile) {
                const formData = new FormData();
                formData.append('title', title);
                formData.append('duration_days', durationDays.toString());
                formData.append('duration_nights', durationNights.toString());
                formData.append('is_featured', isFeatured.toString());
                formData.append('is_active', isActive.toString());
                formData.append('depart_destination', departDestination);
                formData.append('base_price', basePrice.toString());
                formData.append('child_price', childPrice.toString());
                formData.append('infant_price', infantPrice.toString());
                formData.append('highlights', highlights || "");
                formData.append('attractions', attractions || "");
                formData.append('cuisine', cuisine || "");
                formData.append('ideal_time', idealTime || "");
                formData.append('suitable_for', suitableFor || "");
                formData.append('transportation', transportation || "");
                formData.append('promotions', promotion || "");
                formData.append('included_services', includedServices || "");
                formData.append('excluded_services', excludedServices || "");
                formData.append("single_room_surcharge", singleRoomSurcharge.toString());
                if (imageMainFile) {
                    formData.append('main_image', imageMainFile);
                }

                const resTourInfo = await fetch(`${API_URL}/tour/admin/update/${id}`, {
                    method: 'PUT',
                    body: formData,
                    credentials: "include"
                });

                const data = await resTourInfo.json();
                if (!resTourInfo.ok) throw new Error(data.message || "Cập nhật thông tin tour thất bại");
            }

            // 2. Cập nhật điểm đến
            if (destinationsChanged) {
                const res = await fetch(`${API_URL}/tour_destinations/admin/update/${id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ destination_ids: selectedDestinationIds }),
                    credentials: "include"
                });
                const data = await res.json();
                if (!res.ok) throw new Error(data.message || "Cập nhật điểm đến thất bại");
                setOriginalDestinationIds([...selectedDestinationIds]);
            }

            // 3. Cập nhật lịch trình chi tiết (itinerary)
            if (itinerariesChanged) {
                const res = await fetch(`${API_URL}/tour_itineraries/admin/update/${id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ itineraries }),
                    credentials: "include"
                });
                const data = await res.json();
                if (!res.ok) throw new Error(data.message || "Cập nhật lịch trình chi tiết thất bại");
                setOriginalItineraries([...itineraries]);
            }

            // 4. Cập nhật lịch khởi hành (schedule)
            if (schedulesChanged) {
                const cleanedSchedules = schedules.map((s) => ({
                    schedule_id: s.schedule_id || null,
                    departure_date: s.departure_date,
                    return_date: s.return_date,
                    available_seats: Number(s.available_seats),
                    price_adult: Number(s.price_adult),
                    price_child: Number(s.price_child || 0),
                    price_infant: Number(s.price_infant || 0),
                }));

                const res = await fetch(`${API_URL}/tour_schedules/admin/update/${id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ schedules: cleanedSchedules }),
                    credentials: "include"
                });

                const data = await res.json();

                if (!res.ok) {
                    const errorMessages = data.errors
                    ? data.errors.map((e: BackendError) => {
                        if (e.message) {
                            return `Đợt ${e.index + 1}: ${e.message}`;
                        } else if (e.errors) {
                            return `Đợt ${e.index + 1}: ${Object.entries(e.errors).map(([field, msgs]) => `${field}: ${msgs.join(', ')}`).join('; ')}`;
                        } else {
                            return `Đợt ${e.index + 1}: Lỗi không xác định`;
                        }
                        }).join('\n')
                    : data.message;

                    throw new Error("Cập nhật lịch khởi hành thất bại:\n" + errorMessages);
                }

                setOriginalSchedules([...schedules]);
                setSchedulesChanged(false);
            }

            // images tour
            if (imagesChanged) {
                const formData = new FormData();
                
                // Add images to delete
                imagesToDelete.forEach(id => {
                    formData.append('image_ids', id);
                });
                
                // Add new images
                newTourImages.forEach((img) => {
                    formData.append('images', img.file);
                    formData.append('display_orders', img.display_order.toString());
                });
                
                const res = await fetch(`${API_URL}/tour_images/admin/update/${id}`, {
                    method: 'PUT',
                    body: formData,
                    credentials: "include"
                });
                
                const data = await res.json();
                if (!res.ok) throw new Error(data.message || "Cập nhật hình ảnh tour thất bại");
                
                // Reset images state
                setNewTourImages([]);
                setImagesToDelete([]);
                setImagesChanged(false);
            }


            alert("Cập nhật tour thành công!");
            router.push('/admin/dashboard/tours');

        } catch (err: unknown) {
            console.error('Lỗi khi cập nhật tour:', err);
            alert((err as Error).message || 'Lỗi kết nối server. Vui lòng thử lại.');
        }finally {
            setIsSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="p-8 text-center text-lg">
                Đang tải thông tin tour...
            </div>
        );
    }
    if (!tour) {
        return <div className="p-8 text-center text-red-600">Không tìm thấy tour</div>;
    }
    
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
                <h1 className="text-3xl font-bold mb-6 text-main">Cập nhật tour</h1>
            </div>
            <div className="flex flex-col gap-2 pb-16">
                {/* title */}
                <div className="flex w-full">
                    <div className="flex w-full items-center">
                        <div className="flex items-center w-full">
                            <label className="font-medium w-[120px]">Tiêu đề tour:</label>
                            <input 
                                type="text"
                                value={title}
                                className="flex-1 border px-2 py-1 rounded-lg"
                                onChange={(e) => setTitle(e.target.value)}
                            />
                        </div>
                    </div>
                </div>
                <div className="flex gap-8 ">
                    {/* duration_days, duration_nights, is_feature , depart_destination*/}
                    <div className="flex w-1/3 gap-2 flex-col">
                        {/* duration_days */}
                        <div className="flex items-center w-full">
                            <label className="font-medium w-[128px]">Số Ngày:</label>
                            <input
                                type="number"
                                value={durationDays === 0 ? '' : durationDays}
                                className="flex-1 border px-2 py-1 rounded-lg"
                                onChange={(e) => {
                                    const value = e.target.value === '' ? 0 : parseInt(e.target.value);
                                    setDurationDays(value);
                                }}
                                min="0"
                            />
                        </div>
                        {/* duration_nights */}
                        <div className="flex items-center w-full">
                            <label className="font-medium w-[128px]">Số Đêm:</label>
                            <input
                                type="number"
                                value={durationNights === 0 ? '' : durationNights}
                                className="flex-1 border px-2 py-1 rounded-lg"
                                onChange={(e) => {
                                    const value = e.target.value === '' ? 0 : parseInt(e.target.value);
                                    setDurationNights(value);
                                }}
                                min="0"
                            />
                        </div>
                        {durationError && (
                            <p className="text-red-600 text-sm mt-1 lg:pl-30">
                                {durationError}
                            </p>
                        )}
                        {/* tour hot */}
                        <div className="flex items-center w-full">
                            <label className="font-medium w-[128px]">Tour hot:</label>
                            <select
                                value={isFeatured}
                                onChange={(e) => setIsFeatured(Number(e.target.value) as 0 | 1)}
                                className="flex-1 border px-2 py-1 rounded-lg"
                            >
                                <option value={0}>Không</option>
                                <option value={1}>Có</option>
                            </select>
                        </div>
                        {/* tour active */}
                        <div className="flex items-center w-full">
                            <label className="font-medium w-[128px]">Hoạt động:</label>
                            <select
                                value={isActive}
                                onChange={(e) => setIsActive(Number(e.target.value) as 0 | 1)}
                                className="flex-1 border px-2 py-1 rounded-lg"
                            >
                                <option value={0}>Không</option>
                                <option value={1}>Có</option>
                            </select>
                        </div>
                        {/* depart destination */}
                        <div className="flex items-center w-full gap-2">
                            <label className="w-[120px] font-medium flex items-center">
                                Điểm xuất phát:
                            </label>

                            <div className="flex flex-1  border rounded-lg items-center">
                                <select
                                    className="w-full h-full px-2 py-1 outline-none bg-transparent"
                                    value={departDestination}
                                    onChange={(e) => setDepartDestination(e.target.value)}
                                >
                                    <option value="TP. Hà Nội">TP. Hà Nội</option>
                                    <option value="TP. Hồ Chí Minh">TP. Hồ Chí Minh</option>
                                    <option value="TP. Đà Nẵng">TP. Đà Nẵng</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    {/* PRICE */}
                    <div className="flex flex-col gap-3 w-full">
                        {/*PRICE BASE */}
                        <div className="flex items-center w-full gap-2">
                            <label className="w-[120px] font-medium flex items-center">
                                Giá gốc:
                            </label>

                            <div className="flex flex-1  border rounded-lg items-center">
                                <input
                                    className="flex-1 h-full px-2 py-1 outline-none"
                                    value={basePrice === 0 ? "" : formatPrice(basePrice)}
                                    onChange={(e) =>
                                        setBasePrice(parseFormattedNumber(e.target.value))
                                    }
                                />
                                <span className="px-4 font-bold">VND</span>
                            </div>
                        </div>
                        {/* price child */}
                        <div className="flex items-center w-full gap-2">
                            <label className="w-[120px] font-medium flex items-center">
                                Giá trẻ em:
                            </label>

                            <div className="flex flex-1  border rounded-lg items-center">
                                <input
                                    className="flex-1 h-full px-2 py-1 outline-none"
                                    value={childPrice === 0 ? "" : formatPrice(childPrice)}
                                    onChange={(e) => {
                                        setChildPrice(parseFormattedNumber(e.target.value));
                                        setAutoCalculateChildPrice(false);
                                    }}
                                />
                                <span className="px-4 font-bold">VND</span>
                            </div>
                        </div>
                        {/* price infant */}
                        <div className="flex items-center w-full gap-2">
                            <label className="w-[120px] font-medium flex items-center">
                                Giá sơ sinh:
                            </label>

                            <div className="flex flex-1  border rounded-lg items-center">
                                <input
                                    className="flex-1 h-full px-2 py-1 outline-none"
                                    value={infantPrice === 0 ? "" : formatPrice(infantPrice)}
                                    onChange={(e) => {
                                        setInfantPrice(parseFormattedNumber(e.target.value));
                                        setAutoCalculateInfantPrice(false);
                                    }}
                                />
                                <span className="px-4 font-bold">VND</span>
                            </div>
                        </div>
                        {/* single_room_surcharge */}
                        <div className="flex items-center w-full">
                            <label className="w-[150px] font-medium flex items-center">
                                Phụ thu phòng đơn:
                            </label>
                            <div className="flex border rounded-lg w-full justify-between items-center">
                                <input 
                                    className="flex-1 px-2 py-1 outline:none focus:outline-none"
                                    value={singleRoomSurcharge === 0 ? '' : formatPrice(singleRoomSurcharge)}
                                    onChange={(e) => {
                                        const value = parseFormattedNumber(e.target.value);
                                        setSingleRoomSurcharge(value);
                                    }}
                                />
                                <label className="font-bold px-4">VND</label>
                            </div>
                        </div>
                        {priceError && (
                            <p className="text-red-600 text-sm mt-1 lg:pl-30">
                                {priceError}
                            </p>
                        )}
                    </div>
                </div>
                {/* highlights */}
                <div>
                    <div className="flex items-center w-full">
                        <label className="font-medium w-[120px]">Điểm Nhấn:</label>
                        <textarea
                            value={highlights}
                            className="flex-1 border px-2 py-1 rounded-lg h-[200px]"
                            onChange={(e) => {
                                setHighlights(e.target.value)
                            }}
                        />
                    </div>              
                </div>
                {/* information bonus */}
                <div className="flex gap-8">
                    <div className="flex w-1/2 gap-2 flex-col">
                        {/* attractions */}
                        <div className="flex items-center">
                            <label className="font-medium w-[120px]">Điểm tham quan:</label>
                            <textarea   
                                value={attractions}
                                className="flex-1 border px-2 py-1 rounded-lg"
                                onChange={(e) => {
                                    setAttractions(e.target.value)
                                }}
                            />
                        </div>
                        {/* cuisine */}
                        <div className="flex items-center">
                            <label className="font-medium w-[120px]">Ẩm thực:</label>
                            <textarea   
                                value={cuisine}
                                className="flex-1 border px-2 py-1 rounded-lg"
                                onChange={(e) => {setCuisine(e.target.value)}}
                            />
                        </div>
                        {/* ideal_time */}
                        <div className="flex items-center">
                            <label className="font-medium w-[120px]">Thời gian lý tưởng:</label>
                            <textarea   
                                value={idealTime}
                                className="flex-1 border px-2 py-1 rounded-lg"
                                onChange={(e) => {setIdealTime(e.target.value)}}
                            />
                        </div>
                    </div>
                    <div className="flex w-1/2 gap-2 flex-col">
                        {/* suitable_for */}
                        <div className="flex items-center">
                            <label className="font-medium w-[120px]">Đối tượng thích hợp:</label>
                            <textarea   
                                value={suitableFor}
                                className="flex-1 border px-2 py-1 rounded-lg"
                                onChange={(e) => {setSuitableFor(e.target.value)}}
                            />
                        </div>
                        {/* transportation */}
                        <div className="flex items-center">
                            <label className="font-medium w-[120px]">Phương tiện:</label>
                            <textarea   
                                value={transportation}
                                className="flex-1 border px-2 py-1 rounded-lg"
                                onChange={(e) => {setTransportation(e.target.value)}}
                            />
                        </div>
                        {/* promotion */}
                        <div className="flex items-center">
                            <label className="font-medium w-[120px]">Khuyến mãi:</label>
                            <textarea   
                                value={promotion}
                                className="flex-1 border px-2 py-1 rounded-lg"
                                onChange={(e) => {setPromotion(e.target.value)}}
                            />
                        </div>
                    </div>
                </div>
                {/* service */}
                <div className="flex gap-8">
                    {/* included_services */}
                    <div className="flex w-1/2 gap-2 flex-col">
                        <div className="flex items-center">
                            <label className="font-medium w-[120px]">Dịch vụ đã bao gồm:</label>
                            <textarea   
                                value={includedServices}
                                className="flex-1 border px-2 py-1 rounded-lg h-[90px]"
                                onChange={(e) => {setIncludedServices(e.target.value)}}
                            />
                        </div>
                    </div>
                    {/* excluded_services */}
                    <div className="flex w-1/2 gap-2 flex-col">
                        <div className="flex items-center">
                            <label className="font-medium w-[120px]">Dịch vụ không bao gồm:</label>
                            <textarea   
                                value={excludedServices}
                                className="flex-1 border px-2 py-1 rounded-lg h-[90px]"
                                onChange={(e) => {setExcludedServices(e.target.value)}}
                            />
                        </div>
                    </div>
                </div>
                {/* main image */}
                <div className="flex mb-8">
                    <label className="font-medium w-[120px]">Hình ảnh chính:</label>
                    <div
                        onDrop={handleDrop}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        className={`flex-1 border-2 border-dashed rounded-xl p-6 text-center  transition ${
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
                                <p className="text-gray-600">Chọn file hoặc kéo thả ảnh chính vào</p>
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
                                        className="rounded border object-cover h-[300px] w-auto" 
                                    />
                                    {preview && (
                                        <button
                                            onClick={handleRemoveImage}
                                            className="absolute top-0 right-4 cursor-pointer p-2 text-red-600 z-10"
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
                {/* tour destinations */}
                <div className="flex mb-8">
                    <TourDestination
                        allDestinations={allDestinations}
                        selectedIds={selectedDestinationIds}
                        setSelectedIds={setSelectedDestinationIds}
                    />
                </div>
                {/* tour itinerary */}
                <TourItinerary
                    itineraries={itineraries}
                    setItineraries={setItineraries}
                    originalItineraries={originalItineraries}
                    setItinerariesChanged={setItinerariesChanged}
                />
                {/* tour schedule */}
                <TourSchedule
                    schedules={schedules}
                    setSchedules={setSchedules}
                    originalSchedules={originalSchedules}
                    setSchedulesChanged={setSchedulesChanged}
                    basePrice={basePrice}
                    infantPrice = {infantPrice}
                    childPrice = {childPrice}
                    durationDays={durationDays}
                    durationNights={durationNights}
                    setHasScheduleError={setHasScheduleError}
                />
                {/* tour images */}
                <TourImages
                    existingImages={existingTourImages}
                    setExistingImages={setExistingTourImages}
                    newImages={newTourImages}
                    setNewImages={setNewTourImages}
                    imagesToDelete={imagesToDelete}
                    setImagesToDelete={setImagesToDelete}
                    setImagesChanged={setImagesChanged}
                    originalImages={originalTourImages}
                />
            </div>
            {/* Button Submit */}
            <div className={`
                    fixed bottom-0 p-4 border-t shadow-2xl z-20 
                    flex justify-center bg-white 
                    left-[248px] right-0
                `}>
                <div className="w-full">
                    <button
                        onClick={handleUpdateTour}
                        disabled={isSubmitting || !hasChanges || !!durationError || !!priceError || hasScheduleError}
                        className={`px-8 py-3 rounded-lg font-medium transition-colors w-full cursor-pointer ${
                            hasChanges && !durationError && !priceError && !hasScheduleError
                                ? 'bg-main text-white bg-blue-900'
                                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        }`}
                    >
                        {isSubmitting ? 'Đang cập nhật...' : hasChanges ? 'Cập nhật Tour' : 'Chưa có thay đổi'}
                    </button>
                </div>
            </div>
        </div>
    )
}