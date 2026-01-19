'use client';

import { useState } from 'react';
import Image from 'next/image';

export default function AboutCompanyPage() {
    const [activeTab, setActiveTab] = useState<'mission' | 'vision' | 'values'>('mission');

    const team = [
        {
            name: 'Nguyễn Văn Quốc',
            position: 'CEO & Founder',
            image: '/account.png',
            description: 'Hơn 15 năm kinh nghiệm trong ngành du lịch'
        },
        {
            name: 'Trần Thị Nhung',
            position: 'Giám đốc Điều hành',
            image: '/account.png',
            description: 'Chuyên gia về quản lý tour và dịch vụ'
        },
        {
            name: 'Lê Văn Cường',
            position: 'Trưởng phòng Marketing',
            image: '/account.png',
            description: 'Chuyên gia marketing du lịch quốc tế'
        },
        {
            name: 'Phạm Thị Dung',
            position: 'Trưởng phòng Chăm sóc KH',
            image: '/account.png',
            description: 'Đảm bảo trải nghiệm tuyệt vời cho khách hàng'
        }
    ];

    const milestones = [
        { year: '2010', event: 'Thành lập công ty với 5 nhân viên đầu tiên' },
        { year: '2013', event: 'Mở rộng ra 3 chi nhánh tại các thành phố lớn' },
        { year: '2016', event: 'Đạt mốc 5,000 khách hàng và nhận giải thưởng Top 10 công ty du lịch uy tín' },
        { year: '2020', event: 'Ra mắt nền tảng booking online hiện đại' },
        { year: '2024', event: 'Phục vụ hơn 10,000 khách hàng mỗi năm với 500+ tour đa dạng' }
    ];

    const values = [
        {
            icon: '🎯',
            title: 'Chất lượng hàng đầu',
            description: 'Cam kết mang đến dịch vụ tốt nhất với giá cả hợp lý'
        },
        {
            icon: '💎',
            title: 'Uy tín - Minh bạch',
            description: 'Thông tin rõ ràng, không phát sinh chi phí'
        },
        {
            icon: '🤝',
            title: 'Tận tâm phục vụ',
            description: 'Đội ngũ nhiệt tình, hỗ trợ 24/7'
        },
        {
            icon: '🌟',
            title: 'Trải nghiệm độc đáo',
            description: 'Những hành trình khác biệt, đáng nhớ'
        }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-b from-white to-blue-50">
            {/* Hero Section */}
            <section className="relative h-[500px] bg-gradient-to-r from-blue-900 to-blue-700 overflow-hidden">
                <div className="absolute inset-0 bg-black/30" />
                <div 
                    className="absolute inset-0 opacity-20"
                    style={{
                        backgroundImage: '/bgimg.png',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center'
                    }}
                />
                <div className="relative z-10 max-w-7xl mx-auto px-4 h-full flex items-center">
                    <div className="text-white max-w-3xl">
                        <h1 className="text-5xl md:text-6xl font-bold mb-6 animate-fade-in">
                            Về Chúng Tôi
                        </h1>
                        <p className="text-xl md:text-2xl text-blue-100 leading-relaxed">
                            Đồng hành cùng bạn trên mọi hành trình khám phá thế giới. 
                            Hơn 15 năm kinh nghiệm, chúng tôi tự hào là người bạn đồng hành tin cậy của hàng ngàn gia đình Việt.
                        </p>
                    </div>
                </div>
            </section>

            {/* Mission, Vision, Values */}
            <section className="py-20 bg-gradient-to-br from-blue-50 to-white">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-bold text-blue-900 mb-4">
                            Triết lý kinh doanh
                        </h2>
                        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                            Những giá trị cốt lõi định hướng mọi hoạt động của chúng tôi
                        </p>
                    </div>

                    {/* Tabs */}
                    <div className="flex justify-center gap-4 mb-8">
                        <button
                            onClick={() => setActiveTab('mission')}
                            className={`px-8 py-3 rounded-full font-semibold transition-all duration-300 ${
                                activeTab === 'mission'
                                    ? 'bg-blue-900 text-white shadow-lg scale-105'
                                    : 'bg-white text-gray-700 hover:bg-blue-50'
                            }`}
                        >
                            Sứ mệnh
                        </button>
                        <button
                            onClick={() => setActiveTab('vision')}
                            className={`px-8 py-3 rounded-full font-semibold transition-all duration-300 ${
                                activeTab === 'vision'
                                    ? 'bg-blue-900 text-white shadow-lg scale-105'
                                    : 'bg-white text-gray-700 hover:bg-blue-50'
                            }`}
                        >
                            Tầm nhìn
                        </button>
                        <button
                            onClick={() => setActiveTab('values')}
                            className={`px-8 py-3 rounded-full font-semibold transition-all duration-300 ${
                                activeTab === 'values'
                                    ? 'bg-blue-900 text-white shadow-lg scale-105'
                                    : 'bg-white text-gray-700 hover:bg-blue-50'
                            }`}
                        >
                            Giá trị
                        </button>
                    </div>

                    {/* Tab Content */}
                    <div className="bg-white rounded-3xl p-8 md:p-12 shadow-xl">
                        {activeTab === 'mission' && (
                            <div className="animate-fade-in">
                                <h3 className="text-3xl font-bold text-blue-900 mb-6">Sứ mệnh của chúng tôi</h3>
                                <p className="text-gray-700 text-lg leading-relaxed">
                                    Mang đến những trải nghiệm du lịch tuyệt vời, an toàn và đáng nhớ cho mọi khách hàng. 
                                    Chúng tôi cam kết tạo ra những hành trình không chỉ đơn thuần là di chuyển từ điểm này sang điểm khác, 
                                    mà là những câu chuyện đẹp, những kỷ niệm khó quên và những bài học quý giá về cuộc sống.
                                </p>
                            </div>
                        )}
                        {activeTab === 'vision' && (
                            <div className="animate-fade-in">
                                <h3 className="text-3xl font-bold text-blue-900 mb-6">Tầm nhìn đến 2030</h3>
                                <p className="text-gray-700 text-lg leading-relaxed">
                                    Trở thành công ty du lịch hàng đầu Việt Nam, được khách hàng tin tưởng lựa chọn nhờ 
                                    chất lượng dịch vụ xuất sắc và sự đổi mới không ngừng. Chúng tôi hướng tới việc mở rộng 
                                    mạng lưới ra toàn khu vực Đông Nam Á, đồng thời ứng dụng công nghệ hiện đại để mang lại 
                                    trải nghiệm booking thuận tiện và cá nhân hóa cho từng khách hàng.
                                </p>
                            </div>
                        )}
                        {activeTab === 'values' && (
                            <div className="animate-fade-in">
                                <h3 className="text-3xl font-bold text-blue-900 mb-8">Giá trị cốt lõi</h3>
                                <div className="grid md:grid-cols-2 gap-6">
                                    {values.map((value, index) => (
                                        <div 
                                            key={index}
                                            className="flex gap-4 p-6 bg-blue-50 rounded-xl hover:shadow-md transition-all"
                                        >
                                            <div className="text-4xl">{value.icon}</div>
                                            <div>
                                                <h4 className="text-xl font-bold text-blue-900 mb-2">{value.title}</h4>
                                                <p className="text-gray-600">{value.description}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* Timeline */}
            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-blue-900 mb-4">
                            Hành trình phát triển
                        </h2>
                        <p className="text-gray-600 text-lg">
                            Từ những bước đi đầu tiên đến vị thế hàng đầu
                        </p>
                    </div>

                    <div className="relative">
                        {/* Timeline line */}
                        <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-blue-200 hidden md:block" />

                        <div className="space-y-12">
                            {milestones.map((milestone, index) => (
                                <div 
                                    key={index}
                                    className={`flex items-center gap-8 ${
                                        index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                                    }`}
                                >
                                    <div className={`flex-1 ${index % 2 === 0 ? 'md:text-right' : 'md:text-left'}`}>
                                        <div className="bg-gradient-to-br from-blue-900 to-blue-700 text-white inline-block px-6 py-2 rounded-full font-bold text-lg mb-3">
                                            {milestone.year}
                                        </div>
                                        <p className="text-gray-700 text-lg">{milestone.event}</p>
                                    </div>
                                    
                                    {/* Center dot */}
                                    <div className="hidden md:block w-6 h-6 bg-blue-900 rounded-full border-4 border-white shadow-lg z-10" />
                                    
                                    <div className="flex-1" />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Team Section */}
            <section className="py-20 bg-gradient-to-br from-blue-50 to-white">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-blue-900 mb-4">
                            Đội ngũ lãnh đạo
                        </h2>
                        <p className="text-gray-600 text-lg">
                            Những con người tài năng và đầy nhiệt huyết
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {team.map((member, index) => (
                            <div 
                                key={index}
                                className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105"
                            >
                                <div className="relative h-64 overflow-hidden">
                                    <Image
                                        src={member.image}
                                        alt={member.name}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                                <div className="p-6 text-center">
                                    <h3 className="text-xl font-bold text-blue-900 mb-2">{member.name}</h3>
                                    <p className="text-blue-600 font-semibold mb-3">{member.position}</p>
                                    <p className="text-gray-600 text-sm">{member.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}