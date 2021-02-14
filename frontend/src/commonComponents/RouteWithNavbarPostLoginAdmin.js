import React from 'react'
import AdminNavbar from '../components/nav/AdminNavbar'
import { ProtectedRoute } from './ProtectedRoute'

export default function RouteWithNavbarPostLoginAdmin({component:Component, ...rest}) {
    return (
        <ProtectedRoute {...rest}>
            <AdminNavbar />
            <Component />
        </ProtectedRoute>
    )
}
