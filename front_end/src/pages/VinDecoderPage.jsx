//THE VIN DECODER PAGE EXISTS TO VERIFY DETAILS CONTAINED WITHIN A CAR LISTING. 
//THIS PARTICULAR DECODER IS POWERED BY THE NATIONAL HIGHWAY TRAFFIC SAFETY ADMINISTRATION (NHTSA)
import React, { useState } from 'react'
import axios from 'axios'

function VinDecoderPage() {
  const [VIN, setVIN] = useState('')
  const [carDetails, setCarDetails] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  //HANDLES FORM SUBMISSION, PREVENTS DEFAULT PAGE REFRESH. SETS LOADING STATE TO TRUE WHILE RESETTING ERROR STATE TO NULL. THE METHOD CALLS THE NHTSA VIN DECODER API VIA GET METHOD AND RETURNS CAR DETAILS & SETS CAR DETAILS STATE. 
  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    try {
      const response = await axios.get(`https://vpic.nhtsa.dot.gov/api/vehicles/DecodeVin/${VIN}?format=json`)
      setCarDetails(response.data)
    } catch (err) {
      setError('Failed to fetch car details. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  //DYNAMICALLY UPDATES VIN VALUE FROM THE FORM SEARCH FIELD. 
  const handleChange = (e) => {
    setVIN(e.target.value)
  }

  //FORMATTING OF NHTSA RESPONSE. 
  const renderCarDetails = () => {
    if (!carDetails) return null

    //THIS IS STILL WITHIN RENDERCARDETIALS(). FILTERS OUT NULL AND EMPTY VALUES AND REMOVES RESULTS PERTAINING TO BUSSES AND MOTORCYCLES. 
    const filteredResults = carDetails.Results.filter(item => 
      item.Value !== null && 
      item.Value !== "" && 
      !item.Variable.toLowerCase().includes('error') &&
      !item.Variable.toLowerCase().includes('bus') &&
      !item.Variable.toLowerCase().includes('motorcycle')
    )

/*STILL WITHIN RENDERCARDETIALS().  THE BELOW GROUPS FILTERED RESULTS BY THE FIRST WORD OF EACH ITEM'S 'VARIABLE' PROPERTY--THE NHTSA RESPONSE DATA IS VERY CONVOLUTED AND REQUIRES REFORMATTING.
 FOR EACH ITEM IN FILTEREDRESULTS:
   A. SPLIT THE ITEM'S 'VARIABLE' STRING BY SPACES AND TAKE THE FIRST WORD AS THE GROUP TYPE.
   B. IF THIS GROUP TYPE DOESN'T EXIST IN THE ACCUMULATOR: A NEW ARRAY IS INSTANTIATED FOR THE GROUP TYPE. 
   C. PUSH THE CURRENT ITEM INTO THE ARRAY FOR ITS GROUP TYPE. 
   D. RETURN THE UPDATED ACCUMULATOR FOR THE NEXT ITERATION

THE FINAL RETURN IS AN OBJECT WHERE:
- KEYS ARE THE FIRST WORDS OF THE 'VARIABLE' PROPERTIES (SUCH AS "ENGINE", OR "TRANSMISSION")
- VALUES ARE ARRAYS OF ITEMS THAT BELONG TO EACH GROUP*/

    const groupedData = filteredResults.reduce((acc, item) => {
      const group = item.Variable.split(' ')[0]
      if (!acc[group]) {
        acc[group] = []
      }
      acc[group].push(item)
      return acc
    }, {})

    //THIS IS THE RETURN STATEMENT FOR RENDERCARDETAILS.
    return (
      <div className="container mx-auto px-4 py-8">
           {/*OBJECT.ENTRIES RETURNS ARRAY OF KEY/VALUE PAIRS FROM GROUPED DATA. THE FIRST .MAP IS APPLIED TO GROUP TYPES, THE SECOND .MAP IS APPLIED TO ITEMS WITH EACH GROUP TYPE*/}
        <h2 className="text-3xl font-bold mb-6">Vehicle Information</h2>
        {Object.entries(groupedData).map(([group, items]) => (
          <div key={group} className="mb-6">
            <h3 className="text-2xl font-semibold mb-3">{group}</h3>
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              <div className="border-t border-gray-200">
                <dl>
                  {items.map((item, index) => (
                    <div key={index} className={`${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'} px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6`}>
                      <dt className="text-sm font-medium text-gray-500">{item.Variable}</dt>
                      <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{item.Value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  //THIS IS THE RETURN STATEMENT FOR THE ENTIRE VIN DECODER PAGE.
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      {/*THIS FORM TAKES THE USERS VIN, UTILIZING HANDLECHANGE ON SUBMIT. IT USES THE LOADING STATE TO DISABLE THE BUTTON AND CONDITIONALLY RENDER A LOADING STATUS ('SEARCHING') TO THE BUTTON ELEMENT*/}
      <h1 className="text-2xl pt-6 pb-8 font-bold text-center text-blue-600 sm:text-3xl">
        VIN Decoder
      </h1>
      <form onSubmit={handleSubmit} className="mb-8 flex justify-center">
        <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4 max-w-4xl w-full">
          <input
            type="text"
            onChange={handleChange}
            value={VIN}
            name="vin"
            placeholder="Enter VIN (17 characters)"
            className="px-3 py-2 border rounded-md flex-grow"
          />
          <button
            type="submit"
            className="inline-flex items-center justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 w-full sm:w-auto"
            disabled={isLoading}
          >
            {isLoading ? 'Searching...' : 'Decode VIN'}
          </button>
        </div>
      </form>

    {/*CONDITIONALLY RENDERS ERROR MESSAGE AND/OR LOADING STATUS VIA SHORT CIRCUIT EVALUATION*/}
      {error && (
        <div className="text-red-600 text-center mb-4">{error}</div>
      )}

      {isLoading && (
        <div className="text-center mb-4">Loading...</div>
      )}

      {/*THIS IS THE FUNCTION CALL TO THE FORMATTING FUNCTION*/}
      {renderCarDetails()}
    </div>
  )
}

export default VinDecoderPage