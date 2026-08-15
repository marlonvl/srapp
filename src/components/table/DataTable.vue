<script setup>
import { tableRows } from '../../composables/useAppState'
import { rowCount, totalHours, addManualRow, clearAllRows } from '../../composables/useTableRows'
import DataTableRow from './DataTableRow.vue'

function handleClearAll() {
  if (!confirm('¿Vaciar toda la tabla? Se perderán todas las filas.')) return
  clearAllRows()
}
</script>

<template>
  <main class="flex-1 p-4 lg:p-6 flex flex-col lg:overflow-hidden relative">
    <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-3">
      <div>
        <h2 class="text-lg font-bold text-foreground">Tabulario de Control Diario</h2>
        <p class="text-xs text-muted">Modifica, añade o elimina registros antes de exportar.</p>
      </div>
      <div class="flex gap-2 w-full sm:w-auto">
        <button type="button" @click="addManualRow"
          class="flex-1 sm:flex-none px-3 py-1.5 text-xs font-medium bg-surface-alt hover:bg-foreground/5 border border-line rounded transition text-foreground">
          + Fila Vacía
        </button>
        <button type="button" @click="handleClearAll"
          class="flex-1 sm:flex-none px-3 py-1.5 text-xs font-medium bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20 rounded transition">
          Vaciar Tabla
        </button>
      </div>
    </div>

    <div class="flex-1 border border-line bg-surface rounded-xl overflow-hidden flex flex-col shadow-lg">
      <div class="overflow-x-auto lg:overflow-y-auto flex-1">
        <table class="w-full text-left border-collapse whitespace-nowrap min-w-200">
          <thead class="bg-background text-[11px] font-bold text-muted uppercase sticky top-0 z-10 border-b border-line">
            <tr>
              <th class="py-3 px-3 w-10 text-center">N°</th>
              <th class="py-3 px-3 w-40">Fecha</th>
              <th class="py-3 px-3 w-40 text-center">Entrada</th>
              <th class="py-3 px-3 w-40 text-center">Salida</th>
              <th class="py-3 px-3 w-16 text-center">Hrs</th>
              <th class="py-3 px-3 min-w-75 w-full">Actividad Realizada</th>
              <th class="py-3 px-3 w-50">Observaciones</th>
              <th class="py-3 px-3 w-20 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-line text-xs text-foreground">
            <DataTableRow v-for="(row, i) in tableRows" :key="row.id" :row="row" :index="i" />
          </tbody>
        </table>
      </div>
      <div class="bg-background border-t border-line px-5 py-3 flex justify-between items-center text-xs text-muted shrink-0">
        <span>{{ rowCount }} registros</span>
        <span class="flex items-center gap-2">Total Horas:
          <span class="font-bold text-utm-green text-sm">{{ totalHours }} Horas</span>
        </span>
      </div>
    </div>
  </main>
</template>
