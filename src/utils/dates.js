import { DAY_NAME_TO_NUMBER } from './constants'

export function calculateHours(tIn, tOut) {
  if (!tIn || !tOut) return 0
  const [h1, m1] = tIn.split(':').map(Number)
  const [h2, m2] = tOut.split(':').map(Number)
  let diff = (h2 * 60 + m2) - (h1 * 60 + m1)
  if (diff < 0) diff += 24 * 60
  return Math.max(0, Math.round(diff / 60))
}

export function formatDateDMY(isoDate) {
  if (!isoDate) return '...'
  const [y, m, d] = isoDate.split('-')
  return `${d}/${m}/${y}`
}

export function isValidISODate(value) {
  return typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value)
}

// Mediodía UTC evita que el cambio de huso horario retroceda la fecha al convertir a Date.
function toNoonUTC(isoDate) {
  const [y, m, d] = isoDate.split('-').map(Number)
  return new Date(Date.UTC(y, m - 1, d, 12, 0, 0))
}

/**
 * Genera una fila {fecha, entrada, salida} por cada día entre startISO y endISO (inclusive)
 * cuyo día de la semana esté configurado en scheduleDays.
 */
export function generateDatesInRange(startISO, endISO, scheduleDays) {
  const configByDayNumber = new Map()
  scheduleDays.forEach((d) => {
    const dayNum = DAY_NAME_TO_NUMBER[d.dia.toLowerCase()]
    if (dayNum !== undefined) configByDayNumber.set(dayNum, { entrada: d.entrada, salida: d.salida })
  })
  if (configByDayNumber.size === 0) return []

  let curr = toNoonUTC(startISO)
  const end = toNoonUTC(endISO)
  const rows = []
  while (curr <= end) {
    const cfg = configByDayNumber.get(curr.getUTCDay())
    if (cfg) {
      rows.push({ fecha: curr.toISOString().slice(0, 10), entrada: cfg.entrada, salida: cfg.salida })
    }
    curr.setUTCDate(curr.getUTCDate() + 1)
  }
  return rows
}
