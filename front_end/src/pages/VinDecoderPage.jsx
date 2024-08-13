import React from 'react';


function VinDecoderPage() {
  const handleSubmit = (e) => {
    e.preventDefault();
    
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      <h1 className="text-2xl pt-6 pb-8 font-bold text-center text-blue-600 sm:text-3xl">
        Enter VIN
      </h1>
      <form onSubmit={handleSubmit} className="mb-8 flex justify-center">
        <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4 max-w-4xl w-full">
          <input
            type="text"
            name="vin"
            placeholder="XXX-XXX-XXX-XXX"
            className="px-3 py-2 border rounded-md flex-grow"
          />
          <button
            type="submit"
            className="inline-flex items-center justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 w-full sm:w-auto"
          >
            
            Search
          </button>
        </div>
      </form>
    </div>
  );
}

export default VinDecoderPage;