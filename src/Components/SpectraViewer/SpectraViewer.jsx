import React, { useEffect } from "react"
import { useQuery } from "react-apollo-hooks"
import { GET_ACTIVE_SPECTRA, GET_CHART_OPTIONS } from "../../client/queries"
import Highcharts from "highcharts"
import {
  withHighcharts,
  HighchartsChart,
  YAxis,
  Credits,
  Legend,
  Tooltip,
  provideAxis,
  Chart /* etc... */
} from "react-jsx-highcharts"
import XRangePickers from "./XRangePickers"
import { XAxis } from "react-jsx-highcharts"
import SpectrumSeries from "./SpectrumSeries"
import applyExporting from "highcharts/modules/exporting"
import applyExportingData from "highcharts/modules/export-data"
import fixLogScale from "./fixLogScale"
import DEFAULT_OPTIONS from "./ChartOptions"
import update from "immutability-helper"

applyExporting(Highcharts)
applyExportingData(Highcharts)
fixLogScale(Highcharts)

const SpectraViewer = ({ spectraInfo }) => {
  const {
    data: { activeSpectra }
  } = useQuery(GET_ACTIVE_SPECTRA)
  const {
    data: { chartOptions }
  } = useQuery(GET_CHART_OPTIONS)
  let {
    plotOptions,
    xAxis,
    yAxis,
    chart,
    navigation,
    exporting,
    legend,
    tooltip
  } = DEFAULT_OPTIONS
  yAxis = update(yAxis, {
    labels: { enabled: { $set: chartOptions.showY || chartOptions.logScale } },
    gridLineWidth: { $set: chartOptions.showGrid ? 1 : 0 }
  })

  xAxis = update(xAxis, {
    labels: { enabled: { $set: chartOptions.showX } },
    gridLineWidth: { $set: chartOptions.showGrid ? 1 : 0 }
  })

  const ids = activeSpectra.filter(i => i)

  return ids.length ? (
    <div className="spectra-viewer"  style={{position: 'relative'}}>
      <HighchartsChart
        plotOptions={plotOptions}
        navigation={navigation}
        exporting={exporting}
      >
        <Chart {...chart}/>
        <Legend {...legend} />
        <Tooltip {...tooltip} />
        <YAxis
          id="yAx1"
          {...yAxis}
          reversed={chartOptions.logScale}
          max={chartOptions.logScale ? 6 : 1}
          min={0}
        >
          {ids
            .filter(i => spectraInfo[i] && spectraInfo[i].subtype !== "EX")
            .map(id => (
              <SpectrumSeries key={id} id={id} {...chartOptions} />
            ))}
        </YAxis>
        <YAxis
          id="yAx2"
          {...yAxis}
          labels={{
            ...yAxis.labels,
            enabled: chartOptions.scaleEC,
            style: { fontWeight: 600 }
          }}
          opposite
          maxPadding={0.0}
          reversed={chartOptions.logScale}
          max={chartOptions.scaleEC ? null : chartOptions.logScale ? 6 : 1}
          min={0}
        >
          {ids
            .filter(i => spectraInfo[i] && spectraInfo[i].subtype === "EX")
            .map(id => (
              <SpectrumSeries key={id} id={id} {...chartOptions} />
            ))}
        </YAxis>

        <XAxisWithRange options={xAxis} initialRange={chartOptions.extremes} />
        <MyCredits axisId="yAx2">fpbase.org</MyCredits>
      </HighchartsChart>
    </div>
  ) : null
}

const MyCredits = provideAxis(function MyCredits({ getAxis, getHighcharts }) {
  useEffect(() => {
    const axis = getAxis()
    function shiftCredits() {
      const yShift = axis.object.chart.get("xAxis").axisTitleMargin
      axis.object.chart.credits.update({
        position: { y: -25 - yShift, x: -25 - axis.object.axisTitleMargin }
      })
    }
    const Highcharts = getHighcharts()
    Highcharts.addEvent(axis.object.chart, "redraw", shiftCredits)
    shiftCredits()
  }, []) // eslint-disable-line

  return <Credits position={{ y: -45 }}>fpbase.org</Credits>
})

export const XAxisWithRange = ({ options, initialRange}) => {
  return (
    <>
      <XAxis {...options} id="xAxis">
        <XAxis.Title style={{ display: "none" }}>Wavelength</XAxis.Title>
      </XAxis>
      <XRangePickers axisId="xAxis" initialRange={initialRange} visible={options.labels.enabled}/>
    </>
  )
}

export default withHighcharts(SpectraViewer, Highcharts)
