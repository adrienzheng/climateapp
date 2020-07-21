import React from 'react'
import axios from 'axios'
import _ from "lodash"

import Highcharts from "highcharts/highstock"
import HighchartsReact from "highcharts-react-official"

class ClimateChart extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      chartOptions: {
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
            dataLabels: {
                enabled: true
            },
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
  }

  getChartData = () => {
    const {chartOptions} = this.state
    const {id, date, currentDataPoint} = this.props
    let params
    switch(currentDataPoint) {
      case "Daily Max Temperature":
        params = {
          sid: id,
          sdate: "por" + date.substring(4),
          edate: date,
          meta: "",
          elems: [
            {name: "maxt", interval: [1,0,0]},
            {name: "maxt", interval: [1,0,0], normal: 1}
          ]
        }
        chartOptions.title.text = "Daily Max Temperature"
        chartOptions.yAxis.title.text = "Temperature (°F)"
        axios
          .get("http://data.rcc-acis.org/StnData", {params: {params: params}})
          .then(res => {
            let series = res.data.data
            console.log(series)
            chartOptions.xAxis.categories = _.range(parseInt(series[0][0].substring(0, 4)), parseInt(date.substring(0, 4))+1)
            console.log(chartOptions.xAxis.categories)
            let maxt = [], normal = []
            series.forEach(elem => {
              maxt.push(elem[1])
              normal.push(elem[2])
            })
            chartOptions.series = [
              {data: maxt, name: "Daily Max Temperature"},
              {data: normal, name: "Daily Max Temperature Normal"}
            ]
            this.setState({chartOptions: chartOptions})
          })
          .catch(err => console.log(err))
    }
  }

  componentDidUpdate = (prevProps) => {
    if(prevProps !== this.props){
      this.getChartData()
    }
  }

  render() {
    const {
      chartOptions
    } = this.state

    return (
      <HighchartsReact
        highcharts={Highcharts}
        options={chartOptions}
      />
    )
  }
}

export default ClimateChart