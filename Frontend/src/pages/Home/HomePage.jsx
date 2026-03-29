import React from 'react'
import { useAuthStore } from '../../app/store'

const HomePage = () => {
  const { user } = useAuthStore()
  console.log(user)
  return (
    <div>HomePage</div>
  )
}

export default HomePage