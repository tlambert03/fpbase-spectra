import React from "react"
import { makeStyles } from "@material-ui/core/styles"
import AppBar from "@material-ui/core/AppBar"
import Toolbar from "@material-ui/core/Toolbar"
import IconButton from "@material-ui/core/IconButton"
import Fab from "@material-ui/core/Fab"

import SettingsIcon from "@material-ui/icons/Settings"
import AddIcon from "@material-ui/icons/Add"
import SearchModal from "./SearchModal"
import Drawer from "@material-ui/core/Drawer"
import OwnerOptionsForm from "./OwnerOptionsForm"
import ChartOptionsForm from "./SpectraViewer/ChartOptionsForm"
import Button from "@material-ui/core/Button"
import CloseIcon from "@material-ui/icons/Close"

import { useMutation, useQuery } from "react-apollo-hooks"
import { GET_CHART_OPTIONS } from "../client/queries"
import FormControlLabel from "@material-ui/core/FormControlLabel"
import Switch from "@material-ui/core/Switch"
import gql from "graphql-tag"
import ShareButton from "./ShareButton"

const useStyles = makeStyles(theme => ({
  text: {
    padding: theme.spacing(2, 2, 0)
  },
  paper: {
    paddingBottom: 50
  },
  list: {
    marginBottom: theme.spacing(2)
  },
  subheader: {
    backgroundColor: theme.palette.background.paper
  },
  appBar: {
    top: "auto",
    bottom: 0
  },
  grow: {
    flexGrow: 1
  },
  fabButton: {
    backgroundColor: "#3CA644",
    "&:hover": { backgroundColor: "#3A8B44" },
    "&:active": { backgroundColor: "#3CA644" },
    color: "white",
    position: "absolute",
    zIndex: 1,
    top: -30,
    left: 0,
    right: 0,
    margin: "0 auto"
  },
  fullList: {
    width: "auto",
    padding: 30,
    paddingTop: 10,
    [theme.breakpoints.down("sm")]: {
      padding: 15,
      paddingTop: 10,
      paddingBottom: 20
    }
  },
  listCheckbox: {
    display: "none"
  }
}))

const MyAppBar = ({ spectraOptions, clearForm }) => {
  const classes = useStyles()
  const [searchOpen, setSearchOpen] = React.useState(false)
  const handleClick = () => setSearchOpen(true)

  const [drawerOpen, setDrawerOpen] = React.useState(false)

  const toggleDrawer = event => {
    if (
      event &&
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return
    }
    setDrawerOpen(!drawerOpen)
  }

  const {
    data: {
      chartOptions: { logScale }
    }
  } = useQuery(GET_CHART_OPTIONS)
  const toggleLogScale = useMutation(gql`
    mutation ToggleLogScale {
      toggleLogScale @client
    }
  `)

  return (
    <>
      <AppBar position="fixed" color="primary" className={classes.appBar}>
        <Toolbar>
          <IconButton
            onClick={toggleDrawer}
            edge="start"
            color="inherit"
            aria-label="Open drawer"
          >
            <SettingsIcon />
          </IconButton>
          <Fab
            onClick={handleClick}
            aria-label="Add"
            className={classes.fabButton}
          >
            <AddIcon />
          </Fab>
          <div className={classes.grow} />
          <FormControlLabel
          labelPlacement="start"
            control={
              <Switch
                checked={logScale}
                onChange={toggleLogScale}
                color="default"
              />
            }
            label="OD"
          />
          <ShareButton></ShareButton>
        </Toolbar>
      </AppBar>
      <SearchModal
        options={spectraOptions}
        open={searchOpen}
        clearForm={clearForm}
        setOpen={setSearchOpen}
      />
      <Drawer anchor="bottom" open={drawerOpen} onClose={toggleDrawer}>
        <div
          className={classes.fullList}
          role="presentation"
          //onClick={toggleDrawer(side, false)}
        >
          <ChartOptionsForm />
          <OwnerOptionsForm />
          <Button
            color="secondary"
            onClick={toggleDrawer}
            style={{ marginLeft: "-10px" }}
          >
            <CloseIcon></CloseIcon>
          </Button>
          <Button
            variant="contained"
            color="secondary"
            style={{ float: "right" }}
            onClick={() => {
              clearForm()
              toggleDrawer()
            }}
          >
            Remove All Spectra
          </Button>
        </div>
      </Drawer>
    </>
  )
}

export default MyAppBar
