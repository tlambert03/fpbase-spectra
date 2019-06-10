import React, { memo } from "react"
import { useQuery } from "react-apollo-hooks"
import { GET_SPECTRUM } from "../../client/queries"
import { AreaSplineSeries } from "react-jsx-highcharts"

const OD = num => (num <= 0 ? 10 : -Math.log10(num))

const SpectrumSeries = memo(function SpectrumSeries({
  id,
  inverted,
  logScale,
  scaleEC,
  scaleQY
}) {
  const {
    data: { spectrum },
    loading
  } = useQuery(GET_SPECTRUM, { variables: { id } })
  if (!spectrum) return

  let serie = [...spectrum.data]
  const willScaleEC = Boolean(
    spectrum.subtype === "EX" && scaleEC && spectrum.owner.extCoeff
  )
  if (willScaleEC) {
    serie = serie.map(([a, b]) => [a, b * spectrum.owner.extCoeff])
  }
  if (spectrum.subtype === "EM") {
    if (scaleQY && spectrum.owner.qy) {
      serie = serie.map(([a, b]) => [a, b * spectrum.owner.qy])
    }
  }
  if (inverted) {
    serie = serie.map(([a, b]) => [a, 1 - b])
  }
  if (logScale) {
    serie = [...serie].map(([a, b]) => [a, OD(b)])
  }
  if (loading) return <></>

  let name = `${spectrum.owner.name}`
  if (["EX", "EM", "A_2P", "2P"].includes(spectrum.subtype)) {
    name += ` ${spectrum.subtype.replace("A_", "")}`
  }
  return (
    <AreaSplineSeries
      subtype={spectrum.subtype}
      scaleEC={willScaleEC}
      name={name}
      color={spectrum.color}
      className={`cat-${spectrum.category} subtype-${spectrum.subtype}`}
      data={serie}
      threshold={logScale ? 10 : 0}
    />
  )
})

export default SpectrumSeries
