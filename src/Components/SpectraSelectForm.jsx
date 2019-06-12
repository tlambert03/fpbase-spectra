import React, { useContext } from "react"
import Tabs from "@material-ui/core/Tabs"
import Tab from "@material-ui/core/Tab"
import Button from "@material-ui/core/Button"
import { makeStyles } from "@material-ui/core/styles"
import SpectrumSelectGroup from "./SpectrumSelectGroup"

const useStyles = makeStyles(theme => ({
  tabHeader: {
    marginBottom: 12
  },
  tabLabel: {
    marginTop: 0,
    paddingTop: 0,
    minHeight: 40,
    // lineHeight: 0,
    [theme.breakpoints.down("xs")]: {
      fontSize: "0.67rem"
    },
    [theme.breakpoints.up("sm")]: {
      fontSize: ".8rem",
      paddingLeft: 20,
      paddingRight: 20
    },
    [theme.breakpoints.up("lg")]: {
      fontSize: ".9rem"
    }
  }
}))

const SpectraSelectForm = () => {
  const { tab, formState, ownerCategories } = useContext(StateContext)
  const dispatch = useContext(DispatchContext)
  const classes = useStyles()
  console.log("formState", formState)
  const handleTabChange = (event, newValue) => {
    if (newValue !== tab) {
      dispatch({ type: "CHANGE_TAB", payload: newValue })
    }
  }

  const isPopulated = category =>
    formState[category] && formState[category].filter(i => i.value).length > 0

  const smartLabel = (label, cats) => {
    const populated = cats.some(c => isPopulated(c))
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

  console.log(
    "%c RENDERED SpectraSelectForm",
    "color: green; font-weight: bold;"
  )
  return (
    <div>
      <Tabs
        value={tab}
        onChange={handleTabChange}
        indicatorColor="primary"
        textColor="primary"
        centered
        className={classes.tabHeader}
      >
        <Tab
          className={classes.tabLabel}
          label={smartLabel("Fluorophores", ["D", "P"])}
        />
        <Tab
          className={classes.tabLabel}
          label={smartLabel("Filters", ["F"])}
        />
        <Tab
          className={classes.tabLabel}
          label={smartLabel("Light Sources", ["L"])}
        />
        <Tab
          className={classes.tabLabel}
          label={`Cameras ${isPopulated("C") ? "*" : ""}`}
        />
        <Tab className={classes.tabLabel} label="Options" />
      </Tabs>
      <TabContainer index={tab}>
        <div>
          <SpectrumSelectGroup
            options={ownerCategories["P"]}
            selectors={formState["P"]}
            category="P"
            hint="Protein"
          />
          <SpectrumSelectGroup
            options={ownerCategories["D"]}
            selectors={formState["D"]}
            category="D"
            hint="Dye"
          />
        </div>
        <SpectrumSelectGroup
          options={ownerCategories["F"]}
          selectors={formState["F"]}
          category="F"
          hint="Filter"
        />
        <SpectrumSelectGroup
          options={ownerCategories["L"]}
          selectors={formState["L"]}
          category="L"
          hint="Light Source"
        />
        <SpectrumSelectGroup
          options={ownerCategories["C"]}
          selectors={formState["C"]}
          category="C"
          hint="Detector"
        />
        <div>
          <Button
            variant="contained"
            color="secondary"
            className="mt-0"
            onClick={() => {
              dispatch({ type: "RESET" })
              initialize(dispatch, false)
            }}
          >
            Remove All Spectra
          </Button>
        </div>
      </TabContainer>
    </div>
  )
}

// here to make sure we always render each tab to maintain the formstate
const TabContainer = ({ index, children }) =>
  children &&
  children.map((child, idx) => (
    <div
      key={idx} // eslint-disable-line react/no-array-index-key
      style={{
        display: index === idx ? "block" : "none"
      }}
    >
      {React.cloneElement(child)}
    </div>
  ))

export default SpectraSelectForm
