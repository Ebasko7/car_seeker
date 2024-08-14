//THE GARAGEPAGE RENDERS ALL OF A USERS "GARAGED CARS" THAT EXIST IN THE DATABASE.

import React, { useState, useEffect } from 'react'
import { PlusIcon } from '@heroicons/react/20/solid'
import { api } from '../utilities.jsx'
import GarageCar from '../components/GarageCar.jsx'


function Garage() {
  const [garageCars, setGarageCars] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [newCar, setNewCar] = useState({ make: '', model: '', year: '' })

  
  //REQUEST TO DJANGO GARAGE VIEW. RETURNS GARAGE ASSOCIATED WITH USER.
  const getCars = async () => {
    try {
      setLoading(true)
      const response = await api.get('users/garage/')
      setGarageCars(response.data.cars || [])
    } catch (err) {
      setError('Failed to fetch cars')
    } finally {
      setLoading(false)
    }
  }

  //FETCHES GARAGED CARS UPON PAGE LOAD.
  useEffect(() => {
    getCars()
  }, [])

  //HANDLES CHANGE FOR EACH FORM FIELD. NAME/VALUE FOR EACH FORM FIELD ARE PASSED TO SETNEWCAR WHICH APPENDS PRIOR INPUTS FOR EACH FIELD. NEWCAR WILL BE PASSED AS A JSON POST REQUEST VIA "ADDCAR" FUNCTION.
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setNewCar(prevState => ({
      ...prevState,
      [name]: value
    }))
  }

  //USES THE NEWCAR STATE AND PASSES TO DJANGO GARAGE VIEW TO ADD CAR VIA POST METHOD. SETERROR WILL BE CALLED IF THE POST FAILS TO PROVIDE USER FEEDBACK.
  const addCar = async (e) => {
    e.preventDefault()
    try {
      await api.post('users/garage/cars/', newCar)
      await getCars() // Refresh the car list after adding a new car
      setNewCar({ make: '', model: '', year: '' }) // Reset form
    } catch (err) {
      console.error('Error adding car:', err)
      setError('Failed to add car')
    }
  }

  //LOADING IS SET TO TRUE VIA GETCARS. UNTIL GETCARS RETURNS, LOADING WILL BE CONDITIONALLY RENDERED TO SCREEN.
  if (loading) return <p className="text-center mt-4">Loading...</p>

  //IF ERROR OCCURS IN ADDCAR FUNCTION, IT WILL BE RENDERED HERE
  if (error) return <p className="text-center mt-4 text-red-500">{error}</p>

  return (
    
    <div className="container mx-auto px-4">
      <h1 className="text-2xl pt-6 pb-8 font-bold text-center text-blue-600 sm:text-3xl">My Garage</h1>
      
     {/*TAILWIND FORM COMPONENT. ADDCAR IS CALLED UPON SUBMIT */}
      <form onSubmit={addCar} className="mb-8 flex justify-center">
        <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
          <input
            type="text"
            name="make"
            value={newCar.make}
            onChange={handleInputChange}
            placeholder="Make"
            className="px-3 py-2 border rounded-md"
            required
          />
          <input
            type="text"
            name="model"
            value={newCar.model}
            onChange={handleInputChange}
            placeholder="Model"
            className="px-3 py-2 border rounded-md"
            required
          />
          <input
            type="number"
            name="year"
            value={newCar.year}
            onChange={handleInputChange}
            placeholder="Year"
            className="px-3 py-2 border rounded-md"
            required
          />
            <input
            type="text"
            name="VIN"
            value={newCar.VIN}
            onChange={handleInputChange}
            placeholder="XXX-XXX-XXX-XXX"
            className="px-3 py-2 border rounded-md"
          />
          <button
            type="submit"
            className="inline-flex items-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
          >
            <PlusIcon className="-ml-0.5 mr-1.5 h-5 w-5" aria-hidden="true" />
            Add Car
          </button>
        </div>
      </form>
      
{/*IF GETCARS RETURNS ATLEAST ONE CAR, IT IS MAPPED TO A GARAGECAR COMPONENT. OTHERWISE AN "EMPTY GARAGE MESSAGE IS RENDERED" */}

      {garageCars.length === 0 ? (
        <div className="mb-8 flex justify-center">
          <p className="mb-4">Your garage is empty. Add a car to get started!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {garageCars.map((car) => (
            <GarageCar key={car.id} car={car} getCars={getCars} />
          ))}
        </div>
      )}
    </div>
    
  )
}

export default Garage;