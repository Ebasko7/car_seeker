import { useState, useEffect } from 'react'
import { Outlet, useLoaderData, useNavigate, useLocation } from 'react-router-dom'
import './App.css'
import Header from './components/Header'

function App() {
  //LOADER FUNCTION IN ROUTER.JSX CALLS USERCONFIRMATION FUNCTION IN UTILITIES.JSX. USELOADERDATA IS SETTING AUTHENTICATION STATE TO TRUE OR FALSE.
  const { isAuthenticated } = useLoaderData()
  //USER IS USED AS GLOBAL STATE AND CHECKED IN VARIOUS COMPONENTS/FUNCTIONS. IT IS PASSED AS OUTLET CONTEXT TO CHILDREN AND AS PROPS TO HEADER.
  const [user, setUser] = useState(isAuthenticated)
  const navigate = useNavigate()
  //LOCATION GRABS THE CURRENT URL PATH
  const location = useLocation()

  //IF USER CHANGES, THE STATUS IS LOGGED. THIS IS FOR DEBUGGING PURPOSES.
  useEffect(() => {
    console.log("User authentication status:", user)
  }, [user])

  //THIS WILL ENFORCE PUBLIC V. PRIVATE ROUTES UPON CHANGE TO AUTHENTICATION STATUS. IT VERIFIES USER IS ALWAYS ON AN ALLOWED ROUTE.
  useEffect(() => {
    const publicRoutes = ["/login/", "/signup"]
    const isPublicRoute = publicRoutes.includes(location.pathname)

    if (!user && !isPublicRoute) {
      // IF USER NOT AUTHENTICATED AND TRYING TO ACCESS NON PUBLIC ROUTE, REDIRECT TO LOGIN
      navigate("/login/")
    } else if (user && isPublicRoute) {
      // IF USER IS AUTHENTICATED AND TRYING TO ACCESS LOGIN OR SIGN UP, REDIRECT TO HOMEPAGE
      navigate("/")
    }
      //IF URL PATH / USER AUTH STATE CHANGES THE EFFECT RUNS. NAVIGATE IN THE DEPENDENT ARRAY IS BEST PRACTICE, NOT REQUIRED IN MOST CASES. 
  }, [location.pathname, user, navigate])

  return (
    <>
      {/*HEADER IS NOT A CHILD OF APP AND CAN NOT RECEIVE THE OUTLET CONTEXT, USER AND SET USER ARE PASSED AS PROPS TO ALLOW GLOBAL STATE AWARENESS OF AUTH STATUS*/}
      <Header user={user} setUser={setUser} />
      <Outlet context={{ user, setUser }}/>
    </>
  )
}

export default App