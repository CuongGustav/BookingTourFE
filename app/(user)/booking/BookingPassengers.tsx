'use client'

import { useState, useEffect } from "react";

interface CreateBookingPassenger {
    passenger_type: "ADULT" | "CHILD" | "INFANT";
    full_name: string;
    date_of_birth: string;
    gender: "MALE" | "FEMALE" | "OTHER";
    id_number: string;
    single_room: 1 | 0;
}

export default function BookingPassenger() {
  const [numAdults, setNumAdults] = useState(1);
  const [numChildren, setNumChildren] = useState(0);
  const [numInfants, setNumInfants] = useState(0);

  const [adultPassengers, setAdultPassengers] = useState<CreateBookingPassenger[]>([]);
  const [childPassengers, setChildPassengers] = useState<CreateBookingPassenger[]>([]);
  const [infantPassengers, setInfantPassengers] = useState<CreateBookingPassenger[]>([]);

  const [adultErrors, setAdultErrors] = useState<{ full_name: string; gender: string; date_of_birth: string; id_number: string; }[]>([]);
  const [childErrors, setChildErrors] = useState<{ full_name: string; gender: string; date_of_birth: string; }[]>([]);
  const [infantErrors, setInfantErrors] = useState<{ full_name: string; gender: string; date_of_birth: string; }[]>([]);

  useEffect(() => {
    const newPassengers = [...adultPassengers];
    while (newPassengers.length < numAdults) {
      newPassengers.push({
        passenger_type: "ADULT",
        full_name: '',
        date_of_birth: '',
        gender: 'MALE',
        id_number: '',
        single_room: 0
      });
    }
    setAdultPassengers(newPassengers.slice(0, numAdults));

    const newErrors = [...adultErrors];
    while (newErrors.length < numAdults) {
      newErrors.push({ full_name: '', gender: '', date_of_birth: '', id_number: '' });
    }
    setAdultErrors(newErrors.slice(0, numAdults));
  }, [numAdults]);

  useEffect(() => {
    const newPassengers = [...childPassengers];
    while (newPassengers.length < numChildren) {
      newPassengers.push({
        passenger_type: "CHILD",
        full_name: '',
        date_of_birth: '',
        gender: 'MALE',
        id_number: '',
        single_room: 0
      });
    }
    setChildPassengers(newPassengers.slice(0, numChildren));

    const newErrors = [...childErrors];
    while (newErrors.length < numChildren) {
      newErrors.push({ full_name: '', gender: '', date_of_birth: '' });
    }
    setChildErrors(newErrors.slice(0, numChildren));
  }, [numChildren]);

  useEffect(() => {
    const newPassengers = [...infantPassengers];
    while (newPassengers.length < numInfants) {
      newPassengers.push({
        passenger_type: "INFANT",
        full_name: '',
        date_of_birth: '',
        gender: 'MALE',
        id_number: '',
        single_room: 0
      });
    }
    setInfantPassengers(newPassengers.slice(0, numInfants));

    const newErrors = [...infantErrors];
    while (newErrors.length < numInfants) {
      newErrors.push({ full_name: '', gender: '', date_of_birth: '' });
    }
    setInfantErrors(newErrors.slice(0, numInfants));
  }, [numInfants]);

  const updateAdult = (index: number, field: keyof CreateBookingPassenger, value: string | "MALE" | "FEMALE" | "OTHER" | 1 | 0) => {
    setAdultPassengers((prev) => prev.map((p, i) => (i === index ? { ...p, [field]: value } : p)));
  };

  const updateChild = (index: number, field: keyof CreateBookingPassenger, value: string | "MALE" | "FEMALE" | "OTHER" | 1 | 0) => {
    setChildPassengers((prev) => prev.map((p, i) => (i === index ? { ...p, [field]: value } : p)));
  };

  const updateInfant = (index: number, field: keyof CreateBookingPassenger, value: string | "MALE" | "FEMALE" | "OTHER" | 1 | 0) => {
    setInfantPassengers((prev) => prev.map((p, i) => (i === index ? { ...p, [field]: value } : p)));
  };

  const validateAdult = (index: number) => {
    const errors = { full_name: '', gender: '', date_of_birth: '', id_number: '' };
    const data = adultPassengers[index];

    if (!data.full_name.trim()) errors.full_name = 'Thông tin bắt buộc';
    if (!data.gender) errors.gender = 'Thông tin bắt buộc';
    if (!data.date_of_birth.trim()) errors.date_of_birth = 'Thông tin bắt buộc';
    if (!data.id_number.trim()) {
      errors.id_number = 'Thông tin bắt buộc';
    } else if (!/^\d{12}$/.test(data.id_number)) {
      errors.id_number = 'Số CCCD phải là 12 chữ số';
    }

    setAdultErrors((prev) => prev.map((e, i) => (i === index ? errors : e)));
  };

  const validateChild = (index: number) => {
    const errors = { full_name: '', gender: '', date_of_birth: '' };
    const data = childPassengers[index];

    if (!data.full_name.trim()) errors.full_name = 'Thông tin bắt buộc';
    if (!data.gender) errors.gender = 'Thông tin bắt buộc';
    if (!data.date_of_birth.trim()) errors.date_of_birth = 'Thông tin bắt buộc';

    setChildErrors((prev) => prev.map((e, i) => (i === index ? errors : e)));
  };

  const validateInfant = (index: number) => {
    const errors = { full_name: '', gender: '', date_of_birth: '' };
    const data = infantPassengers[index];

    if (!data.full_name.trim()) errors.full_name = 'Thông tin bắt buộc';
    if (!data.gender) errors.gender = 'Thông tin bắt buộc';
    if (!data.date_of_birth.trim()) errors.date_of_birth = 'Thông tin bắt buộc';

    setInfantErrors((prev) => prev.map((e, i) => (i === index ? errors : e)));
  };

  const handleIdNumberChange = (index: number, value: string) => {
    const numericValue = value.replace(/\D/g, '').slice(0, 12);
    updateAdult(index, 'id_number', numericValue);
  };

  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-bold uppercase">Hành khách</h1>
      <div className="flex flex-wrap gap-4">
        <div className="border rounded p-4 flex items-center justify-between w-64">
          <div>
            <p>Người lớn</p>
            <p className="text-sm text-gray-500">Từ 12 trở lên ●</p>
          </div>
          <div className="flex items-center gap-2">
            <button className="border px-2" onClick={() => setNumAdults(Math.max(1, numAdults - 1))}>-</button>
            <span>{numAdults}</span>
            <button className="border px-2" onClick={() => setNumAdults(numAdults + 1)}>+</button>
          </div>
        </div>
        <div className="border rounded p-4 flex items-center justify-between w-64">
          <div>
            <p>Trẻ em</p>
            <p className="text-sm text-gray-500">Từ 2 - 11 tuổi ●</p>
          </div>
          <div className="flex items-center gap-2">
            <button className="border px-2" onClick={() => setNumChildren(Math.max(0, numChildren - 1))}>-</button>
            <span>{numChildren}</span>
            <button className="border px-2" onClick={() => setNumChildren(numChildren + 1)}>+</button>
          </div>
        </div>
        <div className="border rounded p-4 flex items-center justify-between w-64">
          <div>
            <p>Em bé</p>
            <p className="text-sm text-gray-500">Dưới 2 tuổi ●</p>
          </div>
          <div className="flex items-center gap-2">
            <button className="border px-2" onClick={() => setNumInfants(Math.max(0, numInfants - 1))}>-</button>
            <span>{numInfants}</span>
            <button className="border px-2" onClick={() => setNumInfants(numInfants + 1)}>+</button>
          </div>
        </div>
      </div>

      <h1 className="font-bold uppercase">Thông tin hành khách</h1>

      <div>
        <div className="flex items-center mb-2">
          <span className="mr-2">🧑</span>
          <span>Người lớn (Từ 12 trở lên)</span>
        </div>
        {adultPassengers.map((passenger, index) => (
          <div key={`adult-${index}`} className="border-b pb-4">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
              <div className="col-span-1">
                <div className="flex gap-1">
                  <p>Họ tên: *</p>
                </div>
                <p className="text-sm text-gray-500">Liên hệ</p>
                <input
                  className="border p-2 w-full rounded"
                  value={passenger.full_name}
                  onChange={(e) => updateAdult(index, 'full_name', e.target.value)}
                  onBlur={() => validateAdult(index)}
                />
                {adultErrors[index]?.full_name && <p className="text-red-600 text-sm">{adultErrors[index].full_name}</p>}
              </div>
              <div className="col-span-1">
                <div className="flex gap-1">
                  <p>Số CMND/Hộ chiếu: *</p>
                </div>
                <input
                  className="border p-2 w-full rounded"
                  maxLength={12}
                  value={passenger.id_number}
                  onChange={(e) => handleIdNumberChange(index, e.target.value)}
                  onBlur={() => validateAdult(index)}
                />
                {adultErrors[index]?.id_number && <p className="text-red-600 text-sm">{adultErrors[index].id_number}</p>}
              </div>
              <div>
                <div className="flex gap-1">
                  <p>Giới tính: *</p>
                </div>
                <select
                  className="border p-2 w-full rounded"
                  value={passenger.gender}
                  onChange={(e) => updateAdult(index, 'gender', e.target.value as "MALE" | "FEMALE" | "OTHER")}
                  onBlur={() => validateAdult(index)}
                >
                  <option value="MALE">Nam</option>
                  <option value="FEMALE">Nữ</option>
                  <option value="OTHER">Khác</option>
                </select>
                {adultErrors[index]?.gender && <p className="text-red-600 text-sm">{adultErrors[index].gender}</p>}
              </div>
              <div>
                <div className="flex gap-1">
                  <p>Ngày sinh: *</p>
                </div>
                <div className="relative">
                  <input
                    type="date"
                    className="border p-2 w-full rounded pr-8"
                    value={passenger.date_of_birth}
                    onChange={(e) => updateAdult(index, 'date_of_birth', e.target.value)}
                    onBlur={() => validateAdult(index)}
                  />
                  <span className="absolute right-2 top-1/2 transform -translate-y-1/2">📅</span>
                </div>
                {adultErrors[index]?.date_of_birth && <p className="text-red-600 text-sm">{adultErrors[index].date_of_birth}</p>}
              </div>
              <div className="flex items-center gap-2">
                <p>Phòng đơn</p>
                <input
                  type="checkbox"
                  checked={passenger.single_room === 1}
                  onChange={(e) => updateAdult(index, 'single_room', e.target.checked ? 1 : 0)}
                />
                <p>5.000.000 đ</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {numChildren > 0 && (
        <div>
          <div className="flex items-center mb-2">
            <span className="mr-2">👫</span>
            <span>Trẻ em (Từ 2 - 11 tuổi)</span>
          </div>
          {childPassengers.map((passenger, index) => (
            <div key={`child-${index}`} className="border-b pb-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                <div className="col-span-1">
                  <div className="flex gap-1">
                    <p>Họ tên: *</p>
                  </div>
                  <p className="text-sm text-gray-500">Liên hệ</p>
                  <input
                    className="border p-2 w-full rounded"
                    value={passenger.full_name}
                    onChange={(e) => updateChild(index, 'full_name', e.target.value)}
                    onBlur={() => validateChild(index)}
                  />
                  {childErrors[index]?.full_name && <p className="text-red-600 text-sm">{childErrors[index].full_name}</p>}
                </div>
                <div>
                  <div className="flex gap-1">
                    <p>Giới tính: *</p>
                  </div>
                  <select
                    className="border p-2 w-full rounded"
                    value={passenger.gender}
                    onChange={(e) => updateChild(index, 'gender', e.target.value as "MALE" | "FEMALE" | "OTHER")}
                    onBlur={() => validateChild(index)}
                  >
                    <option value="MALE">Nam</option>
                    <option value="FEMALE">Nữ</option>
                    <option value="OTHER">Khác</option>
                  </select>
                  {childErrors[index]?.gender && <p className="text-red-600 text-sm">{childErrors[index].gender}</p>}
                </div>
                <div>
                  <div className="flex gap-1">
                    <p>Ngày sinh: *</p>
                  </div>
                  <div className="relative">
                    <input
                      type="date"
                      className="border p-2 w-full rounded pr-8"
                      value={passenger.date_of_birth}
                      onChange={(e) => updateChild(index, 'date_of_birth', e.target.value)}
                      onBlur={() => validateChild(index)}
                    />
                    <span className="absolute right-2 top-1/2 transform -translate-y-1/2">📅</span>
                  </div>
                  {childErrors[index]?.date_of_birth && <p className="text-red-600 text-sm">{childErrors[index].date_of_birth}</p>}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {numInfants > 0 && (
        <div>
          <div className="flex items-center mb-2">
            <span className="mr-2">👶</span>
            <span>Em bé (Dưới 2 tuổi)</span>
          </div>
          {infantPassengers.map((passenger, index) => (
            <div key={`infant-${index}`} className="border-b pb-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                <div className="col-span-1">
                  <div className="flex gap-1">
                    <p>Họ tên: *</p>
                  </div>
                  <p className="text-sm text-gray-500">Liên hệ</p>
                  <input
                    className="border p-2 w-full rounded"
                    value={passenger.full_name}
                    onChange={(e) => updateInfant(index, 'full_name', e.target.value)}
                    onBlur={() => validateInfant(index)}
                  />
                  {infantErrors[index]?.full_name && <p className="text-red-600 text-sm">{infantErrors[index].full_name}</p>}
                </div>
                <div>
                  <div className="flex gap-1">
                    <p>Giới tính: *</p>
                  </div>
                  <select
                    className="border p-2 w-full rounded"
                    value={passenger.gender}
                    onChange={(e) => updateInfant(index, 'gender', e.target.value as "MALE" | "FEMALE" | "OTHER")}
                    onBlur={() => validateInfant(index)}
                  >
                    <option value="MALE">Nam</option>
                    <option value="FEMALE">Nữ</option>
                    <option value="OTHER">Khác</option>
                  </select>
                  {infantErrors[index]?.gender && <p className="text-red-600 text-sm">{infantErrors[index].gender}</p>}
                </div>
                <div>
                  <div className="flex gap-1">
                    <p>Ngày sinh: *</p>
                  </div>
                  <div className="relative">
                    <input
                      type="date"
                      className="border p-2 w-full rounded pr-8"
                      value={passenger.date_of_birth}
                      onChange={(e) => updateInfant(index, 'date_of_birth', e.target.value)}
                      onBlur={() => validateInfant(index)}
                    />
                    <span className="absolute right-2 top-1/2 transform -translate-y-1/2">📅</span>
                  </div>
                  {infantErrors[index]?.date_of_birth && <p className="text-red-600 text-sm">{infantErrors[index].date_of_birth}</p>}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}