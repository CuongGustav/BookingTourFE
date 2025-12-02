'use client'

import { useState, useEffect, useMemo } from "react"
import { AccountInforListAdmin } from "@/app/types/account"
import ModalReadAccountAdmin from "./account.modalReadAccountAdmin"
import ModalUpdateAccountAdmin from "./account.modalUpdateAccountAdmin"
import ModalDeleteAccountAdmin from "./account.modalDeleteAccountAdmin"

const API_URL = process.env.NEXT_PUBLIC_URL_API

const SortIcon = ({isActive, direction}: {isActive: boolean; direction: "asc" | "desc" | null}) => {
    if(!isActive) {
        return (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="size-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 15 12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9" />
            </svg>
        );
    }
    return direction === "asc" ? (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="size-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 15.75 7.5-7.5 7.5 7.5" />
        </svg>

    ):(
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="size-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
        </svg>
    )
}

export default function AccountsPage () {

    const [accounts, setAccounts] = useState<AccountInforListAdmin[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [sortBy, setSortBy] = useState<keyof AccountInforListAdmin>("created_at");
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
    const [page, setPage] = useState(1);
    const pageSize = 8;
    const [isModalReadOpen, setIsModalReadOpen] = useState(false)
    const [selectedAccount, setSelectedAccount] = useState<AccountInforListAdmin | null> (null)
    const [isModalUpdateOpen, setIsModalUpdateOpen] = useState(false)
    const [isModalDeleteOpen, setIsModalDeleteOpen] = useState(false)

    const fetchListAccount = async () => {
        try {
            const res = await  fetch(`${API_URL}/account/admin/allaccount`, { credentials: "include" })
            const data = await res.json()
            setAccounts(Array.isArray(data) ? data : data.data || []);
            setLoading(false);
        } catch (e) {
            console.error(e);
            alert("Lỗi tải dữ liệu");
            setLoading(false);  
        }
        finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchListAccount()
    }, []);

    const filteredAndSorted = useMemo(() => { //lưu kết quả xử lý từ dữ liệu API, không cần gọi lại
        let result = [...accounts];
        // search 
        if (search.trim()) {
            const term = search.toLowerCase().trim();
            result = result.filter(acc =>
                acc.full_name.toLowerCase().includes(term) ||
                acc.email.toLowerCase().includes(term) ||
                (acc.phone && acc.phone.includes(term)) ||
                (acc.cccd && acc.cccd.includes(term))
            );
        }
        //sort by result search, sortBy, sortOrder
        result.sort((a, b) => {
            const aVal = a[sortBy];
            const bVal = b[sortBy];
            if (aVal === null || aVal === undefined) return 1;
            if (bVal === null || bVal === undefined) return -1;
            if (typeof aVal === "string" && typeof bVal === "string") {
                return sortOrder === "asc"
                ? aVal.localeCompare(bVal)
                : bVal.localeCompare(aVal);
            }
            if (aVal < bVal) return sortOrder === "asc" ? -1 : 1;
            if (aVal > bVal) return sortOrder === "asc" ? 1 : -1;
            return 0;
        });
        return result;
    }, [accounts, search, sortBy, sortOrder]);

    // navigation page
    const paginated = filteredAndSorted.slice((page - 1) * pageSize, page * pageSize);
    const totalPages = Math.ceil(filteredAndSorted.length / pageSize);

    //sort
    const handleSort = (field: keyof AccountInforListAdmin) => {
        if (sortBy === field) {
        setSortOrder(prev => prev === "asc" ? "desc" : "asc");
        } else {
        setSortBy(field);
        setSortOrder("asc");
        }
        setPage(1);
    };

    //convert gender before display
    const formatGender = (gender: string | null) => {
        if (!gender) return <span className="text-gray-400">—</span>;
        const map: Record<string, string> = { MALE: "Nam", FEMALE: "Nữ", OTHER: "Khác" };
        return map[gender] || gender;
    };

    //convert date before display
    const formatDate = (dateStr: string | null) => {
        if (!dateStr) return <span className="text-gray-400">—</span>;
        try {
            return new Date(dateStr).toLocaleDateString("vi-VN");
        } catch {
            return dateStr;
        }
    };

    //handle open modal read
    const openReadModal = (acc: AccountInforListAdmin) =>{
        setSelectedAccount(acc)
        setIsModalReadOpen(true);
    }
    //handle close modal read
    const closeReadModal = () => {
        setSelectedAccount(null)
        setIsModalReadOpen(false);
    }
    //handle open modal update
    const openUpdateModal = (acc: AccountInforListAdmin) => {
        setSelectedAccount(acc)
        setIsModalUpdateOpen(true);
    }
    //handle close modal update
    const closeUpdateModal = () => {
        setSelectedAccount(null)
        setIsModalUpdateOpen(false);
    }

    //handle open modal delete
    const openDeleteModal = (acc: AccountInforListAdmin) => {
        setSelectedAccount(acc)
        setIsModalDeleteOpen(true)
    }
    //handle close modal delete
    const closeDeleteModal = () => {
        setSelectedAccount(null)
        setIsModalDeleteOpen(false);
    }

    if (loading) return <div className="p-8 text-center text-lg">Đang tải danh sách tài khoản...</div>;

    return (
        <div className="py-2 max-w-7xl mx-auto h-screen relative">
            <div className="w-full max-w-[96%] mx-auto">
                {/* title */}
                <h1 className="text-3xl font-bold mb-2 text-main">Quản lý tài khoản</h1>
                {/* search */}
                <div className="bg-white p-2 rounded-xl border-1 border-gray-300 mb-4">
                    <input
                        type="text"
                        placeholder="Tìm tên, email, sđt, cccd..."
                        value={search}
                        onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                        className="w-full px-5 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                </div>
                {/* table */}
                <div className="bg-white rounded-xl order-1 border-gray-300 overflow-x-auto">
                    <table className="w-full min-w-max">
                        <thead className="bg-gray-50 border-b">
                            <tr>
                                <th className="px-6 py-4 text-left font-semibold cursor-pointer hover:bg-gray-100 transition">
                                    <div className="flex items-center gap-2">                                      
                                    </div>
                                </th>
                                <th 
                                    onClick={() => handleSort("full_name")} 
                                    className="px-6 py-4 text-left font-semibold cursor-pointer hover:bg-gray-100 transition"
                                >
                                    <div className="flex items-center gap-2">
                                        Họ tên 
                                        <SortIcon isActive={sortBy === "full_name"} direction={sortBy === "full_name" ? sortOrder : null} />
                                    </div>
                                </th>
                                <th 
                                    onClick={() => handleSort("email")} 
                                    className="px-6 py-4 text-left font-semibold cursor-pointer hover:bg-gray-100 transition"
                                >
                                    <div className="flex items-center gap-2">
                                        Email 
                                        <SortIcon isActive={sortBy === "email"} direction={sortBy === "email" ? sortOrder : null} />
                                    </div>
                                </th>
                                <th    
                                    onClick={() => handleSort("phone")} 
                                    className="px-6 py-4 text-left font-semibold cursor-pointer hover:bg-gray-100 transition"
                                >
                                    <div className="flex items-center gap-2">
                                        SĐT 
                                        <SortIcon isActive={sortBy === "phone"} direction={sortBy === "phone" ? sortOrder : null} />
                                    </div>
                                </th>
                                <th 
                                    onClick={() => handleSort("cccd")} 
                                    className="px-6 py-4 text-left font-semibold cursor-pointer hover:bg-gray-100 transition"
                                >
                                    <div className="flex items-center gap-2">
                                        CCCD 
                                        <SortIcon isActive={sortBy === "cccd"} direction={sortBy === "cccd" ? sortOrder : null} />
                                    </div>
                                </th>
                                <th 
                                    onClick={() => handleSort("gender")} 
                                    className="px-6 py-4 text-left font-semibold cursor-pointer hover:bg-gray-100 transition"
                                >
                                    <div className="flex items-center gap-2">
                                        Giới tính 
                                        <SortIcon isActive={sortBy === "gender"} direction={sortBy === "gender" ? sortOrder : null} />
                                    </div>
                                </th>
                                <th onClick={() => handleSort("date_of_birth")} className="px-6 py-4 text-left font-semibold cursor-pointer hover:bg-gray-100 transition">
                                    <div className="flex items-center gap-2">
                                        Ngày sinh 
                                        <SortIcon isActive={sortBy === "date_of_birth"} direction={sortBy === "date_of_birth" ? sortOrder : null} />
                                    </div>
                                </th>
                                <th onClick={() => handleSort("address")} className="px-6 py-4 text-left font-semibold cursor-pointer hover:bg-gray-100 transition">
                                    <div className="flex items-center gap-2">
                                        Địa chỉ 
                                        <SortIcon isActive={sortBy === "address"} direction={sortBy === "address" ? sortOrder : null} />
                                    </div>
                                </th>
                                <th onClick={() => handleSort("role_account")} className="px-6 py-4 text-left font-semibold cursor-pointer hover:bg-gray-100 transition">
                                    <div className="flex items-center gap-2">
                                        Vai trò 
                                        <SortIcon isActive={sortBy === "role_account"} direction={sortBy === "role_account" ? sortOrder : null} />
                                    </div>
                                </th>
                                <th 
                                    onClick={() => handleSort("is_active")} 
                                    className="px-6 py-4 text-left font-semibold cursor-pointer hover:bg-gray-100 transition"
                                >
                                    <div className="flex items-center gap-2">
                                        Trạng thái 
                                        <SortIcon isActive={sortBy === "is_active"} direction={sortBy === "is_active" ? sortOrder : null} />
                                    </div>
                                </th>
                                <th 
                                    onClick={() => handleSort("created_at")} 
                                    className="px-6 py-4 text-left font-semibold cursor-pointer hover:bg-gray-100 transition"
                                >
                                    <div className="flex items-center gap-2">
                                        Ngày tạo 
                                        <SortIcon isActive={sortBy === "created_at"} direction={sortBy === "created_at" ? sortOrder : null} />
                                    </div>
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {paginated.map(acc => (
                            <tr key={acc.account_id} className="hover:bg-gray-50 transition">
                                <td className="px-2 py-4 font-medium flex gap-2">
                                    <button 
                                        className="p-1 border-1 border-gray-400 rounded cursor-pointer hover:bg-blue-600"
                                        onClick={() => openUpdateModal(acc)}                                   
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                                        </svg>
                                    </button>
                                    <button 
                                        className="p-1 border-1 border-gray-400 rounded cursor-pointer hover:bg-red-600"
                                        onClick={()=>openDeleteModal(acc)}    
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 0 0 5.636 5.636m12.728 12.728A9 9 0 0 1 5.636 5.636m12.728 12.728L5.636 5.636" />
                                        </svg>

                                    </button>
                                </td>
                                <td className="px-6 py-4 font-medium">
                                    <a 
                                        onClick={()=> openReadModal(acc)}
                                        className="cursor-pointer hover:text-blue-600"
                                    >
                                        {acc.full_name}
                                    </a>
                                </td>
                                <td className="px-6 py-4 text-gray-600">{acc.email}</td>
                                <td className="px-6 py-4">{acc.phone || "—"}</td>
                                <td className="px-6 py-4">{acc.cccd || "—"}</td>
                                <td className="px-6 py-4">{formatGender(acc.gender)}</td>
                                <td className="px-6 py-4">{formatDate(acc.date_of_birth)}</td>
                                <td className="px-6 py-4 max-w-xs truncate" title={acc.address || undefined}>
                                {acc.address || "—"}
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${acc.role_account === "QCADMIN" ? "bg-purple-100 text-purple-800" : "bg-green-100 text-green-800"}`}>
                                        {acc.role_account === "QCADMIN" ? "Quản trị viên" : "Người dùng"}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${acc.is_active ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                                        {acc.is_active ? "Hoạt động" : "Bị khóa"}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-500">
                                    {new Date(acc.created_at).toLocaleDateString("vi-VN")}
                                </td>
                            </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {/* navigation */}
                <div className="absolute bottom-4 left-0 right-0">
                    {totalPages > 1 && (
                        <div className="mt-4 flex justify-center items-center gap-2 flex-wrap">
                            {/* arrow left */}
                            <button
                                onClick={() => setPage(prev => Math.max(1, prev - 1))}
                                disabled={page === 1}
                                className={`px-3 py-2 rounded-lg font-medium transition ${
                                    page === 1 
                                        ? "bg-gray-100 text-gray-400 cursor-not-allowed" 
                                        : "bg-gray-200 hover:bg-gray-300 cursor-pointer"
                                }`}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                                </svg>
                            </button>
                            {/* number page */}
                            {(() => {
                                const maxVisible = 5;
                                let startPage = Math.max(1, page - Math.floor(maxVisible / 2));
                                const endPage = Math.min(totalPages, startPage + maxVisible - 1);
                                
                                // Điều chỉnh lại nếu không đủ 5 số
                                if (endPage - startPage + 1 < maxVisible) {
                                    startPage = Math.max(1, endPage - maxVisible + 1);
                                }
                                
                                return Array.from(
                                    { length: endPage - startPage + 1 }, 
                                    (_, i) => startPage + i
                                ).map(p => (
                                    <button 
                                        key={p} 
                                        onClick={() => setPage(p)}
                                        className={`px-5 py-2 rounded-lg font-medium transition cursor-pointer ${
                                            page === p 
                                                ? "bg-blue-600 text-white" 
                                                : "bg-gray-200 hover:bg-gray-300"
                                        }`}
                                    >
                                        {p}
                                    </button>
                                ));
                            })()}
                            {/* arrow right */}
                            <button
                                onClick={() => setPage(prev => Math.min(totalPages, prev + 1))}
                                disabled={page === totalPages}
                                className={`px-3 py-2 rounded-lg font-medium transition ${
                                    page === totalPages 
                                        ? "bg-gray-100 text-gray-400 cursor-not-allowed" 
                                        : "bg-gray-200 hover:bg-gray-300 cursor-pointer"
                                }`}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                                </svg>
                            </button>
                        </div>
                    )}
                </div>
            </div>
            {/* modal read */}
            {isModalReadOpen && (
                <ModalReadAccountAdmin
                    account = {selectedAccount}
                    onClose = {closeReadModal}
                />
            )}
            {/* modal update */}
            {isModalUpdateOpen && (
                <ModalUpdateAccountAdmin
                    account = {selectedAccount}
                    onClose= {closeUpdateModal}
                    onUpdated = {() => {
                        fetchListAccount()
                        setIsModalUpdateOpen(false)
                    }}
                />
            )}
            {/* modal delete */}
            {isModalDeleteOpen && (
                <ModalDeleteAccountAdmin
                    account={selectedAccount}
                    onClose = {closeDeleteModal}
                    onDeleted = {() => {
                        fetchListAccount()
                        setIsModalDeleteOpen(false)
                    }}
                />
            )

            }
        </div>
    )
}