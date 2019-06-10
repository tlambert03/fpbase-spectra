import React, { useState, useEffect, useRef } from "react"
import { useMutation } from "react-apollo-hooks"
import { provideAxis } from "react-jsx-highcharts"
import Input from "@material-ui/core/Input"
import gql from "graphql-tag"
import { debounce } from "../util"

const CLASSES = {
  minInput: {
    fontWeight: "bold",
    fontSize: "0.75rem",
    width: 30,
    color: "#99121F",
    position: "absolute",
  },
  maxInput: {
    position: "absolute",
    fontWeight: "bold",
    fontSize: "0.75rem",
    width: 30,
    color: "#99121F"
  }
}

const MUTATE_CHART_EXTREMES = gql`
  mutation SetChartExtremes($extremes: [Float]!) {
    setChartExtremes(extremes: $extremes) @client
  }
`

const XRangePickers = ({ getAxis, getHighcharts, initialRange, visible }) => {
  const [[min, max], setState] = useState(initialRange || [null, null])
  const axis = getAxis()
  const minNode = useRef()
  const maxNode = useRef()
  const mutateExtremes = useMutation(MUTATE_CHART_EXTREMES)

  useEffect(() => {
    if (min || max) {
      axis.setExtremes(min, max)
      if (min && max) {
        axis.object.chart.showResetZoom()
      }
    }
  }, []) // eslint-disable-line

  useEffect(() => {
    function handleAfterSetExtremes(e) {
      e && setState([e.userMin && e.min, e.userMax && e.max])
    }

    function updateStore(e) {
      if (e) {
        const extremes = [e.userMin && e.min, e.userMax && e.max]
        mutateExtremes({ variables: { extremes } })
      }
    }

    function hideEdgeLabels(e) {
      if (axis.object.labelGroup && minNode.current) {
        let leftPad = -5
        if (axis.object.chart.get("yAx1")) {
          leftPad += +axis.object.chart.get("yAx1").axisTitleMargin
        }
        let rightPad = 0
        if (axis.object.chart.get("yAx2")) {
          rightPad += +axis.object.chart.get("yAx2").axisTitleMargin
        }
        minNode.current.parentElement.style.left = `${leftPad}px`
        maxNode.current.parentElement.style.right = `${rightPad}px`
        axis.object.labelGroup.element.childNodes.forEach(
          node => (node.style.display = "block")
        )
        const { min, max } = axis.getExtremes()
        axis.object.labelGroup.element.childNodes.forEach(node => {
          if (
            Math.min(
              Math.abs(node.textContent - min),
              Math.abs(node.textContent - max)
            ) <
            0.4 * axis.object.tickInterval
          ) {
            node.style.display = "none"
          }
        })
      }
    }

    const Highcharts = getHighcharts()
    Highcharts.addEvent(axis.object, "afterSetExtremes", handleAfterSetExtremes)
    Highcharts.addEvent(
      axis.object,
      "afterSetExtremes",
      debounce(updateStore, 200)
    )
    Highcharts.addEvent(axis.object.chart, "redraw", hideEdgeLabels)
    handleAfterSetExtremes()
    hideEdgeLabels()
    return () => {
      Highcharts.removeEvent(
        getAxis().object,
        "afterSetExtremes",
        handleAfterSetExtremes
      )
      Highcharts.removeEvent(
        getAxis().object,
        "afterSetExtremes",
        debounce(updateStore, 100)
      )
    }
  }, []) // eslint-disable-line

  const updateRange = () => {
    const extremes = [
      +minNode.current.value || null,
      +maxNode.current.value || null
    ]
    axis.setExtremes(...extremes)
  }
  const handleKeyPress = e => {
    if (e.key === "Enter") {
      updateRange()
      e.target.select()
    }
  }

  const extremes = axis.getExtremes()
  return (
    <div
      className="x-range-pickers"
      style={{
        height: 0,
        position: "relative",
        bottom: 38,
        display: visible ? "block" : "none"
      }}
    >
      <Input
        name="min"
        type="text"
        placeholder={`${extremes.dataMin}`}
        value={Math.round(min) || ""}
        inputRef={minNode}
        onChange={e => setState([e.target.value, max])}
        onKeyPress={handleKeyPress}
        onBlur={updateRange}
        style={CLASSES.minInput}
        inputProps={{ style: { textAlign: "center" } }}
      />
      <Input
        name="max"
        type="text"
        placeholder={`${extremes.dataMax}`}
        value={Math.round(max) || ""}
        inputRef={maxNode}
        onChange={e => setState([min, e.target.value])}
        onKeyPress={handleKeyPress}
        onBlur={updateRange}
        style={CLASSES.maxInput}
        inputProps={{ style: { textAlign: "center" } }}
      />
    </div>
  )
}
export default provideAxis(XRangePickers)
