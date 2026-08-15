<script setup>
import { ref } from 'vue'
import { exportBackup, importBackupFromFile, importBackupFromText } from '../../composables/useBackup'
import { hasExistingData } from '../../composables/useAppState'

const pasteText = ref('')

function confirmOverwrite() {
  return !hasExistingData() || confirm('Ya tienes datos cargados en la app. ¿Aplicar este JSON de todas formas?')
}

function handleFileChange(e) {
  const file = e.target.files[0]
  if (file && confirmOverwrite()) importBackupFromFile(file)
  e.target.value = ''
}

function handleImportPaste() {
  if (!pasteText.value.trim()) return
  if (!confirmOverwrite()) return
  importBackupFromText(pasteText.value)
  pasteText.value = ''
}
</script>

<template>
  <div class="bg-surface border border-line rounded-lg p-4">
    <h2 class="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-2 mb-3">
      <i class="ph-bold ph-database text-utm-gold text-lg"></i> 4. Respaldo (JSON)
    </h2>
    <p class="text-[10px] text-faint mb-3 leading-relaxed">
      Sin cuentas ni servidor: tus datos viven solo en este navegador. Exporta un respaldo para no
      perderlos, o pega/carga un JSON para rellenar varias filas por fecha de una sola vez.
    </p>

    <button type="button" @click="exportBackup"
      class="w-full py-2 mb-3 text-xs font-semibold text-utm-green bg-background border border-line hover:border-utm-green/50 hover:bg-utm-green/5 rounded transition-colors flex items-center justify-center gap-2">
      <i class="ph-bold ph-download-simple text-base"></i> Exportar Respaldo
    </button>

    <label class="block text-xs font-medium text-muted mb-1">Importar desde archivo</label>
    <input type="file" accept="application/json" @change="handleFileChange"
      class="w-full text-xs text-muted file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-background file:text-utm-green hover:file:bg-surface-alt cursor-pointer outline-none mb-3">

    <label class="block text-xs font-medium text-muted mb-1">O pegar JSON directamente</label>
    <textarea v-model="pasteText" rows="3" placeholder='{"filas": [{"fecha": "2026-08-03", "actividad": "..."}]}'
      class="field-input font-mono text-[11px] resize-y mb-2"></textarea>
    <button type="button" @click="handleImportPaste"
      class="w-full py-1.5 text-[11px] font-medium text-muted border border-line hover:bg-foreground/5 rounded transition">
      Aplicar JSON Pegado
    </button>
  </div>
</template>
