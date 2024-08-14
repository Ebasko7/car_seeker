//FEATURED CARS IS A COMPONENT UTILIZED WITHIN THE MAINPAGESECTION.JSX. IT IS DESIGNED TO RENDER 20 CARS CATEGORIZED AS "SUPERCARS" TO THE HOMEPAGE.
import { useEffect, useState } from "react"

//CALLS TO THIS API--AN AXIOS INSTANCE--ARE DIRECTED TO DJANGO BACKEND.
import { api } from '../utilities.jsx'

//THE NEXT SECTION OF CODE SHOULD BE MORE DYNAMIC AND PACKAGED INTO A REUSABLE COMPONENT FOR OTHER PARTS OF THE APPLICATION.
//THIS WILL BE FUTURE OPTIMIZATIONS-- MARKETPLACE.JSX, BOUNTYLIST.JSX, AND GARAGE.JSX OFFER SIMILAR BUT DIFFERENT IMPLEMENTATIONS OF AN "AUTOCARD"
export default function AutoCard() {
    const [cars, setCars] = useState([])
    const [isLoading, setIsLoading] = useState(true)

//ON PAGE LOAD, A REQUEST IS MADE TO THE DJANGO BACK END WHICH MAKES A GET REQUEST TO AUTO DEV API AND RETURNS "SUPERCARS"
//THE RESPONSE DATA IS SAVED TO AN ARRAY OF CARS UTILIZING STATE. LOADING STATUS IS ALSO SET TO ALLOW FOR CONDITIONAL STATUS RENDERING TO SCREEN.
    useEffect(() => {
        const getCars = async () => {
            setIsLoading(true)
            try {
                const response = await api.get('autodev/')
                setCars(response.data.records)
                console.log(response.data.records)
            } catch (error) {
                console.error('Error fetching car data:', error)
            } finally {
                setIsLoading(false)
            }
        }
        getCars()
    }, [])

    return (
      <>
      <h1 className="text-2xl pt-6 pb-8 font-bold text-center text-blue-600 sm:text-3xl">Featured Cars</h1>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/*IF LOADING STATE IS TRUE, "LOADING" WILL RENDER. ELSE, 20 SUPERCAR CARDS WILL RENDER*/}
        {isLoading ? (
          <p className="text-center">Loading...</p>
        ) : (
          <ul role="list" className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 sm:gap-x-6 lg:grid-cols-4 xl:gap-x-8">
            {/*EACH CAR IN THE CARS ARRAY IS MAPPED TO A CARD*/}
              {cars.map((car) => (
                  <li key={car.id} className="relative">
                      <div className="group aspect-h-7 aspect-w-10 block w-full overflow-hidden rounded-lg bg-gray-100 focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 focus-within:ring-offset-gray-100">
                          <img alt="" src={car.primaryPhotoUrl} className="pointer-events-none object-cover group-hover:opacity-75" />
                          <button type="button" className="absolute inset-0 focus:outline-none">
                              <span className="sr-only">View details for {car.model}</span>
                          </button>
                      </div>
                      <p className="pointer-events-none mt-2 block truncate text-sm font-medium text-gray-900">{car.year} {car.make} {car.model} | {car.mileage}</p>
                      <p className="pointer-events-none mt-2 block truncate text-sm font-medium text-gray-900">VIN: {car.vin}</p>
                      <p className="pointer-events-none block text-sm font-medium text-gray-500">{car.price}</p>
                      <a href={car.clickoffUrl}
                         target="_blank"
                         rel="noopener noreferrer"
                         className="inline-block rounded-md bg-green-600/80 px-3 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                      >
                          View
                      </a>       
                  </li>
              ))}
          </ul>
        )}
      </div>
      </>
    )
}