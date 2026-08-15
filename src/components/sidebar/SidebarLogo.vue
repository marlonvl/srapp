<script setup>
import { ref } from 'vue'
import { logoCompanyBase64, clearLogoCompany, hasStoredLogo } from '../../composables/useAppState'
import { addToast } from '../../composables/useToast'
import { useSavedFlash } from '../../composables/useSavedFlash'

const { justSaved, flash } = useSavedFlash()
const pendingPreview = ref(null)

function handleFileChange(e) {
  const file = e.target.files[0]
  if (!file) return
  const reader = new FileReader()
  reader.onload = (ev) => {
    pendingPreview.value = ev.target.result
  }
  reader.readAsDataURL(file)
}

function handleSave() {
  if (!pendingPreview.value) return addToast('Selecciona una imagen primero.', true)
  if (hasStoredLogo() && !confirm('Ya hay un logo guardado. ¿Reemplazarlo?')) return
  logoCompanyBase64.value = pendingPreview.value
  pendingPreview.value = null
  addToast('Logo guardado.')
  flash()
}

function handleClear() {
  if (!confirm('¿Quitar el logo de la institución?')) return
  clearLogoCompany()
  pendingPreview.value = null
  addToast('Logo de institución quitado.')
}
</script>

<template>
  <div class="bg-surface border rounded-lg p-4 transition-colors duration-500"
    :class="justSaved ? 'border-utm-green bg-utm-green/5' : 'border-line'">
    <div class="flex justify-between items-center mb-3">
      <h2 class="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-2">
        <i class="ph-bold ph-image text-utm-gold text-lg"></i> 3. Logo Institución
      </h2>
      <button v-if="logoCompanyBase64" type="button" @click="handleClear" title="Quitar logo"
        class="text-faint hover:text-red-500 p-1 transition">
        <i class="ph-bold ph-trash text-sm"></i>
      </button>
    </div>

    <div v-if="pendingPreview || logoCompanyBase64"
      class="mb-3 flex flex-col items-center justify-center bg-background border border-line rounded-lg p-3 h-16 gap-1">
      <img :src="pendingPreview || logoCompanyBase64" alt="Logo institución" class="max-h-10 max-w-full object-contain">
      <span v-if="pendingPreview" class="text-[9px] text-utm-gold font-semibold">Sin guardar</span>
    </div>

    <input type="file" accept="image/*" @change="handleFileChange"
      class="w-full text-xs text-muted file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-background file:text-utm-gold hover:file:bg-surface-alt cursor-pointer outline-none mb-3">

    <button type="button" @click="handleSave"
      class="w-full py-2 text-xs font-semibold text-utm-green bg-background border border-line hover:border-utm-green/50 hover:bg-utm-green/5 rounded transition-colors flex items-center justify-center gap-2">
      <i class="ph-bold ph-floppy-disk text-base"></i> Guardar Logo
    </button>

    <p class="text-[10px] text-faint mt-2 leading-relaxed">Coloca el logo de la institución donde realizas tus prácticas.</p>
  </div>
</template>
