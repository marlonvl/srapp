import { jsPDF } from 'jspdf'
import { autoTable } from 'jspdf-autotable'
import { formState, logoCompanyBase64 } from './useAppState'
import { getPdfTableData, totalHours } from './useTableRows'
import { addToast } from './useToast'
import { formatDateDMY } from '../utils/dates'
import { LOGO_UTM_URL, WATERMARK_URL, UTM_GREEN, UTM_GOLD } from '../utils/constants'
import { isPreviewOpen, previewUrl } from './usePdfState'

// 'digital': sin columna de firma diaria (la firma de cierre ya certifica todo el documento
// cuando se firma electrónicamente). 'print': con columna de firma diaria vacía, para tinta.
const PDF_MODES = {
  digital: {
    head: ['N°', 'FECHA', 'ACTIVIDAD REALIZADA', 'ENTRADA', 'SALIDA', 'OBSERVACIONES'],
    columnStyles: {
      0: { cellWidth: 9, halign: 'center' },
      1: { cellWidth: 25, halign: 'center' },
      2: { cellWidth: 'auto' },
      3: { cellWidth: 20, halign: 'center' },
      4: { cellWidth: 20, halign: 'center' },
      5: { cellWidth: 40 },
    },
  },
  print: {
    head: ['N°', 'FECHA', 'ACTIVIDAD REALIZADA', 'ENTRADA', 'SALIDA', 'FIRMA SUP.', 'OBSERVACIONES'],
    columnStyles: {
      0: { cellWidth: 9, halign: 'center' },
      1: { cellWidth: 25, halign: 'center' },
      2: { cellWidth: 'auto' },
      3: { cellWidth: 20, halign: 'center' },
      4: { cellWidth: 20, halign: 'center' },
      5: { cellWidth: 25, halign: 'center' },
      6: { cellWidth: 40 },
    },
  },
}

function loadImage(url) {
  return new Promise((resolve) => {
    const img = new Image()
    img.crossOrigin = 'Anonymous'
    img.onload = () => resolve(img)
    img.onerror = () => resolve(null) // no rompe la generación si falta la imagen
    img.src = url
  })
}

function drawImageProp(doc, imgElement, x, y, maxW, maxH, align = 'left', opacity = 1) {
  if (!imgElement) return
  const ratio = imgElement.width / imgElement.height
  let w = maxW
  let h = w / ratio
  if (h > maxH) {
    h = maxH
    w = h * ratio
  }
  let finalX = x
  let finalY = y
  if (align === 'center') {
    finalX = x - w / 2
    finalY = y - h / 2
  } else if (align === 'right') {
    finalX = x - w
  }
  if (opacity !== 1) {
    doc.saveGraphicsState()
    doc.setGState(new doc.GState({ opacity }))
  }
  doc.addImage(imgElement, 'PNG', finalX, finalY, w, h)
  if (opacity !== 1) doc.restoreGraphicsState()
}

