<script setup>
import { WEEK_DAYS } from '../../utils/constants'
import { removeScheduleRow } from '../../composables/useAppState'

defineProps({
  row: { type: Object, required: true },
})
</script>

<template>
  <div class="flex items-center gap-1.5">
    <select v-model="row.dia" class="field-input py-1.5 px-2 text-[11px] flex-1 bg-background">
      <option v-for="d in WEEK_DAYS" :key="d" :value="d">{{ d }}</option>
    </select>
    <input v-model="row.entrada" type="time"
      class="field-input py-1.5 px-1 text-[11px] w-17.5 text-center bg-background">
    <input v-model="row.salida" type="time"
      class="field-input py-1.5 px-1 text-[11px] w-17.5 text-center bg-background">
    <button type="button" @click="removeScheduleRow(row.id)" class="text-faint hover:text-red-500 p-1.5 transition">
      <i class="ph-bold ph-trash text-sm"></i>
    </button>
  </div>
</template>
