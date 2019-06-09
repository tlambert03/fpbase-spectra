import { GET_SPECTRUM } from "./queries"
import client from "./client"

const DEFAULT_EXPIRY = 0 * 60 * 60 // n hours

const ID = () => {
  // Math.random should be unique because of its seeding algorithm.
  // Convert it to base 36 (numbers + letters), and grab the first 9 characters
  // after the decimal.
  return `_${Math.random()
    .toString(36)
    .substr(2, 9)}`
}

const emptyFormSelector = () => ({ id: ID(), value: null })

const getStorageWithExpire = (cacheKey, expiry) => {
  const cached = localStorage.getItem(cacheKey)
  const whenCached = localStorage.getItem(`${cacheKey}:ts`)
  if (cached !== null && whenCached !== null) {
    // it was in sessionStorage! Yay!
    // Even though 'whenCached' is a string, this operation
    // works because the minus sign converts the
    // string to an integer and it will work.
    const age = (Date.now() - whenCached) / 1000
    if (age < expiry) {
      return cached
    }
    // We need to clean up this old key
    localStorage.removeItem(cacheKey)
    localStorage.removeItem(`${cacheKey}:ts`)
  }
  return null
}

const getCachedSpectrum = async (id, options) => {
  let expiry = DEFAULT_EXPIRY // 10 min default
  if (typeof options === "number") {
    expiry = options
  } else if (typeof options === "object") {
    // I hope you didn't set it to 0 seconds
    expiry = options.seconds || expiry
  }

  const cacheKey = `spectrum_${id}`
  const cached = getStorageWithExpire(cacheKey, expiry)
  if (cached !== null) return Promise.resolve(JSON.parse(cached))

  const { loading, error, data } = await client.query({
    query: GET_SPECTRUM,
    variables: { id }
  })
  if (!loading && !error) {
    const spec = data.spectrum
    localStorage.setItem(cacheKey, JSON.stringify(spec))
    localStorage.setItem(`${cacheKey}:ts`, Date.now())
    return Promise.resolve(spec)
  }
  return Promise.reject()
}

async function fetchSpectrum(id) {
  const data = await getCachedSpectrum(id)
  if (data) {
    return {
      ...data,
      name: `${data.owner.name}${
        ["P", "D"].includes(data.category)
          ? ` ${data.subtype.replace(/^A_/g, "")}`
          : ""
      }`,
      inverted: false,
      visible: true,
      ecNormed: false,
      qyNormed: false
    }
  }
  const msg = `Could not find spectrum with ID: ${id}`
  throw new Error(msg)
}

async function fetchSpectraList(ids) {
  const results = await Promise.all(
    ids.map(id => fetchSpectrum(id)).map(p => p.catch(e => e))
  )
  const valid = results.filter(result => !(result instanceof Error))
  return valid
}

const customFilterOption = ({ label }, query) => {
  const words = query.split(" ")
  const opts = label.toLowerCase()
  return words.reduce(
    (acc, cur) => acc && opts.includes(cur.toLowerCase()),
    true
  )
}

function reshapeSpectraInfo(arr) {
  if (!arr) return {}
  return arr.reduce(
    (prev, cur) => {
      if (!Object.prototype.hasOwnProperty.call(prev.owners, cur.owner.slug)) {
        // eslint-disable-next-line no-param-reassign
        prev.owners[cur.owner.slug] = {
          category: cur.category,
          label: cur.owner.name,
          spectra: [],
          value: cur.owner.slug,
          url: cur.owner.url
        }
      }
      prev.owners[cur.owner.slug].spectra.push({
        id: cur.id,
        subtype: cur.subtype,
        active: true
      })
      // eslint-disable-next-line no-param-reassign
      prev.spectraInfo[cur.id] = {
        subtype: cur.subtype,
        owner: cur.owner.slug,
        label: cur.owner.name,
        category: cur.category
      }
      return prev
    },
    { owners: {}, spectraInfo: {} }
  )
}

export {
  ID,
  emptyFormSelector,
  getCachedSpectrum,
  getStorageWithExpire,
  fetchSpectrum,
  fetchSpectraList,
  DEFAULT_EXPIRY,
  customFilterOption,
  reshapeSpectraInfo
}
