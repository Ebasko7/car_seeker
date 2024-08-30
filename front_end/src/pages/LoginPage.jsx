//THE LOGIN PAGE IS ONE OF TWO (ALONG WITH SIGNUP.JSX) PAGES ON A PUBLIC ROUTE  .
import { useState } from "react"
import { useOutletContext, Link } from "react-router-dom"
import { userLogIn } from '../utilities.jsx'

const LogIn = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  //USERSTATE CAN EITHER BE AUTHENTICATED OR NOT AUTHENTICATED. IF THE LOGIN FUNCTION IS SUCCESSFUL THE STATE OF USER IS UPDATED AT THE APP.JSX LEVEL. 
  const { setUser } = useOutletContext()

  //AYSNC FUNCTION CALLING ON THE USER LOGIN METHOD DEFINED IN UTILITIES.JSX. PERFORMS TOKEN AUTHENTICATION WITH DJANGO BACK END/USER APP.
  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const user = await userLogIn(email, password)
      setUser(user)
     
    } catch (error) {
      console.error("Login failed:", error)
      
    }
  }

  return (
  
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
      {/*LOGIN FORM. THE HANDLE SUBMIT FUNCTION CALLS THE USER LOGIN FUNCTION. SET EMAIL AND SET PASSWORD ARE DYNAMICALLY UPDATED VIA ONCHANGE FIELDS */}
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <img
          alt="Car seeker logo"
          src="/images/911_gt3.webp"
          className="mx-auto h-13 w-auto"
        />
        <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
          Login to your account
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
                autoComplete="current-password"
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="flex w-full justify-center rounded-md bg-blue-600/80 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Log in
            </button>
          </div>
        </form>
        <div className="mt-6 text-center">
          <h4 className="text-lg font-medium text-gray-900">OR</h4>
          {/*LINK TO NEAR IDENTICAL SIGN UP PAGE THAT CALLS USER SIGN UP FUNCTION IN UTILITIES.JSX. THIS WILL BE MADE INTO ONE COMPONENT WITH TOGGLE STATE VICE A SEPARATE PAGE*/}
          <Link to="/signup" className="mt-2 block text-lg font-medium text-red-700 hover:text-red-800">
            Create an Account
          </Link>
        </div>
      </div>
    </div>
  )
}

export default LogIn