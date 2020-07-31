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
          maxtemp: {observed: "N/A", normal: "N/A", highest: "N/A", lowest: "N/A"},
          mintemp: {observed: "N/A", normal: "N/A", highest: "N/A", lowest: "N/A"},
          avetemp: {observed: "N/A", normal: "N/A", highest: "N/A", lowest: "N/A"},
          precipitation: {observed: "N/A", normal: "N/A", highest: "N/A", lowest: "N/A"},
          snowfall: {observed: "N/A", normal: "N/A", highest: "N/A", lowest: "N/A"},
          snowdepth: {observed: "N/A", normal: "——", highest: "N/A", lowest: "N/A"}
        },
        monthly: {
          precipitation: {observed: "N/A", normal: "N/A", highest: "N/A", lowest: "N/A"},
          snowfall: {observed: "N/A", normal: "N/A", highest: "N/A", lowest: "N/A"}
        },
        seasonal: {
          snowfall: {observed: "N/A", normal: "N/A", highest: "N/A", lowest: "N/A"}
        },
        yearly: {
          precipitation: {observed: "N/A", normal: "N/A", highest: "N/A", lowest: "N/A"},
        }
      },
      loading: false
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
      this.setState({loading: true})
      let params1 = {
        sid: id,
        date: date,
        meta: "name",
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

      let params2 = {
        sid: id,
        sdate: "por" + date.substring(4),
        edate: date,
        meta: "name",
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

      let params3 = {
        sid: id,
        date: date,
        meta: "name",
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

      let params4 = {
        sid: id,
        sdate: "por" + date.substring(4),
        edate: date,
        meta: "name",
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

      const request1 = axios.get("http://data.rcc-acis.org/StnData", {params: {params: params1}})
      const request2 = axios.get("http://data.rcc-acis.org/StnData", {params: {params: params2}})
      const request3 = axios.get("http://data.rcc-acis.org/StnData", {params: {params: params3}})
      const request4 = axios.get("http://data.rcc-acis.org/StnData", {params: {params: params4}})

      axios.all([request1, request2, request3, request4]).then(axios.spread((...responses) => {
        let data1 = responses[0].data.data[0]
        let data2 = responses[1].data.smry
        let data3 = responses[2].data.data[0]
        let data4 = responses[3].data.smry
        // console.log(responses[0].data)
        // console.log(data1, data2, data3, data4)
        let temptable = table
        temptable.daily.maxtemp.observed = data1[1]!=="M" ? data1[1]+" °F" : "N/A"
        temptable.daily.maxtemp.normal = data1[2]!=="M" ? data1[2]+" °F" : "N/A"
        temptable.daily.mintemp.observed = data1[3]!=="M" ? data1[3]+" °F" : "N/A"
        temptable.daily.mintemp.normal = data1[4]!=="M" ? data1[4]+" °F" : "N/A"
        temptable.daily.avetemp.observed = data1[5]!=="M" ? data1[5]+" °F" : "N/A"
        temptable.daily.avetemp.normal = data1[6]!=="M" ? data1[6]+" °F" : "N/A"
        temptable.daily.precipitation.observed = data1[7]==="T" ? "Trace" : (data1[7]!=="M" ? data1[7]+" inches" : "N/A")
        temptable.daily.precipitation.normal = data1[8]==="T" ? "Trace" : (data1[8]!=="M" ? data1[8]+" inches" : "N/A")
        temptable.daily.snowfall.observed = data1[9]==="T" ? "Trace" : (data1[9]!=="M" ? data1[9]+" inches" : "N/A")
        temptable.daily.snowfall.normal = data1[10]==="T" ? "Trace" : (data1[10]!=="M" ? data1[10]+" inches" : "N/A")
        temptable.daily.snowdepth.observed = data1[11]==="T" ? "Trace" : (data1[11]!=="M" ? data1[11]+" inches" : "N/A")

        temptable.daily.maxtemp.highest = data2[0][0]!== "M" ? data2[0][0] + " °F (" + data2[0][1].slice(0,4) + ")" : "N/A"
        temptable.daily.maxtemp.lowest = data2[1][0]!== "M" ? data2[1][0] + " °F (" + data2[1][1].slice(0,4) + ")" : "N/A"
        temptable.daily.mintemp.highest = data2[2][0]!== "M" ? data2[2][0] + " °F (" + data2[2][1].slice(0,4) + ")" : "N/A"
        temptable.daily.mintemp.lowest = data2[3][0]!== "M" ? data2[3][0] + " °F (" + data2[3][1].slice(0,4) + ")" : "N/A"
        temptable.daily.avetemp.highest = data2[4][0]!== "M" ? data2[4][0] + " °F (" + data2[4][1].slice(0,4) + ")" : "N/A"
        temptable.daily.avetemp.lowest = data2[5][0]!== "M" ? data2[5][0] + " °F (" + data2[5][1].slice(0,4) + ")" : "N/A"
        temptable.daily.precipitation.highest = data2[6][0]==="T" ? "Trace" : (data2[6][0]!== "M" ? data2[6][0] + " inches (" + data2[6][1].slice(0,4) + ")" : "N/A")
        temptable.daily.precipitation.lowest = data2[6][0]==="T" ? "Trace" : (data2[7][0]!== "M" ? data2[7][0] + " inches (" + data2[7][1].slice(0,4) + ")" : "N/A")
        temptable.daily.snowfall.highest = data2[6][0]==="T" ? "Trace" : (data2[8][0]!== "M" ? data2[8][0] + " inches (" + data2[8][1].slice(0,4) + ")" : "N/A")
        temptable.daily.snowfall.lowest = data2[6][0]==="T" ? "Trace" : (data2[9][0]!== "M" ? data2[9][0] + " inches (" + data2[9][1].slice(0,4) + ")" : "N/A")
        temptable.daily.snowdepth.highest = data2[6][0]==="T" ? "Trace" : (data2[10][0]!== "M" ? data2[10][0] + " inches (" + data2[10][1].slice(0,4) + ")" : "N/A")
        temptable.daily.snowdepth.lowest = data2[6][0]==="T" ? "Trace" : (data2[11][0]!== "M" ? data2[11][0] + " inches (" + data2[11][1].slice(0,4) + ")" : "N/A")

        temptable.monthly.precipitation.observed = data3[1]!=="T" ? (data3[1]!=="M" ? data3[1] + " inches" : "N/A") : "Trace"
        temptable.monthly.precipitation.normal = data3[2]!=="T" ? (data3[2]!=="M" ? data3[2] + " inches" : "N/A") : "Trace"
        temptable.monthly.snowfall.observed = data3[3]!=="T" ? (data3[3]!=="M" ? data3[3] + " inches" : "N/A") : "Trace"
        temptable.monthly.snowfall.normal = data3[4]!=="T" ? (data3[4]!=="M" ? data3[4] + " inches" : "N/A") : "Trace"
        temptable.seasonal.snowfall.observed = data3[5]!=="T" ? (data3[5]!=="M" ? data3[5] + " inches" : "N/A") : "Trace"
        temptable.seasonal.snowfall.normal = data3[6]!=="T" ? (data3[6]!=="M" ? data3[6] + " inches" : "N/A") : "Trace"
        temptable.yearly.precipitation.observed = data3[7]!=="T" ? (data3[7]!=="M" ? data3[7] + " inches" : "N/A") : "Trace"
        temptable.yearly.precipitation.normal = data3[8]!=="T" ? (data3[8]!=="M" ? data3[8] + " inches" : "N/A") : "Trace"

        temptable.monthly.precipitation.highest = data4[0][0] === "M" ? "N/A" : (data4[0][0] === "T" ? "Trace" : data4[0][0] + " inches") + " (" + data4[0][1].slice(0,4) + ")"
        temptable.monthly.precipitation.lowest = data4[1][0] === "M" ? "N/A" : (data4[1][0] === "T" ? "Trace" : data4[1][0] + " inches") + " (" + data4[1][1].slice(0,4) + ")"
        temptable.monthly.snowfall.highest = data4[2][0] === "M" ? "N/A" : (data4[2][0] === "T" ? "Trace" : data4[2][0] + " inches") + " (" + data4[2][1].slice(0,4) + ")"
        temptable.monthly.snowfall.lowest = data4[3][0] === "M" ? "N/A" : (data4[3][0] === "T" ? "Trace" : data4[3][0] + " inches") + " (" + data4[3][1].slice(0,4) + ")"
        temptable.seasonal.snowfall.highest = data4[4][0] === "M" ? "N/A" : (data4[4][0] === "T" ? "Trace" : data4[4][0] + " inches") + " (" + data4[4][1].slice(0,4) + ")"
        temptable.seasonal.snowfall.lowest = data4[5][0] === "M" ? "N/A" : (data4[5][0] === "T" ? "Trace" : data4[5][0] + " inches") + " (" + data4[5][1].slice(0,4) + ")"
        temptable.yearly.precipitation.highest = data4[6][0] === "M" ? "N/A" : (data4[6][0] === "T" ? "Trace" : data4[6][0] + " inches") + " (" + data4[6][1].slice(0,4) + ")"
        temptable.yearly.precipitation.lowest = data4[7][0] === "M" ? "N/A" : (data4[7][0] === "T" ? "Trace" : data4[7][0] + " inches") + " (" + data4[7][1].slice(0,4) + ")"

        this.setState({table: temptable, loading: false})
      })).catch(err => console.log(err))
      
    } else {
      let temptable = {
        daily: {
          maxtemp: {observed: "N/A", normal: "N/A", highest: "N/A", lowest: "N/A"},
          mintemp: {observed: "N/A", normal: "N/A", highest: "N/A", lowest: "N/A"},
          avetemp: {observed: "N/A", normal: "N/A", highest: "N/A", lowest: "N/A"},
          precipitation: {observed: "N/A", normal: "N/A", highest: "N/A", lowest: "N/A"},
          snowfall: {observed: "N/A", normal: "N/A", highest: "N/A", lowest: "N/A"},
          snowdepth: {observed: "N/A", normal: "——", highest: "N/A", lowest: "N/A"}
        },
        monthly: {
          precipitation: {observed: "N/A", normal: "N/A", highest: "N/A", lowest: "N/A"},
          snowfall: {observed: "N/A", normal: "N/A", highest: "N/A", lowest: "N/A"}
        },
        seasonal: {
          snowfall: {observed: "N/A", normal: "N/A", highest: "N/A", lowest: "N/A"}
        },
        yearly: {
          precipitation: {observed: "N/A", normal: "N/A", highest: "N/A", lowest: "N/A"},
        }
      }
      this.setState({table: temptable})
    }
  }

  componentDidUpdate = (prevProps) => {
    if(prevProps.id !== this.props.id || prevProps.date !== this.props.date){
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
      table,
      loading
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
            <Table.HeaderCell className="left">{this.getChartButton("Daily Max Temperature")}Max Temperature</Table.HeaderCell>
            <Table.Cell>{!loading ? table.daily.maxtemp.observed : <Loader active  inline size="mini"/>}</Table.Cell>
            <Table.Cell>{!loading ? table.daily.maxtemp.normal : <Loader active  inline size="mini"/>}</Table.Cell>
            <Table.Cell>{!loading ? table.daily.maxtemp.highest : <Loader active  inline size="mini"/>}</Table.Cell>
            <Table.Cell>{!loading ? table.daily.maxtemp.lowest : <Loader active  inline size="mini"/>}</Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell className="left">{this.getChartButton("Daily Min Temperature")}Min Temperature</Table.Cell>
            <Table.Cell>{!loading ? table.daily.mintemp.observed : <Loader active  inline size="mini"/>}</Table.Cell>
            <Table.Cell>{!loading ? table.daily.mintemp.normal : <Loader active  inline size="mini"/>}</Table.Cell>
            <Table.Cell>{!loading ? table.daily.mintemp.highest : <Loader active  inline size="mini"/>}</Table.Cell>
            <Table.Cell>{!loading ? table.daily.mintemp.lowest : <Loader active  inline size="mini"/>}</Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell className="left">{this.getChartButton("Daily Average Temperature")}Avrg Temperature</Table.Cell>
            <Table.Cell>{!loading ? table.daily.avetemp.observed : <Loader active  inline size="mini"/>}</Table.Cell>
            <Table.Cell>{!loading ? table.daily.avetemp.normal : <Loader active  inline size="mini"/>}</Table.Cell>
            <Table.Cell>{!loading ? table.daily.avetemp.highest : <Loader active  inline size="mini"/>}</Table.Cell>
            <Table.Cell>{!loading ? table.daily.avetemp.lowest : <Loader active  inline size="mini"/>}</Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell className="left">{this.getChartButton("Daily Precipitation")}Precipitation</Table.Cell>
            <Table.Cell>{!loading ? table.daily.precipitation.observed : <Loader active  inline size="mini"/>}</Table.Cell>
            <Table.Cell>{!loading ? table.daily.precipitation.normal : <Loader active  inline size="mini"/>}</Table.Cell>
            <Table.Cell>{!loading ? table.daily.precipitation.highest : <Loader active  inline size="mini"/>}</Table.Cell>
            <Table.Cell>{!loading ? table.daily.precipitation.lowest : <Loader active  inline size="mini"/>}</Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell className="left">{this.getChartButton("Daily Snowdepth")}Snowdepth</Table.Cell>
            <Table.Cell>{!loading ? table.daily.snowdepth.observed : <Loader active  inline size="mini"/>}</Table.Cell>
            <Table.Cell disabled>{!loading ? table.daily.snowdepth.normal : <Loader active  inline size="mini"/>}</Table.Cell>
            <Table.Cell>{!loading ? table.daily.snowdepth.highest : <Loader active  inline size="mini"/>}</Table.Cell>
            <Table.Cell>{!loading ? table.daily.snowdepth.lowest : <Loader active  inline size="mini"/>}</Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell className="left">{this.getChartButton("Daily Snowfall")}Snowfall</Table.Cell>
            <Table.Cell>{!loading ? table.daily.snowfall.observed : <Loader active  inline size="mini"/>}</Table.Cell>
            <Table.Cell>{!loading ? table.daily.snowfall.normal : <Loader active  inline size="mini"/>}</Table.Cell>
            <Table.Cell>{!loading ? table.daily.snowfall.highest : <Loader active  inline size="mini"/>}</Table.Cell>
            <Table.Cell>{!loading ? table.daily.snowfall.lowest : <Loader active  inline size="mini"/>}</Table.Cell>
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
            <Table.Cell>{!loading ? table.monthly.precipitation.observed : <Loader active  inline size="mini"/>}</Table.Cell>
            <Table.Cell>{!loading ? table.monthly.precipitation.normal : <Loader active  inline size="mini"/>}</Table.Cell>
            <Table.Cell>{!loading ? table.monthly.precipitation.highest : <Loader active  inline size="mini"/>}</Table.Cell>
            <Table.Cell>{!loading ? table.monthly.precipitation.lowest : <Loader active  inline size="mini"/>}</Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell className="left">{this.getChartButton("Month-To-Date Snowfall")}Snowfall</Table.Cell>
            <Table.Cell>{!loading ? table.monthly.snowfall.observed : <Loader active  inline size="mini"/>}</Table.Cell>
            <Table.Cell>{!loading ? table.monthly.snowfall.normal : <Loader active  inline size="mini"/>}</Table.Cell>
            <Table.Cell>{!loading ? table.monthly.snowfall.highest : <Loader active  inline size="mini"/>}</Table.Cell>
            <Table.Cell>{!loading ? table.monthly.snowfall.lowest : <Loader active  inline size="mini"/>}</Table.Cell>
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
            <Table.Cell>{!loading ? table.seasonal.snowfall.observed : <Loader active  inline size="mini"/>}</Table.Cell>
            <Table.Cell>{!loading ? table.seasonal.snowfall.normal : <Loader active  inline size="mini"/>}</Table.Cell>
            <Table.Cell>{!loading ? table.seasonal.snowfall.highest : <Loader active  inline size="mini"/>}</Table.Cell>
            <Table.Cell>{!loading ? table.seasonal.snowfall.lowest : <Loader active  inline size="mini"/>}</Table.Cell>
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
            <Table.Cell>{!loading ? table.yearly.precipitation.observed : <Loader active  inline size="mini"/>}</Table.Cell>
            <Table.Cell>{!loading ? table.yearly.precipitation.normal : <Loader active  inline size="mini"/>}</Table.Cell>
            <Table.Cell>{!loading ? table.yearly.precipitation.highest : <Loader active  inline size="mini"/>}</Table.Cell>
            <Table.Cell>{!loading ? table.yearly.precipitation.lowest : <Loader active  inline size="mini"/>}</Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table>
    )
  }
}

export default ClimateTable
