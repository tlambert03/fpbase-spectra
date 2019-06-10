import qs from "qs"

function updateUrl(activeSpectra, chartOptions, skip) {
  if (activeSpectra && chartOptions && !skip) {
    const qstrings = []
    if (activeSpectra) qstrings.push(`s=${activeSpectra.join(",")}`)
    if (chartOptions) qstrings.push(qs.stringify({ opt: chartOptions }))
    return qstrings.length ? "?" + qstrings.join("&") : ""
  }
  return ""
}

export default updateUrl
