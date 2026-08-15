<script setup>
import {
  formState, scheduleDays, addScheduleRow, saveScheduleInfo, clearScheduleInfo, hasStoredSchedule,
} from '../../composables/useAppState'
import { generateRowsFromDates } from '../../composables/useTableRows'
import { addToast } from '../../composables/useToast'
import { useSavedFlash } from '../../composables/useSavedFlash'
import ScheduleRow from './ScheduleRow.vue'

const { justSaved, flash } = useSavedFlash()

function handleSaveSchedule() {
  if (hasStoredSchedule() && !confirm('Ya hay un cronograma guardado. ¿Sobrescribirlo?')) return
  saveScheduleInfo()
  addToast('Horarios por día guardados.')
  flash()
}

function handleClear() {
  if (!confirm('¿Limpiar fechas y días del cronograma?')) return
  clearScheduleInfo()
  addToast('Cronograma limpiado.')
}
</script>

<template>
  <div class="bg-surface border rounded-lg p-4 transition-colors duration-500"
    :class="justSaved ? 'border-utm-green bg-utm-green/5' : 'border-line'">
    <div class="flex justify-between items-center mb-3">
      <h2 class="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-2">
        <i class="ph-bold ph-calendar text-utm-gold text-lg"></i> 2. Cronograma Base
      </h2>
      <button type="button" @click="handleClear" title="Limpiar esta sección"
        class="text-faint hover:text-red-500 p-1 transition">
        <i class="ph-bold ph-trash text-sm"></i>
      </button>
    </div>
    <div class="grid grid-cols-2 gap-3 mb-3">
      <div>
        <label class="block text-xs font-medium text-muted mb-1">Fecha Inicio</label>
        <input v-model="formState.startDate" type="date" class="field-input">
      </div>
      <div>
        <label class="block text-xs font-medium text-muted mb-1">Fecha Fin</label>
        <input v-model="formState.endDate" type="date" class="field-input">
      </div>
    </div>

    <div class="flex items-center justify-between mb-2 mt-4">
      <label class="block text-xs font-medium text-muted">Días Asignados</label>
      <button type="button" @click="addScheduleRow()"
        class="text-[10px] font-bold bg-surface-alt text-foreground px-2 py-1 rounded hover:bg-foreground/5 flex items-center gap-1 transition">
        <i class="ph-bold ph-plus"></i> Añadir Día
      </button>
    </div>
    <div class="space-y-2 mb-3 max-h-40 overflow-y-auto pr-1">
      <ScheduleRow v-for="row in scheduleDays" :key="row.id" :row="row" />
    </div>
    <button type="button" @click="handleSaveSchedule"
      class="w-full py-1.5 text-[11px] font-medium text-muted border border-line hover:bg-foreground/5 rounded mb-3 transition">
      Guardar Configuración de Días
    </button>
    <button type="button" @click="generateRowsFromDates"
      class="w-full py-2 text-xs font-bold text-utm-gold bg-utm-gold/10 border border-utm-gold/20 hover:bg-utm-gold/20 rounded shadow-sm transition">
      Generar Filas en Blanco
    </button>
  </div>
</template>
