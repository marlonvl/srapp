import { ref } from 'vue'

export const isPreviewOpen = ref(false)
export const previewUrl = ref('')
export const isGeneratingPdf = ref(false)

export function closePreview() {
  isPreviewOpen.value = false
  previewUrl.value = ''
}
