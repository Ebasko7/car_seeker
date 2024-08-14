//THE SEARCH CARS COMPONENT IS UTILIZED IN MARKETPLACE.JSX. EVENTUALLY IT WILL BE UTILIZED IN BOUNTYLIST.JSX--WHERE THERE IS DUPLICATION OF SEVERAL SEARCH CARS FUNCTIONS.

import { useState } from "react"

//CALLS TO THIS API--AN AXIOS INSTANCE--ARE DIRECTED TO DJANGO BACKEND.
import { api } from '../utilities.jsx'

export default function AutoCard() {
    const [cars, setCars] = useState([])
    const [page, setPage] = useState(1)
    const [make, setMake] = useState('')
    const [model, setModel] = useState('')
    const [year_min, setMinYear] = useState('')
    const [price_max, setPriceMax] = useState('')
    const [isLoading, setIsLoading] = useState(false)
  
//MAKES A REQUEST TO DJANGO BACKEND WHICH SENDS A GET REQUEST TO AUTO.DEV API UTILIZING AN API KEY. THE PARAMS ARE SENT IN THE HTTP BODY AND AUTO.DEV RETURNS RESULTS MATCHING THE QUERY. RESULTS ARE SET TO AN ARRAY OF CARS.
//LOADING STATE IS SET TO CONDITIONALLY RENDER TO SCREEN
    const getCars = async () => {
        setIsLoading(true)
        try {
            const response = await api.get('autodev/search', {
                params: {
                    make,
                    model,
                    year_min,
                    price_max,
                    page
                }
            })
            setCars(response.data.records)
            console.log(response.data.records)
        } catch (error) {
            console.error('Error fetching car data:', error)
        } finally {
            setIsLoading(false)
        }
    }

    //HANDLES THE CLICK EVENT WHEN "SEARCH" IS CLICKED. PREVENTS DEFAULT PAGE SUBMIT, RESETS THE PAGE STATE TO 1 TO RETURN FIRST PAGE OF API RESULTS WHEN GETCARS() IS CALLED.
    const handleSubmit = (e) => {
        e.preventDefault()
        setPage(1)
        getCars()
    }

    //SWITCH STATEMENT TO HANDLE INPUT CHANGE ACROSS ANY OF THE FORM FIELDS IN THE SEARCH FORM. EACH FIELD TRACKED VIA USESTATE
    const handleInputChange = (e) => {
        const { name, value } = e.target
        switch(name) {
            case 'make':
                setMake(value)
                break
            case 'model':
                setModel(value)
                break
            case 'year_min':
                setMinYear(value)
                break
            case 'price_max':
                setPriceMax(value)
                break
        }
    }
    //HANDLES NEXT PAGE BUTTON CLICK. INCREMENTS THE PAGE STATE BY ONE AND CALLS GETCARS() WHICH CALLS THE AUTO.DEV API REQUESTING THE NEXT PAGE OF CARS.
    const handleNextPage = () => {
        setPage(prevPage => prevPage + 1)
        getCars()
    }
    //THIS DOES THE OPPOSITE OF HANDLE NEXT PAGE. DECREMENTS THE PAGE COUNT BY 1, WITH A FLOOR OF 1 AS LOWEST PAGE COUNT.
    const handlePreviousPage = () => {
        setPage(prevPage => Math.max(1, prevPage - 1))
        getCars()
    }

    return (
        <>
            <h1 className="text-2xl pt-6 pb-8 font-bold text-center text-blue-600 sm:text-3xl">Search Cars</h1>
             {/*THIS IS A FORM TO SUBMIT A SEARCH QUERY TO THE AUTO.DEV API*/}
            <form onSubmit={handleSubmit} className="mb-8 flex justify-center">
                <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4 max-w-4xl w-full">
                    <input
                        type="text"
                        name="make"
                        value={make}
                        onChange={handleInputChange}
                        placeholder="Make"
                        className="px-3 py-2 border rounded-md flex-grow"
                    />
                    <input
                        type="text"
                        name="model"
                        value={model}
                        onChange={handleInputChange}
                        placeholder="Model"
                        className="px-3 py-2 border rounded-md flex-grow"
                    />
                    <input
                        type="number"
                        name="year_min"
                        value={year_min}
                        onChange={handleInputChange}
                        placeholder="Minimum Year"
                        className="px-3 py-2 border rounded-md flex-grow"
                    />
                    <input
                        type="number"
                        name="price_max"
                        value={price_max}
                        onChange={handleInputChange}
                        placeholder="Max Price"
                        className="px-3 py-2 border rounded-md flex-grow"
                    />
                     {/*IF LOADING STATE IS TRUE, THE SEARCH BUTTON IS DISABLED AND THE BUTTON DISPLAYS "SEARCHING..." VICE "SEARCH" WHEN LOADING IS FALSE*/}
                    <button
                        type="submit"
                        className="inline-flex items-center justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 w-full sm:w-auto"
                        disabled={isLoading}
                    >
                        {isLoading ? 'Searching...' : 'Search'}
                    </button>
                </div>
            </form>
            {/*USES LOADING STATE TO CONDITIONALLY RENDER "LOADING" OR A MAPPING OF CARS HELD WITHIN THE CARS ARRAY*/}
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                {isLoading ? (
                    <p className="text-center">Loading cars...</p>
                ) : (
                    <ul role="list" className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 sm:gap-x-6 lg:grid-cols-4 xl:gap-x-8">
                        {cars.map((car) => (
                            <li key={car.id} className="relative">
                                <div className="group aspect-h-7 aspect-w-10 block w-full overflow-hidden rounded-lg bg-gray-100 focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 focus-within:ring-offset-gray-100">
                                    <img alt="" src={car.primaryPhotoUrl} className="pointer-events-none object-cover group-hover:opacity-75" />
                                    <button type="button" className="absolute inset-0 focus:outline-none">
                                        <span className="sr-only">View details for {car.model}</span>
                                    </button>
                                </div>
                                <p className="pointer-events-none mt-2 block truncate text-sm font-medium text-gray-900">{car.year} {car.make} {car.model} | {car.mileage}</p>
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
            <div className="flex justify-center space-x-4 mt-4">
                {/*THE PREVIOUS PAGE BUTTON IS GRAYED OUT AND NOT CLICKABLE WHEN THE PAGE IS 1 OR IF LOADING STATE IS TRUE*/}
                <button
                    onClick={handlePreviousPage}
                    disabled={page === 1 || isLoading}
                    className={`inline-flex items-center justify-center rounded-md px-3 py-2 text-sm font-semibold text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 w-full sm:w-auto ${
                        page === 1 || isLoading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-500'
                    }`}
                >
                    Previous Page
                </button>
                <button
                    onClick={handleNextPage}
                    disabled={isLoading}
                    className={`inline-flex items-center justify-center rounded-md px-3 py-2 text-sm font-semibold text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 w-full sm:w-auto ${
                        isLoading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-500'
                    }`}
                >
                    Next Page
                </button>
            </div>
        </>
    )
}