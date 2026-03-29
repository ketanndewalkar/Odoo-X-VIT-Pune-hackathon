import React from 'react'
import { useAuthStore } from '../../../app/store'

const AdminProtectRoute = ({ children }) => {
    const { user } = useAuthStore()
    if (!user) {
        return <Navigate to="/login" />
    }
    if (user.role !== "ADMIN") {
        return <Navigate to={roleRoute[user.role]} />
    }
    return children
}

export default AdminProtectRoute