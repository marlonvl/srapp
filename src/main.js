import { createApp } from 'vue'
import '@phosphor-icons/web/bold'
import '@fontsource/plus-jakarta-sans/400.css'
import '@fontsource/plus-jakarta-sans/500.css'
import '@fontsource/plus-jakarta-sans/600.css'
import '@fontsource/plus-jakarta-sans/700.css'
import './style.css'
import App from './App.vue'
import { loadFromLocalStorage } from './composables/useAppState'

loadFromLocalStorage()
createApp(App).mount('#app')