async function buildDocument(mode) {
  const doc = new jsPDF('l', 'mm', 'a4')
  const pW = doc.internal.pageSize.width
  const pH = doc.internal.pageSize.height

  const student = (formState.studentName || 'ESTUDIANTE').toUpperCase()
  const faculty = (formState.facultyName || 'FACULTAD').toUpperCase()
  const supervisor = (formState.supervisorName || 'SUPERVISOR').toUpperCase()
  const company = (formState.companyName || 'INSTITUCIÓN').toUpperCase()
  const fase = formState.fase || 'I'
  const period = `${formatDateDMY(formState.startDate)} - ${formatDateDMY(formState.endDate)}`
  const totHrs = totalHours.value

  const [imgUTM, imgWater, imgComp] = await Promise.all([
    loadImage(LOGO_UTM_URL),
    loadImage(WATERMARK_URL),
    logoCompanyBase64.value ? loadImage(logoCompanyBase64.value) : Promise.resolve(null),
  ])

  const drawBaseTemplate = (data) => {
    // Ancla al centro del área útil bajo la franja de encabezado (25mm), no al centro de toda la página.
    const waterY = 25 + (pH - 25) / 2
    if (imgWater) drawImageProp(doc, imgWater, pW / 2, waterY, 90, 90, 'center', 0.03)

    doc.setFillColor(...UTM_GREEN)
    doc.rect(0, 0, pW, 22, 'F')
    doc.setFillColor(...UTM_GOLD)
    doc.rect(0, 22, pW, 3, 'F')

    if (imgUTM) drawImageProp(doc, imgUTM, 14, 2, 47, 18, 'left')
    if (imgComp) drawImageProp(doc, imgComp, pW - 14, 2, 47, 18, 'right')

    doc.setTextColor(255)
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(14)
    doc.text('UNIVERSIDAD TÉCNICA DE MANABÍ', pW / 2, 9, { align: 'center' })
    doc.setFontSize(9)
    doc.setFont('helvetica', 'normal')
    doc.text(faculty, pW / 2, 14, { align: 'center' })
    doc.setFontSize(11)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(...UTM_GOLD)
    doc.text(`REGISTRO DE ASISTENCIA DIARIA - PRÁCTICAS PRE PROFESIONALES PPP ${fase}`, pW / 2, 20, { align: 'center' })

    doc.setTextColor(40)
    doc.setFontSize(9)

    doc.setFont('helvetica', 'bold')
    doc.text('Estudiante:', 14, 34)
    doc.setFont('helvetica', 'normal')
    doc.text(student, 35, 34)

    doc.setFont('helvetica', 'bold')
    doc.text('Supervisor Institucional:', 14, 40)
    doc.setFont('helvetica', 'normal')
    doc.text(supervisor, 53, 40)

    doc.setFont('helvetica', 'bold')
    doc.text('Institución Receptora:', 14, 46)
    doc.setFont('helvetica', 'normal')
    doc.text(company, 49, 46)

    doc.setFont('helvetica', 'bold')
    doc.text('Período:', pW - 70, 34)
    doc.setFont('helvetica', 'normal')
    doc.text(period, pW - 54, 34)

    doc.setFont('helvetica', 'bold')
    doc.text('Total Horas Registradas:', pW - 70, 40)
    doc.setTextColor(...UTM_GREEN)
    doc.text(`${totHrs} Horas`, pW - 31, 40)

    doc.setTextColor(40)
    doc.setFont('helvetica', 'bold')
    doc.text('Fase:', pW - 70, 46)
    doc.setFont('helvetica', 'normal')
    doc.text(`PPP ${fase}`, pW - 58, 46)

    doc.setFontSize(8)
    doc.setFont('helvetica', 'italic')
    doc.setTextColor(120)
    doc.text('SRAPP - Sistema de Registro de Asistencias de Prácticas Pre Profesionales - UTM', 14, pH - 8)
    doc.text(`Página ${data.pageNumber}`, pW - 20, pH - 8)
  }

  const { head, columnStyles } = PDF_MODES[mode]

  autoTable(doc, {
    startY: 52,
    margin: { top: 52, left: 14, right: 14, bottom: 25 },
    // 'avoid' evita partir una fila entre dos páginas (dejaba una tira vacía como resto de la fila anterior).
    rowPageBreak: 'avoid',
    head: [head],
    body: getPdfTableData(mode),
    theme: 'grid',
    styles: { font: 'helvetica', fontSize: 8, textColor: [40, 40, 40], valign: 'middle', cellPadding: 2.5 },
    headStyles: { fillColor: UTM_GREEN, textColor: 255, fontStyle: 'bold', halign: 'center', minCellHeight: 8 },
    // 12.5mm asegura ~10 filas por hoja A4 horizontal — necesario en modo impreso, donde ahí se escribe a mano.
    bodyStyles: { minCellHeight: 12.5 },
    columnStyles,
    didDrawPage: drawBaseTemplate,
    didDrawCell: (data) => {
      // Modo digital: una Observaciones vacía se tacha (no se deja en blanco) para que no se
      // pueda escribir algo después de que el documento ya fue firmado electrónicamente.
      if (mode !== 'digital' || data.section !== 'body') return
      const lastColIndex = head.length - 1
      if (data.column.index !== lastColIndex) return
      if (String(data.cell.raw ?? '').trim() !== '') return
      const { x, y, width, height } = data.cell
      doc.setDrawColor(180)
      doc.setLineWidth(0.3)
      doc.line(x + 3, y + height / 2, x + width - 3, y + height / 2)
    },
  })

  // Bloque de cierre: espacio para la única firma que certifica todo el documento (Art. 14, Ley
  // de Comercio Electrónico) — a mano si es impreso, o con FirmaEC/Acrobat si es digital. La app
  // no estampa ninguna imagen aquí, solo deja el espacio y la línea listos.
  // En digital baja un poco más: ahí es donde se coloca el widget de firma de FirmaEC/Acrobat,
  // que necesita algo más de aire que una simple línea para tinta.
  const gapAfterTable = mode === 'digital' ? 32 : 25
  const finalY = doc.lastAutoTable.finalY
  const needsNewPage = finalY > pH - 45
  if (needsNewPage) {
    doc.addPage()
    // addPage() no dispara el hook didDrawPage de autoTable: hay que pintar la plantilla a mano.
    drawBaseTemplate({ pageNumber: doc.internal.getNumberOfPages() })
  }
  // En hoja extra (solo encabezado + firma, sin tabla) se centra en el espacio disponible
  // bajo los metadatos, para que no quede pegada al encabezado y Acrobat tenga aire de sobra.
  const yFirmas = needsNewPage ? 46 + (pH - 25 - 46) / 2 : finalY + gapAfterTable

  doc.setDrawColor(50)
  doc.setLineWidth(0.4)
  const lineW = 80
  doc.line(pW / 2 - lineW / 2, yFirmas, pW / 2 + lineW / 2, yFirmas)

  doc.setFontSize(10)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(30)
  doc.text(supervisor, pW / 2, yFirmas + 5, { align: 'center' })

  doc.setFontSize(8)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(80)
  doc.text('SUPERVISOR DE PRÁCTICAS PRE PROFESIONALES Y PASANTÍAS', pW / 2, yFirmas + 9, { align: 'center' })

  return doc
}

export async function previewPdf(mode) {
  if (getPdfTableData(mode).length === 0) return addToast('La tabla está vacía. Genera filas primero.', true)
  const doc = await buildDocument(mode)
  previewUrl.value = doc.output('bloburl')
  isPreviewOpen.value = true
}

export async function downloadPdf(mode) {
  if (getPdfTableData(mode).length === 0) return addToast('La tabla está vacía. Genera filas primero.', true)
  const doc = await buildDocument(mode)
  const safeName = (formState.studentName || 'Asistencia').trim().replace(/\s+/g, '_')
  doc.save(`SRAPP_Registro_Asistencias_${safeName}.pdf`)
  addToast('PDF exportado correctamente.')
}
