import DestinationFavourite from "../components/homepage.destinationFavorite";
import ListTour from "../components/homepage.listTour";
import FilterHomePage from "../components/homepage.filterHomePage";
import { cookies } from "next/headers"

export default async function HomePage() {

    const cookieStore = await cookies();
    const isLoggedIn = !!(cookieStore.get('access_token_cookie'));

    return(
        <div className="w-full">
            <div className="relative">
                <div 
                    className="bg-cover bg-center bg-no-repeat h-[400px] w-auto"
                    style={{ backgroundImage: "url('/bgimg.png')"}}
                />
                <div className="absolute left-1/10 right-1/10 bottom-0 z-5">
                    <FilterHomePage/>
                </div>
            </div>
            <div className="bg-blue-100 pt-[70px]">
                <div className="w-4/5 m-auto">
                    <ListTour isLoggedIn={isLoggedIn}/>
                </div>
            </div>
            {/* <div className="w-4/5 m-auto">
                <DestinationFavourite/>
            </div> */}
        </div>
    )
}