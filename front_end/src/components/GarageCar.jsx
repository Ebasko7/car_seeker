//A GARAGE CAR IS MODEL THAT EXISTS IN THE DJANGO BACK END. THERE MAY BE NONE OR MANY GARAGED CARS RENDERED TO THE USERS GARAGE.
import React, { useState } from 'react'
import { api } from '../utilities.jsx'

//PROPS PASSED IN: CAR--THE INSTANCE OF A CAR IN THE GARAGE. ONDELETE--USED TO UPDATE GARAGECARS STATE BY FILTERING THE DELETED CAR FROM THE ARRAY.
const GarageCard = ({ car, onDelete }) => {
  const [error, setError] = useState(null)
  const [service, setService] = useState('')
  // STATE TO HOLD THE CAR DATA, INITIALIZED WITH THE CAR PROP
  const [carData, setCarData] = useState(car)

  //HANDLES INPUT TO SERVICE NOTES AND SETS SERVICE STATE
  const handleService = (e) => {
    setService(e.target.value)
  }

  //SENDS A PUT REQUEST TO DJANGO BACKEND TO UPDATE THE SERVICE FIELD OF THE CAR INSTANCE.
  const handleUpdate = async () => {
    try {
      const response = await api.put(`users/garage/cars/${carData.id}/`, {
        "services": service
      })
      // UPDATE CAR DATA STATE WITH NEW SERVICE INFORMATION
      setCarData(prevData => ({ ...prevData, services: service }))
      // RESETS THE SERVICE INPUT FIELD
      setService('')
      // RESETS ERROR STATE TO NULL
      setError(null)
    } catch (err) {
      console.error('Failed to update car', err)
      setError('Failed to update car. Please try again.')
    }
  }

  // HANDLES THE DELETION OF A CAR
  const handleDelete = async () => {
    try {
      // SEND DELETE REQUEST TO REMOVE CAR FROM DATABASE
      await api.delete(`users/garage/cars/${carData.id}/`)
      // CALL ONDELETE PROP TO UPDATE GARAGE'S CAR STATE
      onDelete(carData.id)
      // RESET ERROR STATE TO NULL
      setError(null)
    } catch (err) {
      console.error('Failed to delete car', err)
      setError('Failed to delete car. Please try again.')
    }
  }

  // RENDER THE GARAGECARD COMPONENT
  return (
    <div className="overflow-hidden rounded-lg bg-white shadow mb-4">
      <div className="px-4 py-5 sm:p-6">
        {/* DISPLAY CAR DETAILS */}
        <h3 className="text-lg font-medium leading-6 text-gray-900">{carData.year} {carData.make} {carData.model}</h3>
        <div className="mt-2 mb-2 max-w-xl text-sm text-gray-500">
          <p>VIN: {carData.VIN}</p>
          <p>Service Due: {carData.services}</p>
        </div>
        {/* INPUT FIELD FOR NEW SERVICE NOTES */}
        <input 
          className="px-3 py-2 mb-2 border rounded-md" 
          onChange={handleService} 
          value={service}
          type="text" 
        />
        {/* BUTTON TO ADD SERVICE NOTES */}
        <button 
          onClick={handleUpdate} 
          className="inline-block rounded-md bg-green-600/80 px-3 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 mr-2"
        >
          Add Service Notes
        </button>
        {/* BUTTON TO DELETE THE CAR */}
        <button 
          onClick={handleDelete} 
          className="inline-block rounded-md bg-red-600/80 px-3 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          Delete
        </button>
        {/* DISPLAY ERROR MESSAGE IF THERE IS ONE */}
        {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
      </div>
    </div>
  )
}

export default GarageCard