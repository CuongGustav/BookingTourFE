export interface CreateImageTourFE {
    file: File;          
    preview: string;      
    display_order: number;
}

export interface ReadTourImages {
    tour_image_id: string;
    image_url: string;
    image_public_id: string;
    display_order: number;
}