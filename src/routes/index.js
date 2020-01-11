import React from 'react'
import { Switch, Route } from 'react-router-dom'

import Dashboard from '../pages/Dashboard'
import Profile from '../pages/Profile'

import SignUp from '../pages/SignUp'
import SignIn from '../pages/SignIn'

export default function Routes() {
  return (
    <Switch>
      <Route path='/' exact component={SignIn} />
      <Route path='/register' component={SignUp} />
      <Route path='/profile' component={Profile} />
      <Route path='/dashboard' component={Dashboard} />
    </Switch>
  )
}