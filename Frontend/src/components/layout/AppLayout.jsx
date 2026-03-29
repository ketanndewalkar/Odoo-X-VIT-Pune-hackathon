import React from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from '../common/Navbar'
import Footer from '../common/Footer'

const AppLayout = () => {
  return (
    <>
      <div className='w-screen h-fit bg-[#FFFFFF] p-4'>
        <Navbar />
        <Outlet />
        <Footer />
      </div>
    </>
  )
}

export default AppLayout