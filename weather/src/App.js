import React from 'react'
import logo from './logo.svg'
import Home from './pages/Home'
import Search from './pages/Search'

import "./styles/main.scss"
import 'semantic-ui-css/semantic.min.css'

import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom"

function App() {
  return (
    <div className="App">
      <Router>
        <Switch>
          <Route exact path="/" component={Search}>
          </Route>
          <Route exact path="/location/:zip" component={Home}/>
        </Switch>
      </Router>
    </div>
  );
}

export default App
