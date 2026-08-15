import { ref } from 'vue'

// Confirmación visual tenue en el bloque, además del toast, para que se note qué se guardó.
export function useSavedFlash(durationMs = 1200) {
  const justSaved = ref(false)

  function flash() {
    justSaved.value = true
    setTimeout(() => {
      justSaved.value = false
    }, durationMs)
  }

  return { justSaved, flash }
}
