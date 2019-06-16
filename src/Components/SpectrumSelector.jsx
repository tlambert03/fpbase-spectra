import React from "react"
import PropTypes from "prop-types"
import Box from "@material-ui/core/Box"
import { customFilterOption } from "../util"
import { useQuery, useMutation } from "react-apollo-hooks"
import { UPDATE_ACTIVE_SPECTRA, GET_OWNER_OPTIONS } from "../client/queries"
import SubtypeSelector from "./SubtypeSelector"
import SortablePaginatedSelect from "./SortablePaginatedSelect"
import ProductLink from "./ProductLink"

const SpectrumSelector = ({
  options,
  value,
  otherOwners,
  onChange,
  showCategoryIcon
}) => {
  //const [value, setValue] = useState(current)
  const subtypes = (value && value.spectra) || []
  const updateSpectra = useMutation(UPDATE_ACTIVE_SPECTRA)

  const {
    data: { excludeSubtypes }
  } = useQuery(GET_OWNER_OPTIONS)

  // when the spectrum selector changes
  const handleOwnerChange = newValue => {
    // if it's the same as the previous value do nothing
    if (value === newValue) return
    // setValue(newValue)
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
  }

  // disable options that are already claimed by other selectors
  const myOptions = options.map(opt =>
    (otherOwners || []).includes(opt.value)
      ? {
          ...opt,
          label: opt.label + " (already selected)",
          isDisabled: true
        }
      : opt
  )

  return (
    <Box display="flex">
      <Box flexGrow={1}>
        <SortablePaginatedSelect
          isClearable
          showIcon={showCategoryIcon}
          value={value}
          placeholder="Type to search..."
          onChange={handleOwnerChange}
          options={myOptions}
        />
      </Box>
      <SubtypeSelector
        subtypes={subtypes}
        skip={value && !["P", "D"].includes(value.category)}
      />
      <ProductLink current={value} />
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

export default SpectrumSelector
