export interface Gender {
    id: number;
    name: string;
    value: string;
}

export const gendersData: Gender[] = [
    { id: 1, name: "Nam", value: "MALE" },
    { id: 2, name: "Nữ", value: "FEMALE" },
    { id: 3, name: "Khác", value: "OTHER" }
];