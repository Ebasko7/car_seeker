//HEADER PERSISTS ACROSS ALL OTHER REACT PAGES, IT IS NOT A CHILD OF APP, IT EXISTS AT THE TOP LEVEL OF THE APPLICATION.
'use client'
import { useState } from 'react'
import { Dialog, DialogPanel } from '@headlessui/react'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'
import { Link } from 'react-router-dom'
import { userLogOut } from '../utilities.jsx'

//EACH OBJECT IN THIS ARRAY IS MAPPED TO IN THE RETURN SECTION AND LINKS TO THE PATH IN THE 'TO' FIELD.
const navigation = [
  { name: 'Home', to: '/' },
  { name: 'VIN Decoder', to: '/decoder'},
  { name: 'Marketplace', to: '/marketplace' },
  { name: 'Bounty List', to: '/bountylist' },
  { name: 'Garage', to: '/garage' },
]

//USER AND SETUSER ARE PASSED IN AS PROPS FROM APP.JSX. IF USER = TRUE, THEY ARE AUTHENTICATED.
//THIS IS A TAILWIND NAVBAR COMPONENT, WHEN SCALED TO WITHIN MOBILE DEVICE SIZE, A BREAKPOINT WILL ALLOW MOBILEMENU TO TOGGLE BETWEEN TRUE OR FALSE
//IF TRUE, THE MENU TAKES THE ENTIRE SCREEN, IF FALSE THE MENU IS COLLAPSED.
export default function Header({ user, setUser }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

//THIS LOGS THE USER OUT VIA THE LOGOUT FUNCTION IN UTILITIES.JSX. USER IS RESET TO NULL, RESTRICTING ACCESS TO PUBLIC ROUTES (LOGIN AND SIGNUP) ONLY
  const handleLogout = () => {
    userLogOut()
    setUser(null)
  }

//REGARDLESS OF USER STATE, THIS BUTTON WILL NAVIGATE TO LOGIN PAGE. IT DISPLAYS LOG IN IF USER IS FALSE (NOT AUTHENTICATED) OR LOG OUT IF USER IS AUTHENTICATED
//HANDLE LOGOUT IS CALLED AND USER IS LOGGED OUT
  const AuthButton = () => (
    <Link
      to="/login"
      onClick={user ? handleLogout : undefined}
      className="block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-white hover:text-gray-200"
    >
      {user ? 'Log out' : 'Log in'}
    </Link>
  )

  return (
    <header className="bg-white">

  {/*THE BELOW MAPS THE NAVIGATION OBJECTS AT TOP OF PAGE TO LINKED REACT PAGES*/}
      <nav className="bg-blue-600/80 mx-auto flex max-w-9xl items-center justify-between p-6 lg:px-8" aria-label="Global">
        <div className="flex-1 flex items-center justify-between">
          <Link to="/" className="flex items-center">
            <span className="sr-only">CarSeeker</span>
            <img alt="CarSeeker logo" src="../src/assets/images/wheel.png" className="h-20 w-auto" />
            <h1 className="text-4xl font-bold tracking-tight text-white ml-4">CarSeeker</h1>
          </Link>
        </div>
        <div className="flex-1 flex items-center justify-center">
          { user ? (
          <div className="hidden lg:flex lg:gap-x-12">
            {navigation.map((item) => (
              <Link key={item.name} to={item.to} className="text-lg font-normal leading-6 text-white hover:text-gray-200">
                {item.name}
              </Link>
            ))}
          </div>) : 
          (<div> </div>)}

        </div>
        <div className="flex-1 flex items-center justify-end">
          <div className="hidden lg:block">
            <AuthButton />
          </div>
          <div className="flex lg:hidden">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-white"
            >
              <span className="sr-only">Open main menu</span>
              <Bars3Icon className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
        </div>
      </nav>
      <Dialog as="div" className="lg:hidden" open={mobileMenuOpen} onClose={setMobileMenuOpen}>
        <div className="fixed inset-0 z-10" />
        <DialogPanel className="fixed inset-y-0 right-0 z-10 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
          <div className="flex items-center justify-between">
            <Link to="/" className="-m-1.5 p-1.5">
              <span className="sr-only">CarSeeker</span>
              <img
                className="h-8 w-auto"
                src="../src/assets/images/wheel.png"
                alt="CarSeeker"
              />
            </Link>
            <button
              type="button"
              className="-m-2.5 rounded-md p-2.5 text-gray-700"
              onClick={() => setMobileMenuOpen(false)}
            >
              <span className="sr-only">Close menu</span>
              <XMarkIcon className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
          <div className="mt-6 flow-root">
            <div className="-my-6 divide-y divide-gray-500/10">
              <div className="space-y-2 py-6">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.to}
                    className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
              <div className="py-6">
                <AuthButton />
              </div>
            </div>
          </div>
        </DialogPanel>
      </Dialog>
    </header>
  )
}