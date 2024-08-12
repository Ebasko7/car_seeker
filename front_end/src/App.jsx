import { useState, useEffect } from 'react'
import { Outlet, useLoaderData, useNavigate, useLocation } from 'react-router-dom'
import './App.css'
import Header from './components/Header'

function App() {
  const { isAuthenticated } = useLoaderData();
  const [user, setUser] = useState(isAuthenticated)
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    console.log("User authentication status:", user);
  }, [user]);

  useEffect(() => {
    const publicRoutes = ["/login/", "/signup"];
    const isPublicRoute = publicRoutes.includes(location.pathname);

    if (!user && !isPublicRoute) {
      // If user is not authenticated and trying to access a non-public route, redirect to login
      navigate("/login/");
    } else if (user && isPublicRoute) {
      // If user is authenticated and trying to access login or signup, redirect to home
      navigate("/");
    }
    // We're not redirecting if the user is not authenticated and on a public route
  }, [location.pathname, user, navigate]);

  return (
    <>
      <Header user={user} setUser={setUser} />
      <Outlet context={{ user, setUser }}/>
    </>
  )
}

export default App