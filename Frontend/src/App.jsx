import React from 'react'
import { RouterProvider } from 'react-router-dom'
import { router } from './app/providers'
import { Toaster } from './utils/Toaster'

const App = () => {
  return (
    <>
    <RouterProvider router={router}/>
    <Toaster />
    </>
  )
}

export default App