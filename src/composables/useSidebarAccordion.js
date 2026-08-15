import { ref, computed } from 'vue'

// Solo relevante en mobile (breakpoint lg): en escritorio las 4 secciones se ven siempre expandidas.
const openSection = ref(1)

export function useSidebarAccordion(id) {
  const isOpen = computed(() => openSection.value === id)

  function toggle() {
    openSection.value = isOpen.value ? null : id
  }

  return { isOpen, toggle }
}
