<script setup>
import { PhStudent, PhSun, PhMoon, PhTrash, PhEye, PhDownloadSimple } from '@phosphor-icons/vue'
import { pdfMode, clearAllData } from '../composables/useAppState'
import { totalHours } from '../composables/useTableRows'
import { isDark, toggleTheme } from '../composables/useTheme'
import { addToast } from '../composables/useToast'
import { isGeneratingPdf } from '../composables/usePdfState'

function handleClearAll() {
  if (!confirm('¿Limpiar TODOS los datos? Esto borra la información general, el cronograma, la tabla y el logo.')) return
  clearAllData()
  addToast('Todos los datos fueron limpiados.')
}

// jspdf/jspdf-autotable son pesados: se cargan solo al usarlos, no en el bundle inicial.
// isGeneratingPdf cubre tanto la descarga del chunk como el armado del documento.
async function handlePreview() {
  isGeneratingPdf.value = true
  try {
    const { previewPdf } = await import('../composables/usePdfExport')
    await previewPdf(pdfMode.value)
  } finally {
    isGeneratingPdf.value = false
  }
}

async function handleDownload() {
  isGeneratingPdf.value = true
  try {
    const { downloadPdf } = await import('../composables/usePdfExport')
    await downloadPdf(pdfMode.value)
  } finally {
    isGeneratingPdf.value = false
  }
}
</script>

<template>
  <header
    class="sticky top-0 min-h-16 bg-surface border-b border-line px-4 sm:px-6 py-2 flex flex-wrap items-center justify-between gap-y-2 shrink-0 z-30 shadow-sm">
    <div class="flex items-center gap-2 sm:gap-3">
      <div class="w-10 h-10 rounded-lg bg-surface-alt border border-line flex items-center justify-center shrink-0">
        <PhStudent weight="bold" class="text-utm-gold text-2xl" />
      </div>
      <div>
        <h1 class="text-base font-bold text-foreground flex items-center gap-2">
          SRAPP
        </h1>
        <p class="text-xs text-muted mt-0.5 hidden sm:block">Sistema de Registro de Asistencias de Prácticas Pre
          Profesionales</p>
      </div>
    </div>

    <div class="flex items-center gap-2 sm:gap-3">
      <div class="bg-surface-alt border border-line px-3 py-2 rounded-lg items-center gap-2 hidden sm:flex">
        <span class="text-xs text-muted">Acumulado:</span>
        <span class="text-sm font-bold text-utm-green bg-utm-green/10 px-2 py-0.5 rounded">{{ totalHours }}
          Hrs</span>
      </div>

      <button type="button" @click="toggleTheme"
        :title="isDark ? 'Cambiar a tema claro' : 'Cambiar a tema oscuro'"
        class="w-9 h-9 shrink-0 flex items-center justify-center rounded-lg border border-line text-muted hover:text-foreground hover:bg-foreground/5 transition">
        <PhSun v-if="isDark" weight="bold" class="text-base" />
        <PhMoon v-else weight="bold" class="text-base" />
      </button>

      <button type="button" @click="handleClearAll" title="Limpiar todos los datos"
        class="w-9 h-9 shrink-0 flex items-center justify-center rounded-lg border border-line text-muted hover:text-red-500 hover:bg-red-500/5 transition">
        <PhTrash weight="bold" class="text-base" />
      </button>

      <div class="hidden md:flex items-center bg-surface-alt border border-line rounded-lg p-1 text-xs font-semibold">
        <button type="button" @click="pdfMode = 'digital'" class="px-3 py-1.5 rounded-md transition"
          :class="pdfMode === 'digital' ? 'bg-utm-green text-white' : 'text-muted hover:text-foreground'">
          Digital
        </button>
        <button type="button" @click="pdfMode = 'print'" class="px-3 py-1.5 rounded-md transition"
          :class="pdfMode === 'print' ? 'bg-utm-green text-white' : 'text-muted hover:text-foreground'">
          Para Imprimir
        </button>
      </div>

      <button type="button" @click="handlePreview" :disabled="isGeneratingPdf" title="Vista Previa"
        class="flex items-center gap-1.5 px-2.5 sm:px-4 py-2 text-xs font-bold text-foreground bg-surface-alt hover:bg-foreground/5 border border-line rounded-lg transition-all shadow-md disabled:opacity-50">
        <PhEye weight="bold" class="text-base" /> <span class="hidden sm:inline">Vista Previa</span>
      </button>
      <button type="button" @click="handleDownload" :disabled="isGeneratingPdf" title="Descargar PDF"
        class="flex items-center gap-1.5 px-2.5 sm:px-4 py-2 text-xs font-bold text-slate-900 bg-utm-gold hover:bg-yellow-400 rounded-lg transition-all shadow-md active:scale-95 disabled:opacity-50">
        <PhDownloadSimple weight="bold" class="text-base" /> <span class="hidden sm:inline">Descargar PDF</span>
      </button>
    </div>
  </header>
</template>
