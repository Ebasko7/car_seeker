//THE SOLE PURPOSE OF MARKETPLACEPAGE.JSX IS TO RENDER SEARCH RESULTS FROM THE SEARCH CARS COMPONENT. SEARCH CARS RECEIVES A USER SEARCH QUERY AND RETURNS 20 RESULTS AT A TIME.
import React from 'react'
import SearchCars from '../components/SearchCars.jsx'

function Marketplace() {
  return (
    <>
    <SearchCars />
    </>
  )
}

export default Marketplace