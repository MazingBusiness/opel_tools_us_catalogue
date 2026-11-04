// US display values, worked out from the brochure value every time so they can't drift from it.
// The brochure value stays the source of truth: filters, URLs and sorting all use it.

const round = (n, dp) => String(Number(n.toFixed(dp)))
const inches = (mm) => round(mm / 25.4, mm / 25.4 < 10 ? 2 : 1)

// Each rule takes the printed number in its unit and returns the US number as text.
const UNITS = {
  mm: (n) => [inches(n), 'in'],
  cm: (n) => [inches(n * 10), 'in'],
  m: (n) => [round(n * 3.28084, 1), 'ft'],
  kg: (n) => [round(n * 2.20462, 1), 'lb'],
  ml: (n) => [round(n / 29.5735, 1), 'fl oz'],
  'ml/min': (n) => [round(n / 29.5735, 1), 'fl oz/min'],
  l: (n) => [round(n / 3.78541, 2), 'gal'],
  'l/min': (n) => [round(n / 3.78541, 2), 'GPM'],
  'm³': (n) => [round(n * 35.3147, 2), 'ft³'],
  bar: (n) => [round(n * 14.5038, 0), 'PSI'],
  mpa: (n) => [round(n * 145.038, 0), 'PSI'],
  j: (n) => [round(n * 0.737562, 1), 'ft-lb'],
  '°c': (n) => [round((n * 9) / 5 + 32, 0), '°F'],
}
// Small torques read better in inch-pounds, so the unit is chosen from the largest number in the value.
const torque = (nums) => (Math.max(...nums) < 20 ? [(n) => round(n * 8.85075, 0), 'in-lb'] : [(n) => round(n * 0.737562, 1), 'ft-lb'])

const NUMBERS = /^\s*(\d+(?:\.\d+)?(?:\s*[-/]\s*\d+(?:\.\d+)?)*)\s*(mm|cm|m|kg|ml\/min|ml|l\/min|l|m³|m3|bar|mpa|nm|j|°c)\s*$/i
const METRIC_LEFT = /\d\s*(mm|cm|m|kg|ml|l|bar|mpa|nm|j|°c|m³|m3)\b/i
const KEY_UNIT = /^(.*?)\s*\((mm|cm|v|hz|r\/min)\)$/i
const MAINS_HZ = /^\s*\d+(\/\d+)?\s*hz\s*$/i

function convertNumbers(value) {
  const m = value.match(NUMBERS)
  if (!m) return null
  const unit = m[2].toLowerCase().replace('m3', 'm³')
  const nums = [...m[1].matchAll(/\d+(?:\.\d+)?/g)].map((x) => Number(x[0]))
  const [fn, label] = unit === 'nm' ? torque(nums) : [(n) => UNITS[unit](n)[0], UNITS[unit](1)[1]]
  return m[1].replace(/\d+(?:\.\d+)?/g, (x) => fn(Number(x))).replace(/\s+/g, '') + ' ' + label
}

// Returns { key, value, status } where status is 'converted', 'same' (nothing to convert) or 'unhandled' (left as printed).
// 120V/60Hz is a fact about the US corded models, so it only replaces mains ratings on corded products.
export const isCorded = (p) => !(p.specMap['Battery Voltage'] || p.specMap['Battery Type'] || p.power.some((s) => /\d\s*cc\b/i.test(s)))

export function toUS(rawKey, rawValue, { corded = true } = {}) {
  let key = rawKey
  let value = String(rawValue).trim()
  const ku = rawKey.match(KEY_UNIT)
  if (ku) {
    key = ku[1]
    if (/^[\d.\s/-]+$/.test(value)) value += ku[2]
  }
  const k = key.toLowerCase()

  // US models are 120V/60Hz (confirmed by Alok). Battery voltages are the battery's, not the mains supply.
  if (corded && /vo[il]*tage/.test(k) && !/battery/.test(k) && /\d/.test(value)) return { key, value: /hz/i.test(value) ? '120V/60Hz' : '120V', status: 'converted' }
  if (corded && /frequency/.test(k) && !/vibration|impact/.test(k) && MAINS_HZ.test(value)) return { key, value: '60Hz', status: 'converted' }

  const relabelled = value.replace(/\s*(r\/min|rpm)\b/gi, ' RPM').replace(/\s*ipm\b/gi, ' IPM')
  const converted = convertNumbers(relabelled)
  if (converted) return { key, value: converted, status: 'converted' }
  if (METRIC_LEFT.test(relabelled)) return { key, value: relabelled, status: 'unhandled' }
  return { key, value: relabelled, status: relabelled === String(rawValue).trim() ? 'same' : 'converted' }
}

export const showSpec = (key, value, units, opts) => (units === 'us' ? toUS(key, value, opts) : { key, value })
