//A BOUNTY FILTER EQUATES TO A USER'S SAVED SEARCH PARAMETERS. THESE ARE EMPLOYED AS A COMPONENT ON BOUNTYPAGE.JSX. 0 OR MANY BOUNTY FILTERS MAY EXIST ON THE BOUNTY PAGE.
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
    const [isLoadingFilters, setIsLoadingFilters] = useState(true) // LOADING STATE FOR FILTERS
    const [loadingFilters, setLoadingFilters] = useState({}) // LOADING STATE FOR INDIVIDUAL FILTERS

    //THE FUNCTION FETCHES ALL FILTERS FOR THE USER
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

    //FETCHES CARS FOR THE SPECIFIC FILTER. ADDS A FILTER ID: FILTER OBJECT KEY VALUE PAIR TO FILTERRESULTS
    const getCars = async (filter) => {
        //UPDATES THE LOADINGFILTERS STATE FOR A SPECIFIC FILTER TO TRUE
        //FETCHES CARS FROM AUTO.DEV API
        setLoadingFilters(prev => ({ ...prev, [filter.id]: true }))
        try {
            const response = await api.get('autodev/search', {
                params: {
                    make: filter.make,
                    model: filter.model,
                    year_min: filter.year_min,
                    price_max: filter.price_max,
                }
            })
            setFilterResults(prevResults => ({
                ...prevResults,
                [filter.id]: response.data.records.slice(0, 4)
            }))
        } catch (error) {
            console.error('Error fetching car data:', error)
        } finally {
            //UPDATES THE LOADINGFILTERS STATE FOR A SPECIFIC FILTER TO FALSE
            setLoadingFilters(prev => ({ ...prev, [filter.id]: false }))
        }
    }

    //FETCHES FILTERS ON COMPONENT MOUNT
    useEffect(() => {
        getFilters()
    }, [])

    //FETCH CARS FOR EACH FILTER WHEN FILTERS CHANGE
    useEffect(() => {
        filters.forEach(filter => {
            //ONLY CALL GETCARS FOR FILTERS WE DONT HAVE DATA FOR 
            if (!filterResults[filter.id] && !loadingFilters[filter.id]) {
                getCars(filter)
            }
        })
    }, [filters, filterResults, loadingFilters])

    //UPDATES A SPECIFIC FILTER ON BACKEND AND TRACKS THE CHANGE IN STATE
    const updateFilter = async (filterId, method) => {
        const filter = filters.find(f => f.id === filterId)
        let newPriceMax = filter.price_max
        if (method === 'add') {
            newPriceMax += 5000
        } else if (method === 'subtract' && newPriceMax - 5000 >= 0) {
            newPriceMax -= 5000
        }
            
        try {
            const response = await api.put(`users/bounty/bounty-filters/${filterId}/`, {
                price_max: newPriceMax
            })
            //UPDATES LOCAL STATE WITH RESPONSE DATA FROM SERVER
            setFilters(prevFilters => prevFilters.map(f => 
                f.id === filterId ? response.data : f
            ))
            //REFETCH CARS FOR THE UPDATED FILTER
            getCars(response.data)
        } catch (error) {
            console.error('Unable to update price', error)
        }
    }

    //DELETES A SPECIFIC FILTER ON BACKEND AND TRACKS THE CHANGE IN STATE TO AVOID ANOTHER API CALL
    const deleteFilter = async (filterId) => {
        try {
            await api.delete(`users/bounty/bounty-filters/${filterId}/`)
            setFilters(prevFilters => prevFilters.filter(filter => filter.id !== filterId))
            setFilterResults(prevResults => {
                const newResults = { ...prevResults }
                delete newResults[filterId]
                return newResults
            })
            setLoadingFilters(prev => {
                const newLoadingFilters = { ...prev }
                delete newLoadingFilters[filterId]
                return newLoadingFilters
            })
        } catch (error) {
            console.error('Error deleting filter:', error)
        }
    }

    //HANDLES FORM SUBMISSION FOR A NEW FILTER
    const handleSubmit = (e) => {
        e.preventDefault()
        newFilter()
    }

    //HANDLES FILTER DELETION
    const handleDelete = (filterId) => {
        deleteFilter(filterId)
    }

    //CREATES A NEW FILTER WHICH WILL BE STORED IN POSTGRES DB FOR THE USER
    const newFilter = async () => {
        try {
            const response = await api.post('users/bounty/bounty-filters/', {
                make,
                model,
                year_min,
                price_max,
            })
            const newFilter = response.data
            setFilters(prevFilters => [...prevFilters, newFilter])
            getCars(newFilter)
            setMake('')
            setModel('')
            setMinYear('')
            setPriceMax('')
        } catch (error) {
            console.error('Error creating new bounty:', error)
        }
    }

    //HANDLES INPUT CHANGES TO THE FILTER/BOUNTY FORM
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
            
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                {/*CONDITIONALLY RENDERS LOADING STATE OR A MAPPING OF EACH FILTER'S TITLE/PARAMS*/}
                {isLoadingFilters ? (
                    <p className="text-center">Loading filters...</p>
                ) : (
                    filters.map((filter) => (
                        <div key={filter.id} className="mb-8">
                            <h2 className="text-xl font-bold mb-4">
                                {filter.make} {filter.model} (Year: {filter.year_min}+, Max Price: ${filter.price_max}) 
                                <button 
                                    onClick={() => handleDelete(filter.id)}
                                    className="inline-block rounded-md bg-red-600/80 px-3 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-red-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 ml-2"
                                >
                                    Delete
                                </button>
                                <button 
                                    onClick={() => updateFilter(filter.id, 'add')}
                                    className="inline-block rounded-md bg-blue-600/80 px-3 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 ml-2"
                                >
                                    + Max
                                </button>
                                <button 
                                    onClick={() => updateFilter(filter.id, 'subtract')}
                                    className="inline-block rounded-md bg-blue-600/80 px-3 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 ml-2"
                                >
                                    - Max
                                </button>
                            </h2>
                            {/*CONDITIONALLY RENDERS LOADING STATE OR A MAPPING OF EACH FILTER'S RESULTS OR IF NO RESULTS, A "NO CARS FOUND" MESSAGE IS RENDERED*/}
                            {loadingFilters[filter.id] ? (
                                <p>Loading cars...</p>
                            ) : filterResults[filter.id] ? (
                                <ul role="list" className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 sm:gap-x-6 lg:grid-cols-4 xl:gap-x-8">
                                    {filterResults[filter.id].map((car) => (
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
                            ) : (
                                <p>No cars found.</p>
                            )}
                        </div>
                    ))
                )}
            </div>
        </>
    )
}