import { ref } from 'vue'

export const toasts = ref([])

let nextId = 1

export function addToast(message, isError = false) {
  const id = nextId++
  toasts.value.push({ id, message, isError })
  setTimeout(() => {
    toasts.value = toasts.value.filter((t) => t.id !== id)
  }, 3000)
}
