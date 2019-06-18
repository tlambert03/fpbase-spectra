import React from "react"
import Menu from "@material-ui/core/Menu"
import MenuItem from "@material-ui/core/MenuItem"
import ListItemIcon from "@material-ui/core/ListItemIcon"
import ListItemText from "@material-ui/core/ListItemText"
import DownloadIcon from "@material-ui/icons/GetApp"
import ChartIcon from "@material-ui/icons/InsertChart"
import PrintIcon from "@material-ui/icons/Print"
import LinkIcon from "@material-ui/icons/Link"
import Divider from "@material-ui/core/Divider"
import ShareIcon from "@material-ui/icons/Share"
import { useApolloClient } from "react-apollo-hooks"
import { GET_ACTIVE_SPECTRA, GET_CHART_OPTIONS } from "../client/queries"
import stateToUrl from "./stateToUrl"
import IconButton from "@material-ui/core/IconButton"
import Highcharts from "highcharts"

const ShareButton = () => {
  const [anchorEl, setAnchorEl] = React.useState(null)
  const chart = Highcharts.charts[0]

  function handleShareClick(event) {
    setAnchorEl(event.currentTarget)
  }

  function handleClose() {
    setAnchorEl(null)
  }

  function exportChart(format) {
    chart.exportChart({
      type: format,
      filename: "FPbaseSpectra"
    })
    setAnchorEl(null)
  }

  function printChart(format) {
    chart.print()
    setAnchorEl(null)
  }

  const client = useApolloClient()
  function shareURL() {
    async function pushHistory() {
      const {
        data: { activeSpectra }
      } = await client.query({ query: GET_ACTIVE_SPECTRA })
      const {
        data: { chartOptions }
      } = await client.query({ query: GET_CHART_OPTIONS })
      const qstring = stateToUrl(activeSpectra, chartOptions)

      window.history.pushState({}, null, qstring)
    }
    pushHistory()
    setAnchorEl(null)
  }

  const hasSeries = chart && chart.series.length > 0
  return (
    <div>
      <IconButton
        edge="end"
        color="inherit"
        aria-controls="simple-menu"
        aria-haspopup="true"
        onClick={handleShareClick}
      >
        <ShareIcon />
      </IconButton>
      <Menu
        id="simple-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        {hasSeries ? (
          <div>
            <MenuItem onClick={() => exportChart("image/svg+xml")}>
              <ListItemIcon>
                <DownloadIcon />
              </ListItemIcon>
              <ListItemText primary="Download chart as SVG vector graphic" />
            </MenuItem>
            <MenuItem onClick={() => exportChart("image/png")}>
              <ListItemIcon>
                <DownloadIcon />
              </ListItemIcon>
              <ListItemText primary="Download chart as PNG image" />
            </MenuItem>
            <MenuItem onClick={() => exportChart("application/pdf")}>
              <ListItemIcon>
                <DownloadIcon />
              </ListItemIcon>
              <ListItemText primary="Download chart as PDF document" />
            </MenuItem>
            <Divider />
            <MenuItem onClick={() => exportChart("application/pdf")}>
              <ListItemIcon>
                <ChartIcon />
              </ListItemIcon>
              <ListItemText primary="Download data as CSV" />
            </MenuItem>
            <Divider light />
            <MenuItem onClick={printChart}>
              <ListItemIcon>
                <PrintIcon />
              </ListItemIcon>
              <ListItemText primary="Print Chart" />
            </MenuItem>
            <Divider />
            <MenuItem onClick={shareURL}>
              <ListItemIcon>
                <LinkIcon />
              </ListItemIcon>
              <ListItemText primary="Share Chart as URL" />
            </MenuItem>
          </div>
        ) : (
          <MenuItem disabled>
            <ListItemText primary="Add data to chart to enable exporting" />
          </MenuItem>
        )}
      </Menu>
    </div>
  )
}

export default ShareButton
