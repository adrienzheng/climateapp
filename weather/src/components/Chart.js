import React from 'react'
import axios from 'axios'
import _ from "lodash"

import Highcharts from "highcharts/highstock"
import HighchartsReact from "highcharts-react-official"

class ClimateChart extends React.Component {
  constructor(props) {
    super(props)
    this.chart = React.createRef()
    this.state = {
      chart: {
        type: "line",
        zoomType: "x"
      },
      title: {
        text: ""
      },
      xAxis: {
        categories: _.range(1940, 2020+1)
      },
      yAxis: {
        title: {
          text: ""
        }
      },
      plotOptions: {
        line: {
          enableMouseTracking: true
        }
      },
      series: [
        {
          data:[],
          name: ""
        }
      ]
    }
  }

  getUnit = () => {
    if (this.props.currentDataPoint.includes("Temperature")) {
      return "°F"
    } else {
      return "Inches"
    }
  }

  getChartData = () => {
    let chartObj = this.chart.current.chart
    chartObj.showLoading()
    const {id, date, currentDataPoint} = this.props
    let params = {
      sid: id,
      sdate: "por" + date.substring(4),
      edate: date,
      meta: "",
      elems: null
    }
    switch(currentDataPoint) {
      case "Daily Max Temperature":
        params.elems = [
          {name: "maxt", interval: [1,0,0]},
          {name: "maxt", interval: [1,0,0], normal: 1}
        ]
        break
      case "Daily Min Temperature":
        params.elems = [
          {name: "mint", interval: [1,0,0]},
          {name: "mint", interval: [1,0,0], normal: 1}
        ]
        break
      case "Daily Average Temperature":
        params.elems = [
          {name: "avgt", interval: [1,0,0]},
          {name: "avgt", interval: [1,0,0], normal: 1}
        ]
        break
      case "Daily Precipitation":
        params.elems = [
          {name: "pcpn", interval: [1,0,0]},
          {name: "pcpn", interval: [1,0,0], normal: 1}
        ]
        break
      case "Daily Snowdepth":
        params.elems = [
          {name: "snwd", interval: [1,0,0]}
        ]
        break
      case "Daily Snowfall":
        params.elems = [
          {name: "snow", interval: [1,0,0]},
          {name: "snow", interval: [1,0,0], normal: 1}
        ]
        break
      case "Month-To-Date Precipitation":
        params.elems = [
          {name: "pcpn", interval: [1,0,0], duration:"mtd", reduce: "sum"},
          {name: "pcpn", interval: [1,0,0], duration:"mtd", reduce: "sum", normal: 1}
        ]
        break
      case "Month-To-Date Snowfall":
        params.elems = [
          {name: "snow", interval: [1,0,0], duration:"mtd", reduce: "sum"},
          {name: "snow", interval: [1,0,0], duration:"mtd", reduce: "sum", normal: 1}
        ]
        break
      case "Season-To-Date Snowfall":
        params.elems = [
          {name: "snow", interval: [1,0,0], duration:"std", season_start: "10-01", reduce: "sum"},
          {name: "snow", interval: [1,0,0], duration:"std", season_start: "10-01", reduce: "sum", normal: 1}
        ]
        break
      case "Year-To-Date Precipitation":
      params.elems = [
        {name: "pcpn", interval: [1,0,0], duration:"ytd", reduce: "sum"},
        {name: "pcpn", interval: [1,0,0], duration:"ytd", reduce: "sum", normal: 1}
      ]
        break

      default:
        break
    }
    axios
      .get("http://data.rcc-acis.org/StnData", {params: {params: params}})
      .then(res => {
        let data = res.data.data
        let categories = _.range(parseInt(data[0][0].substring(0, 4)), parseInt(date.substring(0, 4))+1)
        let observed = [], normal = []
        data.forEach(elem => {
          if (elem[1] === "M") {
            observed.push(null)
          } else if (elem[1] === "T") {
            observed.push(0)
          } else {
            observed.push(Number(elem[1]))
          }
          normal.push(elem[2] ? Number(elem[2]) : null)
        })
        let series = [
          {data: observed, name: currentDataPoint+ " (" + this.getUnit()+ ")" },
        ]
        // data[0].length>2 && series.push({data: normal, name: "Normal (" + this.getUnit()+")", marker: {enabled: false}})
        let yAxis
        data[0].length>2 ? (
          yAxis = {
            title: {
              text: this.getUnit()
            },
            plotLines: [
              {
                value: normal[0],
                label: {text: "Normal (" + this.getUnit()+"): "+normal[0], align: "right"},
                color: "green",
                width: 2,
                zIndex: 5,
              }
            ]
          }
        ) : (
          yAxis = {
            title: {
              text: this.getUnit()
            }
          }
        )
        this.setState({
          title: {text: currentDataPoint},
          xAxis: {categories: categories},
          yAxis: yAxis,
          series: series
        })
        chartObj.hideLoading()
      })
      .catch(err => console.log(err))
  }

  componentDidUpdate = (prevProps) => {
    if(prevProps !== this.props){
      this.getChartData()
    }
  }

  render() {

    return (
      <HighchartsReact
        highcharts={Highcharts}
        options={this.state}
        ref={this.chart}
      />
    )
  }
}

export default ClimateChart