<script setup>
import { PhWarningCircle, PhCheckCircle } from '@phosphor-icons/vue'
import { toasts } from '../composables/useToast'
</script>

<template>
  <div id="toast-container">
    <TransitionGroup name="toast">
      <div v-for="t in toasts" :key="t.id" class="toast" :class="{ error: t.isError }">
        <PhWarningCircle v-if="t.isError" weight="bold" class="text-lg" />
        <PhCheckCircle v-else weight="bold" class="text-lg" />
        <span>{{ t.message }}</span>
      </div>
    </TransitionGroup>
  </div>
</template>
