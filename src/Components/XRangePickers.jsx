import React, { Component } from "react"
import { provideAxis } from "react-jsx-highcharts"
import Input from "@material-ui/core/Input"
import { makeStyles } from "@material-ui/core/styles"

const useStyles = makeStyles({
  container: {
    display: "flex",
    flexWrap: "wrap"
  },
  input: {
    margin: "1rem"
  }
})

class XRangePickers extends Component {
  constructor(props) {
    console.log("X RANGE PICKERS")
    super(props)

    console.log(props)

    this.classes = useStyles()
    this.state = {
      min: null,
      max: null
    }
  }

  componentDidMount() {
    const { getHighcharts, getAxis } = this.props
    const Highcharts = getHighcharts() // Get Highcharts injected via withHighcharts
    const axis = getAxis()

    Highcharts.addEvent(
      axis.object,
      "afterSetExtremes",
      this.handleAfterSetExtremes
    )

    const { min, max } = axis.getExtremes()
    this.setState({
      min,
      max
    })
  }

  componentWillUnmount() {
    const { getHighcharts, getAxis } = this.props
    const Highcharts = getHighcharts() // Get Highcharts injected via withHighcharts

    Highcharts.removeEvent(
      getAxis().object,
      "afterSetExtremes",
      this.handleAfterSetExtremes
    )
  }

  render() {
    const { min, max } = this.state;

    return (
      <div className="x-range-pickers">
        <Input
          defaultValue={min}
          className={this.classes.input}
          inputProps={{
            "aria-label": "Description"
          }}
        />
        <Input
          defaultValue={max}
          className={this.classes.input}
          inputProps={{
            "aria-label": "Description"
          }}
        />
      </div>
    )
  }
}
export default provideAxis(XRangePickers)
