<template>
  <div 
    v-if="isVisible" 
    class="confirm-modal-overlay"
    @click="handleOverlayClick"
  >
    <div class="confirm-modal" @click.stop>
      <!-- Header -->
      <div class="confirm-modal__header">
        <div class="confirm-modal__icon">
          <svg class="icon icon--danger" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
          </svg>
        </div>
        <h3 class="confirm-modal__title">{{ title }}</h3>
      </div>

      <!-- Content -->
      <div class="confirm-modal__content">
        <p class="confirm-modal__message">{{ message }}</p>
        <div v-if="staffInfo" class="staff-info">
          <div class="staff-info__item">
            <span class="staff-info__label">ชื่อ:</span>
            <span class="staff-info__value">{{ staffInfo.name }}</span>
          </div>
          <div class="staff-info__item">
            <span class="staff-info__label">ตำแหน่ง:</span>
            <span class="staff-info__value">{{ staffInfo.role }}</span>
          </div>
        </div>
        <div class="warning-note">
          <svg class="warning-icon" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
          </svg>
          <span>การกระทำนี้ไม่สามารถย้อนกลับได้</span>
        </div>
      </div>

      <!-- Actions -->
      <div class="confirm-modal__actions">
        <button 
          class="btn btn--secondary"
          @click="handleCancel"
          :disabled="loading"
        >
          ยกเลิก
        </button>
        <button 
          class="btn btn--danger"
          @click="handleConfirm"
          :disabled="loading"
        >
          <span v-if="loading" class="loading-spinner"></span>
          <span v-else>ยืนยันการลบ</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

interface StaffInfo {
  name: string
  role: string
}

interface Props {
  isVisible: boolean
  title?: string
  message?: string
  staffInfo?: StaffInfo
  loading?: boolean
}

interface Emits {
  (e: 'confirm'): void
  (e: 'cancel'): void
}

const props = withDefaults(defineProps<Props>(), {
  title: 'ยืนยันการลบพนักงาน',
  message: 'คุณต้องการลบพนักงานคนนี้ออกจากระบบหรือไม่?',
  loading: false
})

const emit = defineEmits<Emits>()

const handleConfirm = () => {
  emit('confirm')
}

const handleCancel = () => {
  emit('cancel')
}

const handleOverlayClick = () => {
  if (!props.loading) {
    handleCancel()
  }
}
</script>

<style scoped>
.confirm-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
  animation: fadeIn 0.2s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.confirm-modal {
  background: white;
  border-radius: 16px;
  box-shadow: 
    0 25px 50px -12px rgba(0, 0, 0, 0.25),
    0 0 0 1px rgba(0, 0, 0, 0.05);
  max-width: 450px;
  width: 90%;
  max-height: 90vh;
  overflow: hidden;
  animation: slideUp 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(16px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.confirm-modal__header {
  padding: 2rem 2rem 1rem 2rem;
  text-align: center;
}

.confirm-modal__icon {
  width: 4rem;
  height: 4rem;
  margin: 0 auto 1rem;
  background: linear-gradient(135deg, #fee2e2, #fecaca);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.icon {
  width: 2rem;
  height: 2rem;
}

.icon--danger {
  color: #dc2626;
}

.confirm-modal__title {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: #111827;
}

.confirm-modal__content {
  padding: 0 2rem 1rem 2rem;
}

.confirm-modal__message {
  margin: 0 0 1.5rem 0;
  font-size: 0.95rem;
  color: #6b7280;
  line-height: 1.5;
  text-align: center;
}

.staff-info {
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1rem;
}

.staff-info__item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
}

.staff-info__item:last-child {
  margin-bottom: 0;
}

.staff-info__label {
  font-weight: 500;
  color: #6b7280;
}

.staff-info__value {
  font-weight: 600;
  color: #111827;
}

.warning-note {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem;
  background: #fef3c7;
  border: 1px solid #fbbf24;
  border-radius: 8px;
  font-size: 0.85rem;
  color: #92400e;
}

.warning-icon {
  width: 1rem;
  height: 1rem;
  flex-shrink: 0;
}

.confirm-modal__actions {
  padding: 1rem 2rem 2rem 2rem;
  display: flex;
  gap: 0.75rem;
  justify-content: center;
}

.btn {
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 500;
  font-size: 0.9rem;
  border: none;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  min-width: 120px;
  justify-content: center;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn--secondary {
  background: #f3f4f6;
  color: #374151;
  border: 1px solid #d1d5db;
}

.btn--secondary:hover:not(:disabled) {
  background: #e5e7eb;
}

.btn--danger {
  background: linear-gradient(135deg, #dc2626, #b91c1c);
  color: white;
}

.btn--danger:hover:not(:disabled) {
  background: linear-gradient(135deg, #b91c1c, #991b1b);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(220, 38, 38, 0.4);
}

.loading-spinner {
  width: 1rem;
  height: 1rem;
  border: 2px solid transparent;
  border-top: 2px solid currentColor;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

@media (max-width: 640px) {
  .confirm-modal {
    width: 95%;
    margin: 1rem;
  }
  
  .confirm-modal__header,
  .confirm-modal__content,
  .confirm-modal__actions {
    padding-left: 1.5rem;
    padding-right: 1.5rem;
  }
  
  .confirm-modal__actions {
    flex-direction: column;
  }
  
  .btn {
    width: 100%;
  }
}
</style>
