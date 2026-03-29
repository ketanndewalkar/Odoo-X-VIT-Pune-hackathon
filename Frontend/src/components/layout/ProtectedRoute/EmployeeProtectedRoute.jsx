import React from 'react'

const EmployeeProtectedRoute = () => {
    const { user } = useAuthStore()
    if (!user) {
        return <Navigate to="/login" />
    }
    if (user.role !== "EMPLOYEE") {
        return <Navigate to={roleRoute[user.role]} />
    }
    return children
}

export default EmployeeProtectedRoute