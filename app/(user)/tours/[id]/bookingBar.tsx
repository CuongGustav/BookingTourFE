import { formatPrice } from "@/app/common"

export default function BookingBarPage() {
    return (
        <div className="flex flex-col gap-2">
            <span className="font-bold">Giá từ:</span>
            <span>
                <p className="text-2xl text-red-600 font-bold">6.790.000</p>
                <p>/ Khách</p>
            </span>
            <span>
                <p>Mã chương trình:</p>
                <p className="font-bold"></p>
            </span>
            <button>
                Chọn ngày khởi hành
            </button>
        </div>
    )

}