'use client';

import {useState} from 'react';
import Link from 'next/link';

export default function Header() {

    const [isDropDownDestination, setIsDropDownDestination] = useState(false);
    const [activeSelectOption, setSelectOption] = useState<string | null>(null);
    const [selectedArea, setSelectedArea] = useState<'domestic' | 'asia'>('domestic');

    {/* Logic Click Menu */}
    const handleClickMenu = (option: string) => {
        if (activeSelectOption === option) {
            setSelectOption(null);
            setIsDropDownDestination(false);
        } else {
            setSelectOption(option);
            if (option === 'destination') {
                setIsDropDownDestination(true);
            } else {
                setIsDropDownDestination(false);
            }
        }
    };

    return (
        <div className="flex w-full mx-auto ">
            {/* Hearder */}
            <div className="header w-full fixed top-0 left-0 z-[10]">
                {/* Sub Hearder */}
                <div className="subHeader bg-yellow-200 p-1">
                    <div className="subHeaderContent w-4/5 mx-auto flex justify-between text-sm">
                        <div className="subHeaderLeft">
                            <div className="flex items-center gap-3">
                                <div className="flex items-center gap-1">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" />
                                    </svg>
                                    <p className="text-red-600 font-bold">0364798502</p>
                                </div>
                                <p>-</p>
                                <p>Từ 8:00 - 20:00 hằng ngày</p>
                            </div>
                        </div>
                        <div className="subHeaderRight">
                            <Link href="/auth" className="cursor-pointer text-hover-blue">Đăng nhập / Đăng ký</Link>
                        </div>
                    </div>
                </div>
                {/* Main Hearder */}
                <div className="mainHeader flex items-center justify-between text-xl py-4 relative bg-white shadow-sm">
                    <div className="mainHeaderContent w-4/5 mx-auto flex justify-between ">
                        {/* DropDownMenu Destination */}
                        {isDropDownDestination && (
                            <div className='absolute top-1/1 w-4/5 flex rounded-3xl shadow-custom p-4 pl-20 z-[20] text-base bg-white'>
                                <div className='relative flex w-full'>
                                    {/* Button Close Dropdown */}
                                    <div 
                                        className='absolute top-0 right-0 cursor-pointer hover:text-red-600'
                                        onClick={() => {setIsDropDownDestination(false);setSelectOption(null)}}
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="size-6">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                                        </svg>
                                    </div>
                                    {/* Areas */}
                                    <div className='areas flex flex-col gap-4 font-bold'>
                                        <a 
                                            onClick={() => setSelectedArea('domestic')}
                                            className={`cursor-pointer text-hover-blue  ${
                                                selectedArea === 'domestic' ? 'text-main ' : ''
                                            }`}
                                        >
                                            TRONG NƯỚC
                                        </a>
                                    </div>
                                    {/* Regions */}
                                    <div className='regions flex-1 pl-20 '>
                                        {/* Regions VietNam*/}
                                        {selectedArea === 'domestic' && (
                                            <div className='flex gap-10'>
                                                <div>
                                                    <p className='font-bold pb-4'>MIỀN BẮC</p>
                                                    <ul className='flex flex-col gap-2'>
                                                        <li className='w-fit cursor-pointer underline-animation'>Hà Giang</li>
                                                        <li className='w-fit cursor-pointer underline-animation'>Quảng Ninh</li>
                                                        <li className='w-fit cursor-pointer underline-animation'>Ninh Bình</li>
                                                        <li className='w-fit cursor-pointer underline-animation'>Hà Nội</li>
                                                        <li className='w-fit cursor-pointer underline-animation'>Lào Cai</li>
                                                        <a className='flex items-center gap-1 text-hover-blue'>
                                                            <p className='cursor-pointer '>Xem tất cả</p>
                                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4">
                                                                <path strokeLinecap="round" strokeLinejoin="round" d="m5.25 4.5 7.5 7.5-7.5 7.5m6-15 7.5 7.5-7.5 7.5" />
                                                            </svg>
                                                        </a>
                                                    </ul>
                                                </div>
                                                <div>
                                                    <p className='font-bold pb-4'>MIỀN TRUNG</p>
                                                    <ul className='flex flex-col gap-2'>
                                                        <li className='w-fit cursor-pointer underline-animation'>Đà Nẵng</li>
                                                        <li className='w-fit cursor-pointer underline-animation'>TP.Huế</li>
                                                        <li className='w-fit cursor-pointer underline-animation'>Quảng Bình</li>
                                                        <li className='w-fit cursor-pointer underline-animation'>Quy Nhơn</li>
                                                        <li className='w-fit cursor-pointer underline-animation'>Phú Yên</li>
                                                        <a className='flex items-center gap-1 text-hover-blue'>
                                                            <p className='cursor-pointer '>Xem tất cả</p>
                                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4">
                                                                <path strokeLinecap="round" strokeLinejoin="round" d="m5.25 4.5 7.5 7.5-7.5 7.5m6-15 7.5 7.5-7.5 7.5" />
                                                            </svg>
                                                        </a>
                                                    </ul>
                                                </div>
                                                <div>
                                                    <p className='font-bold pb-4'>MIỀN ĐÔNG NAM BỘ</p>
                                                    <ul className='flex flex-col gap-2'>
                                                        <li className='w-fit cursor-pointer underline-animation'>Tây Ninh</li>
                                                        <li className='w-fit cursor-pointer underline-animation'>TP. Hồ Chí Minh</li>
                                                        <li className='w-fit cursor-pointer underline-animation'>Đồng Nai</li>
                                                        <li className='w-fit cursor-pointer underline-animation'>Vũng Tàu</li>
                                                        <li className='w-fit cursor-pointer underline-animation'>Côn Đảo</li>
                                                        <a className='flex items-center gap-1 text-hover-blue'>
                                                            <p className='cursor-pointer '>Xem tất cả</p>
                                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4">
                                                                <path strokeLinecap="round" strokeLinejoin="round" d="m5.25 4.5 7.5 7.5-7.5 7.5m6-15 7.5 7.5-7.5 7.5" />
                                                            </svg>
                                                        </a>
                                                    </ul>
                                                </div>
                                                <div>
                                                    <p className='font-bold pb-4'>MIỀN TÂY NAM BỘ</p>
                                                    <ul className='flex flex-col gap-2'>
                                                        <li className='w-fit cursor-pointer underline-animation'>Phú Quốc</li>
                                                        <li className='w-fit cursor-pointer underline-animation'>Cần Thơ</li>
                                                        <li className='w-fit cursor-pointer underline-animation'>Cà Mau</li>
                                                        <li className='w-fit cursor-pointer underline-animation'>Bạc Liêu</li>
                                                        <li className='w-fit cursor-pointer underline-animation'>Tiền Giang</li>
                                                        <a className='flex items-center gap-1 text-hover-blue'>
                                                            <p className='cursor-pointer '>Xem tất cả</p>
                                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4">
                                                                <path strokeLinecap="round" strokeLinejoin="round" d="m5.25 4.5 7.5 7.5-7.5 7.5m6-15 7.5 7.5-7.5 7.5" />
                                                            </svg>
                                                        </a>
                                                    </ul>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}
                        {/* Main Hearder Content*/}
                        <div className="mainHeaderLeft font-bold">
                            Logo
                        </div>
                        <div className="mainHeaderRight font-bold">
                            <ul className="flex gap-8">
                                <Link href="/" 
                                    onClick={() => handleClickMenu('home')}
                                    className={`cursor-pointer text-hover-blue transition-colors ${
                                        activeSelectOption === 'home' ? 'text-main' : ''
                                    }`}
                                >
                                    Trang chủ
                                </Link>
                                <li 
                                    onClick={() => handleClickMenu('about')}
                                    className={`cursor-pointer text-hover-blue transition-colors ${
                                        activeSelectOption === 'about' ? 'text-main' : ''
                                    }`}
                                >
                                    Giới thiệu
                                </li>
                                <li
                                    onClick={() => handleClickMenu('destination')}
                                    className={`cursor-pointer text-hover-blue transition-colors ${
                                        activeSelectOption === 'destination' ? 'text-main' : ''
                                    }`}
                                >
                                    Điểm đến
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}