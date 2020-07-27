import React from 'react'
import axios from 'axios'

import {
  Button,
  Loader,
  Popup,
  Table,
} from 'semantic-ui-react'

class ClimateTable extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      table: {
        daily: {
          maxtemp: {observed: null, normal: null, highest: null, lowest: null},
          mintemp: {observed: null, normal: null, highest: null, lowest: null},
          avetemp: {observed: null, normal: null, highest: null, lowest: null},
          precipitation: {observed: null, normal: null, highest: null, lowest: null},
          snowfall: {observed: null, normal: null, highest: null, lowest: null},
          snowdepth: {observed: null, normal: "N/A", highest: null, lowest: null}
        },
        monthly: {
          precipitation: {observed: null, normal: null, highest: null, lowest: null},
          snowfall: {observed: null, normal: null, highest: null, lowest: null}
        },
        seasonal: {
          snowfall: {observed: null, normal: null, highest: null, lowest: null}
        },
        yearly: {
          precipitation: {observed: null, normal: null, highest: null, lowest: null},
        }
      }
    }
  }

  getTableData = () => {
    const {
      id,
      date
    } = this.props

    const {
      table
    } = this.state

    if(id && date) {
      let params1 = {
        sid: id,
        date: date,
        meta: "",
        elems: [
          {name: "maxt"},
          {name: "maxt", normal: 1},
          {name: "mint"},
          {name: "mint", normal: 1},
          {name: "avgt"},
          {name: "avgt", normal: 1},
          {name: "pcpn"},
          {name: "pcpn", normal: 1},
          {name: "snow"},
          {name: "snow", normal: 1},
          {name: "snwd"},
        ]
      }

      axios //get daily observed and normal
        .get("http://data.rcc-acis.org/StnData", {params: {params: params1}})
        .then(res => {
          let data = res.data.data[0]
          let temptable = table
          temptable.daily.maxtemp.observed = data[1]!=="M" ? data[1]+" °F" : "N/A"
          temptable.daily.maxtemp.normal = data[2]!=="M" ? data[2]+" °F" : "N/A"
          temptable.daily.mintemp.observed = data[3]!=="M" ? data[3]+" °F" : "N/A"
          temptable.daily.mintemp.normal = data[4]!=="M" ? data[4]+" °F" : "N/A"
          temptable.daily.avetemp.observed = data[5]!=="M" ? data[5]+" °F" : "N/A"
          temptable.daily.avetemp.normal = data[6]!=="M" ? data[6]+" °F" : "N/A"
          temptable.daily.precipitation.observed = data[7]!=="M" ? data[7]+" inches" : "N/A"
          temptable.daily.precipitation.normal = data[8]!=="M" ? data[8]+" inches" : "N/A"
          temptable.daily.snowfall.observed = data[9]!=="M" ? data[9]+" inches" : "N/A"
          temptable.daily.snowfall.normal = data[10]!=="M" ? data[10]+" inches" : "N/A"
          temptable.daily.snowdepth.observed = data[11]!=="M" ? data[11]+" inches" : "N/A"
          this.setState({table: temptable})
        })
        .catch(err => console.log(err))
      
      let params2 = {
        sid: id,
        sdate: "por" + date.substring(4),
        edate: date,
        meta: "",
        elems: [
          {name: "maxt", interval: [1,0,0], smry: {add: "date", reduce: "max"}, smry_only: 1},
          {name: "maxt", interval: [1,0,0], smry: {add: "date", reduce: "min"}, smry_only: 1},
          {name: "mint", interval: [1,0,0], smry: {add: "date", reduce: "max"}, smry_only: 1},
          {name: "mint", interval: [1,0,0], smry: {add: "date", reduce: "min"}, smry_only: 1},
          {name: "avgt", interval: [1,0,0], smry: {add: "date", reduce: "max"}, smry_only: 1},
          {name: "avgt", interval: [1,0,0], smry: {add: "date", reduce: "min"}, smry_only: 1},
          {name: "pcpn", interval: [1,0,0], smry: {add: "date", reduce: "max"}, smry_only: 1},
          {name: "pcpn", interval: [1,0,0], smry: {add: "date", reduce: "min"}, smry_only: 1},
          {name: "snow", interval: [1,0,0], smry: {add: "date", reduce: "max"}, smry_only: 1},
          {name: "snow", interval: [1,0,0], smry: {add: "date", reduce: "min"}, smry_only: 1},
          {name: "snwd", interval: [1,0,0], smry: {add: "date", reduce: "max"}, smry_only: 1},
          {name: "snwd", interval: [1,0,0], smry: {add: "date", reduce: "min"}, smry_only: 1}
        ]
      }
      axios //get daily record high and low
        .get("http://data.rcc-acis.org/StnData", {params: {params: params2}})
        .then(res => {
          let summary = res.data.smry
          let temptable = table
          temptable.daily.maxtemp.highest = summary[0][0]!== "M" ? summary[0][0] + " °F (" + summary[0][1].slice(0,4) + ")" : "N/A"
          temptable.daily.maxtemp.lowest = summary[1][0]!== "M" ? summary[1][0] + " °F (" + summary[1][1].slice(0,4) + ")" : "N/A"
          temptable.daily.mintemp.highest = summary[2][0]!== "M" ? summary[2][0] + " °F (" + summary[2][1].slice(0,4) + ")" : "N/A"
          temptable.daily.mintemp.lowest = summary[3][0]!== "M" ? summary[3][0] + " °F (" + summary[3][1].slice(0,4) + ")" : "N/A"
          temptable.daily.avetemp.highest = summary[4][0]!== "M" ? summary[4][0] + " °F (" + summary[4][1].slice(0,4) + ")" : "N/A"
          temptable.daily.avetemp.lowest = summary[5][0]!== "M" ? summary[5][0] + " °F (" + summary[5][1].slice(0,4) + ")" : "N/A"
          temptable.daily.precipitation.highest = summary[6][0]!== "M" ? summary[6][0] + " inches (" + summary[6][1].slice(0,4) + ")" : "N/A"
          temptable.daily.precipitation.lowest = summary[7][0]!== "M" ? summary[7][0] + " inches (" + summary[7][1].slice(0,4) + ")" : "N/A"
          temptable.daily.snowfall.highest = summary[8][0]!== "M" ? summary[8][0] + " inches (" + summary[8][1].slice(0,4) + ")" : "N/A"
          temptable.daily.snowfall.lowest = summary[9][0]!== "M" ? summary[9][0] + " inches (" + summary[9][1].slice(0,4) + ")" : "N/A"
          temptable.daily.snowdepth.highest = summary[10][0]!== "M" ? summary[10][0] + " inches (" + summary[10][1].slice(0,4) + ")" : "N/A"
          temptable.daily.snowdepth.lowest = summary[11][0]!== "M" ? summary[11][0] + " inches (" + summary[11][1].slice(0,4) + ")" : "N/A"
          this.setState({table: temptable})
        })
        .catch(err => console.log(err))

      let params3 = {
        sid: id,
        date: date,
        meta: "",
        elems: [
          {name: "pcpn", interval: [1,0,0], duration: "mtd", reduce: "sum"},
          {name: "pcpn", interval: [1,0,0], duration: "mtd", reduce: "sum", normal: 1},
          {name: "snow", interval: [1,0,0], duration: "mtd", reduce: "sum"},
          {name: "snow", interval: [1,0,0], duration: "mtd", reduce: "sum", normal: 1},
          {name: "snow", interval: [1,0,0], duration: "std", reduce: "sum", season_start: "10-01"},
          {name: "snow", interval: [1,0,0], duration: "std", reduce: "sum", season_start: "10-01", normal: 1},
          {name: "pcpn", interval: [1,0,0], duration: "ytd", reduce: "sum"},
          {name: "pcpn", interval: [1,0,0], duration: "ytd", reduce: "sum", normal: 1},
        ]
      }
      axios //get month/season/year-to-date observed and normal
        .get("http://data.rcc-acis.org/StnData", {params: {params: params3}})
        .then(res => {
          let data = res.data.data[0]
          let temptable = table
          temptable.monthly.precipitation.observed = data[1]!=="T" ? (data[1]!=="M" ? data[1] + " inches" : "N/A") : "Trace"
          temptable.monthly.precipitation.normal = data[2]!=="T" ? (data[2]!=="M" ? data[2] + " inches" : "N/A") : "Trace"
          temptable.monthly.snowfall.observed = data[3]!=="T" ? (data[3]!=="M" ? data[3] + " inches" : "N/A") : "Trace"
          temptable.monthly.snowfall.normal = data[4]!=="T" ? (data[4]!=="M" ? data[4] + " inches" : "N/A") : "Trace"
          temptable.seasonal.snowfall.observed = data[5]!=="T" ? (data[5]!=="M" ? data[5] + " inches" : "N/A") : "Trace"
          temptable.seasonal.snowfall.normal = data[6]!=="T" ? (data[6]!=="M" ? data[6] + " inches" : "N/A") : "Trace"
          temptable.yearly.precipitation.observed = data[7]!=="T" ? (data[7]!=="M" ? data[7] + " inches" : "N/A") : "Trace"
          temptable.yearly.precipitation.normal = data[8]!=="T" ? (data[8]!=="M" ? data[8] + " inches" : "N/A") : "Trace"
          this.setState({table: temptable})
        })
        .catch(err => console.log(err))
      
      let params4 = {
        sid: id,
        sdate: "por" + date.substring(4),
        edate: date,
        meta: "",
        elems: [
          {name: "pcpn", interval: [1,0,0], duration: "mtd", reduce: "sum", smry: {add: "date", reduce: "max"}, smry_only: 1},
          {name: "pcpn", interval: [1,0,0], duration: "mtd", reduce: "sum", smry: {add: "date", reduce: "min"}, smry_only: 1},
          {name: "snow", interval: [1,0,0], duration: "mtd", reduce: "sum", smry: {add: "date", reduce: "max"}, smry_only: 1},
          {name: "snow", interval: [1,0,0], duration: "mtd", reduce: "sum", smry: {add: "date", reduce: "min"}, smry_only: 1},
          {name: "snow", interval: [1,0,0], duration: "std", season_start: "10-1", reduce: "sum", smry: {add: "date", reduce: "max"}, smry_only: 1},
          {name: "snow", interval: [1,0,0], duration: "std", season_start: "10-1", reduce: "sum", smry: {add: "date", reduce: "min"}, smry_only: 1},
          {name: "pcpn", interval: [1,0,0], duration: "ytd", reduce: "sum", smry: {add: "date", reduce: "max"}, smry_only: 1},
          {name: "pcpn", interval: [1,0,0], duration: "ytd", reduce: "sum", smry: {add: "date", reduce: "min"}, smry_only: 1},
        ]
      }
      
      axios //get month/season/year-to-date record high and low
        .get("http://data.rcc-acis.org/StnData", {params: {params: params4}})
        .then(res => {
          let summary = res.data.smry
          let temptable = this.state.table
          temptable.monthly.precipitation.highest = summary[0][0] === "M" ? "N/A" : (summary[0][0] === "T" ? "Trace" : summary[0][0] + " inches") + " (" + summary[0][1].slice(0,4) + ")"
          temptable.monthly.precipitation.lowest = summary[1][0] === "M" ? "N/A" : (summary[1][0] === "T" ? "Trace" : summary[1][0] + " inches") + " (" + summary[1][1].slice(0,4) + ")"
          temptable.monthly.snowfall.highest = summary[2][0] === "M" ? "N/A" : (summary[2][0] === "T" ? "Trace" : summary[2][0] + " inches") + " (" + summary[2][1].slice(0,4) + ")"
          temptable.monthly.snowfall.lowest = summary[3][0] === "M" ? "N/A" : (summary[3][0] === "T" ? "Trace" : summary[3][0] + " inches") + " (" + summary[3][1].slice(0,4) + ")"
          temptable.seasonal.snowfall.highest = summary[4][0] === "M" ? "N/A" : (summary[4][0] === "T" ? "Trace" : summary[4][0] + " inches") + " (" + summary[4][1].slice(0,4) + ")"
          temptable.seasonal.snowfall.lowest = summary[5][0] === "M" ? "N/A" : (summary[5][0] === "T" ? "Trace" : summary[5][0] + " inches") + " (" + summary[5][1].slice(0,4) + ")"
          temptable.yearly.precipitation.highest = summary[6][0] === "M" ? "N/A" : (summary[6][0] === "T" ? "Trace" : summary[6][0] + " inches") + " (" + summary[6][1].slice(0,4) + ")"
          temptable.yearly.precipitation.lowest = summary[7][0] === "M" ? "N/A" : (summary[7][0] === "T" ? "Trace" : summary[7][0] + " inches") + " (" + summary[7][1].slice(0,4) + ")"
          this.setState({table: temptable})
        })
        .catch(err => console.log(err))
    }
  }

  componentDidUpdate = (prevProps) => {
    if(prevProps !== this.props){
      this.getTableData()
    }
  }

  getChartButton = attr => {
    return (
      <Popup
        content={`View chart of ${attr}`}
        size="mini"
        trigger={
          <Button
            icon="chart line"
            size="mini"
            compact
            onClick={() => this.props.updateChart(attr)}
          />
        }
      />
    )
  }

  render() {
    const {
      table
    } = this.state

    return (
      <Table compact unstackable definition>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell className="left header" ><div>Daily</div></Table.HeaderCell>
            <Table.HeaderCell>Observed</Table.HeaderCell>
            <Table.HeaderCell>Normal</Table.HeaderCell>
            <Table.HeaderCell>Record Highest</Table.HeaderCell>
            <Table.HeaderCell>Record Lowest</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          <Table.Row>
            <Table.Cell className="left">{this.getChartButton("Daily Max Temperature")}Max Temperature</Table.Cell>
            <Table.Cell>{table.daily.maxtemp.observed || <Loader active  inline size="mini"/>}</Table.Cell>
            <Table.Cell>{table.daily.maxtemp.normal || <Loader active  inline size="mini"/>}</Table.Cell>
            <Table.Cell>{table.daily.maxtemp.highest || <Loader active  inline size="mini"/>}</Table.Cell>
            <Table.Cell>{table.daily.maxtemp.lowest || <Loader active  inline size="mini"/>}</Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell className="left">{this.getChartButton("Daily Min Temperature")}Min Temperature</Table.Cell>
            <Table.Cell>{table.daily.mintemp.observed || <Loader active  inline size="mini"/>}</Table.Cell>
            <Table.Cell>{table.daily.mintemp.normal || <Loader active  inline size="mini"/>}</Table.Cell>
            <Table.Cell>{table.daily.mintemp.highest || <Loader active  inline size="mini"/>}</Table.Cell>
            <Table.Cell>{table.daily.mintemp.lowest || <Loader active  inline size="mini"/>}</Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell className="left">{this.getChartButton("Daily Average Temperature")}Avrg Temperature</Table.Cell>
            <Table.Cell>{table.daily.avetemp.observed || <Loader active  inline size="mini"/>}</Table.Cell>
            <Table.Cell>{table.daily.avetemp.normal || <Loader active  inline size="mini"/>}</Table.Cell>
            <Table.Cell>{table.daily.avetemp.highest || <Loader active  inline size="mini"/>}</Table.Cell>
            <Table.Cell>{table.daily.avetemp.lowest || <Loader active  inline size="mini"/>}</Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell className="left">{this.getChartButton("Daily Precipitation")}Precipitation</Table.Cell>
            <Table.Cell>{table.daily.precipitation.observed || <Loader active  inline size="mini"/>}</Table.Cell>
            <Table.Cell>{table.daily.precipitation.normal || <Loader active  inline size="mini"/>}</Table.Cell>
            <Table.Cell>{table.daily.precipitation.highest || <Loader active  inline size="mini"/>}</Table.Cell>
            <Table.Cell>{table.daily.precipitation.lowest || <Loader active  inline size="mini"/>}</Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell className="left">{this.getChartButton("Daily Snowdepth")}Snowdepth</Table.Cell>
            <Table.Cell>{table.daily.snowdepth.observed || <Loader active  inline size="mini"/>}</Table.Cell>
            <Table.Cell>{table.daily.snowdepth.normal || <Loader active  inline size="mini"/>}</Table.Cell>
            <Table.Cell>{table.daily.snowdepth.highest || <Loader active  inline size="mini"/>}</Table.Cell>
            <Table.Cell>{table.daily.snowdepth.lowest || <Loader active  inline size="mini"/>}</Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell className="left">{this.getChartButton("Daily Snowfall")}Snowfall</Table.Cell>
            <Table.Cell>{table.daily.snowfall.observed || <Loader active  inline size="mini"/>}</Table.Cell>
            <Table.Cell>{table.daily.snowfall.normal || <Loader active  inline size="mini"/>}</Table.Cell>
            <Table.Cell>{table.daily.snowfall.highest || <Loader active  inline size="mini"/>}</Table.Cell>
            <Table.Cell>{table.daily.snowfall.lowest || <Loader active  inline size="mini"/>}</Table.Cell>
          </Table.Row>
        </Table.Body>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell className="left header">Month-To-Date</Table.HeaderCell>
            <Table.HeaderCell>Observed</Table.HeaderCell>
            <Table.HeaderCell>Normal</Table.HeaderCell>
            <Table.HeaderCell>Record Highest</Table.HeaderCell>
            <Table.HeaderCell>Record Lowest</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          <Table.Row>
            <Table.Cell className="left">{this.getChartButton("Month-To-Date Precipitation")}Precipitation</Table.Cell>
            <Table.Cell>{table.monthly.precipitation.observed || <Loader active  inline size="mini"/>}</Table.Cell>
            <Table.Cell>{table.monthly.precipitation.normal || <Loader active  inline size="mini"/>}</Table.Cell>
            <Table.Cell>{table.monthly.precipitation.highest || <Loader active  inline size="mini"/>}</Table.Cell>
            <Table.Cell>{table.monthly.precipitation.lowest || <Loader active  inline size="mini"/>}</Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell className="left">{this.getChartButton("Month-To-Date Snowfall")}Snowfall</Table.Cell>
            <Table.Cell>{table.monthly.snowfall.observed || <Loader active  inline size="mini"/>}</Table.Cell>
            <Table.Cell>{table.monthly.snowfall.normal || <Loader active  inline size="mini"/>}</Table.Cell>
            <Table.Cell>{table.monthly.snowfall.highest || <Loader active  inline size="mini"/>}</Table.Cell>
            <Table.Cell>{table.monthly.snowfall.lowest || <Loader active  inline size="mini"/>}</Table.Cell>
          </Table.Row>
        </Table.Body>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell className="left header">Season-To-Date</Table.HeaderCell>
            <Table.HeaderCell>Observed</Table.HeaderCell>
            <Table.HeaderCell>Normal</Table.HeaderCell>
            <Table.HeaderCell>Record Highest</Table.HeaderCell>
            <Table.HeaderCell>Record Lowest</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          <Table.Row>
            <Table.Cell className="left">{this.getChartButton("Season-To-Date Snowfall")}Snowfall</Table.Cell>
            <Table.Cell>{table.seasonal.snowfall.observed || <Loader active  inline size="mini"/>}</Table.Cell>
            <Table.Cell>{table.seasonal.snowfall.normal || <Loader active  inline size="mini"/>}</Table.Cell>
            <Table.Cell>{table.seasonal.snowfall.highest || <Loader active  inline size="mini"/>}</Table.Cell>
            <Table.Cell>{table.seasonal.snowfall.lowest || <Loader active  inline size="mini"/>}</Table.Cell>
          </Table.Row>
        </Table.Body>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell className="left header">Year-To-Date</Table.HeaderCell>
            <Table.HeaderCell>Observed</Table.HeaderCell>
            <Table.HeaderCell>Normal</Table.HeaderCell>
            <Table.HeaderCell>Record Highest</Table.HeaderCell>
            <Table.HeaderCell>Record Lowest</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          <Table.Row>
            <Table.Cell className="left">{this.getChartButton("Year-To-Date Precipitation")}Precipitation</Table.Cell>
            <Table.Cell>{table.yearly.precipitation.observed || <Loader active  inline size="mini"/>}</Table.Cell>
            <Table.Cell>{table.yearly.precipitation.normal || <Loader active  inline size="mini"/>}</Table.Cell>
            <Table.Cell>{table.yearly.precipitation.highest || <Loader active  inline size="mini"/>}</Table.Cell>
            <Table.Cell>{table.yearly.precipitation.lowest || <Loader active  inline size="mini"/>}</Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table>
    )
  }
}

export default ClimateTable
