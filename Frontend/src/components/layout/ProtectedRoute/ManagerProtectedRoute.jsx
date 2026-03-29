import React from 'react'

const ManagerProtectedRoute = () => {
    const { user } = useAuthStore()
    if (!user) {
        return <Navigate to="/login" />
    }
    if (user.role !== "MANAGER") {
        return <Navigate to={roleRoute[user.role]} />
    }
    return children
}

export default ManagerProtectedRoute