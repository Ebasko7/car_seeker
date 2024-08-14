//BOUNTYLISTPAGE.JSX RENDERS ALL OR NONE OF THE BOUNTY FILTERS THAT EXISTS IN THE USER'S LIST OF BOUNTIES (I.E. SAVED SEARCH PARAMETERS)
import React from 'react'
import BountyFilter from '../components/BountyFilter.jsx'

function BountyList() {
  return (
    <BountyFilter />
  )
}

export default BountyList