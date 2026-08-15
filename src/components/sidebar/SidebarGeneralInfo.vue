<script setup>
import { formState, saveGeneralInfo, clearGeneralInfo, hasStoredGeneralInfo } from '../../composables/useAppState'
import { addToast } from '../../composables/useToast'
import { useSavedFlash } from '../../composables/useSavedFlash'

const { justSaved, flash } = useSavedFlash()

function handleSave() {
  if (hasStoredGeneralInfo() && !confirm('Ya hay datos guardados para esta sección. ¿Sobrescribirlos?')) return
  saveGeneralInfo()
  addToast('Datos del formulario guardados localmente.')
  flash()
}

function handleClear() {
  if (!confirm('¿Limpiar los datos de información general?')) return
  clearGeneralInfo()
  addToast('Información general limpiada.')
}
</script>

<template>
  <div class="bg-surface border rounded-lg p-4 transition-colors duration-500"
    :class="justSaved ? 'border-utm-green bg-utm-green/5' : 'border-line'">
    <div class="flex justify-between items-center mb-3">
      <h2 class="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-2">
        <i class="ph-bold ph-identification-card text-utm-gold text-lg"></i> 1. Información General
      </h2>
      <button type="button" @click="handleClear" title="Limpiar esta sección"
        class="text-faint hover:text-red-500 p-1 transition">
        <i class="ph-bold ph-trash text-sm"></i>
      </button>
    </div>
    <div class="space-y-3">
      <div class="grid grid-cols-3 gap-3">
        <div class="col-span-2">
          <label class="block text-xs font-medium text-muted mb-1">Estudiante</label>
          <input v-model="formState.studentName" type="text" placeholder="Nombre completo del estudiante"
            class="field-input">
        </div>
        <div>
          <label class="block text-xs font-medium text-muted mb-1">Fase</label>
          <select v-model="formState.fase" class="field-input">
            <option value="I">PPP I</option>
            <option value="II">PPP II</option>
          </select>
        </div>
      </div>

      <div class="border-t border-line pt-3 space-y-3">
        <div>
          <label class="block text-xs font-medium text-muted mb-1">Facultad</label>
          <input v-model="formState.facultyName" type="text" placeholder="Ej: Facultad de Ciencias Informáticas"
            class="field-input">
        </div>
        <div>
          <label class="block text-xs font-medium text-muted mb-1">Supervisor Institucional (Con Título)</label>
          <input v-model="formState.supervisorName" type="text" placeholder="Nombre y título del supervisor"
            class="field-input">
        </div>
        <div>
          <label class="block text-xs font-medium text-muted mb-1">Institución Receptora</label>
          <input v-model="formState.companyName" type="text" placeholder="Nombre de la empresa o institución"
            class="field-input">
        </div>
      </div>

      <button type="button" @click="handleSave"
        class="w-full py-2 mt-2 text-xs font-semibold text-utm-green bg-background border border-line hover:border-utm-green/50 hover:bg-utm-green/5 rounded transition-colors flex items-center justify-center gap-2">
        <i class="ph-bold ph-floppy-disk text-base"></i> Guardar Datos
      </button>
    </div>
  </div>
</template>
