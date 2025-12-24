import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET() {
    const cookieStore = await cookies();
    const isLoggedIn = !!(
        cookieStore.get('access_token') || 
        cookieStore.get('token') || 
        cookieStore.get('access_token_cookie')
    );
    
    return NextResponse.json({ isLoggedIn });
}