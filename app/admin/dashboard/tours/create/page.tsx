'use client'

import {useRouter} from "next/navigation"
import { useState, useEffect, DragEvent } from "react";
import Image from "next/image";
import { destinationCreateTour } from "@/app/types/destination";
import { ItineraryInforFE } from "@/app/types/tour_itinerary";
import { TourSchedule } from "@/app/types/tour_schedule";
import { CreateImageTourFE } from "@/app/types/tour_images";

const API_URL = process.env.NEXT_PUBLIC_URL_API;

export default function CreateTourPage () {

    const router = useRouter();
    const [durationError, setDurationError]=useState<string|null>(null)
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [priceError, setPriceError] = useState<string|null>(null)
    const [loading, setLoading] = useState(false);

    const [title, setTitle] = useState("")
    const [slug, setSlug] = useState("")
    const [slugEdited, setSlugEdited] = useState(false)
    const [attractionsEdited, setattractionsEdited] = useState(false)
    const [durationDays, setDurationDays] = useState<number>(0)
    const [durationNights, setDurationNights] = useState<number>(0)
    const [isFeatured, setIsFeatured] = useState(false)
    const [basePrice, setBasePrice] = useState<number>(0)
    const [childPrice, setChildPrice] = useState<number>(0)
    const [infantPrice, setInfantPrice] = useState<number>(0)
    const [hightlight, setHightlight] = useState("")
    const [attractions, setAttractions] = useState("")
    const [cuisine, setCuisine] = useState("")
    const [idealTime, setIdealTime] = useState("")
    const [suitableFor, setSuitableFor] = useState("")
    const [transportation, setTransportation] = useState("")
    const [promotion, setPromotion] = useState("")
    const [includedServices, setIncludedServices] = useState("")
    const [excludedServices, setExcludedServices] = useState("")
    const [destinations, setDestinations] = useState<destinationCreateTour[]>([])
    const [selectedDestinations, setSelectedDestinations] = useState<string[]>([])
    const [itineraries, setItineraries] = useState<ItineraryInforFE[]>([])
    const [schedules, setSchedules] = useState<TourSchedule[]>([]);
    const [scheduleError, setScheduleError] = useState<string | null>(null);
    const [tourImages, setTourImages] = useState<CreateImageTourFE[]>([]);
    const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
    const [departDestination, setDepartDestination] = useState<string>("");


    const [dragOver, setDragOver] = useState(false);
    const [imageMainFile, setImageFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string>("");
        
    //slug
    const slugify = (text: string) =>
        text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
            .replace(/đ/g, "d").replace(/[^a-z0-9\s-]/g, "").trim()
            .replace(/\s+/g, "-").replace(/-+/g, "-");
    //attraction
    const generateAttractions = (text: string) => {
        return text
            .split('-')
            .map(item => item.trim().toUpperCase())
            .filter(item => item.length > 0)
            .join(' | ');
    };
    // title change
    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setTitle(value);
        if (!slugEdited) {
            setSlug(slugify(value));
        }
        if (!attractionsEdited) {
            setAttractions(generateAttractions(value));
        }
    };
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
    //format number
    const formatNumber = (num: number): string => {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    }
    const parseFormattedNumber = (value: string): number => {
        return parseInt(value.replace(/\./g, "")) || 0;
    }
    //check price
    useEffect(() => {
        if (basePrice === 0 && childPrice === 0 && infantPrice === 0) {
            setPriceError(null);
            return;
        }
        if (childPrice > 0 && basePrice > 0 && childPrice >= basePrice) {
            setPriceError("Giá trẻ em phải nhỏ hơn giá gốc");
        } else if (infantPrice > 0 && childPrice > 0 && infantPrice >= childPrice) {
            setPriceError("Giá sơ sinh phải nhỏ hơn giá trẻ em");
        } else if (infantPrice > 0 && basePrice > 0 && infantPrice >= basePrice) {
            setPriceError("Giá sơ sinh phải nhỏ hơn giá gốc");
        } else {
            setPriceError(null);
        }
    }, [basePrice, childPrice, infantPrice]);
    //image
    const setImageMain = (file: File) => {
        setImageFile(file);
        setPreview(URL.createObjectURL(file)); // preview local
    };
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) setImageMain(file);
    };
    const handleDrop = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setDragOver(false);
        const file = e.dataTransfer.files?.[0];
        if (file) setImageMain(file);
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
    //fetch data destination
    useEffect (() => {
        const fetchDestinations = async () => {
            try {
                const res = await fetch(`${API_URL}/destination/allCreateTour`);
                const data = await res.json();
                setDestinations(data);
            } catch (error) {
                console.error('Error fetching destinations:', error)
            }
        }
        fetchDestinations();
    }, [])
    // add itinerary
    const addItinerary = () => {
        setItineraries(prev => [
            ...prev,
            { title: '', description: '', meals: '', display_order: prev.length + 1 }
        ]);
    };
    // update itinerary
    const updateItinerary = (index: number, field: keyof ItineraryInforFE, value: string) => {
        setItineraries(prev => 
            prev.map((item, i) => i === index ? { ...item, [field]: value } : item)
        );
    };
    // remnove itinerary
    const removeItinerary = (index: number) => {
        const updated = itineraries
            .filter((_, i) => i !== index)
            .map((item, i) => ({ ...item, display_order: i + 1 }));
        setItineraries(updated);
    };
    // add schedule
    const addSchedule = () => {
        const newSchedule: TourSchedule = {
            departure_date: '',
            return_date: '',
            available_seats: 30,
            booked_seats: 0,
            price_adult: basePrice,
            price_child: childPrice,
            price_infant: infantPrice,
            status: 'available',
        };
        setSchedules([...schedules, newSchedule]);
    };
    // calculate ReturnDate
    const calculateReturnDate = (departureDate: string, durationNights: number): string => {
        if (!departureDate || !durationNights) return '';
        const depDate = new Date(departureDate);
        depDate.setDate(depDate.getDate() + durationNights);
        return depDate.toISOString().split('T')[0];
    };
    //update schedule
    const updateSchedule = <K extends keyof TourSchedule>(
        index: number,
        field: K,
        value: TourSchedule[K]
    ) => {
        const updated = [...schedules];
        updated[index] = { ...updated[index], [field]: value };
        if (field === 'departure_date' && value && durationNights > 0) {
            const returnDate = calculateReturnDate(value as string, durationNights);
            updated[index].return_date = returnDate;
        }
        setSchedules(updated);
        validateSchedule(index, updated);
    };
    //delete schedule
    const removeSchedule = (index: number) => {
        setSchedules(schedules.filter((_, i) => i !== index));
    };
    //validate schedule
    const validateSchedule = (index: number, schedulesList: TourSchedule[]) => {
        const schedule = schedulesList[index];
        if (!schedule) return false;

        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        if (schedule.departure_date) {
            const depDate = new Date(schedule.departure_date);
            depDate.setHours(0, 0, 0, 0);
            if (depDate < today) {
                setScheduleError('Ngày khởi hành phải là ngày trong tương lai');
                return false;
            }
        }
        if (schedule.departure_date && schedule.return_date) {
            const depDate = new Date(schedule.departure_date);
            const retDate = new Date(schedule.return_date);
            depDate.setHours(0, 0, 0, 0);
            retDate.setHours(0, 0, 0, 0);
            if (retDate <= depDate) {
                setScheduleError('Ngày kết thúc phải sau ngày khởi hành');
                return false;
            }
            if (durationNights > 0) {
                const diffTime = retDate.getTime() - depDate.getTime();
                const diffDays = diffTime / (1000 * 60 * 60 * 24);
                if (diffDays !== durationNights) {
                    setScheduleError(
                        `Tour ${durationDays} ngày ${durationNights} đêm: ngày kết thúc phải sau ngày khởi hành ${durationNights} ngày (hiện tại: ${diffDays} ngày)`
                    );
                    return false;
                }
            }
        }
        if (schedule.price_adult && schedule.price_child) {
            if (schedule.price_child >= schedule.price_adult) {
                setScheduleError('Giá trẻ em phải nhỏ hơn giá người lớn');
                return false;
            }
        }
        if (schedule.price_child && schedule.price_infant) {
            if (schedule.price_infant >= schedule.price_child) {
                setScheduleError('Giá em bé phải nhỏ hơn giá trẻ em');
                return false;
            }
        }
        setScheduleError(null);
        return true;
    };
    //upload image - max 9 image
    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files) return;

        const remainingSlots = 9 - tourImages.length;
        if (remainingSlots <= 0) {
            alert('Bạn chỉ có thể tải lên tối đa 9 ảnh!');
            return;
        }
        const filesToAdd = Array.from(files).slice(0, remainingSlots);
        if (files.length > remainingSlots) {
            alert(`Chỉ thêm được ${remainingSlots} ảnh nữa. Đã bỏ qua ${files.length - remainingSlots} ảnh.`);
        }
        const newImages: CreateImageTourFE[] = filesToAdd.map((file, index) => ({
            file,
            preview: URL.createObjectURL(file),
            display_order: tourImages.length + index + 1
        }));
        setTourImages([...tourImages, ...newImages]);
    };
    //Delete Image
    const removeImage = (display_order: number) => {
        const filtered = tourImages.filter(img => img.display_order !== display_order);
        const updated = filtered.map((img, index) => ({
            ...img,
            display_order: index + 1
        }));
        setTourImages(updated);
    };
    //setting image bg
    const setAsCoverImage = (currentDisplayOrder: number) => {
        setTourImages(prev => {
            const newImages = prev.map(img => {
            // Image choice -> always 1
            if (img.display_order === currentDisplayOrder) {
                return { ...img, display_order: 1 };
            }
            if (img.display_order === 1) {
                return { ...img, display_order: prev.length + 1 }; // push down + 1
            }
            return img;
            });
            // Re schedule image
            return newImages
            .sort((a, b) => a.display_order - b.display_order)
            .map((img, idx) => ({ ...img, display_order: idx + 1 }));
        });
    };
    //render image
    {tourImages
        .filter(img => img.display_order === 1)
        .map((image, idx) => (
            <div key={idx} className="col-span-2 row-span-2 relative group">
                <Image
                    src={image.preview}
                    alt="Tour cover"
                    className="w-full h-full object-cover rounded-lg cursor-pointer"
                    onClick={() => setSelectedImageIndex(0)}
                />
                <button onClick={(e) => { e.stopPropagation(); removeImage(image.display_order); }}>Xóa</button>
            </div>
    ))}
    //handle submit
    const handleSubmit = async () => {
        //tour
        if(!title || !durationDays || !durationNights || !departDestination || !basePrice || !imageMainFile){
            alert("Tiêu đề, số ngày, số đêm, điểm khởi hành, giá góc, ảnh chính là bắt buộc");
            return;
        }
        //tour_destinations
        if (selectedDestinations.length === 0){
            alert("Vui lòng chọn ít nhất 1 điểm đến");
            return;
        }
        //tour_itineraries
        if (itineraries.length === 0){
            alert("Vui lòng tạo ít nhất 1 lịch trình chi tiết");
            return;
        }
        for (let i = 0; i < itineraries.length; i++) {
            const  itinerary = itineraries[i];
            if (!itinerary.title?.trim() || !itinerary.description?.trim() || !itinerary.meals?.trim()) {
                alert("Các trường trong lịch trình chi tiết là bắt buộc");
                return;
            }
        }
        //tour_schedules
        if (schedules.length === 0) {
            alert("Vui lòng tạo ít nhất 1 lịch khởi hành");
            return;
        }
        for (let i = 0; i < schedules.length; i++) {
            const  schedule = schedules[i];
            if (!schedule.departure_date?.trim() || !schedule.return_date?.trim() || !schedule.price_adult 
                || !schedule.price_child || !schedule.price_infant || !schedule.available_seats) {
                alert("Các trường trong lịch trình chi tiết là bắt buộc");
                return;
            }
        }
        //tour_images
        if (tourImages.length === 0) {
            alert("Vui lòng tải lên ít nhất 1 ảnh chi tiết");
            return;
        }

        setLoading(true);
        setErrorMessage(null);
        try {
            //tour_form_data
            const tourFormData = new FormData();
            tourFormData.append("title", title);
            tourFormData.append("slug", slug);
            tourFormData.append("duration_days", durationDays.toString());
            tourFormData.append("duration_nights", durationNights.toString());
            tourFormData.append("highlights", hightlight);
            tourFormData.append("included_services", includedServices);
            tourFormData.append("excluded_services", excludedServices);
            tourFormData.append("attractions", attractions);
            tourFormData.append("cuisine", cuisine);
            tourFormData.append("suitable_for", suitableFor);
            tourFormData.append("ideal_time", idealTime);
            tourFormData.append("transportation", transportation);
            tourFormData.append("promotions", promotion);
            tourFormData.append("depart_destination", departDestination);
            tourFormData.append("base_price", basePrice.toString());
            tourFormData.append("child_price", childPrice.toString());
            tourFormData.append("infant_price", infantPrice.toString());
            tourFormData.append("is_featured", isFeatured ? "1" : "0");
            if (imageMainFile) {
                tourFormData.append("main_image", imageMainFile);
            }
            //tour_schedules data
            const formattedSchedules = schedules.map(s => ({
                departure_date: s.departure_date,
                return_date: s.return_date,
                available_seats: s.available_seats,
                price_adult: s.price_adult.toFixed(2),    
                price_child: s.price_child?.toFixed(2), 
                price_infant: s.price_infant?.toFixed(2),
            }));
            //fetchTour
            const tourRes = await fetch(`${API_URL}/tour/admin/add`, {
                method: "POST",
                credentials: "include",
                body: tourFormData
            })
            const tourData = await tourRes.json()
            if (!tourRes.ok) {
                setErrorMessage(tourData.message || "Tạo tour thất bại");
                setLoading(false);
                return;
            }

            const tourId = tourData.tour_id
            if (!tourId) {
                setErrorMessage("Không nhận được tour_id từ server");
                setLoading(false);
                return;
            }
            console.log("Tour đã tạo thành công với ID:", tourId);
            //fetch tour_destinations
            if (selectedDestinations.length > 0) {
                const destRes = await fetch(`${API_URL}/tour_destinations/admin/add`, {
                    method: "POST",
                    credentials: "include",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        tour_id: tourId,
                        destination_ids: selectedDestinations
                    })
                });
                if (!destRes.ok) {
                    setErrorMessage(tourData.message || "Tạo tour và các điểm đến thất bại");
                    return;
                }
            }
            //fetch tour_itineraries
            if (itineraries.length > 0) {
                const itineraryRes = await fetch(`${API_URL}/tour_itineraries/admin/add`, {
                    method: "POST",
                    credentials: "include",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        tour_id: tourId,
                        itineraries: itineraries
                    })
                });
                if (!itineraryRes.ok) {
                    setErrorMessage(tourData.message || "Tạo lịch trình chi tiết thất bại");
                    return;
                }
            }
            //fetch tour_schedules
            if (schedules.length > 0) {
                const scheduleRes = await fetch(`${API_URL}/tour_schedules/admin/add`, {
                    method: "POST",
                    credentials: "include",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        tour_id: tourId,
                        schedules: formattedSchedules
                    })
                });
                if (!scheduleRes.ok) {
                    setErrorMessage(tourData.message || "Tạo lịch khởi hành thất bại");
                    return;
                }
            }
            //fetch tour_images
            if (tourImages.length > 0) {
                const imagesFormData = new FormData();
                imagesFormData.append("tour_id", tourId);
                tourImages
                    .sort((a, b) => a.display_order - b.display_order)
                    .forEach((img) => {
                        imagesFormData.append("images", img.file);                   
                        imagesFormData.append("display_orders", img.display_order.toString());
                    });
                const imagesRes = await fetch(`${API_URL}/tour_images/admin/add`, {
                    method: "POST",
                    credentials: "include",
                    body: imagesFormData
                });
                if (!imagesRes.ok) {
                    const err = await imagesRes.json();
                    setErrorMessage(err.message || "Upload ảnh thất bại");
                    return;
                }
            }
            alert("Tạo tour thành công!");
            router.push("/admin/dashboard/tours");
        }   catch (err) {
            console.error(err);
            alert("Không thể kết nối server");
        } finally {
            setLoading(false); 
        }
    }

    return(
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
                <h1 className="text-3xl font-bold mb-6 text-main">Tạo tour mới</h1>
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
                                onChange={handleTitleChange}
                            />
                        </div>
                    </div>
                </div>
                {/* slug */}
                <div className="flex w-full">
                    <div className="flex items-center w-full">
                        <label className="font-medium w-[120px]">Slug tour:</label>
                        <input
                            type="text"
                            value={slug}
                            className="flex-1 border px-2 py-1 rounded-lg"
                            onChange={(e) => {
                                setSlug(e.target.value)
                                setSlugEdited(true)
                            }}
                        />
                    </div>
                </div>
                <div className="flex gap-8 ">
                    {/* duration_days, duration_nights, is_feature , depart_destination*/}
                    <div className="flex w-1/3 gap-2 flex-col">
                        {/* duration_days */}
                        <div className="flex items-center w-full">
                            <label className="font-medium w-[120px]">Số Ngày:</label>
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
                            <label className="font-medium w-[120px]">Số Đêm:</label>
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
                            <label className="font-medium w-[120px]">Tour hot:</label>
                            <select
                                value={isFeatured ? "true" : "false"}
                                onChange={(e) => setIsFeatured(e.target.value === "true")}
                                className="flex-1 border px-2 py-1 rounded-lg"
                            >
                                <option value="false">Không</option>
                                <option value="true">Có</option>
                            </select>
                        </div>
                        {/* depart_destination */}
                        <div className="flex items-center w-full">
                            <label className="font-medium w-[120px]">Điểm xuất phát:</label>
                            <select
                                value={departDestination}
                                onChange={(e) => setDepartDestination(e.target.value)}
                                className="flex-1 border px-2 py-1 rounded-lg"
                            >
                                <option value="Hà Nội">-- Chọn điểm xuất phát --</option>
                                <option value="Hà Nội">Hà Nội</option>
                                <option value="Hồ Chí Minh">Hồ Chí Minh</option>
                                <option value="Đà Nẵng">Đà Nẵng</option>
                                <option value="Nha Trang">Nha Trang</option>
                            </select>
                        </div>
                    </div>
                    {/* price */}
                    <div className="flex flex-1 flex-col gap-2">
                        {/* base price */}
                        <div className="flex items-center w-full">
                            <label className="font-medium w-[120px]">Giá gốc:</label>
                            <div className="flex border rounded-lg w-full justify-between items-center">
                                <input 
                                    className="flex-1 px-2 py-1 outline:none focus:outline-none"
                                    value={basePrice === 0 ? '' : formatNumber(basePrice)}
                                    onChange={(e) => {
                                        const value = parseFormattedNumber(e.target.value);
                                        setBasePrice(value);
                                    }}
                                />
                                <label className="font-bold px-4">VND</label>
                            </div>
                        </div>
                        {/* child price */}
                        <div className="flex items-center w-full">
                            <label className="font-medium w-[120px]">Giá trẻ em:</label>
                            <div className="flex border rounded-lg w-full justify-between items-center">
                                <input 
                                    className="flex-1 px-2 py-1 outline:none focus:outline-none"
                                    value={childPrice === 0 ? '' : formatNumber(childPrice)}
                                    onChange={(e) => {
                                        const value = parseFormattedNumber(e.target.value);
                                        setChildPrice(value);
                                    }}
                                />
                                <label className="font-bold px-4">VND</label>
                            </div>
                        </div>
                        {/* infant price */}
                        <div className="flex items-center w-full">
                            <label className="font-medium w-[120px]">Giá sơ sinh:</label>
                            <div className="flex border rounded-lg w-full justify-between items-center">
                                <input 
                                    className="flex-1 px-2 py-1 outline:none focus:outline-none"
                                    value={infantPrice === 0 ? '' : formatNumber(infantPrice)}
                                    onChange={(e) => {
                                        const value = parseFormattedNumber(e.target.value);
                                        setInfantPrice(value);
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
                {/* hightlight */}
                <div>
                    <div className="flex items-center w-full">
                        <label className="font-medium w-[120px]">Điểm Nhấn:</label>
                        <textarea
                            value={hightlight}
                            className="flex-1 border px-2 py-1 rounded-lg h-[200px]"
                            onChange={(e) => {
                                setHightlight(e.target.value)
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
                                    setattractionsEdited(true)
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
                        className={`flex-1 border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition ${
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
                                        width={0}
                                        height={300}
                                        style={{ width: 'auto', height: 300 }}
                                        className="rounded border object-cover "
                                    />
                                    {preview && (
                                        <button
                                            onClick={handleRemoveImage}
                                            className="absolute top-0 right-4 cursor-pointer p-2 text-red-600"
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
                {/* tour destination */}
                <div className="flex gap-2 w-full">
                    <div className="flex items-start">
                        <label className="font-medium w-[120px] pt-2">Chọn điểm đến:</label>
                        <div className="flex-1 border rounded-lg p-3 max-h-[150px] overflow-y-auto">
                            {destinations.length === 0 ? (
                                <p className="text-gray-400 text-sm">Đang tải danh sách điểm đến...</p>
                            ) : (
                                <div className="grid grid-cols-8 gap-2">
                                    {destinations.map((dest) => (
                                        <label 
                                            key={dest.destination_id} 
                                            className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded"
                                        >
                                            <input
                                                type="checkbox"
                                                value={dest.destination_id}
                                                checked={selectedDestinations.includes(dest.destination_id)}
                                                onChange={(e) => {
                                                    if (e.target.checked) {
                                                        setSelectedDestinations([...selectedDestinations, dest.destination_id]);
                                                    } else {
                                                        setSelectedDestinations(
                                                            selectedDestinations.filter(id => id !== dest.destination_id)
                                                        );
                                                    }
                                                }}
                                                className="w-4 h-4"
                                            />
                                            <span className="text-sm">{dest.name}</span>
                                        </label>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                {/* tour itinerary */}
                <div className="flex flex-col gap-2 w-full">
                    {/* button */}
                    <div className="flex justify-between items-center mb-2">
                        <label className="font-medium w-[120px] pt-2">Lịch trình chi tiết:</label>
                        <button
                            type="button"
                            onClick={addItinerary}
                            className="bg-blue-900 text-white px-4 py-2 rounded-lg hover:bg-blue-600 flex items-center gap-2 cursor-pointer"
                        >
                            Thêm lịch trình
                        </button>
                    </div>
                    {/* textarea */}
                    {itineraries.length === 0 && (
                        <p className="text-center text-gray-400 py-8 border-2 border-dashed rounded-lg">
                            Chưa có lịch trình nào. Nhấn Thêm lịch trình để bắt đầu.
                        </p>
                    )}
                    <div className="flex flex-col gap-4">
                        {itineraries.map((itinerary, index) => (
                            <div key={index} className="border rounded-lg p-4 bg-gray-50">
                                <div className="flex justify-between items-center mb-3">
                                    <h3 className="font-semibold text-lg text-blue-600">
                                        Ngày {itinerary.display_order}
                                    </h3>
                                    <button
                                        type="button"
                                        onClick={() => removeItinerary(index)}
                                        className="text-red-500 hover:text-red-700 p-1 cursor-pointer"
                                    >
                                        Xóa
                                    </button>
                                </div>

                                <div className="flex flex-col gap-3">
                                    <div className="flex items-center">
                                        <label className="font-medium w-[120px]">Tiêu đề:</label>
                                        <input
                                            type="text"
                                            value={itinerary.title}
                                            onChange={(e) => updateItinerary(index, 'title', e.target.value)}
                                            className="flex-1 border px-3 py-2 rounded-lg bg-white"
                                        />
                                    </div>
                                    <div className="flex items-start">
                                        <label className="font-medium w-[120px] pt-2">Mô tả:</label>
                                        <textarea
                                            value={itinerary.description}
                                            onChange={(e) => updateItinerary(index, 'description', e.target.value)}
                                            className="flex-1 border px-3 py-2 rounded-lg h-[120px] bg-white"
                                        />
                                    </div>
                                    <div className="flex items-center">
                                        <label className="font-medium w-[120px]">Bữa ăn:</label>
                                        <input
                                            type="text"
                                            value={itinerary.meals}
                                            onChange={(e) => updateItinerary(index, 'meals', e.target.value)}
                                            className="flex-1 border px-3 py-2 rounded-lg bg-white"
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                {/* tour schedule */}
                <div className="flex flex-col gap-2 w-full mt-6">
                    {/* button */}
                    <div className="flex justify-between items-center">
                        <label className="font-medium w-[120px] pt-2">Lịch khởi hành:</label>
                        <button
                            type="button"
                            onClick={addSchedule}
                            className="bg-blue-900 text-white px-4 py-2 rounded-lg hover:bg-blue-600 flex items-center gap-2 cursor-pointer"
                        >
                            Thêm lịch khởi hành
                        </button>
                    </div>
                    {scheduleError && (
                        <p className="text-red-600 text-sm bg-red-50 p-2 rounded">{scheduleError}</p>
                    )}
                    {/* schedule */}
                    <div className="flex flex-col gap-3">
                        {schedules.length === 0 ? (
                            <div className="text-center text-gray-400 py-8 border-2 border-dashed rounded-lg">
                                Chưa có lịch khởi hành nào. Nhấn Thêm lịch khởi hành để tạo mới.
                            </div>
                        ) : (
                            schedules.map((schedule, index) => (
                                <div key={index} className="border rounded-lg p-4 bg-gray-50">
                                    <div className="flex justify-between items-center mb-3">
                                        <h3 className="font-semibold text-lg text-blue-600">Đợt {index + 1}</h3>
                                        <button
                                            type="button"
                                            onClick={() => removeSchedule(index)}
                                            className="text-red-600 hover:text-red-800 p-1 cursor-pointer"
                                        >
                                            Xóa
                                        </button>
                                    </div>
                                    <p className=" items-center mb-3 text-red-600">Chú ý định dạng ngày tháng là tháng/ngày/năm</p>
                                    <div className="flex gap-2">
                                        <div className="flex flex-col w-1/2 gap-2">
                                            {/* departure_date */}
                                            <div className="flex gap-2 ">
                                                <label className="font-medium w-[120px] pt-2">Ngày khởi hành:</label>
                                                <input
                                                    type="date"
                                                    value={schedule.departure_date}
                                                    min={new Date().toISOString().split('T')[0]}
                                                    onChange={(e) => {
                                                    updateSchedule(index, 'departure_date', e.target.value);
                                                    }}
                                                    className="border px-3 py-2 rounded-lg bg-white flex-1 cursor-pointer"
                                                />
                                            </div>
                                            {/* price_adult */}
                                            <div className="flex gap-2">
                                                <label className="font-medium w-[120px] pt-2">Giá vé gốc:</label>
                                                <input
                                                    type="text"
                                                    value={formatNumber(schedule.price_adult)}
                                                    onChange={(e) =>
                                                        updateSchedule(index, 'price_adult', parseFormattedNumber(e.target.value))
                                                    }
                                                    className="border px-3 py-2 rounded-lg bg-white flex-1"
                                                />
                                            </div>
                                            {/* price_child */}
                                            <div className="flex gap-2">
                                                <label className="font-medium w-[120px] pt-2">Giá vé trẻ em:</label>
                                                <input
                                                    type="text"
                                                    value={formatNumber(schedule.price_child)}
                                                    onChange={(e) =>
                                                        updateSchedule(index, 'price_child', parseFormattedNumber(e.target.value))
                                                    }
                                                    className="border px-3 py-2 rounded-lg bg-white flex-1"
                                                />
                                            </div>

                                        </div>
                                        <div className="flex flex-col w-1/2 gap-2">
                                            {/* return_date */}
                                            <div className="flex gap-2 ">
                                                <label className="font-medium w-[120px] pt-2">Ngày kết thúc:</label>
                                                <input
                                                    type="date"
                                                    value={schedule.return_date}
                                                    min={schedule.departure_date || new Date().toISOString().split('T')[0]}
                                                    onChange={(e) => updateSchedule(index, 'return_date', e.target.value)}
                                                    className="border px-3 py-2 rounded-lg bg-white flex-1 cursor-pointer"
                                                />
                                            </div>
                                            {/* price_infant */}
                                            <div className="flex gap-2">
                                                <label className="font-medium w-[120px] pt-2">Giá vé em bé:</label>
                                                <input
                                                    type="text"
                                                    value={formatNumber(schedule.price_infant)}
                                                    onChange={(e) =>
                                                        updateSchedule(index, 'price_infant', parseFormattedNumber(e.target.value))
                                                    }
                                                    className="border px-3 py-2 rounded-lg bg-white flex-1"
                                                />
                                            </div>
                                            {/* available_seats */}
                                            <div className="flex gap-2">
                                                <label className="font-medium w-[120px] pt-2">Số chỗ:</label>
                                                <input
                                                    type="number"
                                                    value={schedule.available_seats}
                                                    onChange={(e) =>
                                                    updateSchedule(index, 'available_seats', Number(e.target.value))
                                                    }
                                                    className="border px-3 py-2 rounded-lg bg-white flex-1"
                                                />
                                            </div>                                      
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>  
                {/* tour images */}
                <div className="flex flex-col gap-2 w-full mt-6 items-center">
                    <div className="flex justify-between items-center w-full">
                        <div className="flex gap-2 items-center">
                            <label className="font-medium text-lg">Hình ảnh tour:</label>
                            <span className="text-sm text-gray-600">
                                {tourImages.length}/9 ảnh
                            </span>
                        </div>
                        {/* Upload button */}
                        <div className="flex items-center gap-4">
                            <span className="text-sm text-gray-500">
                                {tourImages.length === 0 && 'Chưa có ảnh nào'}
                                {tourImages.length > 0 && tourImages.length < 9 && `Còn ${9 - tourImages.length} ảnh`}
                                {tourImages.length === 9 && 'Đã đủ số lượng ảnh'}
                            </span>
                            <label className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
                                tourImages.length >= 9 
                                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                                    : 'bg-blue-900 text-white hover:bg-blue-600 cursor-pointer'
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
                                    disabled={tourImages.length >= 9}
                                />
                            </label>
                        </div>
                    </div>
                    {/* Image preview grid */}
                    {tourImages.length === 0 ? (
                        <p className="text-center text-gray-400 py-8 border-2 border-dashed rounded-lg w-full">
                            Chưa có ảnh nào. Nhấn tải hình ảnh lên để bắt đầu.
                        </p>
                    ) : (
                        <div className="grid grid-cols-6 gap-4 mt-4">
                            {/*bg Image*/}
                            {tourImages
                            .sort((a, b) => a.display_order - b.display_order)
                            .filter(img => img.display_order === 1)
                            .map((image) => {
                                const index = tourImages
                                .sort((a, b) => a.display_order - b.display_order)
                                .findIndex(i => i.display_order === image.display_order);
                                return (
                                    <div
                                        key={image.display_order}
                                        className="col-span-2 row-span-2 relative rounded-lg overflow-hidden cursor-pointer group"
                                        onClick={() => setSelectedImageIndex(index)}
                                    >
                                        <Image
                                        src={image.preview}
                                        alt="Ảnh bìa tour"
                                        width={600}
                                        height={600}
                                        className="w-full h-full object-cover"
                                        />
                                        <div className="absolute top-3 left-3 bg-blue-600 text-white text-xs px-3 py-1 rounded-full font-medium">
                                        Ảnh bìa
                                        </div>
                                        {/* Overlay + button */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-6 gap-6">
                                            <button
                                                onClick={(e) => {
                                                e.stopPropagation();
                                                removeImage(image.display_order);
                                                }}
                                                className="opacity-0 group-hover:opacity-100 transition-opacity bg-red-600 hover:bg-red-700 text-white p-3 rounded-full shadow-lg"
                                                title="Xóa ảnh"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                            {/* Another image */}
                            <div className="col-span-4 grid grid-cols-4 gap-3">
                            {tourImages
                                .sort((a, b) => a.display_order - b.display_order)
                                .filter(img => img.display_order > 1)
                                .map((image) => {
                                const index = tourImages
                                    .sort((a, b) => a.display_order - b.display_order)
                                    .findIndex(i => i.display_order === image.display_order);

                                    return (
                                        <div
                                        key={image.display_order}
                                        className="relative aspect-square rounded-lg overflow-hidden cursor-pointer group"
                                        onClick={() => setSelectedImageIndex(index)}
                                        >
                                            <Image
                                                src={image.preview}
                                                alt={`Ảnh tour ${image.display_order}`}
                                                width={300}
                                                height={300}
                                                className="w-full h-full object-cover"
                                            />
                                            {/* Overlay + button */}
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-6 gap-6">
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setAsCoverImage(image.display_order);
                                                    }}
                                                    className="opacity-0 group-hover:opacity-100 transition-opacity bg-blue-900 hover:bg-blue-600 text-white p-3 rounded-full shadow-lg"
                                                    title="Đặt làm ảnh bìa"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                                                    </svg>
                                                </button>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        removeImage(image.display_order);
                                                    }}
                                                    className="opacity-0 group-hover:opacity-100 transition-opacity bg-red-600 hover:bg-red-700 text-white p-3 rounded-full shadow-lg"
                                                    title="Xóa ảnh"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>         
                    )}
                    {/* Modal Image*/}
                    {selectedImageIndex !== null && tourImages[selectedImageIndex] && (
                        <div 
                            className="fixed inset-0 bg-black/50 bg-opacity-90 z-50 flex items-center justify-center p-4 w-6/10 mx-auto h-8/10 my-auto"
                            onClick={() => setSelectedImageIndex(null)}
                        >
                            {/* Close button */}
                            <button
                                onClick={() => setSelectedImageIndex(null)}
                                className="absolute top-4 right-4 text-red-600 bg-black/50 bg-opacity-50 rounded-full p-2 hover:bg-opacity-70 z-10 cursor-pointer"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                            {/* Previous button */}
                            {selectedImageIndex > 0 && (
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setSelectedImageIndex(selectedImageIndex - 1);
                                    }}
                                    className="absolute left-4 text-white bg-black bg-opacity-50 rounded-full p-3 hover:bg-opacity-70 z-10 cursor-pointer"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                                    </svg>
                                </button>
                            )}
                            {/* Main image */}
                            <div className="relative max-w-5xl max-h-[80vh]" onClick={(e) => e.stopPropagation()}>
                                <Image
                                    src={tourImages[selectedImageIndex].preview}
                                    alt="Full size"
                                    width={1200}
                                    height={800}
                                    className="max-w-full max-h-[80vh] w-auto h-auto object-contain rounded-lg"
                                />
                            </div>
                            {/* Next button */}
                            {selectedImageIndex < tourImages.length - 1 && (
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setSelectedImageIndex(selectedImageIndex + 1);
                                    }}
                                    className="absolute right-4 text-white bg-black bg-opacity-50 rounded-full p-3 hover:bg-opacity-70 z-10 cursor-pointer"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                                    </svg>
                                </button>
                            )}
                            {/* Image counter */}
                            <div className="absolute bottom-30 left-1/2 transform -translate-x-1/2 text-white bg-black bg-opacity-60 px-4 py-2 rounded-full text-sm">
                                {selectedImageIndex + 1} / {tourImages.length}
                            </div>
                            {/* Thumbnail strip */}
                            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 max-w-[90%] overflow-x-auto pb-2 px-4">
                                {tourImages
                                    .sort((a, b) => a.display_order - b.display_order)
                                    .map((image, index) => (
                                        <Image
                                            key={index}
                                            src={image.preview}
                                            alt={`Thumbnail ${index + 1}`}
                                            width={64}
                                            height={64}
                                            className={`h-16 w-16 min-w-[4rem] object-cover rounded cursor-pointer transition-all border-2 ${
                                                index === selectedImageIndex 
                                                    ? 'border-blue-500 opacity-100 scale-110' 
                                                    : 'border-transparent opacity-60 hover:opacity-100 hover:border-white'
                                            }`}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setSelectedImageIndex(index);
                                            }}
                                        />
                                    ))
                                }
                            </div>
                        </div>
                    )}
                </div>
                <div className={`
                    fixed bottom-0 p-4 border-t shadow-2xl z-20 
                    flex justify-center bg-white 
                    left-[248px] right-0
                `}>
                    <div className="w-full">
                        {errorMessage && (
                            <p className="text-red-600 text-sm mt-1">
                                {errorMessage}
                            </p>
                        )}
                        <button
                            className={`w-full py-3 rounded-lg text-white cursor-pointer ${
                                loading
                                ? 'bg-gray-400 cursor-not-allowed opacity-50'
                                : 'bg-blue-900 hover:bg-blue-600'
                            }`}
                            onClick={() => {
                                if (loading) return; 
                                handleSubmit();
                            }}
                            disabled={loading}
                        >
                            {loading ? 'Đang tạo...' : 'Tạo tour'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}