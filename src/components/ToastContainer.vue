<script setup>
import { toasts } from '../composables/useToast'
</script>

<template>
  <div id="toast-container">
    <TransitionGroup name="toast">
      <div v-for="t in toasts" :key="t.id" class="toast" :class="{ error: t.isError }">
        <i class="ph-bold" :class="t.isError ? 'ph-warning-circle text-lg' : 'ph-check-circle text-lg'"></i>
        <span>{{ t.message }}</span>
      </div>
    </TransitionGroup>
  </div>
</template>
