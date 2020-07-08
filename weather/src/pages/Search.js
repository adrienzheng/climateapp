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

import "../styles/search.scss"

class Search extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      zipToSearch: 10001,
    }
  }

  render() {
    const {
      zipToSearch,
    } = this.state
    return (
      <div id="search-cont">
        <Header
          as="h1"
          icon
        >
          <Icon
            color="blue"
            name="map marker alternate"
          />
          <Header.Subheader>
            Enter a Zip Code to Look up the Weather History.
          </Header.Subheader>
        </Header>
        <form>
          <Input
            id="search-bar"
            focus
            placeholder="10001"
            size="large"
            onChange = {(event, data) => {
              this.setState({zipToSearch: data.value})
            }}
          />
          <Link to={`/location/${zipToSearch}`}><Button 
            color="blue"
            icon
            id="search-btn"
            primary
            labelPosition="right"
            size="large"
          >
            Search
            <Icon name="search"/>
          </Button></Link>
        </form>
      </div>
    )
  }
}

export default Search