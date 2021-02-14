import React, { useEffect } from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import Home from './home/Home'
import SignIn from './auth/SignIn'
import Signup from './auth/Signup'
import DemoTwo from './demo/DemoTwo'
import User from './userManagement/User'
import Department from './products/department/Department'
import Products from './products/Products'
import Profile from './profile/Profile'
import ProductBulkUploadImage from './products/ProductBulkUploadImage'
import SignInOTP from './auth/SignInOTP'
import PageNotFound from './pageNotFound/PageNotFound'
import RouteWithNavbarPreLogin from '../commonComponents/RouteWithNavbarPreLogin'
import RouteWithNavbarPostLoginAdmin from '../commonComponents/RouteWithNavbarPostLoginAdmin'
import SubCategory from './products/subDepartment/SubCategory'
import Brand from './products/brand/Brand'

export default function App() {
  const dashboard=window.location.pathname.includes('dashboard')

  return (
    <div className={`${dashboard ? 'd-flex':undefined}`}>
      {!dashboard ?
        <Router>
          <Switch>
            <RouteWithNavbarPreLogin path="/" exact component={Home} />
            <Route path="/signin" exact component={SignIn} />
            <Route path="/signup" exact component={Signup} />
            <Route path='/otpLogin' exact component={SignInOTP} />
            <RouteWithNavbarPreLogin path='/demo' exact component={DemoTwo} />
            <Route path='*' component={PageNotFound} />
          </Switch>
        </Router>:
        <Router>
          <Switch>
            <RouteWithNavbarPostLoginAdmin exact path="/dashboard" component={DemoTwo} />
            <RouteWithNavbarPostLoginAdmin exact path="/dashboard/user" component={User} />
            <RouteWithNavbarPostLoginAdmin exact path="/dashboard/category" component={Department} />
            <RouteWithNavbarPostLoginAdmin exact path="/dashboard/subCategory" component={SubCategory} />
            <RouteWithNavbarPostLoginAdmin exact path="/dashboard/brand" component={Brand} />
            <RouteWithNavbarPostLoginAdmin exact path="/dashboard/product" component={Products} />
            <RouteWithNavbarPostLoginAdmin exact path="/dashboard/productImage" component={ProductBulkUploadImage} />
            <RouteWithNavbarPostLoginAdmin exact path="/dashboard/profile" component={Profile} />
            <Route path='*' component={PageNotFound} />
          </Switch>
        </Router>
      }
    </div>
  )
}
