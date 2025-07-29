// @ts-ignore
import React from "react";

const Navbar = () => {

  return (
    <nav className='bg-white shadow-lg border-b border-gray-200'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-20'>
        <div className='flex justify-between items-center h-16'>
          {/* Logo Section */}
          <div className='flex items-center'>
            <div className='flex-shrink-0'>
              <h1 className='text-2xl font-bold text-indigo-600'>📚 Book Club Library</h1>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
