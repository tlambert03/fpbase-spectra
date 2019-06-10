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
        # url
      }
    }
  }
`

const GET_ACTIVE_SPECTRA = gql`
  query ActiveSpectra {
    activeSpectra @client
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
    }
  }
`

const UPDATE_ACTIVE_SPECTRA = gql`
  mutation updateActiveSpectra($activeSpectra: [String]!) {
    updateActiveSpectra(activeSpectra: $activeSpectra) @client
  }
`

export {
  GET_SPECTRUM,
  SPECTRA_LIST,
  GET_ACTIVE_SPECTRA,
  UPDATE_ACTIVE_SPECTRA,
  batchSpectra,
  GET_CHART_OPTIONS
}
