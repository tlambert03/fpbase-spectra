import qs from "qs"

function stateToUrl(activeSpectra, chartOptions, skip) {
  if (activeSpectra && chartOptions && !skip) {
    const qstrings = []
    if (activeSpectra) qstrings.push(`s=${activeSpectra.join(",")}`)
    if (chartOptions) {
      let opts = { ...chartOptions }
      delete opts.__typename
      const [xMin, xMax] = opts.extremes
      opts.xMin = xMin
      opts.xMax = xMax
      delete opts.extremes
      Object.keys(opts).forEach(key => {
        if (typeof opts[key] === "boolean") {
          opts[key] = Number(opts[key])
        }
      })
      qstrings.push(qs.stringify(opts))
    }
    return qstrings.length ? "?" + qstrings.join("&") : ""
  }
  return ""
}

export default stateToUrl
