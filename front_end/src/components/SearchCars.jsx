import { useState } from "react"
import { api } from '../utilities.jsx';

export default function AutoCard() {
    const [cars, setCars] = useState([]);
    const [page, setPage] = useState(1)
    const [make, setMake] = useState('')
    const [model, setModel] = useState('')
    const [year_min, setMinYear] = useState('')
    const [price_max, setPriceMax] = useState('')
    const [isLoading, setIsLoading] = useState(false)
  
    const getCars = async () => {
        setIsLoading(true);
        try {
            const response = await api.get('autodev/search', {
                params: {
                    make,
                    model,
                    year_min,
                    price_max,
                    page
                }
            });
            setCars(response.data.records);
            console.log(response.data.records);
        } catch (error) {
            console.error('Error fetching car data:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setPage(1);
        getCars();
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        switch(name) {
            case 'make':
                setMake(value);
                break;
            case 'model':
                setModel(value);
                break;
            case 'year_min':
                setMinYear(value);
                break;
            case 'price_max':
                setPriceMax(value);
                break;
        }
    };

    const handleNextPage = () => {
        setPage(prevPage => prevPage + 1);
        getCars();
    };

    const handlePreviousPage = () => {
        setPage(prevPage => Math.max(1, prevPage - 1));
        getCars();
    };

    return (
        <>
            <h1 className="text-2xl pt-6 pb-8 font-bold text-center text-blue-600 sm:text-3xl">Search Cars</h1>
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
                        className="inline-flex items-center justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 w-full sm:w-auto"
                        disabled={isLoading}
                    >
                        {isLoading ? 'Searching...' : 'Search'}
                    </button>
                </div>
            </form>

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