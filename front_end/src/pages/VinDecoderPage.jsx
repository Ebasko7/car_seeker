import React, { useState } from 'react';
import axios from 'axios';

function VinDecoderPage() {
  const [VIN, setVIN] = useState('');
  const [carDetails, setCarDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.get(`https://vpic.nhtsa.dot.gov/api/vehicles/DecodeVin/${VIN}?format=json`);
      setCarDetails(response.data);
    } catch (err) {
      setError('Failed to fetch car details. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    setVIN(e.target.value);
  };

  const renderCarDetails = () => {
    if (!carDetails) return null;

    // Filter out entries with null or empty values, and remove 'Error' and 'Bus' fields
    const filteredResults = carDetails.Results.filter(item => 
      item.Value !== null && 
      item.Value !== "" && 
      !item.Variable.toLowerCase().includes('error') &&
      !item.Variable.toLowerCase().includes('bus') &&
      !item.Variable.toLowerCase().includes('motorcycle')
    );

    // Group data by variable
    const groupedData = filteredResults.reduce((acc, item) => {
      const group = item.Variable.split(' ')[0];
      if (!acc[group]) {
        acc[group] = [];
      }
      acc[group].push(item);
      return acc;
    }, {});

    return (
      <div className="container mx-auto px-4 py-8">
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
    );
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
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

      {error && (
        <div className="text-red-600 text-center mb-4">{error}</div>
      )}

      {isLoading && (
        <div className="text-center mb-4">Loading...</div>
      )}

      {renderCarDetails()}
    </div>
  );
}

export default VinDecoderPage;