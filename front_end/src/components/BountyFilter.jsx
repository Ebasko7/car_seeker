//A BOUNTY FILTER EQUATES TO A USER'S SAVED SEARCH PARAMETERS. THESE ARE EMPLOYED AS A COMPONENT ON BOUNTYPAGE.JSX. 0 OR MANY BOUNTY FILTERS EXIST ON THE BOUNTY PAGE.

import { useState, useEffect } from "react"

//CALLS TO THIS API--AN AXIOS INSTANCE--ARE DIRECTED TO DJANGO BACKEND.
import { api } from '../utilities.jsx'

export default function BountyFilter() {
    const [filters, setFilters] = useState([])
    const [filterResults, setFilterResults] = useState({})
    const [make, setMake] = useState('')
    const [model, setModel] = useState('')
    const [year_min, setMinYear] = useState('')
    const [price_max, setPriceMax] = useState('')
    const [isLoadingFilters, setIsLoadingFilters] = useState(true)
    const [isLoadingCars, setIsLoadingCars] = useState(false)

    //FETCHES USER FILTERS (I.E SAVED SEARCH PARAMETERS) FROM DJANGO BOUNTYFILTER VIEW AND SAVES THEM AS AN ARRAY IN FILTERS STATE. 'LOADING FILTERS' CONDITIONALLY RENDERED PENDING THE RESPONSE. 
    const getFilters = async () => {
        setIsLoadingFilters(true)
        try {
            const response = await api.get('users/bounty/bounty-filters/')
            setFilters(response.data)
        } catch (error) {
            console.error('Could not fetch bounties', error)
        } finally {
            setIsLoadingFilters(false)
        }
    }

    //QUERIES THE AUTODEV API FOR LISTINGS MATCHING EACH SEARCH FILTER. THE CALL TO AUTO DEV IS HANDLED IN THE DJANGO FILTERS VIEW. THIS FUNCTION CHANGES LOADING CARS STATE TO CONDITIONALLY RENDER STATUS TO SCREEN.
    const getCars = async () => {
        setIsLoadingCars(true)
        try {
            const results = {}
            //FOR EACH FILTER IN FILTERS ARRAY, QUERY AUTODEV API. PARAMS ARE SENT VIA HTTP BODY IN A "GET" REQUEST.
            for (let filter of filters) {
                const response = await api.get('autodev/search', {
                    params: {
                        make: filter.make,
                        model: filter.model,
                        year_min: filter.year_min,
                        price_max: filter.price_max,
                    }
                })
            //EACH FILTER ID IS INSTANTIATED AS A KEY IN RESULTS OBJECT. THE VALUE IS THE FIRST 4 CARS RETURNED WHICH MATCH THE FILTER PARAMETERS.
                results[filter.id] = response.data.records.slice(0, 4)
            }
            //AFTER THE LOOP THROUGH EACH FILTER, THE RESULTS OBJECT IS NOW SET AS THE FILTERED RESULTS.
            setFilterResults(results)
        } catch (error) {
            console.error('Error fetching car data:', error)
        } finally {
            setIsLoadingCars(false)
        }
    }
//ON PAGE LOAD THIS CALLS THE GET FILTERS FUNCTION
    useEffect(() => {
        getFilters()
    }, [])
//IF GET FILTERS RETURNS AT LEAST ONE FILTER, THE GET CARS FUNCTION IS CALLED TO FETCH CARS FROM AUTODEV API. IF A NEW FILTER IS ADDED (OR DELETED) GETCARS IS CALLED AGAIN. 
//THE CALL TO GETCARS UPON DELETION OF A FILTER IS UNDESIRED BEHAVIOR AS IT RELOADS ALL THE PERSISTING FILTERS. A FUTURE ITERATION OF CODE WILL CORRECT THIS.
    useEffect(() => {
        if (filters.length > 0) {
            getCars()
        }
    }, [filters])

//SENDS A DELETE REQUEST TO FILTER VIEW IN DJANGO THEN CALLS GETFILTERS TO RENDER REMAINING FILTERS. THIS HAS THE SAME UNDESIRABLE EFFECT OF MAKING A NEW API CALL TO EACH FILTER DESCRIBED ABOVE.
    const deleteFilter = async (filterId) => {
        try {
            await api.delete(`users/bounty/bounty-filters/${filterId}`)
            getFilters() 
        } catch (error) {
            console.error('Error deleting filter:', error)
        }
    }
//HANDLES 'ADD BOUNTY'(I.E. A NEW FILTER) BUTTON CLICK EVENT
    const handleSubmit = (e) => {
        e.preventDefault()
        newFilter()
    }
//HANDLES 'DELETE'(I.E. REMOVE FILTER) BUTTON CLICK EVENT
    const handleDelete = (filterId) => {
        deleteFilter(filterId)
    }
//SENDS A POST REQUEST TO DJANGO FILTER VIEW TO CREATE A NEW FILTER INSTANCE FOR THE USER
    const newFilter = async () => {
        try {
            await api.post('users/bounty/bounty-filters/', {
                make,
                model,
                year_min,
                price_max,
            })
            getFilters() //NEW CALL MADE TO GET FILTERS SO THE NEW FILTER CAN BE RENDERED TO SCREEN
            // EACH FORM FIELD IS RESET
            setMake('')
            setModel('')
            setMinYear('')
            setPriceMax('')
        } catch (error) {
            console.error('Error creating new bounty:', error)
        }
    }

//THIS SWITCH STATEMENT REDUCED 4 FUNCTIONS INTO ONE. IT DYNAMICALLY UPDATES THE STATE FOR EACH OF THE FORM FIELDS ON THE PAGE.
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

    return (
        <>
            <h1 className="text-2xl pt-6 pb-8 font-bold text-center text-blue-600 sm:text-3xl">Bounty List</h1>
            {/*THIS IS A FORM TO SUBMIT A NEW BOUNTY/SEARCH FILTER*/}
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
                    <button
                        type="submit"
                        className="inline-flex items-center justify-center rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 w-full sm:w-auto"
                    >
                        Add Bounty
                    </button>
                </div>
            </form>
            {/*CONDITIONALLY RENDERS LOADING STATE TO SCREEN OR MAPS EACH FILTER CRITERIA TO SCREEN WITH A DELETE BUTTON */}

            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                {isLoadingFilters ? (
                    <p className="text-center">Loading filters...</p>
                ) : (
                    filters.map((filter) => (
                        <div key={filter.id} className="mb-8">
                            <h2 className="text-xl font-bold mb-4">
                                {filter.make} {filter.model} (Year: {filter.year_min}+, Max Price: ${filter.price_max}) 
                                <button 
                                    onClick={() => handleDelete(filter.id)}
                                    className="inline-block rounded-md bg-red-600/80 px-3 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 ml-2"
                                >
                                    Delete
                                </button>
                            </h2>
            {/*CONDITIONALLY RENDERS LOADING STATE OR THE 4 CARS FROM THE FILTERED AUTO DEV API RESULTS. MOST, BUT NOT ALL RESULTS RETURN WITH A "CLICK OFF URL", ERROR HANDLING FOR NULL URLS IS REQUIRED*/}
            {/*CURRENTLY, AT LEAST 3 OTHER COMPONENTS (SEARCH CARS, GARAGECARS, AND FEATUREDCARS) IMPLEMENT VERY SIMILAR CAR CARDS MAPPED IN SIMILAR FASHION. THIS HIGHLIGHTS THE NEED FOR A STANDARD CAR COMPONENT--FUTURE ENHANCEMENT*/}
                            {isLoadingCars ? (
                                <p>Loading cars...</p>
                            ) : (
                                <ul role="list" className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 sm:gap-x-6 lg:grid-cols-4 xl:gap-x-8">
                                    {filterResults[filter.id]?.map((car) => (
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
                    ))
                )}
            </div>
        </>
    )
}