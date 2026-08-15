import { computed } from 'vue'
import { formState, scheduleDays, tableRows } from './useAppState'
import { addToast } from './useToast'
import { calculateHours, generateDatesInRange, formatDateDMY } from '../utils/dates'

function newId() {
  return crypto.randomUUID()
}

function blankRow() {
  return { id: newId(), fecha: '', entrada: '', salida: '', actividad: '', observaciones: '' }
}

export function addManualRow() {
  tableRows.value.push(blankRow())
}

export function deleteRow(id) {
  tableRows.value = tableRows.value.filter((r) => r.id !== id)
}

export function clearAllRows() {
  tableRows.value = []
}

export function generateRowsFromDates() {
  if (!formState.startDate || !formState.endDate) {
    addToast('Define Inicio y Fin del cronograma.', true)
    return
  }
  if (scheduleDays.value.length === 0) {
    addToast('Agrega al menos 1 día al horario.', true)
    return
  }
  const dates = generateDatesInRange(formState.startDate, formState.endDate, scheduleDays.value)
  const lastIndex = dates.length - 1
  tableRows.value = dates.map((d, i) => ({
    id: newId(),
    fecha: d.fecha,
    entrada: d.entrada,
    salida: d.salida,
    actividad: '',
    // El último día del período queda marcado por defecto; el resto se llena a mano o por import JSON.
    observaciones: i === lastIndex ? 'Completado exitosamente' : '',
  }))
  addToast('Filas generadas correctamente.')
}

export const rowCount = computed(() => tableRows.value.length)

export const totalHours = computed(() =>
  tableRows.value.reduce((sum, r) => sum + calculateHours(r.entrada, r.salida), 0)
)

/**
 * Filas con contenido real (fecha, entrada o actividad), en el orden que espera el PDF.
 * mode 'digital' (6 columnas): N°, FECHA, ACTIVIDAD, ENTRADA, SALIDA, OBSERVACIONES.
 * mode 'print' (7 columnas): igual, más FIRMA SUP. (siempre vacía, para tinta) antes de OBSERVACIONES.
 */
export function getPdfTableData(mode) {
  return tableRows.value
    .filter((r) => r.fecha || r.actividad || r.entrada)
    .map((r, i) => {
      const base = [(i + 1).toString(), formatDateDMY(r.fecha), r.actividad, r.entrada, r.salida]
      return mode === 'print' ? [...base, '', r.observaciones] : [...base, r.observaciones]
    })
}
