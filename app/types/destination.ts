export interface destinationInfo{
    destination_id: string,
    name: string,
    region: string,
    country: string,
    description: string,
    is_active: boolean,
    image_url: string,
    image_public_id: string,
    created_at: string,
}

export interface destinationFavourite{
    destination_id: string,
    name: string,
    image_url: string,
    image_public_id: string,
}

export interface destinationCreateTour{
    destination_id: string,
    name: string,
}

export interface destinationByTourID{
    destination_id: string,
    name: string,
    region: string,
    country: string,
}