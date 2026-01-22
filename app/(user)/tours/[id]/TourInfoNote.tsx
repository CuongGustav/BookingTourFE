'use client';

import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import AudioReader from './AudioReader';

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
            content: '- Xem giá trẻ em trong phần đặt tour giá sẽ thấp hơn giá người lớn'
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
            content: `Sau khi đóng tiền, nếu Quý khách muốn huỷ tour xin vui lòng mang Vé Du Lịch hoặc biên nhận đóng tiền đến văn phòng đăng ký tour để làm thủ tục huỷ tour và chịu chi phí theo quy định của Vietravel. 
                        Giải quyết các trường hợp liên hệ huỷ tour qua điện thoại. Bằng số hotline: 0354798502`
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
            content: `- Quý khách vui lòng thanh toán 100% số tiền giá tour/khách để giữ chỗ.`
        },
        { 
            id: 'note', 
            title: 'Lưu ý về chuyển hoặc hủy tour', 
            content: `- Nếu hủy hoặc chuyển sang các tuyến du lịch khác trước ngày khởi hành 30 ngày: Không mất chi phí.
                        - Nếu hủy hoặc chuyển sang các chuyến du lịch khác sớm hơn 7 ngày trước ngày khởi hành: Chi phí chuyển/huỷ tour là 30% tiền cọc tour.
                        - Nếu hủy hoặc chuyển sang các chuyến du lịch khác muộn hơn 7 ngày trước ngày khởi hành: Chi phí chuyển/huỷ tour là 70% tiền cọc tour.
                        * Thời gian hủy tour được tính cho ngày làm việc, tính cả thứ bảy và chủ nhật`
        },
    ];

    const allItems = [...leftColumnItems, ...rightColumnItems];
    const fullNoteSpeech = "Sau đây là những thông tin cần lưu ý cho chuyến đi. " + 
        allItems.map(item => `${item.title}: ${item.content}`).join(". Tiếp theo ");

    return (
        <div className='flex flex-col gap-2'>
            <div className="flex items-center justify-center gap-3">
                <h1 className='font-medium text-xl'>NHỮNG THÔNG TIN CẦN LƯU Ý</h1>
                <AudioReader text={fullNoteSpeech} />
            </div>
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