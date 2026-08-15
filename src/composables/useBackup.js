import { formState, scheduleDays, tableRows, logoCompanyBase64 } from './useAppState'
import { addToast } from './useToast'
import { calculateHours, isValidISODate } from '../utils/dates'
import { GENERAL_INFO_STORAGE_FIELDS } from '../utils/constants'

function newId() {
  return crypto.randomUUID()
}

export function exportBackup() {
  const payload = {
    schemaVersion: 1,
    app: 'SRAPP',
    exportedAt: new Date().toISOString(),
    infoGeneral: {
      studentName: formState.studentName,
      facultyName: formState.facultyName,
      supervisorName: formState.supervisorName,
      companyName: formState.companyName,
      fase: formState.fase,
    },
    cronograma: {
      startDate: formState.startDate,
      endDate: formState.endDate,
      dias: scheduleDays.value.map((d) => ({ dia: d.dia, entrada: d.entrada, salida: d.salida })),
    },
    filas: tableRows.value.map((r) => ({
      fecha: r.fecha,
      entrada: r.entrada,
      salida: r.salida,
      actividad: r.actividad,
      observaciones: r.observaciones,
      horas: calculateHours(r.entrada, r.salida),
    })),
    logoCompanyBase64: logoCompanyBase64.value || undefined,
  }

  const studentSlug = (formState.studentName || 'SinNombre').trim().replace(/\s+/g, '_')
  const dateSlug = new Date().toISOString().slice(0, 10)
  const filename = `SRAPP_Respaldo_${studentSlug}_${dateSlug}.json`

  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
  addToast('Respaldo exportado.')
}

/**
 * Aplica un JSON de respaldo (completo o parcial) al estado actual.
 * infoGeneral/cronograma se sobrescriben si están presentes; filas se aplica con
 * upsert por fecha (no borra filas ausentes del JSON — usar "Vaciar Tabla" antes
 * de importar un respaldo completo si se quiere un reemplazo limpio).
 */
export function importBackupFromText(text) {
  let data
  try {
    data = JSON.parse(text)
  } catch {
    addToast('El archivo no es un JSON válido.', true)
    return
  }
  if (typeof data !== 'object' || data === null) {
    addToast('El JSON no tiene el formato esperado.', true)
    return
  }

  if (data.infoGeneral && typeof data.infoGeneral === 'object') {
    GENERAL_INFO_STORAGE_FIELDS.forEach((f) => {
      if (typeof data.infoGeneral[f] === 'string') formState[f] = data.infoGeneral[f]
    })
  }
  if (data.cronograma && typeof data.cronograma === 'object') {
    if (typeof data.cronograma.startDate === 'string') formState.startDate = data.cronograma.startDate
    if (typeof data.cronograma.endDate === 'string') formState.endDate = data.cronograma.endDate
    if (Array.isArray(data.cronograma.dias)) {
      scheduleDays.value = data.cronograma.dias.map((d) => ({
        id: newId(), dia: d.dia, entrada: d.entrada, salida: d.salida,
      }))
    }
  }
  if (typeof data.logoCompanyBase64 === 'string') logoCompanyBase64.value = data.logoCompanyBase64

  let created = 0
  let updated = 0
  let ignored = 0
  if (Array.isArray(data.filas)) {
    data.filas.forEach((f) => {
      if (!f || !isValidISODate(f.fecha)) {
        ignored++
        return
      }
      const existing = tableRows.value.find((r) => r.fecha === f.fecha)
      if (existing) {
        if (f.entrada !== undefined) existing.entrada = f.entrada
        if (f.salida !== undefined) existing.salida = f.salida
        if (f.actividad !== undefined) existing.actividad = f.actividad
        if (f.observaciones !== undefined) existing.observaciones = f.observaciones
        updated++
      } else {
        tableRows.value.push({
          id: newId(),
          fecha: f.fecha,
          entrada: f.entrada || '',
          salida: f.salida || '',
          actividad: f.actividad || '',
          observaciones: f.observaciones || '',
        })
        created++
      }
    })
  }

  const parts = []
  if (created) parts.push(`${created} fila(s) nueva(s)`)
  if (updated) parts.push(`${updated} actualizada(s)`)
  if (ignored) parts.push(`${ignored} ignorada(s) por fecha inválida`)
  addToast(parts.length ? `Importación aplicada: ${parts.join(', ')}.` : 'No se encontraron filas para importar.')
}

export function importBackupFromFile(file) {
  const reader = new FileReader()
  reader.onload = (ev) => importBackupFromText(ev.target.result)
  reader.onerror = () => addToast('No se pudo leer el archivo.', true)
  reader.readAsText(file)
}
