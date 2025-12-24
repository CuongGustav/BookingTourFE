//format price xxx.000.000
export const formatPrice = (price: number | string | null | undefined): string => {
    if (price === null || price === undefined || price === "") return "—";
    let num: number;
    if (typeof price === "string") {
        num = parseFloat(price.replace(/,/g, '')); 
    } else {
        num = price;
    }
    if (isNaN(num)) return "—";
    const fixed = Number(num.toFixed(2));
    const integerPart = Math.floor(fixed); 
    const decimalPart = (fixed - integerPart).toFixed(2).slice(2); 
    const formattedInteger = integerPart.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    if (decimalPart === "00") {
        return formattedInteger;
    }
    return `${formattedInteger},${decimalPart}`;
};

//format price xxx.000 k
export const formatPriceK = (price: number | string | null | undefined): string => {
        if (price === null || price === undefined || price === "") return "—";
        let num: number;
        if (typeof price === "string") {
            num = parseFloat(price.replace(/,/g, '')); 
        } else {
            num = price;
        }
        if (isNaN(num)) return "—";
        const valueInK = Math.floor(num / 1000);
        const formatted = valueInK
            .toString()
            .replace(/\B(?=(\d{3})+(?!\d))/g, ".");

        return `${formatted} k`;

    };

export const formatDateVN = (dateStr: string) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    return date.toLocaleDateString("vi-VN");
};

export const parseFormattedNumber = (value: string): number => {
    const cleanValue = value.replace(/\D/g, ""); 
    return cleanValue ? parseInt(cleanValue, 10) : 0;
}
