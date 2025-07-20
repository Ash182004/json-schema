'use client';

import { useState } from 'react';
import { Dialog, DialogPanel } from '@headlessui/react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import Lottie from "lottie-react";
import icons8 from '../assets/icons8-js.json';

export default function Example() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    
   <header
  className="w-full max-w-7xl px-6 py-2 mt-2 mx-auto rounded-3xl sticky z-50 top-2 shadow-lg backdrop-blur-md border border-white/20 text-white"
  style={{
    background: 'linear-gradient(to right, #020024, #090979, #00d4ff)',
  }}
>

      {/* Navbar */}
      <nav className="mx-auto flex max-w-2xl items-center justify-between p-3 lg:px-6" aria-label="Global">
        {/* Logo */}
        <div className="flex lg:flex-1">
          <a href="#" className="-m-1.5 p-1.5 flex items-center gap-2">
            <Lottie
    animationData={icons8}
    loop={true}
    autoplay={true}
    style={{ width: 40, height: 40 , filter: "brightness(0) invert(1)"}}
  />
            <span className="font-bold text-white text-lg ">SchemaB</span>
          </a>
        </div>

        {/* Mobile menu button */}
        <div className="flex lg:hidden">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-white"
          >
            <span className="sr-only">Open main menu</span>
            <Bars3Icon className="size-6" aria-hidden="true" />
          </button>
        </div>

        {/* Desktop Nav Items */}
        <div className="hidden lg:flex gap-x-9 ml-9  text-xl font-semibold" >
         {['Home', 'Use It'].map((label) => (
  <a
    key={label}
    href={`#${label.toLowerCase().replace(/\s+/g, '-')}`} // this turns "Use It" to "use-it"
    className="px-4 py-2 rounded-xl transition-all duration-200 ease-in-out
               hover:bg-black/30 hover:backdrop-blur-sm hover:border hover:border-white/20 hover:shadow-lg"
  >
    {label}
  </a>
))}

        </div>
      </nav>

      {/* Mobile Sidebar */}
      <Dialog as="div" open={mobileMenuOpen} onClose={setMobileMenuOpen} className="lg:hidden ml-4">
        <div className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm" /> {/* Background overlay */}
        <DialogPanel className="fixed inset-y-0 right-0 z-50 w-full sm:max-w-sm backdrop-blur-md bg-white/10 border-l border-white/20 p-6 text-white">
          <div className="flex items-center justify-between">
            <a href="#" className="-m-1.5 p-1.5 flex items-center gap-2">
              <img
                className="h-8 w-auto"
                src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=600"
                alt="Your Logo"
              />
              <span className="font-bold text-white text-lg">SchemaB</span>
            </a>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(false)}
              className="-m-2.5 rounded-md p-2.5 text-white"
            >
              <span className="sr-only">Close menu</span>
              <XMarkIcon className="size-6" aria-hidden="true" />
            </button>
          </div>

          <div className="mt-8 flex flex-col gap-y-4 font-bold text-3xl">
            {['Home', 'use it'].map((label) => (
              <a
                key={label}
                href={`#${label.toLowerCase()}`}
                className="block text-white px-4 py-3 rounded-xl transition-all duration-200 ease-in-out
                           hover:bg-black/30 hover:backdrop-blur-sm hover:border hover:border-white/20 hover:shadow-lg"
              >
                {label}
              </a>
            ))}
          </div>
        </DialogPanel>
      </Dialog>
    </header>
   
  );
}
