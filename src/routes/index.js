import React from 'react'
import { Switch } from 'react-router-dom'
import Route from './Route'

import Dashboard from '../pages/Dashboard'
import Profile from '../pages/Profile'

import SignUp from '../pages/SignUp'
import SignIn from '../pages/SignIn'

export default function Routes() {
  return (
    <Switch>
      <Route path='/' exact component={SignIn} />
      <Route path='/register' component={SignUp} />
      <Route path='/profile' component={Profile} isPrivate />
      <Route path='/dashboard' component={Dashboard} isPrivate />
    </Switch>
  )
}