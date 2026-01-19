'use client';

import {useEffect, useState} from 'react';
import Link from 'next/link';
import { AccountLogin } from '../types/account';

interface HeaderProps {
  account: AccountLogin | null;
}

// const API_URL = process.env.NEXT_PUBLIC_URL_API;

export default function Header({ account: initialAccount }: HeaderProps) {

    const [account, setAccount] = useState<AccountLogin | null>(initialAccount);
    const [activeSelectOption, setSelectOption] = useState<string | null>(null);

    {/* Logic Click Menu */}
    const handleClickMenu = (option: string) => {
        if (activeSelectOption === option) {
            setSelectOption(null);
        } else {
            setSelectOption(option);
        }
    };

    useEffect(() => {
        // Check localStorage when component mount
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            try {
                const userData = JSON.parse(storedUser);
                setAccount(userData);
            } catch (e) {
                console.error('Error parsing stored user:', e);
            }
        }

        // Listen custom event for login page
        const handleAccountUpdate = (event: CustomEvent) => {
            setAccount(event.detail);
        };

        window.addEventListener('accountUpdated', handleAccountUpdate as EventListener);
        
        return () => {
            window.removeEventListener('accountUpdated', handleAccountUpdate as EventListener);
        };
    }, []);

    // Update account when prop changed
    useEffect(() => {
        if (initialAccount) {
            setAccount(initialAccount);
        }
    }, [initialAccount]);

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
                            {account ? (
                                <div className='flex'>
                                    <Link 
                                        href={"/account"}
                                        className='cursor-pointer text-hover-blue hover:bg-white/80 hover:rounded-full'
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 hover:font-medium">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                                        </svg>
                                    </Link>
                                </div>
                            ):(
                                <Link href="/auth" className="cursor-pointer text-hover-blue">Đăng nhập / Đăng ký</Link>
                            )}
                        </div>
                    </div>
                </div>
                {/* Main Hearder */}
                <div className="mainHeader flex items-center justify-between text-xl py-4 relative bg-white shadow-sm">
                    <div className="mainHeaderContent w-4/5 mx-auto flex justify-between ">
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
                                <Link
                                    href="/about"
                                    target="_blank"
                                    className={`text-hover-blue transition-colors cursor-pointer ${
                                        activeSelectOption === 'about' ? 'text-main' : ''
                                    }`}
                                >
                                    Giới thiệu
                                </Link>

                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}