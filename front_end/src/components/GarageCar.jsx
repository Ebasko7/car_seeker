import react from 'react'

 const CarCard = ({ car }) => (
    <div className="overflow-hidden rounded-lg bg-white shadow mb-4">
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-lg font-medium leading-6 text-gray-900">{car.year} {car.make} {car.model} </h3>
        <div className="mt-2 max-w-xl text-sm text-gray-500">
          <p>VIN: {car.VIN}</p>
          <p>Service History: {car.services} </p>
        </div>
      </div>
    </div>
  );

  export default CarCard

