
import React from 'react'
import axios from 'axios'

import _ from 'lodash'
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
  Header,
  Icon,
  Input,
  Loader,
  Menu,
  Segment,
  Table,
} from 'semantic-ui-react'

import Highcharts, { chart } from "highcharts/highstock"
import HighchartsReact from "highcharts-react-official"

import moment from 'moment'

import {
  determineBbox,
  processMetaResults,
  getDailyData,
  getDataTable,
} from "../helpers"

import "../styles/home.scss"

class Home extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      currentDate: moment().format('YYYY-MM-DD'),
      currentDataPoint: "Max Temperature",
      currentLocation: null,
      currentStationData: null,
      currentStationId: null,
      dataTable: null,
      isSearchingState: true,
      stationList: [],
    }

    this.getStations()

    console.log(this.state)
  }

  getStations = () => {
    this.setState({isSearchingState: true})
    console.log("get")
    axios.get(`http://www.mapquestapi.com/geocoding/v1/address?key=m1lsJZVvDgjMwJ4bAmiVTdEqoJ9h2DeA&location=${this.props.match.params.zip}`)
      .then(
        result => {
          let location = result.data.results[0].locations[0]
          let currentLocation = {city: location.adminArea5, state: location.adminArea3, zip: location.postalCode, ll:{lat: location.latLng.lat, lng: location.latLng.lng}}
          this.setState({currentLocation: currentLocation})
          let box = determineBbox(location.latLng.lat, location.latLng.lng)
          console.log(box.toString())
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
      ).then(
        this.setTable()
      )
  }

  setTable = () => {
    getDataTable(this.state.currentStationId, this.state.currentDate)
      .then(table => this.setState({dataTable: table}))
  }

  searchStationById = id => {
    for(let i=0; i<this.state.stationList.length; i++) {
      if(this.state.stationList[i].id === id) {
        return this.state.stationList[i]
      }
    }
    return this.state.stationList[0]
  }

  changeStation = id => {
    console.log(id)
    let station = this.searchStationById(id)
    this.setState({currentStationId: id})
    this.setTable()
  }

  changeDate = date => {
    this.setState({currentDate: date})
    this.getStations()
  }

  render() {

    const {
      showFavorites
    } = this.props

    const {
      currentDate,
      currentDataPoint,
      currentLocation,
      currentStationData,
      currentStationId,
      dataTable,
      isSearchingState,
      stationList,
      
    } = this.state

    let stationOptions = []
    stationList.map((station, index) => {
      stationOptions.push({key: station.id + " " + index, value: station.id, text: `${station.name} (${Math.round((station.distance + Number.EPSILON) * 10) / 10}miles away)`})
    })

    const chartData = {
      maxtemp: {
        start: 1960,
        end: 2020,
        dataSeries: [94, 93, null, 96.5, 84, 76, 100, 87.5, 92, 97, 89, 79, 99, 93, 95, 87, 90, 84, 98, 94, 93, 92, 96.5, 84, 76, 100, 87.5, 92, 97, 89, 79, 99, 93, 95, 87, 90, 84, 98, 94, 93, 92, 96.5, 84, 76, 100, 87.5, 92, 97, 89, 79, 99, 93, 95, 87, 90, 84, 98, 90]
      },
      mintemp: {
        start: 2000,
        end: 2020,
        dataSeries: [94, 93, 92, 96.5, 84, 76, 100, 87.5, 92, 97, 89, 79, 99, 93, 95, 87, 90, 84, 98, 90]
      },
      avetemp: {
        start: 2000,
        end: 2020,
        dataSeries: [94, 93, 92, 96.5, 84, 76, 100, 87.5, 92, 97, 89, 79, 99, 93, 95, 87, 90, 84, 98, 90]
      },
      precipitation: {
        start: 2000,
        end: 2020,
        dataSeries: [94, 93, 92, 96.5, 84, 76, 100, 87.5, 92, 97, 89, 79, 99, 93, 95, 87, 90, 84, 98, 90]
      },
      snowdepth: {
        start: 2000,
        end: 2020,
        dataSeries: [94, 93, 92, 96.5, 84, 76, 100, 87.5, 92, 97, 89, 79, 99, 93, 95, 87, 90, 84, 98, 90]
      },
    }

    const chartOptions = {
      chart: {
        type: "line",
        zoomType: "x",
      },
      title: {
        text: currentDataPoint,
      },
      xAxis: {
        categories: _.range(chartData.maxtemp.start, chartData.maxtemp.end + 1)
      },
      yAxis: {
        title: {
          text: "Temperature (°F)"
        }
      },
      plotOptions: {
        line: {
          dataLabels: {
              enabled: true
          },
          enableMouseTracking: true
        }
      },
      series: [
        {
          data:chartData.maxtemp.dataSeries,
          name: "Max Temperature"
        }
      ]
    }

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
          <div>
          {dataTable &&
          <Table celled structured striped compact unstackable>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell className="hard-left" colspan="2" />
                <Table.HeaderCell>Observed</Table.HeaderCell>
                <Table.HeaderCell>Normal</Table.HeaderCell>
                <Table.HeaderCell>Record Highest</Table.HeaderCell>
                <Table.HeaderCell>Record Lowest</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              <Table.Row>
                <Table.Cell className="hard-left" rowspan="6">Daily</Table.Cell>
                <Table.Cell className="next-left">Max Temperature</Table.Cell>
                <Table.Cell>{dataTable.daily.maxtemp.obeserved || "N/A"}</Table.Cell>
                <Table.Cell>{dataTable.daily.maxtemp.normal || "N/A"}</Table.Cell>
                <Table.Cell>{dataTable.daily.maxtemp.hightest || "N/A"}</Table.Cell>
                <Table.Cell>{dataTable.daily.maxtemp.lowest || "N/A"}</Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell className="next-left">Min Temperature</Table.Cell>
                <Table.Cell>{dataTable.daily.mintemp.obeserved || "N/A"}</Table.Cell>
                <Table.Cell>{dataTable.daily.mintemp.normal || "N/A"}</Table.Cell>
                <Table.Cell>{dataTable.daily.mintemp.hightest || "N/A"}</Table.Cell>
                <Table.Cell>{dataTable.daily.mintemp.lowest || "N/A"}</Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell className="next-left">Average Temperature</Table.Cell>
                <Table.Cell>{dataTable.daily.avetemp.obeserved || "N/A"}</Table.Cell>
                <Table.Cell>{dataTable.daily.avetemp.normal || "N/A"}</Table.Cell>
                <Table.Cell>{dataTable.daily.avetemp.hightest || "N/A"}</Table.Cell>
                <Table.Cell>{dataTable.daily.avetemp.lowest || "N/A"}</Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell className="next-left">Precipitation</Table.Cell>
                <Table.Cell>{dataTable.daily.precipitation.obeserved || "N/A"}</Table.Cell>
                <Table.Cell>{dataTable.daily.precipitation.normal || "N/A"}</Table.Cell>
                <Table.Cell>{dataTable.daily.precipitation.hightest || "N/A"}</Table.Cell>
                <Table.Cell>{dataTable.daily.precipitation.lowest || "N/A"}</Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell className="next-left">Snowdepth</Table.Cell>
                <Table.Cell>{dataTable.daily.snowdepth.obeserved || "N/A"}</Table.Cell>
                <Table.Cell>{dataTable.daily.snowdepth.normal || "N/A"}</Table.Cell>
                <Table.Cell>{dataTable.daily.snowdepth.hightest || "N/A"}</Table.Cell>
                <Table.Cell>{dataTable.daily.snowdepth.lowest || "N/A"}</Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell className="next-left">Snowfall</Table.Cell>
                <Table.Cell>{dataTable.daily.snowfall.obeserved || "N/A"}</Table.Cell>
                <Table.Cell>{dataTable.daily.snowfall.normal || "N/A"}</Table.Cell>
                <Table.Cell>{dataTable.daily.snowfall.hightest || "N/A"}</Table.Cell>
                <Table.Cell>{dataTable.daily.snowfall.lowest || "N/A"}</Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell className="hard-left" rowspan="2">Monthly-To-Date</Table.Cell>
                <Table.Cell className="next-left">Precipitation</Table.Cell>
                <Table.Cell>{dataTable.monthly.precipitation.obeserved || "N/A"}</Table.Cell>
                <Table.Cell>{dataTable.monthly.precipitation.normal || "N/A"}</Table.Cell>
                <Table.Cell>{dataTable.monthly.precipitation.hightest || "N/A"}</Table.Cell>
                <Table.Cell>{dataTable.monthly.precipitation.lowest || "N/A"}</Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell className="next-left">Snowfall</Table.Cell>
                <Table.Cell>{dataTable.monthly.snowfall.obeserved || "N/A"}</Table.Cell>
                <Table.Cell>{dataTable.monthly.snowfall.normal || "N/A"}</Table.Cell>
                <Table.Cell>{dataTable.monthly.snowfall.hightest || "N/A"}</Table.Cell>
                <Table.Cell>{dataTable.monthly.snowfall.lowest || "N/A"}</Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell className="hard-left">Seasonal-to-Date</Table.Cell>
                <Table.Cell className="next-left">Snowfall</Table.Cell>
                <Table.Cell>{dataTable.seasonal.snowfall.obeserved || "N/A"}</Table.Cell>
                <Table.Cell>{dataTable.seasonal.snowfall.normal || "N/A"}</Table.Cell>
                <Table.Cell>{dataTable.seasonal.snowfall.hightest || "N/A"}</Table.Cell>
                <Table.Cell>{dataTable.seasonal.snowfall.lowest || "N/A"}</Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell className="hard-left">Yearly-to-Date</Table.Cell>
                <Table.Cell className="next-left">Precipitation</Table.Cell>
                <Table.Cell>{dataTable.yearly.precipitation.obeserved || "N/A"}</Table.Cell>
                <Table.Cell>{dataTable.yearly.precipitation.normal || "N/A"}</Table.Cell>
                <Table.Cell>{dataTable.yearly.precipitation.hightest || "N/A"}</Table.Cell>
                <Table.Cell>{dataTable.yearly.precipitation.lowest || "N/A"}</Table.Cell>
              </Table.Row>
            </Table.Body>
          </Table>}
          </div>
        </Segment>
        <Segment>
          <HighchartsReact
            highcharts={Highcharts}
            options={chartOptions}
          />
        </Segment>
      </div>
    )
  }
}

export default withRouter(Home)