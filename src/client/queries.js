import gql from "graphql-tag"

const batchSpectra = ids => {
  const f = ids
    .filter(i => i)
    .map(
      id => `spectrum_${id}: spectrum(id: ${id}) {
    ...spectrumDetails
  }`
    )
    .join("\n")
  return gql`
    query BatchSpectra{
      ${f}
    }

    fragment spectrumDetails on Spectrum {
      id
      data
      category
      color
      subtype
      owner {
        slug
        name
        id
        url
      }
    }
  `
}

const GET_SPECTRUM = gql`
  query Spectrum($id: Int!) {
    spectrum(id: $id) {
      id
      data
      category
      color
      subtype
      owner {
        slug
        name
        id
        ... on State {
          ...FluorophoreParts
        }
        ... on Dye {
          ...FluorophoreParts
        }
      }
    }
  }

  fragment FluorophoreParts on FluorophoreInterface {
    qy
    extCoeff
    twopPeakgm
    exMax
    emMax
  }
`

const SPECTRA_LIST = gql`
  {
    spectra {
      id
      category
      subtype
      owner {
        name
        slug
        url
      }
    }
  }
`

const GET_ACTIVE_SPECTRA = gql`
  query ActiveSpectra {
    activeSpectra @client
  }
`

const GET_ACTIVE_OWNERS = gql`
  query ActiveOwners {
    activeOwners @client
  }
`

const GET_CHART_OPTIONS = gql`
  query ChartOptions {
    chartOptions @client {
      showY
      showX
      showGrid
      logScale
      scaleEC
      scaleQY
      extremes
      shareTooltip
    }
  }
`

const SET_ACTIVE_SPECTRA = gql`
  mutation setActiveSpectra($activeSpectra: [String]!) {
    setActiveSpectra(activeSpectra: $activeSpectra) @client
  }
`

const UPDATE_ACTIVE_SPECTRA = gql`
  mutation updateActiveSpectra($add: [String], $remove: [String]) {
    updateActiveSpectra(add: $add, remove: $remove) @client
  }
`

const UPDATE_ACTIVE_OWNERS = gql`
  mutation updateActiveOwners($add: [String], $remove: [String]) {
    updateActiveOwners(add: $add, remove: $remove) @client
  }
`

const GET_OWNER_OPTIONS = gql`
  {
    excludeSubtypes @client
  }
`

export {
  GET_SPECTRUM,
  SPECTRA_LIST,
  GET_ACTIVE_SPECTRA,
  SET_ACTIVE_SPECTRA,
  UPDATE_ACTIVE_SPECTRA,
  batchSpectra,
  GET_ACTIVE_OWNERS,
  UPDATE_ACTIVE_OWNERS,
  GET_CHART_OPTIONS,
  GET_OWNER_OPTIONS
}
