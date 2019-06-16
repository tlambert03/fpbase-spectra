import React, { useState, useRef, useEffect } from "react"
import PropTypes from "prop-types"
import { useMutation, useQuery } from "react-apollo-hooks"
import {
  UPDATE_ACTIVE_SPECTRA,
  GET_ACTIVE_SPECTRA,
  SET_ACTIVE_SPECTRA
} from "../client/queries"
import update from "immutability-helper"
import Tabs from "@material-ui/core/Tabs"
import Tab from "@material-ui/core/Tab"
import Button from "@material-ui/core/Button"
import { makeStyles } from "@material-ui/core/styles"
import OwnerOptionsForm from "./OwnerOptionsForm"
import ChartOptionsForm from "./SpectraViewer/ChartOptionsForm"
import QuickEntry from "./QuickEntry"

import SpectrumSelectorGroup from "./SpectrumSelectorGroup"
import { Typography } from "@material-ui/core"

const useStyles = makeStyles(theme => ({
  tabHeader: {
    marginBottom: 12,
    marginLeft: 60,
    paddingLeft: 0
  },
  tabLabel: {
    marginTop: 0,
    paddingTop: 0,
    minHeight: 40,
    // lineHeight: 0,
    [theme.breakpoints.down("xs")]: {
      fontSize: "0.65rem",
      paddingLeft: 5,
      paddingRight: 5
    },
    [theme.breakpoints.up("sm")]: {
      fontSize: ".73rem",
      paddingLeft: 20,
      paddingRight: 20
    },
    [theme.breakpoints.up("md")]: {
      fontSize: ".76rem",
      paddingLeft: 25,
      paddingRight: 25
    },
    [theme.breakpoints.up("lg")]: {
      fontSize: ".9rem",
      paddingLeft: 60,
      paddingRight: 60
    }
  },
  categoryHeader: { 
    textTransform: "uppercase", 
    fontSize: "small",
    color: "#3F51B5",
    marginTop: '1rem',
  }
}))

function selectorSorter(a, b) {
  const ORDER = ["P", "D", "F", "L", "C", "", null]
  if (ORDER.indexOf(a.category) === ORDER.indexOf(b.category)) {
    if (a.owner && !b.owner) return -1
    if (!a.owner && b.owner) return 1
    return 0
  }
  if (ORDER.indexOf(a.category) > ORDER.indexOf(b.category)) return 1
  return -1
}

// function getUnique(arr) {
//   let set = new Set()
//   return arr
//     .map((v, index) => {
//       if (set.has(v.id)) {
//         return false
//       } else {
//         set.add(v.id)
//         return index
//       }
//     })
//     .filter(e => e)
//     .map(e => arr[e])
// }

