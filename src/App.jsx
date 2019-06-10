import React, { useState, useMemo, useEffect } from "react"
import { useQuery, useMutation } from "react-apollo-hooks"
import {
  SPECTRA_LIST,
  GET_ACTIVE_SPECTRA,
  GET_CHART_OPTIONS,
  UPDATE_ACTIVE_SPECTRA
} from "./client/queries"
import { ApolloProvider } from "react-apollo-hooks"
import client from "./client/client"
import { reshapeSpectraInfo } from "./Components/util"
import QuickEntry from "./Components/QuickEntry"
import SpectraViewer from "./Components/SpectraViewer/SpectraViewer"
import updateUrl from "./Components/stateToUrl"
import ChartOptionsForm from "./Components/SpectraViewer/ChartOptionsForm"

const Current = () => {
  const {
    loading,
    data: { activeSpectra }
  } = useQuery(GET_ACTIVE_SPECTRA)
  const updateSpectra = useMutation(UPDATE_ACTIVE_SPECTRA)
  const [value, setValue] = useState("")

  useEffect(() => {
    setValue(activeSpectra.join(", "))
  }, [activeSpectra])

  const handleKey = e => {
    if (e.key !== "Enter") {
      return
    }
    e.preventDefault()

    const newVal = e.target.value
      .split(",")
      .map(i => i.trim())
      .filter(i => i)
    updateSpectra({
      variables: {
        activeSpectra: newVal
      },
      update: (
        cache,
        {
          data: {
            updateActiveSpectra: { activeSpectra }
          }
        }
      ) => {
        setValue(activeSpectra.join(", "))
      }
    })
  }
  const handleChange = e => {
    setValue(e.target.value)
  }
  if (loading) {
    return <></>
  }
  return (
    <input
      type="text"
      value={value}
      style={{ width: "80%" }}
      onKeyPress={handleKey}
      onChange={handleChange}
    />
  )
}

const App = () => {
  const { data, loading } = useQuery(SPECTRA_LIST)
  const { owners, spectraInfo } = useMemo(
    () => reshapeSpectraInfo(data.spectra),
    [data.spectra]
  )

  return (
    <>
      {loading ? "App loading" : ""}
      {spectraInfo && <SpectraViewer spectraInfo={spectraInfo} />}
      {!loading && <ChartOptionsForm />}
      {owners && <QuickEntry options={Object.values(owners)} />}
      <Current />
      <UrlUpdater loading={loading} />
    </>
  )
}

const UrlUpdater = ({ loading }) => {
  const {
    data: { activeSpectra }
  } = useQuery(GET_ACTIVE_SPECTRA)
  const {
    data: { chartOptions }
  } = useQuery(GET_CHART_OPTIONS)
  const qstring = useMemo(
    () => updateUrl(activeSpectra, chartOptions, loading),
    [activeSpectra, chartOptions, loading]
  )
  return (
    <button onClick={() => window.history.pushState({}, null, qstring)}>
      CLICK
    </button>
  )
}

const AppWrapper = () => (
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>
)

export default AppWrapper
