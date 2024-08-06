import { useState, useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import './App.css'
import Header from './components/Header'


function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    console.log(user);
  }, [user]);

  return (
    <>
      <Header />
      <Outlet context={{ user, setUser }}/>
    </>
  )
}

export default App
