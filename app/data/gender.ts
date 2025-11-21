export interface Gender {
    id: number;
    name: string;
    value: string;
}

export const gendersData: Gender[] = [
    { id: 1, name: "Nam", value: "Male" },
    { id: 2, name: "Nữ", value: "Female" },
    { id: 3, name: "Khác", value: "Other" }
];