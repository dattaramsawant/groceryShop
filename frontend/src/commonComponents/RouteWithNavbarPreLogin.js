import React from 'react'
import { Route } from 'react-router-dom'
import BottomNav from '../components/nav/BottomNav'
import Navbar from '../components/nav/Navbar'

export default function RouteWithNavbarPreLogin({component:Component, ...rest}) {
    return (
        <Route {...rest}>
            <Navbar />
            <BottomNav />
            <Component />
        </Route>
    )
}
