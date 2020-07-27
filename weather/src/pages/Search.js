import React from 'react'
import {
  Link,
  withRouter
} from "react-router-dom"

import {postcodeValidator} from 'postcode-validator'

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

  search = () => {
    if(postcodeValidator(this.state.zipToSearch, "US")) {
      this.props.history.push(`/location/${this.state.zipToSearch}`)
    } else {
      alert ("Invalid zipcode. Please try a different one.")
    }
  }

  render() {
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
            Enter a zip code to look up the climate history.
          </Header.Subheader>
        </Header>
        <div id = "searchbar-cont">
        <Input
          id="search-bar"
          focus
          placeholder="10001"
          size="large"
          onChange = {(event, data) => {
            this.setState({zipToSearch: data.value})
          }}
        />      
        <Button 
          color="blue"
          icon
          id="search-btn"
          labelPosition="right"
          onClick={() => this.search()}
          primary
          size="large"
        >
          Search
          <Icon name="search"/>
        </Button>
        <Button
          color="blue"
          icon
          labelPosition="right"
          onClick={() => this.props.showFavorites()}
          primary
          size="large"
        >
          My Favorites
          <Icon name="star" color="yellow"/>
        </Button>
        </div>
      </div>
    )
  }
}

export default withRouter(Search)