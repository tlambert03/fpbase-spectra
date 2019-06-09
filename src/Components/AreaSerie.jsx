import React, { useState, useEffect } from "react"
import { fetchSpectrum } from "./util"
import { AreaSplineSeries } from "react-jsx-highcharts"

const OD = num => (num <= 0 ? 10 : -Math.log10(num))

const SpectrumSeriesItem = React.memo(function SpectrumSeriesItem({
  serie,
  logScale
}) {
  let data = serie.data
  if (logScale) {
    data = serie.data.map(([a, b]) => [a, OD(b)])
  }
  return (
    <AreaSplineSeries {...serie} data={data} threshold={logScale ? 10 : 0} />
  )
})

const SpectrumItemContainer = React.memo(function SpectrumItemContainer({
  spectrumID,
  logScale
}) {
  const [serie, setSerie] = useState({})
  console.log("SpectrumItemContainer", serie)
  useEffect(() => {
    const fetchSeriesData = async () => {
      const data = await fetchSpectrum(spectrumID)
      setSerie(data)
    }
    fetchSeriesData()
  }, [spectrumID]) // eslint-disable-line react-hooks/exhaustive-deps

  return <SpectrumSeriesItem serie={serie} logScale={logScale} />
})

const SpectrumSeriesList = React.memo(function SpectrumSeriesList({
  currentSpectra,
  logScale
}) {
  console.log("SpectrumSeriesList", currentSpectra)
  return currentSpectra.map(cs => (
    <SpectrumItemContainer key={cs} spectrumID={cs} logScale={logScale} />
  ))
})

export default SpectrumSeriesList
