<script setup>
import { computed } from 'vue'
import { PhTrash } from '@phosphor-icons/vue'
import { calculateHours } from '../../utils/dates'
import { deleteRow } from '../../composables/useTableRows'

const props = defineProps({
  row: { type: Object, required: true },
  index: { type: Number, required: true },
})

const hours = computed(() => calculateHours(props.row.entrada, props.row.salida))
</script>

<template>
  <tr class="hover:bg-foreground/5 transition-colors group">
    <td class="py-3 px-3 text-center text-muted font-medium">{{ index + 1 }}</td>
    <td class="py-3 px-2">
      <input v-model="row.fecha" type="date"
        class="w-full bg-transparent border-none outline-none text-xs text-foreground px-2 py-1 focus:bg-surface-alt rounded">
    </td>
    <td class="py-3 px-2">
      <input v-model="row.entrada" type="time"
        class="w-full bg-transparent border-none outline-none text-xs text-center text-foreground focus:bg-surface-alt rounded py-1">
    </td>
    <td class="py-3 px-2">
      <input v-model="row.salida" type="time"
        class="w-full bg-transparent border-none outline-none text-xs text-center text-foreground focus:bg-surface-alt rounded py-1">
    </td>
    <td class="py-3 px-2 text-center font-bold text-utm-green">{{ hours }}</td>
    <td class="py-3 px-2">
      <textarea v-model="row.actividad" rows="1" placeholder="Actividad..."
        class="w-full bg-transparent border-none outline-none text-xs text-foreground px-2 py-1 resize-y focus:bg-surface-alt rounded leading-relaxed"></textarea>
    </td>
    <td class="py-3 px-2">
      <input v-model="row.observaciones" type="text" placeholder="Opcional"
        class="w-full bg-transparent border-none outline-none text-xs text-muted px-2 py-1 focus:bg-surface-alt rounded">
    </td>
    <td class="py-3 px-2 text-center">
      <button type="button" @click="deleteRow(row.id)" title="Eliminar fila"
        class="text-muted hover:text-red-500 transition p-1">
        <PhTrash weight="bold" class="text-base" />
      </button>
    </td>
  </tr>
</template>
