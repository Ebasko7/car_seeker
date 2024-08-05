import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Header from './components/Header'
import MainPageSection from './components/MainPageSection'
import AutoCard from './components/AutoCard'

function App() {


  return (
    <>
    <Header />
    <MainPageSection />
    <h1 className='text-center text-xl'>FEATURED CARS</h1>
    <AutoCard />
    </>
  )
}

export default App
