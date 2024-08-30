//THE SIGNUP PAGE IS ONE OF TWO (ALONG WITH LOGIN.JSX) PAGES ON A PUBLIC ROUTE  .
import React from 'react'
import { useState } from "react"
import { Link } from "react-router-dom"
import { userRegistration } from '../utilities.jsx'

function Signup() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")


//HANDLES FORM SUBMIT, PREVENTS FORM FROM REFRESHING PAGE BY DEFAULT. CALLS SIGN UP FUNCTION IN UTILITIES.JSX. USER MUST THEN NAVIGATE TO LOGIN PAGE TO LOGIN, FUTURE ITERATION WILL LOGIN UPON ACCOUNT CREATION.
  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const user = await userRegistration(email, password)
      console.log("User registered:", user)
    } catch (error) {
      console.error("Registration failed:", error)
    }
  };

  return (
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
      {/*LOGIN FORM. THE HANDLE SUBMIT FUNCTION CALLS THE USER LOGIN FUNCTION. SET EMAIL AND SET PASSWORD ARE DYNAMICALLY UPDATED VIA ONCHANGE FIELDS */}
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <img
          alt="Car seeker logo??"
          src="/images/911_black.webp"
          className="mx-auto h-13 w-auto"
        />
        <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
          Create an Account
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
              Email address
            </label>
            <div className="mt-2">
              <input
                onChange={(e) => setEmail(e.target.value)}
                id="email"
                name="email"
                type="email"
                required
                autoComplete="email"
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
                Password
              </label>
            </div>
            <div className="mt-2">
              <input
                onChange={(e) => setPassword(e.target.value)}
                id="password"
                name="password"
                type="password"
                required
                autoComplete="new-password"
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="flex w-full justify-center rounded-md bg-blue-600/80 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Sign up
            </button>
          </div>
        </form>
      </div>
      <div className="mt-6 text-center">
          <h4 className="text-lg font-medium text-gray-900">OR</h4>
          {/*LINK TO NEAR IDENTICAL LOGIN IN PAGE THAT CALLS USER SIGN UP FUNCTION IN UTILITIES.JSX. THIS WILL BE MADE INTO ONE COMPONENT WITH TOGGLE STATE VICE A SEPARATE PAGE*/}
          <Link to="/login" className="mt-2 block text-lg font-medium text-red-700 hover:text-red-800">
            Login to your account
          </Link>
        </div>
      </div>
    
  )
}

export default Signup