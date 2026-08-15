<script setup>
import { PhIdentificationCard, PhTrash, PhCaretDown, PhFloppyDisk, PhCheckCircle } from '@phosphor-icons/vue'
import {
  formState, saveGeneralInfo, clearGeneralInfo, hasStoredGeneralInfo, isGeneralInfoSaved,
} from '../../composables/useAppState'
import { addToast } from '../../composables/useToast'
import { useSavedFlash } from '../../composables/useSavedFlash'
import { useSidebarAccordion } from '../../composables/useSidebarAccordion'

const { justSaved, flash } = useSavedFlash()
const { isOpen, toggle } = useSidebarAccordion(1)

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
    <div class="flex justify-between items-center mb-3 cursor-pointer lg:cursor-default select-none" @click="toggle"
      role="button" :aria-expanded="isOpen">
      <h2 class="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-2">
        <PhIdentificationCard weight="bold" class="text-utm-gold text-lg" /> 1. Información General
        <span v-if="isGeneralInfoSaved"
          class="normal-case text-[9px] font-semibold text-utm-green bg-utm-green/10 px-1.5 py-0.5 rounded-full flex items-center gap-1">
          <PhCheckCircle weight="bold" /> Guardado
        </span>
      </h2>
      <div class="flex items-center gap-1">
        <button type="button" @click.stop="handleClear" title="Limpiar esta sección"
          class="text-faint hover:text-red-500 p-1 transition">
          <PhTrash weight="bold" class="text-sm" />
        </button>
        <PhCaretDown weight="bold" class="text-sm text-muted transition-transform lg:hidden"
          :class="{ 'rotate-180': isOpen }" />
      </div>
    </div>
    <div class="space-y-3" :class="isOpen ? 'block' : 'hidden lg:block'">
      <div class="grid grid-cols-3 gap-3">
        <div class="col-span-2">
          <label class="block text-xs font-medium text-muted mb-1">Estudiante</label>
          <input v-model="formState.studentName" type="text" placeholder="Ej: Pérez García Juan Carlos"
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
          <input v-model="formState.supervisorName" type="text" placeholder="Ej: Ing. Pérez García Juan Carlos"
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
        <PhFloppyDisk weight="bold" class="text-base" /> Guardar Datos
      </button>
    </div>
  </div>
</template>
