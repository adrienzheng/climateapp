
import React from 'react'
import axios from 'axios'

import {
  DateInput,
} from 'semantic-ui-calendar-react'

import {
  Link,
  withRouter,
} from "react-router-dom"

import {
  Button,
  Dropdown,
  Icon,
  Loader,
  Menu,
  Segment,
} from 'semantic-ui-react'

import moment from 'moment'

import ClimateTable from '../components/Table'
import ClimateChart from '../components/Chart'

import {
  determineBbox,
  processMetaResults,
} from "../helpers"

import "../styles/home.scss"

class Home extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      currentDate: moment().format('YYYY-MM-DD'),
      currentDataPoint: "Daily Max Temperature",
      currentLocation: null,
      currentStationData: null,
      currentStationId: null,
      dataTable: null,
      isSearchingState: true,
      stationList: [],
    }

    this.setStations()
  }

  componentDidUpdate = prevProps => {
    if(prevProps.current !== this.props.current ) {
      this.props.history.push(`/location/${this.props.current.zip}`)
      this.changeDate(this.props.current.date).then(() => {
        console.log(this.props.current.id)
        // this.setState({currentStationId: this.props.current.id})
        console.log(this.state.currentStationId)
      })
    }
  }

  getBox = async() => {
    this.setState({isSearchingState: true})
    let result = await axios.get(`http://www.mapquestapi.com/geocoding/v1/address?key=m1lsJZVvDgjMwJ4bAmiVTdEqoJ9h2DeA&location=${this.props.match.params.zip}`)
    let location = result.data.results[0].locations[0]
    let currentLocation = {city: location.adminArea5, state: location.adminArea3, zip: location.postalCode, ll:{lat: location.latLng.lat, lng: location.latLng.lng}}
    this.setState({currentLocation: currentLocation})
    let box = determineBbox(location.latLng.lat, location.latLng.lng)
    return box
  }

  getStations = async() => {
    let box = await this.getBox()
    let res = await axios.get("http://data.rcc-acis.org/StnMeta", {params: {params: {
      meta: "name,state,sids,ll,uid,valid_daterange",
      elems: "maxt,mint,avgt,pcpn,snow,pcpn,snwd",
      bbox: box.toString(),
      date: this.state.currentDate
    }}})
    console.log(res)
    let stationList = processMetaResults(res, this.state.currentLocation.ll)
    console.log(stationList)
    return stationList
  }

  setStations = async() => {
    let stationList = await this.getStations()
    console.log(stationList)
    this.setState({stationList: stationList, currentStationId: stationList[0] ? stationList[0].id : null, isSearchingState: false})
    return null
  }

  changeStation = id => {
    this.setState({currentStationId: id})
  }

  changeDate = async(date) => {
    this.setState({currentDate: date})
    let res = await this.setStations()
    return res
  }

  updateChart = attr => {
    this.setState({currentDataPoint: attr})
  }

  isFavorite = () => {
    const {
      currentDate,
      currentLocation,
      currentStationId,
    } = this.state
    let favorites = this.props.favorites
    let result = false
    favorites.forEach(fav => {
      if (currentLocation.city === fav.city && currentLocation.state === fav.state && currentLocation.zip === fav.zip && currentStationId === fav.station.id && currentDate === fav.date) {
        result = true
      }
    })
    return result
  }

  handleFavoriteClick = () => {
    const {
      currentDate,
      currentLocation,
      currentStationId,
      isSearchingState
    } = this.state
    if (this.isFavorite()) {
      console.log("is favorite")
      let favorites = this.props.favorites
      favorites.forEach((fav, index) => {
        if (currentLocation.city === fav.city && currentLocation.state === fav.state && currentLocation.zip === fav.zip && currentStationId === fav.station.id && currentDate === fav.date) {
          this.props.removeFavorite(index)
        }
      })
    } else {
      let stations = this.state.stationList
      let currentStation
      stations.forEach(station => {
        if (station.id === currentStationId) {
          currentStation = station
        }
      })
      !isSearchingState && this.props.addFavorite(
        currentLocation.city,
        currentLocation.state,
        currentLocation.zip,
        currentStation,
        currentDate
      )
    }
  }

  render() {

    const {
      showFavorites,
    } = this.props

    const {
      currentDate,
      currentDataPoint,
      currentLocation,
      currentStationId,
      isSearchingState,
      stationList,
    } = this.state

    let stationOptions = []
    stationList.forEach((station, index) => {
      stationOptions.push({key: station.id + " " + index, value: station.id, text: `${station.name} (${Math.round((station.distance + Number.EPSILON) * 10) / 10}miles away)`})
    })

    return (
      currentLocation && <div id="home-cont">
        <Menu stackable>
          <Menu.Item>
            <Icon name="map marker alternate" />
            <span style={{marginRight: "8px"}}>{`${currentLocation.city}, ${currentLocation.state}`}</span>
            <Button
              circular
              icon
              onClick = {() => {
                this.handleFavoriteClick()
              }}
            >
              <Icon name="star" color={this.isFavorite() ? "yellow" : "grey"}/>
            </Button>
          </Menu.Item>
          <Menu.Item>
            {!isSearchingState ? (
              stationList.length > 0 ? <Dropdown
                value= {this.state.currentStationId}
                onChange = {(event, data) => this.changeStation(data.value)}
                options = {stationOptions}
                placeholder = "Select a station"
                search
                selection 
              /> : <>No station with valid data found for the date selected:(</>
            ) : <div><Loader active size="mini" inline>Looking for nearby stations</Loader></div>}
          </Menu.Item>
          <Menu.Item>
            <DateInput
              closable             
              dateFormat="YYYY-MM-DD"
              maxDate={moment()}
              iconPosition="right"
              name="date"
              onChange={(event, {name, value}) => {this.changeDate(value)}}
              placeholder="Date"
              value={currentDate}
            />
          </Menu.Item>
          <Menu.Menu position="right">
            <Menu.Item>
              <Button className="button-margin-right" icon labelPosition="right" onClick={() => showFavorites()}>
                My Favorites
                <Icon name="star" color="yellow"/>
              </Button>
              <Link to="/"><Button icon labelPosition="right">
                New Search
                <Icon name="search"/>
              </Button></Link>
            </Menu.Item>
          </Menu.Menu>
        </Menu>
        <Segment color="blue">
          <div id="table-cont">
            <ClimateTable id={currentStationId} date={currentDate} updateChart={this.updateChart}/>
          </div>
        </Segment>
        <Segment>
          <ClimateChart id={currentStationId} date={currentDate} currentDataPoint={currentDataPoint}/>
        </Segment>
      </div>
    )
  }
}

export default withRouter(Home)