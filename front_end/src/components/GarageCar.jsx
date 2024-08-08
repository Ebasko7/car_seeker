import react from 'react'
import { api } from '../utilities.jsx';



const updateCar = async () => {
    try {
      const response = await api.put('users/garage/');
      console.log(response.data);
      setGarageCars(response.data.cars || []);
    } catch (err) {
      console.error('No cars found', err);
      setError('Failed to fetch cars');
    } finally {
      setLoading(false);
    }
  };

  const deleteCar = async () => {
    try {
      const response = await api.delete('users/garage/');
      console.log(response.data);
      setGarageCars(response.data.cars || []);
    } catch (err) {
      console.error('No cars found', err);
      setError('Failed to fetch cars');
    } finally {
      setLoading(false);
    }
  };  
  

  


 const CarCard = ({ car }) => (
    <div className="overflow-hidden rounded-lg bg-white shadow mb-4">
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-lg font-medium leading-6 text-gray-900">{car.year} {car.make} {car.model} </h3>
        <div className="mt-2 max-w-xl text-sm text-gray-500">
          <p>VIN: {car.VIN}</p>
          <p>Service History: {car.services} </p>
        </div>
        <button className="inline-block rounded-md bg-green-600/80 px-3 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Edit</button>
        <button className="inline-block rounded-md bg-red-600/80 px-3 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Delete</button>
      </div>
    </div>
  );

  export default CarCard

