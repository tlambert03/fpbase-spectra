import React, { useEffect, useState } from "react"
import PropTypes from "prop-types"
import Select from "react-select"
import Box from "@material-ui/core/Box"
import ToggleButton from "@material-ui/lab/ToggleButton"
import ToggleButtonGroup from "@material-ui/lab/ToggleButtonGroup"
import { makeStyles } from "@material-ui/core/styles"
import IconButton from "@material-ui/core/IconButton"
import LinkIcon from "@material-ui/icons/Link"
import { customFilterOption } from "../util"
import { useQuery, useMutation } from "react-apollo-hooks"
import { categoryIcon } from "../Components/FaIcon"
import {
  GET_ACTIVE_SPECTRA,
  UPDATE_ACTIVE_SPECTRA,
  GET_OWNER_OPTIONS
} from "../client/queries"

const useStyles = makeStyles(() => ({
  toggleButton: { height: "38px" },
  toggleButtonGroup: { marginLeft: "5px" }
}))

function subtypeSorter(a, b) {
  const TYPE_ORDER = ["AB", "A_2P", "EX", "EM"]
  const upperA = a.subtype.toUpperCase()
  const upperB = b.subtype.toUpperCase()
  if (TYPE_ORDER.indexOf(upperA) > TYPE_ORDER.indexOf(upperB)) return 1
  return -1
}

const SpectrumSelector = ({
  options,
  current,
  otherOwners,
  onChange,
  showIcon
}) => {
  const selectRef = React.useRef()
  const [value, setValue] = useState(current)
  const subtypes = (value && value.spectra) || []
  //const updateOwners = useMutation(UPDATE_ACTIVE_OWNERS)
  const updateSpectra = useMutation(UPDATE_ACTIVE_SPECTRA)

  const {
    data: { excludeSubtypes }
  } = useQuery(GET_OWNER_OPTIONS)

  // when the spectrum selector changes
  const handleOwnerChange = newValue => {
    // if it's the same as the previous value do nothing
    if (value === newValue) return
    setValue(newValue)
    onChange(newValue && newValue.value)
    updateSpectra({
      variables: {
        add:
          newValue &&
          newValue.spectra
            .filter(({ subtype }) => !excludeSubtypes.includes(subtype))
            .map(({ id }) => id),
        remove: value && value.spectra.map(({ id }) => id)
      }
    })
    //updateOwners({ variables: { remove: [value && value.value] } })
  }

  // clean up on unmount
  useEffect(() => {
    return () => {
      if (value) {
      }
      // dispatch({
      //   type: "UPDATE_SPECTRA",
      //   remove: value.spectra.map(({ id }) => id)
      // })
    }
  }, [value])

  useEffect(() => {
    const blurme = e => (e.code === "Escape" ? selectRef.current.blur() : null)
    document.addEventListener("keydown", blurme)
    return () => {
      document.removeEventListener("keydown", blurme)
    }
  }, [])

  let ownerLink
  if (current) {
    if (current.category === "P") {
      ownerLink = current.url ? `/protein/${current.url}` : current.url || null
    } else if (current.url) {
      ownerLink = current.url
    }
  }
  return (
    <Box display="flex">
      {current &&
        showIcon &&
        categoryIcon(current.category, "rgba(0,0,50,0.4)", {
          style: {
            position: "relative",
            top: 10,
            left: current.category === 'L' ? 4 : 2,
            height: "1.3rem",
            marginRight: 10
          }
        })}
      <Box flexGrow={1}>
        <Select
          ref={selectRef}
          isClearable
          defaultValue={value}
          placeholder="Type to search..."
          filterOption={customFilterOption}
          onChange={handleOwnerChange}
          // options={options.filter(
          //   opt => !(otherOwners || []).includes(opt.value)
          // )}
          options={options.map(opt =>
            (otherOwners || []).includes(opt.value)
              ? {
                  ...opt,
                  label: opt.label + " (already selected)",
                  isDisabled: true
                }
              : opt
          )}
        />
      </Box>
      <SubtypeSelector
        subtypes={subtypes}
        skip={current && !["P", "D"].includes(current.category)}
      />
      {ownerLink && (
        <IconButton
          color="primary"
          aria-label="Delete"
          href={ownerLink}
          target="_blank"
          style={{ padding: 6, marginLeft: 10, marginRight: 2 }}
        >
          <LinkIcon />
        </IconButton>
      )}
    </Box>
  )
}

SpectrumSelector.propTypes = {
  options: PropTypes.arrayOf(PropTypes.object).isRequired,
  current: PropTypes.objectOf(PropTypes.any),
  otherOwners: PropTypes.arrayOf(PropTypes.string),
  showIcon: PropTypes.bool
}

SpectrumSelector.defaultProps = {
  otherOwners: [],
  current: null,
  showIcon: true
}

const SubtypeSelector = ({ subtypes, skip }) => {
  const classes = useStyles()
  const {
    data: { activeSpectra }
  } = useQuery(GET_ACTIVE_SPECTRA)
  const updateSpectra = useMutation(UPDATE_ACTIVE_SPECTRA)

  const handleClick = e => {
    const elem = e.target.closest("button")
    const checked = !elem.classList.contains("Mui-selected")
    const variables = {}
    variables[checked ? "add" : "remove"] = [elem.value]
    updateSpectra({ variables })
  }

  if (skip) return null

  subtypes.sort(subtypeSorter)
  subtypes.forEach(subtype => {
    subtype.active = activeSpectra.includes(subtype.id)
  })

  return (
    <Box>
      <ToggleButtonGroup
        value={subtypes.filter(i => i.active).map(i => i.id)}
        size="small"
        className={classes.toggleButtonGroup}
      >
        {subtypes.map(st => (
          <ToggleButton
            key={st.id}
            value={st.id}
            onClick={handleClick}
            className={classes.toggleButton}
          >
            {st.subtype.replace(/^A_/g, "")}
          </ToggleButton>
        ))}
      </ToggleButtonGroup>
    </Box>
  )
}

SubtypeSelector.propTypes = {
  subtypes: PropTypes.arrayOf(
    PropTypes.objectOf(PropTypes.oneOfType([PropTypes.string, PropTypes.bool]))
  ).isRequired
}

export default SpectrumSelector
