<script setup>
import AppHeader from './components/AppHeader.vue'
import SidebarGeneralInfo from './components/sidebar/SidebarGeneralInfo.vue'
import SidebarSchedule from './components/sidebar/SidebarSchedule.vue'
import SidebarLogo from './components/sidebar/SidebarLogo.vue'
import SidebarBackup from './components/sidebar/SidebarBackup.vue'
import DataTable from './components/table/DataTable.vue'
import PreviewModal from './components/PreviewModal.vue'
import ToastContainer from './components/ToastContainer.vue'
import PdfLoadingOverlay from './components/PdfLoadingOverlay.vue'
</script>

<template>
  <ToastContainer />
  <PdfLoadingOverlay />
  <AppHeader />
  <div class="flex-1 flex flex-col lg:flex-row lg:overflow-hidden">
    <aside
      class="w-full lg:w-95 bg-background border-r border-line flex flex-col shrink-0 lg:overflow-y-auto p-5 gap-5 relative">
      <SidebarGeneralInfo />
      <SidebarSchedule />
      <SidebarLogo />
      <SidebarBackup />
    </aside>
    <DataTable />
  </div>
  <PreviewModal />
</template>
