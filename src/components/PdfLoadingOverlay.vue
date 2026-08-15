<script setup>
import { isGeneratingPdf } from '../composables/usePdfState'
</script>

<template>
  <div v-if="isGeneratingPdf" class="fixed inset-0 z-60 modal-overlay flex items-center justify-center">
    <div class="bg-surface border border-line rounded-xl px-6 py-5 flex flex-col items-center gap-3 shadow-2xl">
      <div class="w-8 h-8 border-3 border-utm-green/20 border-t-utm-green rounded-full animate-spin"></div>
      <p class="text-sm font-medium text-foreground">Generando PDF...</p>
    </div>
  </div>
</template>
