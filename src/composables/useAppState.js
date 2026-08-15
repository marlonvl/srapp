import { reactive, ref, watch } from 'vue'
import { GENERAL_INFO_STORAGE_FIELDS } from '../utils/constants'

const DEFAULT_FORM_STATE = {
  studentName: '',
  facultyName: '',
  supervisorName: '',
  companyName: '',
  fase: 'I',
  startDate: '',
  endDate: '',
}

export const formState = reactive({ ...DEFAULT_FORM_STATE })

export const isGeneralInfoSaved = ref(false)
export const isScheduleSaved = ref(false)

export const scheduleDays = ref([])
export const tableRows = ref([])
export const logoCompanyBase64 = ref(null)

// 'digital': PDF para firmar electrónicamente (FirmaEC/Acrobat), sin columna de firma diaria.
// 'print': PDF para imprimir y firmar a mano día a día, con columna de firma diaria vacía.
export const pdfMode = ref('digital')

const DEFAULT_SCHEDULE_DAYS = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes']

function newId() {
  return crypto.randomUUID()
}

// Campos sin botón de "Guardar" propio (filas de la tabla, logo, modo de PDF): se
// autoguardan en cada cambio para que nada se pierda con un refresco accidental.
function persistTableRows() {
  localStorage.setItem('tableRowsData', JSON.stringify(tableRows.value))
}
watch(tableRows, persistTableRows, { deep: true })
watch(logoCompanyBase64, (v) => {
  if (v) localStorage.setItem('logoCompanyBase64', v)
  else localStorage.removeItem('logoCompanyBase64')
})
watch(pdfMode, (v) => localStorage.setItem('pdfMode', v))

export function addScheduleRow(dia = 'Lunes', entrada = '08:00', salida = '16:00') {
  scheduleDays.value.push({ id: newId(), dia, entrada, salida })
}

export function removeScheduleRow(id) {
  scheduleDays.value = scheduleDays.value.filter((d) => d.id !== id)
}

export function loadFromLocalStorage() {
  GENERAL_INFO_STORAGE_FIELDS.forEach((f) => {
    const v = localStorage.getItem(f)
    if (v) formState[f] = v
  })
  const savedStart = localStorage.getItem('startDate')
  const savedEnd = localStorage.getItem('endDate')
  if (savedStart) formState.startDate = savedStart
  if (savedEnd) formState.endDate = savedEnd

  const raw = localStorage.getItem('scheduleData')
  if (raw) {
    const days = JSON.parse(raw)
    scheduleDays.value = days.map((d) => ({ id: newId(), dia: d.day, entrada: d.in, salida: d.out }))
  } else {
    DEFAULT_SCHEDULE_DAYS.forEach((d) => addScheduleRow(d, '08:00', '16:00'))
  }

  const savedRows = localStorage.getItem('tableRowsData')
  if (savedRows) tableRows.value = JSON.parse(savedRows)

  const savedLogo = localStorage.getItem('logoCompanyBase64')
  if (savedLogo) logoCompanyBase64.value = savedLogo

  const savedMode = localStorage.getItem('pdfMode')
  if (savedMode) pdfMode.value = savedMode

  isGeneralInfoSaved.value = hasStoredGeneralInfo()
  isScheduleSaved.value = hasStoredSchedule()
}

export function saveGeneralInfo() {
  GENERAL_INFO_STORAGE_FIELDS.forEach((f) => localStorage.setItem(f, formState[f]))
  isGeneralInfoSaved.value = true
}

export function saveScheduleInfo() {
  localStorage.setItem('startDate', formState.startDate)
  localStorage.setItem('endDate', formState.endDate)
  localStorage.setItem(
    'scheduleData',
    JSON.stringify(scheduleDays.value.map((d) => ({ day: d.dia, in: d.entrada, out: d.salida })))
  )
  isScheduleSaved.value = true
}

// Para confirmar antes de sobrescribir: ¿ya había algo guardado para este bloque?
export function hasStoredGeneralInfo() {
  return GENERAL_INFO_STORAGE_FIELDS.some((f) => localStorage.getItem(f) !== null)
}

export function hasStoredSchedule() {
  return localStorage.getItem('scheduleData') !== null
}

export function hasStoredLogo() {
  return localStorage.getItem('logoCompanyBase64') !== null
}

export function hasExistingData() {
  return (
    tableRows.value.length > 0 ||
    scheduleDays.value.length > 0 ||
    GENERAL_INFO_STORAGE_FIELDS.some((f) => !!formState[f] && formState[f] !== DEFAULT_FORM_STATE[f])
  )
}

export function clearGeneralInfo() {
  Object.assign(formState, {
    studentName: '',
    facultyName: '',
    supervisorName: '',
    companyName: '',
    fase: 'I',
  })
  GENERAL_INFO_STORAGE_FIELDS.forEach((f) => localStorage.removeItem(f))
  isGeneralInfoSaved.value = false
}

export function clearScheduleInfo() {
  formState.startDate = ''
  formState.endDate = ''
  scheduleDays.value = []
  localStorage.removeItem('startDate')
  localStorage.removeItem('endDate')
  localStorage.removeItem('scheduleData')
  isScheduleSaved.value = false
}

export function clearLogoCompany() {
  logoCompanyBase64.value = null
}

export function clearAllData() {
  Object.assign(formState, DEFAULT_FORM_STATE)
  scheduleDays.value = []
  // tableRows, logoCompanyBase64 y pdfMode se auto-guardan por watch(); limpiarlos ya
  // actualiza su respectiva clave de localStorage sin necesidad de removerla a mano.
  tableRows.value = []
  logoCompanyBase64.value = null
  pdfMode.value = 'digital'
  GENERAL_INFO_STORAGE_FIELDS.forEach((f) => localStorage.removeItem(f))
  ;['startDate', 'endDate', 'scheduleData'].forEach((k) => localStorage.removeItem(k))
  isGeneralInfoSaved.value = false
  isScheduleSaved.value = false
}
