//THE GARAGE CAR COMPONENT IS USED WITHIN THE GARAGE.JSX PAGE WHERE IT IS MAPPED TO USER GARAGE CAR INSTANCES AND RENDERED TO SCREEN.
import React, { useState } from 'react'
import { api } from '../utilities.jsx'

//CARS AND GET CARS ARE PASSED AS PROPS FROM GARAGE.JSX. CAR IS AN INSTANCE OF A USER'S GARAGEDCAR. GET CARS IS A FUNCTION THAT QUERIES THE DJANGO GARAGE VIEW AND RETURNS AN ARRAY OF A USERS GARAGEDCARS.
const CarCard = ({ car, getCars }) => {
  const [error, setError] = useState(null)
  const [service, setService] = useState('')
 
  //DYNAMICALLY SETS THE SERVICE STATE GIVEN FIELD INPUT
  const handleService = (e) => {
    setService(e.target.value)
  }

  //UTILIZES THE GARAGE VIEW PUT METHOD TO UPDATE A GARAGED CAR'S SERVICE STATUS. 
  //THE BACKEND MODEL EXISTS WITH A ONE TO ONE RELATIONSHIP BETWEEN SERVICE (A TEXT FIELD) AND GARAGED CAR. THIS CAUSES THE FIELD INPUT TO OVERWRITE THE VALUE SAVED TO THE POSTGRES DB RATHER THAN APPENDING A SERVICE RECORD.
  //THIS BEHAVIOR WILL BE ADDRESS IN A FUTURE ITERATION--UTILIZING A MANY TO ONE RELATIONSHIP BETWEEN SERVICES AND GARAGECARS
  const handleUpdate = async () => {
    try {
      const response = await api.put(`users/garage/cars/${car.id}/`, 
        {"services" : `${service}`}
      );
      console.log('Car updated:', response.data)
      await getCars() //CALL IS MADE TO REFRESH THE GARAGED CARS DISPLAYED TO SCREEN
      setError(null) // RESETS THE ERROR STATUS IF THE LIST OF GARAGEDCARS IS RETURNED
    } catch (err) {
      console.error('Failed to update car', err)
      setError('Failed to update car. Please try again.')
    } 
  }

  
  //EVENT HANDLER FOR EACH GARAGED CAR RENDERED TO SCREEN. A DELETE REQUEST IS SENT TO THE DJANGO GARAGEVIEW--IF THE USER IS AUTHENTICATED, THE INSTANCE IS DELETED. 
  const handleDelete = async () => {
    try {
      await api.delete(`users/garage/cars/${car.id}/`)
      await getCars() // CALL IS MADE TO REFRESH THE GARAGED CARS DISPLAYED TO SCREEN
      setError(null) // // RESETS THE ERROR STATUS IF THE LIST OF GARAGEDCARS IS RETURNED
    } catch (err) {
      console.error('Failed to delete car', err)
      setError('Failed to delete car. Please try again.')
    } 
  }

  return (
    <div className="overflow-hidden rounded-lg bg-white shadow mb-4">
      {/*USES THE CAR PROP FROM GARAGE AND MAPS CAR DETAILS TO A CARD*/}
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-lg font-medium leading-6 text-gray-900">{car.year} {car.make} {car.model}</h3>
        <div className="mt-2 mb-2 max-w-xl text-sm text-gray-500">
          <p>VIN: {car.VIN}</p>
          <p>Service Due:  {car.services}</p>
        </div>
        <input className="px-3 py-2 mb-2 border rounded-md" onChange={handleService} type="text" />
        <button onClick={handleUpdate} className="inline-block rounded-md bg-green-600/80 px-3 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 mr-2">Add Service Notes</button>
        <button onClick={handleDelete} className="inline-block rounded-md bg-red-600/80 px-3 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Delete</button>
        {/*IF ERROR STATE IS TRUE, THE ERROR IS RENDERED*/}
        {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
      </div>
    </div>
  )
}

export default CarCard