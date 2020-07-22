
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

    this.getStations()
  }

  getStations = () => {
    this.setState({isSearchingState: true})
    axios.get(`http://www.mapquestapi.com/geocoding/v1/address?key=m1lsJZVvDgjMwJ4bAmiVTdEqoJ9h2DeA&location=${this.props.match.params.zip}`)
      .then(
        result => {
          let location = result.data.results[0].locations[0]
          let currentLocation = {city: location.adminArea5, state: location.adminArea3, zip: location.postalCode, ll:{lat: location.latLng.lat, lng: location.latLng.lng}}
          this.setState({currentLocation: currentLocation})
          let box = determineBbox(location.latLng.lat, location.latLng.lng)
          axios.get("http://data.rcc-acis.org/StnMeta", {params: {params: {
            meta: "name,state,sids,ll,uid,valid_daterange",
            elems: "maxt,mint,avgt,pcpn,snow,pcpn,snwd",
            bbox: box.toString(),
            date: this.state.currentDate
          }}})
            .then(res => {
              let stationList = processMetaResults(res, this.state.currentLocation.ll)
              this.setState({stationList: stationList, currentStationId: stationList[0] ? stationList[0].id : null, isSearchingState: false})
            })
        }
      )
  }

  changeStation = id => {
    this.setState({currentStationId: id})
  }

  changeDate = date => {
    this.setState({currentDate: date})
    this.getStations()
  }

  updateChart = attr => {
    this.setState({currentDataPoint: attr})
  }

  render() {

    const {
      showFavorites
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
            <Icon name="star" color="grey"></Icon>
          </Menu.Item>
          <Menu.Item>
            {!isSearchingState ? (
              stationList.length > 0 ? <Dropdown
                defaultValue= {stationOptions[0].value}
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