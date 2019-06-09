import React, { useState, useMemo, useEffect } from "react"
import ReactDOM from "react-dom"
import { useQuery, useMutation } from "react-apollo-hooks"
import {
  SPECTRA_LIST,
  GET_ACTIVE_SPECTRA,
  UPDATE_ACTIVE_SPECTRA
} from "./queries"
import { ApolloProvider } from "react-apollo-hooks"
import client from "./client"
import { reshapeSpectraInfo } from "./util"
import QuickEntry from "./QuickEntry"
import SpectraViewer from "./SpectraViewer/SpectraViewer";


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
  const { owners, spectraInfo } = useMemo(() => reshapeSpectraInfo(data.spectra), [
    data.spectra
  ])

  return (
    <>
      {loading ? "App loading" : ""}
      {spectraInfo && <SpectraViewer spectraInfo={spectraInfo} />}
      {owners && <QuickEntry options={Object.values(owners)} />}
      <Current />
    </>
  )
}

const initReactSpectra = elem => {
  ReactDOM.render(
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>,
    document.getElementById(elem)
  )
}

export default initReactSpectra
