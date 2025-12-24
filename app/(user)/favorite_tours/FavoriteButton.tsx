'use  client'

import { Heart } from 'lucide-react'; 
import { useState } from 'react';

interface Props{
    tourId: string;
    initialIsFavorite?: boolean;
}

const API_URL = process.env.NEXT_PUBLIC_URL_API;

export const FavoriteButton = ({ tourId, initialIsFavorite = false }: Props) => {
    const [isFavorite, setIsFavorite] = useState(initialIsFavorite);
    const [loading, setLoading] = useState(false);

    const toggleFavorite = async (e: React.MouseEvent) => {
        e.stopPropagation();
        if (loading) return;

        setLoading(true);

        try {
            const url = isFavorite
                ? `${API_URL}/favorites/delete`
                : `${API_URL}/favorites/add`;

            const res = await fetch(url, {
                method: isFavorite ? 'DELETE' : 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({ tour_id: tourId }),
            });

            if (!res.ok) {
                throw new Error('Favorite failed');
            }

            setIsFavorite(!isFavorite);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <button
            onClick={toggleFavorite}
            className="p-2 bg-white/80 hover:bg-white rounded-full transition-all shadow-md cursor-pointer"
        >
            <Heart
                size={20}
                fill={isFavorite ? '#ef4444' : 'none'}
                className={isFavorite ? 'text-red-600' : 'text-gray-600'}
            />
        </button>
    );
}