const OwnersContainer = ({ owners, spectraInfo }) => {
  const {
    data: { activeSpectra }
  } = useQuery(GET_ACTIVE_SPECTRA)
  const [selectors, setSelectors] = useState([])
  const selectorId = useRef(0)
  const classes = useStyles()

  const [tab, setTab] = useState(0)

  const handleTabChange = (event, newValue) => {
    if (newValue !== tab) {
      setTab(newValue)
    }
  }

  // this makes sure that all active spectra are reflected in the ownerSlugs array
  useEffect(() => {
    const currentOwners = selectors.map(({ owner }) => owner)
    let newOwners = activeSpectra
      .map(id => spectraInfo[id] && spectraInfo[id].owner)
      .filter(owner => owner && !currentOwners.includes(owner))
    newOwners = [...new Set(newOwners)].map(owner => ({
      id: selectorId.current++,
      owner,
      category: owners[owner].category
    }))
    setSelectors(update(selectors, { $push: newOwners }))
  }, [activeSpectra]) // eslint-disable-line

  const updateSpectra = useMutation(UPDATE_ACTIVE_SPECTRA)
  const removeRow = selector => {
    if (owners[selector.owner] && owners[selector.owner].spectra) {
      updateSpectra({
        variables: {
          remove: owners[selector.owner].spectra.map(({ id }) => id)
        }
      })
    }
    setSelectors(selectors.filter(({ id }) => id !== selector.id))
  }

  const addRow = (category = null) => {
    let newSelectors = update(selectors, {
      $push: [
        {
          id: selectorId.current++,
          owner: null,
          category
        }
      ]
    })
    setSelectors(newSelectors)
  }

  const changeOwner = (id, category = null) => {
    return function(newOwner) {
      const index = selectors.findIndex(selector => selector.id === id)
      let newSelectors = update(selectors, {
        [index]: {
          owner: { $set: newOwner },
          category: {
            $set: newOwner ? owners[newOwner].category : category
          }
        }
      })
      setSelectors(newSelectors)
    }
  }

  const isPopulated = cat =>
    selectors.filter(({ owner, category }) => category === cat && owner)
      .length > 0

  const smartLabel = (label, cats) => {
    let populated
    if (cats === null) {
      populated = Boolean(selectors.filter(i => i.owner).length)
    } else {
      populated = cats.some(c => isPopulated(c))
    }
    return (
      <span
        style={{
          fontWeight: populated ? "bold" : "normal"
        }}
      >
        {label}
        {populated ? " ✶" : ""}
      </span>
    )
  }

  const setSpectra = useMutation(SET_ACTIVE_SPECTRA)
  const clearSpectra = () => {
    setSelectors([
      {
        id: selectorId.current++,
        owner: null,
        category: null
      }
    ])
    setSpectra({ variables: { activeSpectra: [] } })
  }

  selectors.sort(selectorSorter)
  const allOptions = Object.values(owners)
  const spectrumCategoryGroup = (category, hint) => {
    return (
      <SpectrumSelectorGroup
        selectors={selectors}
        options={allOptions}
        addRow={addRow}
        showCategoryIcon={!Boolean(category)}
        changeOwner={changeOwner}
        removeRow={removeRow}
        owners={owners}
        category={category}
        hint={hint}
      />
    )
  }

  return (
    <div>
      <div
        style={{
          position: "relative",
          top: -4,
          left: 4,
          zIndex: 2
        }}
      >
        <QuickEntry options={allOptions} />
      </div>
      <Tabs
        value={tab}
        onChange={handleTabChange}
        indicatorColor="primary"
        textColor="primary"
        variant="scrollable"
        scrollButtons="auto"
        className={classes.tabHeader}
      >
        <Tab className={classes.tabLabel} label={smartLabel("All", null)} />
        <Tab
          className={classes.tabLabel}
          label={smartLabel("Fluorophores", ["D", "P"])}
        />
        <Tab
          className={classes.tabLabel}
          label={smartLabel("Filters", ["F"])}
        />
        <Tab className={classes.tabLabel} label={smartLabel("Lights", ["L"])} />
        <Tab
          className={classes.tabLabel}
          label={smartLabel("Detectors", ["C"])}
        />
        <Tab className={classes.tabLabel} label="Options" />
      </Tabs>

      <TabContainer index={tab}>
        <div>{spectrumCategoryGroup()}</div>
        <div>
          <Typography variant="h6" className={classes.categoryHeader}>
            Fluorescent Proteins
          </Typography>
          {spectrumCategoryGroup("P", "protein")}
          <Typography variant="h6" className={classes.categoryHeader}>
            Dyes
          </Typography>
          {spectrumCategoryGroup("D", "dye")}
        </div>
        <div>{spectrumCategoryGroup("F", "filter")}</div>
        <div>{spectrumCategoryGroup("L", "light")}</div>
        <div>{spectrumCategoryGroup("C", "camera")}</div>

        <div>
          <ChartOptionsForm />
          <OwnerOptionsForm />
          <Button
            variant="contained"
            color="secondary"
            className="mt-0"
            onClick={clearSpectra}
          >
            Remove All Spectra
          </Button>
        </div>
      </TabContainer>
    </div>
  )
}

OwnersContainer.propTypes = {
  category: PropTypes.string
}

OwnersContainer.defaultProps = {
  category: ""
}

// here to make sure we always render each tab to maintain the formstate
const TabContainer = ({ index, children }) =>
  children && React.cloneElement(children[index])
  
export default OwnersContainer
