<script setup>
import { pdfMode, clearAllData } from '../composables/useAppState'
import { totalHours } from '../composables/useTableRows'
import { previewPdf, downloadPdf } from '../composables/usePdfExport'
import { isDark, toggleTheme } from '../composables/useTheme'
import { addToast } from '../composables/useToast'

function handleClearAll() {
  if (!confirm('¿Limpiar TODOS los datos? Esto borra la información general, el cronograma, la tabla y el logo.')) return
  clearAllData()
  addToast('Todos los datos fueron limpiados.')
}
</script>

<template>
  <header
    class="h-16 bg-surface border-b border-line px-6 flex items-center justify-between shrink-0 z-30 shadow-sm">
    <div class="flex items-center gap-3">
      <div class="w-10 h-10 rounded-lg bg-surface-alt border border-line flex items-center justify-center">
        <i class="ph-bold ph-student text-utm-gold text-2xl"></i>
      </div>
      <div>
        <h1 class="text-base font-bold text-foreground flex items-center gap-2">
          SRAPP
        </h1>
        <p class="text-xs text-muted mt-0.5">Sistema de Registro de Asistencias de Prácticas Pre Profesionales</p>
      </div>
    </div>

    <div class="flex items-center gap-3">
      <div class="bg-surface-alt border border-line px-3 py-2 rounded-lg items-center gap-2 hidden sm:flex">
        <span class="text-xs text-muted">Acumulado:</span>
        <span class="text-sm font-bold text-utm-green bg-utm-green/10 px-2 py-0.5 rounded">{{ totalHours }}
          Hrs</span>
      </div>

      <button type="button" @click="toggleTheme"
        :title="isDark ? 'Cambiar a tema claro' : 'Cambiar a tema oscuro'"
        class="w-9 h-9 flex items-center justify-center rounded-lg border border-line text-muted hover:text-foreground hover:bg-foreground/5 transition">
        <i class="ph-bold text-base" :class="isDark ? 'ph-sun' : 'ph-moon'"></i>
      </button>

      <button type="button" @click="handleClearAll" title="Limpiar todos los datos"
        class="w-9 h-9 flex items-center justify-center rounded-lg border border-line text-muted hover:text-red-500 hover:bg-red-500/5 transition">
        <i class="ph-bold ph-trash text-base"></i>
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

      <button type="button" @click="previewPdf(pdfMode)"
        class="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-foreground bg-surface-alt hover:bg-foreground/5 border border-line rounded-lg transition-all shadow-md">
        <i class="ph-bold ph-eye text-base"></i> Vista Previa
      </button>
      <button type="button" @click="downloadPdf(pdfMode)"
        class="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-slate-900 bg-utm-gold hover:bg-yellow-400 rounded-lg transition-all shadow-md active:scale-95">
        <i class="ph-bold ph-download-simple text-base"></i> Descargar PDF
      </button>
    </div>
  </header>
</template>
