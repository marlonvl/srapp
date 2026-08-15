import { ref, watch } from 'vue'

const STORAGE_KEY = 'theme'

// El script inline de index.html ya aplicó la clase antes del primer paint; solo leemos ese estado.
export const isDark = ref(document.documentElement.classList.contains('dark'))

watch(isDark, (value) => {
  document.documentElement.classList.toggle('dark', value)
  localStorage.setItem(STORAGE_KEY, value ? 'dark' : 'light')
})

export function toggleTheme() {
  isDark.value = !isDark.value
}
