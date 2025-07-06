<template>
  <div id="app">
    <RouterView />
    <NotificationSystem />
    <ConfirmDeleteModal 
      :is-visible="confirmState.isVisible"
      :title="confirmState.options.title"
      :message="confirmState.options.message"
      :staff-info="confirmState.options.staffInfo"
      :loading="confirmState.loading"
      @confirm="handleConfirm"
      @cancel="handleCancel"
    />
  </div>
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router'
import NotificationSystem from '@/components/NotificationSystem.vue'
import ConfirmDeleteModal from '@/components/ConfirmDeleteModal.vue'
import { globalConfirm } from '@/composables/useConfirm'

const { confirmState, handleConfirm, handleCancel } = globalConfirm
</script>
