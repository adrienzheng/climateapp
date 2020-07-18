import React from 'react'
import {
  Link,
  withRouter
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

  search = () => {
    fetch(`http://www.mapquestapi.com/geocoding/v1/address?key=m1lsJZVvDgjMwJ4bAmiVTdEqoJ9h2DeA&location=${this.state.zipToSearch}`)
      .then(res => res.json())
      .then(
        result => {
          let location = result.results[0].locations[0]
          console.log(location)
          this.props.setLocation({city: location.adminArea5, state: location.adminArea3, zip: location.postalCode, latitude: location.latLng.lat, longtitude: location.latLng.lng})
          this.props.history.push(`/location/${this.state.zipToSearch}`)
        },
        error => {
          alert("The zip code entered is invalid.")
        }
      )
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
            Enter a zip code to look up the climate history.
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
          <Link><Button 
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
          </Button></Link>
        </form>
      </div>
    )
  }
}

export default withRouter(Search)