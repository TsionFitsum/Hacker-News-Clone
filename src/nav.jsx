import { Fragment } from 'react'
import { Disclosure, Menu, Transition } from '@headlessui/react'
import { Bars3Icon, BellIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { BrowserRouter as Router, Route, Link, Routes, useParams } from 'react-router-dom';
import New from './New';


const navigation = [
  { name: 'Top', href: '/', current: true },
  { name: 'New', href: '/new', current: false },
  { name: 'Best', href: '#', current: false },
  { name: 'Ask', href: '#', current: false },
  { name: 'Show', href: '#', current: false },
  { name: 'Jobs', href: '#', current: false },


]

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function Nav() {
  return (
    <Disclosure as="nav" className="bg-orange-600">
      {({ open }) => (
        <>
          <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
            <div className="relative flex h-16 items-center justify-between">
              <div className="flex-shrink-0 flex items-center">
                
               <svg xmlns="http://www.w3.org/2000/svg" 
                    viewBox="0 0 24 24" 
                    id="hacker-news"
                    className='w-10 h-10'>
                      <path d="M21.036 24H2.964A2.968 2.968 
                      0 0 1 0 21.036V2.964A2.968 2.968 0 0 1 2.964 
                      0h18.072A2.968 2.968 0 0 1 24 2.964v18.071A2.968 
                      2.968 0 0 1 21.036 24zM2.964 1A1.966 1.966 0 0 0 1 
                      2.964v18.071C1 22.119 1.881 23 2.964 23h18.072A1.966 
                      1.966 0 0 0 23 21.036V2.964A1.966 1.966 0 0 0 21.036 
                      1H2.964zm9.815 18.071h-1.611a.5.5 0 0 1-.5-.5v-5.15L6.627 
                      5.66a.498.498 0 0 1 .443-.731h1.915a.5.5 0 0 1 .441.265c1.751 
                      3.278 2.306 4.517 2.618 5.318.306-.775.802-1.897 2.656-5.321a.5.5 
                      0 0 1 .439-.262h1.787a.5.5 0 0 1 .444.731l-4.092 7.852v5.06a.497.497 
                      0 0 1-.499.499zm-1.111-1h.611v-4.68a.5.5 0 0 1 .057-.231l3.768-7.231h-.665c-1.947 
                      3.606-2.28 4.473-2.576 5.24-.108.281-.21.546-.378.915-.082.181-.268.278-.464.292a.499.499 
                      0 0 1-.453-.309c-.112-.27-.192-.49-.276-.718-.29-.792-.619-1.688-2.605-5.421h-.792l3.717 
                      7.139a.5.5 0 0 1 .057.231v4.773z"></path></svg>
               <Link to="/"> <h1 className="text-2xl font-bold ml-2">Hacker News</h1></Link>
              </div>
              <div className="flex ml-auto space-x-4">
                {navigation.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    className={classNames(
                      item.current ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                      'rounded-md px-3 py-2 text-sm font-medium'
                    )}
                    aria-current={item.current ? 'page' : undefined}
                  >
                    {item.name}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </Disclosure>
  )
}
