import gql from "graphql-tag"

export const defaults = {
  activeSpectra: [],
  chartOptions: {
    showY: false,
    showX: true,
    showGrid: false,
    logScale: false,
    scaleEC: false,
    scaleQY: false,
    extremes: [null, null],
    __typename: "chartOptions"
  }
}

function toggleChartOption(cache, key) {
  const current = cache.readQuery({
    query: gql`
      {
        chartOptions {
          ${key}
        }
      }
    `
  })
  const data = { ...current }
  data.chartOptions[key] = !current.chartOptions[key]
  cache.writeData({ data })
  return data
}

export const resolvers = {
  Mutation: {
    toggleYAxis: (_root, variables, { cache }) => {
      return toggleChartOption(cache, "showY")
    },
    toggleXAxis: (_root, variables, { cache }) => {
      return toggleChartOption(cache, "showX")
    },
    toggleGrid: (_root, variables, { cache }) => {
      return toggleChartOption(cache, "showGrid")
    },
    toggleLogScale: (_root, variables, { cache }) => {
      return toggleChartOption(cache, "logScale")
    },
    toggleScaleEC: (_root, variables, { cache }) => {
      return toggleChartOption(cache, "scaleEC")
    },
    toggleScaleQY: (_root, variables, { cache }) => {
      return toggleChartOption(cache, "scaleQY")
    },
    setChartExtremes: (_root, { extremes }, { cache }) => {
      const data = { chartOptions: { extremes, __typename: "extremes" } }
      cache.writeData({ data })
      return data
    },
    updateActiveSpectra: async (_, { activeSpectra }, { cache }) => {
      // const previous = cache.readQuery({ query: GET_ACTIVE_SPECTRA })
      // const data = {
      //   activeSpectra: [
      //     ...new Set([...previous.activeSpectra, ...activeSpectra])
      //   ]
      // }
      // Under the hood, cache.writeData automatically constructs
      // a query from the  data object you pass in and calls
      // cache.writeQuery.
      const data = {
        activeSpectra: [...new Set(activeSpectra)]
      }
      await cache.writeData({ data })
      return data
    }
  }
}
