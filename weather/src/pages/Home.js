import React from 'react'

import {
  Link,
} from "react-router-dom"

import {
  Button,
  Header,
  Icon,
  Input,
} from 'semantic-ui-react'

import "../styles/home.scss"

class Home extends React.Component {
  
  render() {
    console.log(this.props.match.params.zip)
    return (
    <div id="home-cont">
      <div className="ui secondary  menu">
        <div className="item">
          <Icon name="map marker alternate" />
          Ithaca, NY
        </div>
        <div className="item">
          <Input></Input>
        </div>
        <a className="item">
          Friends
        </a>
        <div className="right menu">
          <div className="item">
            <div className="ui icon input">
              <input type="text" placeholder="Search..." />
              <i className="search link icon"></i>
            </div>
          </div>
          <a className="ui item">
            Logout
          </a>
        </div>
      </div>
    </div>
    )
  }
}

export default Home