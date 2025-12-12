import DestinationFavourite from "../components/homepage.destinationFavorite";
import ListTour from "../components/homepage.listTour";
import FilterHomePage from "../components/homepage.filterHomePage";


export default function HomePage() {

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
            <div className="h-[1000px]"></div>
                
            <div>
            

            </div>
            {/* <div className="bg-blue-100">
                <div className="w-4/5 m-auto">
                    <ListTour/>
                </div>
            </div> */}
            {/* <div className="w-4/5 m-auto">
                <DestinationFavourite/>
            </div> */}
        </div>
    )
}