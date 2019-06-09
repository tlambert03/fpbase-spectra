import React, { useState, useEffect, useRef } from "react"
import { provideAxis } from "react-jsx-highcharts"
import Input from "@material-ui/core/Input"

const CLASSES = {
  minInput: {
    fontWeight: "bold",
    fontSize: "0.75rem",
    width: 30,
    left: 0,
    color: "#99121F"
  },
  maxInput: {
    float: "right",
    fontWeight: "bold",
    fontSize: "0.75rem",
    width: 30,
    right: 0,
    color: "#99121F"
  }
}

const XRangePickers = ({ getAxis, getHighcharts }) => {
  const [{ min, max }, setState] = useState({ min: "", max: "" })
  const axis = getAxis()
  const minNode = useRef()
  const maxNode = useRef()

  useEffect(() => {

    function handleAfterSetExtremes(e) {
      if (e) setState({ min: e.userMin && e.min, max: e.userMax && e.max })
    }

    function hideEdgeLabels(e) {
      if (axis.object.labelGroup && minNode.current) {
        let leftPad = 0
        if (axis.object.chart.get('yAx1')){
          leftPad = +axis.object.chart.get('yAx1').axisTitleMargin
        }
        let rightPad = 0
        if (axis.object.chart.get('yAx2')){
          rightPad = -axis.object.chart.get('yAx2').axisTitleMargin
        }
        minNode.current.parentElement.style.left = `${leftPad}px`
        maxNode.current.parentElement.style.left = `${rightPad}px`
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
            axis.object.tickInterval / 2
          ) {
            node.style.display = "none"
          }
        })
      }
    }

    const Highcharts = getHighcharts()
    Highcharts.addEvent(axis.object, "afterSetExtremes", handleAfterSetExtremes)
    Highcharts.addEvent(axis.object.chart, "redraw", hideEdgeLabels)
    handleAfterSetExtremes()
    hideEdgeLabels()
    return () => {
      Highcharts.removeEvent(
        getAxis().object,
        "afterSetExtremes",
        handleAfterSetExtremes
      )
    }
  }, []) // eslint-disable-line

  const updateRange = () => {
    axis.setExtremes(
      +minNode.current.value || null,
      +maxNode.current.value || null
    )
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
      style={{ height: 0, position: "relative", bottom: 38 }}
    >
      <Input
        name="min"
        type="text"
        placeholder={`${extremes.dataMin}`}
        value={Math.round(min) || ""}
        inputRef={minNode}
        onChange={e => setState({ max, min: e.target.value })}
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
        onChange={e => setState({ min, max: e.target.value })}
        onKeyPress={handleKeyPress}
        onBlur={updateRange}
        style={CLASSES.maxInput}
        inputProps={{ style: { textAlign: "center" } }}
      />
    </div>
  )
}
export default provideAxis(XRangePickers)
