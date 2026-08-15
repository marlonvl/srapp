<script setup>
import { isPreviewOpen, previewUrl, closePreview } from '../composables/usePdfState'
import { pdfMode } from '../composables/useAppState'

async function handleDownload() {
  const { downloadPdf } = await import('../composables/usePdfExport')
  downloadPdf(pdfMode.value)
}
</script>

<template>
  <div v-if="isPreviewOpen" class="fixed inset-0 z-50 modal-overlay flex items-center justify-center p-4">
    <div
      class="bg-surface w-full max-w-[75vw] h-full max-h-[90vh] rounded-xl shadow-2xl flex flex-col border border-line overflow-hidden">
      <div class="h-14 bg-background border-b border-line px-5 flex justify-between items-center shrink-0">
        <h3 class="text-base font-bold text-foreground flex items-center gap-2">
          <i class="ph-bold ph-file-pdf text-red-500 text-xl"></i> Vista Previa
        </h3>
        <button type="button" @click="closePreview" class="text-muted hover:text-foreground p-1 transition">
          <i class="ph-bold ph-x text-xl"></i>
        </button>
      </div>
      <div class="flex-1 bg-surface-alt w-full relative">
        <iframe :src="previewUrl" class="w-full h-full border-0 bg-white"></iframe>
      </div>
      <div class="h-16 bg-background border-t border-line px-5 flex justify-end items-center gap-4 shrink-0">
        <button type="button" @click="closePreview"
          class="px-5 py-2 text-sm font-medium text-muted hover:text-foreground transition">Cancelar</button>
        <button type="button" @click="handleDownload"
          class="px-5 py-2 text-sm font-bold text-slate-900 bg-utm-gold hover:bg-yellow-400 rounded-lg transition shadow-md flex items-center gap-2">
          <i class="ph-bold ph-download-simple text-lg"></i> Confirmar y Descargar
        </button>
      </div>
    </div>
  </div>
</template>
