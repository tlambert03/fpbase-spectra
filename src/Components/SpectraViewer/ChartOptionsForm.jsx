import React, { memo } from "react"
import Checkbox from "@material-ui/core/Checkbox"
import MUIListItem from "@material-ui/core/ListItem"
import FormControlLabel from "@material-ui/core/FormControlLabel"
import List from "@material-ui/core/List"
import { useMutation, useQuery } from "react-apollo-hooks"
import gql from "graphql-tag"
import { GET_CHART_OPTIONS } from "../../client/queries"

const toggleMut = param => gql`
mutation Toggle${param} {
  toggle${param} @client
}
`

const ChartOptionsForm = memo(function ChartOptionsForm({ options }) {
  const toggleY = useMutation(toggleMut("YAxis"))
  const toggleX = useMutation(toggleMut("XAxis"))
  const toggleGrid = useMutation(toggleMut("Grid"))
  const toggleLogScale = useMutation(toggleMut("LogScale"))
  const toggleScaleEC = useMutation(toggleMut("ScaleEC"))
  const toggleScaleQY = useMutation(toggleMut("ScaleQY"))
  const {
    data: { chartOptions }
  } = useQuery(GET_CHART_OPTIONS)
  return (
    <List dense>
      <ListCheckbox
        onCheckItem={toggleY}
        checked={chartOptions.showY}
        value="labels"
        name="Show Y Axis"
      />
      <ListCheckbox
        onCheckItem={toggleX}
        checked={chartOptions.showX}
        value="labels"
        name="Show X Axis"
      />
      <ListCheckbox
        onCheckItem={toggleGrid}
        checked={chartOptions.showGrid}
        value="labels"
        name="Show Grid"
      />
      <ListCheckbox
        onCheckItem={toggleLogScale}
        checked={chartOptions.logScale}
        value="labels"
        name="Log scale"
      />
      <ListCheckbox
        onCheckItem={toggleScaleEC}
        checked={chartOptions.scaleEC}
        value="labels"
        name="Scale Excitation to Extinction Coefficient"
      />
      <ListCheckbox
        onCheckItem={toggleScaleQY}
        checked={chartOptions.scaleQY}
        value="labels"
        name="Scale Emission to Quantum Yield"
      />
    </List>
  )
})
const ListCheckbox = memo(function ListCheckbox({
  onCheckItem,
  name,
  value,
  checked
}) {
  return (
    <MUIListItem>
      <FormControlLabel
        control={
          <Checkbox onChange={onCheckItem} checked={checked} value={value} />
        }
        label={name}
      />
    </MUIListItem>
  )
})

export default ChartOptionsForm
