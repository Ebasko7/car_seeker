import React, { useState } from 'react';
import { api } from '../utilities.jsx';

const CarCard = ({ car, getCars }) => {
  const [error, setError] = useState(null);
  const [service, setService] = useState('')
  
  const handleService = (e) => {
    setService(e.target.value)
  }

  const handleUpdate = async () => {
    try {
      const response = await api.put(`users/garage/cars/${car.id}/`, 
        {"services" : `${service}`}
      );
      console.log('Car updated:', response.data);
      await getCars(); // Refresh the car list after updating
      setError(null);
    } catch (err) {
      console.error('Failed to update car', err);
      setError('Failed to update car. Please try again.');
    } 
  };

  const handleDelete = async () => {
    try {
      await api.delete(`users/garage/cars/${car.id}/`);
      await getCars(); // Refresh the car list after deleting
      setError(null);
    } catch (err) {
      console.error('Failed to delete car', err);
      setError('Failed to delete car. Please try again.');
    } 
  };  

  return (
    <div className="overflow-hidden rounded-lg bg-white shadow mb-4">
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-lg font-medium leading-6 text-gray-900">{car.year} {car.make} {car.model}</h3>
        <div className="mt-2 mb-2 max-w-xl text-sm text-gray-500">
          <p>VIN: {car.VIN}</p>
          <p>Service Due:  {car.services}</p>
        </div>
        <input className="px-3 py-2 mb-2 border rounded-md" onChange={handleService} type="text" />
        <button onClick={handleUpdate} className="inline-block rounded-md bg-green-600/80 px-3 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 mr-2">Add Service Notes</button>
        <button onClick={handleDelete} className="inline-block rounded-md bg-red-600/80 px-3 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Delete</button>
        {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
      </div>
    </div>
  );
};

export default CarCard;