'use client';

import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface TourPolicyAccordionProps {
    included_service: string;
    excluded_service: string;
}

export default function TourInforNote({ included_service = '', excluded_service = '' }: TourPolicyAccordionProps) {
    const [openIds, setOpenIds] = useState<Set<string>>(new Set());
    const toggle = (id: string) => { setOpenIds(prev => { const newSet = new Set(prev); if (newSet.has(id)) newSet.delete(id); else newSet.add(id); return newSet; }); };
    const leftColumnItems = [
        { 
            id: 'included', 
            title: 'Giá tour bao gồm', 
            content: included_service 
        },
        { 
            id: 'child', 
            title: 'Lưu ý giá trẻ em', 
            content: '- Trẻ em dưới 2 tuổi: 30% giá tour người lớn (không có chế độ giường riêng)\n\
                        Trẻ em từ trên 2 tuổi đến dưới 12 tuổi bay hàng không VJ:\n\
                        90% giá tour người lớn (không có chế độ giường riêng) \n\
                        100% giá tour người lớn (có chế độ giường riêng) \n\
                        Trẻ em từ trên 2 tuổi đến dưới 12 tuổi bay hàng không VN: \n\
                        75% giá tour người lớn (không có chế độ giường riêng) \n\
                        90% giá tour người lớn (có chế độ giường riêng) \n\
                        Trẻ em từ 12 tuổi trở lên: 100% giá tour người lớn.' 
        },
        { 
            id: 'register', 
            title: 'Điều kiện đăng ký', 
            content: `- Khi đăng ký tour du lịch, Quý khách vui lòng đọc kỹ chương trình, giá tour, các khoản bao gồm cũng như không bao gồm trong chương trình, các điều kiện hủy tour trên biên nhận đóng tiền. Trong trường hợp Quý khách không trực tiếp đến đăng ký tour mà do người khác đến đăng ký thì Quý khách vui lòng tìm hiểu kỹ chương trình từ người đăng ký cho mình. 
                        Nếu Quý khách là Việt Kiều hoặc khách Nước Ngoài và visa VN ghi trong hộ chiếu là loại visa nhập cảnh 1 lần. Quý khách tự làm visa tái xuất nhập vào Việt Nam theo link https://evisa.xuatnhapcanh.gov.vn/web/guest/khai-thi-thuc-dien-tu/cap-thi-thuc-dien-tu
                        Do các chuyến bay phụ thuộc vào các hãng Hàng Không nên trong một số trường hợp giờ bay có thể thay đổi mà không được báo trước.
                        Tùy vào tình hình thực tế, thứ tự các điểm tham quan trong chương trình có thể thay đổi nhưng vẫn đảm bảo đầy đủ các điểm tham quan như lúc đầu.
                        Chúng tôi sẽ không chịu trách nhiệm bảo đảm các điểm tham quan trong trường hợp:
                        Xảy ra thiên tai: bão lụt, hạn hán, động đất, dịch bệnh…
                        Sự cố về an ninh: khủng bố, biểu tình
                        Sự cố về hàng không: trục trặc kỹ thuật, an ninh, dời, hủy, hoãn chuyến bay.
                        Nếu những trường hợp trên xảy ra, chúng tôi sẽ xem xét để hoàn trả chi phí không tham quan cho khách trong điều kiện có thể (sau khi đã trừ lại các dịch vụ đã thực hiện không chịu trách nhiệm bồi thường thêm bất kỳ chi phí nào khác).' 
        `},
        { 
            id: 'cancel', 
            title: 'Các điều kiện hủy tour', 
            content: `Sau khi đóng tiền, nếu Quý khách muốn chuyển/huỷ tour xin vui lòng mang Vé Du Lịch hoặc biên nhận đóng tiền đến văn phòng đăng ký tour để làm thủ tục chuyển/huỷ tour và chịu chi phí theo quy định của Vietravel. Không giải quyết các trường hợp liên hệ chuyển/huỷ tour qua điện thoại.
                        Đối với những tour còn thời hạn hủy nhưng đã làm visa, Quý khách vui lòng thanh toán phí visa.
                        Sau khi đặt cọc tour và trước khi Vietravel nộp phí visa: chi phí không hoàn lại là 2.000.000 VND (phí đặt cọc vé máy bay và đặt lịch lăn tay với trung tâm tiếp nhận hồ sơ).
                        Sau khi Vietravel nộp phí visa: chi phí không hoàn lại là 4.000.000 VND
                        Trường hợp Quý khách bị từ chối visa, chi phí không hoàn lại là 4.000.000 VND` 
        },
    ];

    const rightColumnItems = [
        {   
            id: 'excluded', 
            title: 'Giá tour không bao gồm', 
            content: excluded_service 
        },
        { 
            id: 'payment', 
            title: 'Điều kiện thanh toán', 
            content: `- Quý khách vui lòng đóng tiền cọc tương đương 50% giá tour/khách để giữ chỗ. Số tiền còn lại sẽ thanh toán trước ngày khởi hành 07 ngày (đối với các tour ngày thường) và thanh toán trước 21 ngày (đối với các tour trong các dịp Lễ, Tết).`
        },
        { 
            id: 'note', 
            title: 'Lưu ý về chuyển hoặc hủy tour', 
            content: `- Nếu hủy hoặc chuyển sang các tuyến du lịch khác trước ngày khởi hành 30 ngày: Không mất chi phí.
                        - Nếu hủy hoặc chuyển sang các chuyến du lịch khác từ 25-29 ngày trước ngày khởi hành: Chi phí chuyển/huỷ tour là 50% tiền cọc tour.
                        - Nếu hủy hoặc chuyển sang các chuyến du lịch khác từ 20-24 ngày trước ngày khởi hành: Chi phí chuyển/huỷ tour là 100% tiền cọc tour.
                        - Nếu hủy chuyến du lịch ngay sau khi Đại Sứ Quán, Lãnh Sự Quán đã cấp visa: Chi phí huỷ tour là 100% tiền cọc tour.
                        - Nếu hủy chuyến du lịch trong vòng từ 14-19 ngày trước ngày khởi hành: Chi phí huỷ tour là 50% trên giá tour du lịch.
                        - Nếu hủy chuyến du lịch trong vòng từ 10-13 ngày trước ngày khởi hành: Chi phí huỷ tour là 70% trên giá tour du lịch.
                        - Nếu hủy chuyến du lịch trong vòng từ 02-09 ngày trước ngày khởi hành: Chi phí huỷ tour là 90% trên giá vé du lịch.
                        - Nếu hủy chuyến du lịch trong vòng 1 ngày trước ngày khởi hành: Chi phí huỷ tour là 100% trên giá vé du lịch.
                        * Thời gian hủy tour được tính cho ngày làm việc, không tính thứ bảy và chủ nhật`
        },
    ];

    return (
        <div className='flex flex-col gap-4'>
            <h1 className='font-medium mx-auto text-xl'>NHỮNG THÔNG TIN CẦN LƯU Ý</h1>
            <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-4">
                    {leftColumnItems.map(item => {
                        const isOpen = openIds.has(item.id);
                        return (
                            <div
                                key={item.id}
                                className="border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                            >
                                <button
                                    onClick={() => toggle(item.id)}
                                    className="cursor-pointer w-full px-6 py-4 flex items-center justify-between hover:bg-blue-100 transition-colors text-left"
                                >
                                    <span className="font-medium">{item.title}</span>
                                    {isOpen ? (
                                        <ChevronUp className="w-5 h-5" />
                                    ) : (
                                        <ChevronDown className="w-5 h-5" />
                                    )}
                                </button>

                                <div
                                    className={`overflow-hidden transition-all duration-400 ease-in-out ${
                                        isOpen ? 'max-h-[500px] opacity-400' : 'max-h-0 opacity-0'
                                    }`}
                                >
                                <div className="px-6 py-5 bg-white border-t border-gray-100">
                                    <div className="text-gray-700 text-sm leading-relaxed">
                                        <p>{item.content}</p>
                                    </div>
                                </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                <div className="space-y-4">
                {rightColumnItems.map(item => {
                    const isOpen = openIds.has(item.id);
                    return (
                    <div
                        key={item.id}
                        className="border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                    >
                        <button
                            onClick={() => toggle(item.id)}
                            className="cursor-pointer w-full px-6 py-4 flex items-center justify-between hover:bg-blue-100 transition-colors text-left"
                        >
                            <span className="font-medium">{item.title}</span>
                            {isOpen ? (
                                <ChevronUp className="w-5 h-5" />
                            ) : (
                                <ChevronDown className="w-5 h-5" />
                            )}
                        </button>

                        <div
                            className={`overflow-hidden transition-all duration-400 ease-in-out ${
                                isOpen ? 'max-h-[500px] opacity-300' : 'max-h-0 opacity-0'
                            }`}
                        >
                            <div className="px-6 py-5 bg-white border-t border-gray-100">
                                <div className="text-gray-700 text-sm leading-relaxed">
                                    <p>{item.content}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    );
                })}
                </div>

            </div>
        </div>
    );
}