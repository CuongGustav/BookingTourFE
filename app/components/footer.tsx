'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const API_URL = process.env.NEXT_PUBLIC_URL_API;

interface Destination {
    destination_id: string;
    name: string;
}

export default function Footer() {
    const router = useRouter();
    const [destinations, setDestinations] = useState<Destination[]>([]);
    const [showAllDestinations, setShowAllDestinations] = useState(false);

    useEffect(() => {
        fetchDestinations();
    }, []);

    const fetchDestinations = async () => {
        try {
            const res = await fetch(`${API_URL}/destination/all`);
            const data = await res.json();
            setDestinations(data);
        } catch (error) {
            console.error('Error fetching destinations:', error);
        }
    };

    const displayedDestinations = showAllDestinations 
        ? destinations 
        : destinations.slice(0, 20);

    const handleDestinationClick = (destinationName: string) => {
        router.push(`/tours?destination=${destinationName}`);
    };

    return (
        <footer className="bg-gradient-to-br from-blue-100 to-blue-50 text-black mt-4">
            <div className="max-w-7xl mx-auto px-4 py-12">
                {/* Main Footer Content */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 mb-8">
                    <div>
                        <h3 className="text-xl font-bold mb-4 border-b-2 border-blue-400 pb-2 inline-block">
                            Du lịch trong nước
                        </h3>
                        <div className="grid grid-cols-4 gap-x-4 gap-y-2 mt-4">
                            {displayedDestinations.map((destination) => (
                                <button
                                    key={destination.destination_id}
                                    onClick={() => handleDestinationClick(destination.name)}
                                    className="cursor-pointer text-left text-black hover:text-blue-800 hover:translate-x-1 transition-all duration-200"
                                >
                                    {destination.name}
                                </button>
                            ))}
                        </div>
                        
                        {destinations.length > 20 && (
                            <button
                                onClick={() => setShowAllDestinations(!showAllDestinations)}
                                className="cursor-pointer mt-4 hover:text-blue-800 text-black font-semibold flex items-center gap-2 transition-colors"
                            >
                                {showAllDestinations ? (
                                    <>
                                        Thu gọn
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 15.75 7.5-7.5 7.5 7.5" />
                                        </svg>
                                    </>
                                ) : (
                                    <>
                                        Xem thêm ({destinations.length - 20} địa điểm)
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                                        </svg>
                                    </>
                                )}
                            </button>
                        )}
                    </div>
                    {/* contact */}
                    <div>
                        <h3 className="text-xl font-bold mb-4 border-b-2 border-blue-400 pb-2 inline-block">
                            Liên hệ
                        </h3>
                        <div className="space-y-3 mt-4">
                            <div className="flex items-start gap-3">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mt-1 flex-shrink-0">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                                </svg>
                                <p className="text-black">
                                    190 Pasteur, Phường Xuân Hoà, TP. Hồ Chí Minh, Việt Nam
                                </p>
                            </div>

                            <div className="space-y-2">
                                <a  className="flex items-center gap-3 text-black transition-colors">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" />
                                    </svg>
                                    (+84) 36 4798 502
                                </a>
                            </div>

                            <a 
                                // href="mailto:info@vietravel.com"
                                className="flex items-center gap-3 text-black transition-colors"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
                                </svg>
                                cuong@gmail.com
                            </a>

                            <p className="text-sm text-black mt-2">
                                Từ 8:00 - 20:00 hằng ngày
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}