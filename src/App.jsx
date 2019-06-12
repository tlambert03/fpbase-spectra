import React, { useState, useEffect } from "react"
import { useQuery, useApolloClient } from "react-apollo-hooks"
import {
  SPECTRA_LIST,
  GET_ACTIVE_SPECTRA,
  GET_CHART_OPTIONS} from "./client/queries"
import { ApolloProvider } from "react-apollo-hooks"
import client from "./client/client"
import {
  reshapeSpectraInfo,
  getStorageWithExpire,
  setStorageWithTimeStamp
} from "./util"
import QuickEntry from "./Components/QuickEntry"
import { SpectraViewer, ChartOptionsForm } from "./Components/SpectraViewer"
import stateToUrl from "./Components/stateToUrl"
import OwnerGroup from "./Components/OwnerGroup"
import OwnerOptionsForm from "./Components/OwnerOptionsForm"

const useStashedSpectraInfo = spectra => {
  const cacheKey = "_FPbaseSpectraStash"
  const [stash, setStash] = useState(getStorageWithExpire(cacheKey))
  const { data, loading } = useQuery(SPECTRA_LIST)

  useEffect(() => {
    if(!loading && data.spectra){
      const _stash = reshapeSpectraInfo(data.spectra)
      setStash(_stash)
      setStorageWithTimeStamp(cacheKey, _stash)
    }
  }, [data.spectra, loading])

  return { ...stash }
}

const App = () => {
  const { owners, spectraInfo } = useStashedSpectraInfo()

  return (
    <>
      <SpectraViewer spectraInfo={spectraInfo} />
      <ChartOptionsForm />
      <OwnerOptionsForm />
      {owners && <QuickEntry options={Object.values(owners)} />}

      {spectraInfo && (
        <OwnerGroup owners={owners} spectraInfo={spectraInfo}></OwnerGroup>
      )}
      <UrlUpdater />
    </>
  )
}

const UrlUpdater = ({ loading }) => {
  const client = useApolloClient()

  const handleClick = () => {
    async function pushHistory() {
      const {
        data: { activeSpectra }
      } = await client.query({ query: GET_ACTIVE_SPECTRA })
      const {
        data: { chartOptions }
      } = await client.query({ query: GET_CHART_OPTIONS })
      const qstring = stateToUrl(activeSpectra, chartOptions, loading)

      window.history.pushState({}, null, qstring)
    }
    pushHistory()
  }

  return <button onClick={handleClick}>CLICK</button>
}

const AppWrapper = () => (
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>
)

export default AppWrapper
