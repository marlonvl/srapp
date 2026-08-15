<script setup>
import { PhFilePdf, PhX, PhDownloadSimple } from '@phosphor-icons/vue'
import { isPreviewOpen, previewUrl, closePreview, isGeneratingPdf } from '../composables/usePdfState'
import { pdfMode } from '../composables/useAppState'

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
  <div v-if="isPreviewOpen" class="fixed inset-0 z-50 modal-overlay flex items-center justify-center p-4">
    <div
      class="bg-surface w-full max-w-[75vw] h-full max-h-[90vh] rounded-xl shadow-2xl flex flex-col border border-line overflow-hidden">
      <div class="h-14 bg-background border-b border-line px-5 flex justify-between items-center shrink-0">
        <h3 class="text-base font-bold text-foreground flex items-center gap-2">
          <PhFilePdf weight="bold" class="text-red-500 text-xl" /> Vista Previa
        </h3>
        <button type="button" @click="closePreview" class="text-muted hover:text-foreground p-1 transition">
          <PhX weight="bold" class="text-xl" />
        </button>
      </div>
      <div class="flex-1 bg-surface-alt w-full relative">
        <iframe :src="previewUrl" class="w-full h-full border-0 bg-white"></iframe>
      </div>
      <div class="h-16 bg-background border-t border-line px-5 flex justify-end items-center gap-4 shrink-0">
        <button type="button" @click="closePreview"
          class="px-5 py-2 text-sm font-medium text-muted hover:text-foreground transition">Cancelar</button>
        <button type="button" @click="handleDownload" :disabled="isGeneratingPdf"
          class="px-5 py-2 text-sm font-bold text-slate-900 bg-utm-gold hover:bg-yellow-400 rounded-lg transition shadow-md flex items-center gap-2 disabled:opacity-50">
          <PhDownloadSimple weight="bold" class="text-lg" /> Confirmar y Descargar
        </button>
      </div>
    </div>
  </div>
</template>
