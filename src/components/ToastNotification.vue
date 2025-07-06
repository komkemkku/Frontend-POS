<template>
  <Teleport to="body">
    <div class="toast-container">
      <TransitionGroup name="toast" tag="div">
        <div
          v-for="toast in toasts"
          :key="toast.id"
          :class="[
            'toast',
            `toast--${toast.type}`,
            { 'toast--persistent': toast.persistent }
          ]"
        >
          <!-- Icon -->
          <div class="toast__icon">
            <svg v-if="toast.type === 'success'" class="icon" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
            </svg>
            
            <svg v-else-if="toast.type === 'error'" class="icon" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
            </svg>
            
            <svg v-else-if="toast.type === 'warning'" class="icon" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
            </svg>
            
            <svg v-else-if="toast.type === 'info'" class="icon" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
            </svg>
          </div>

          <!-- Content -->
          <div class="toast__content">
            <h4 class="toast__title">{{ toast.title }}</h4>
            <p v-if="toast.message" class="toast__message">{{ toast.message }}</p>
          </div>

          <!-- Action Button (if provided) -->
          <button
            v-if="toast.action"
            class="toast__action"
            @click="toast.action.handler"
          >
            {{ toast.action.label }}
          </button>

          <!-- Close Button -->
          <button
            class="toast__close"
            @click="removeToast(toast.id)"
          >
            <svg class="icon" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
            </svg>
          </button>

          <!-- Progress Bar (for non-persistent toasts) -->
          <div
            v-if="!toast.persistent && toast.duration"
            class="toast__progress"
            :style="{ animationDuration: `${toast.duration}ms` }"
          ></div>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useToast } from '@/composables/useToast'

const { toasts, removeToast } = useToast()
</script>

<style scoped>
.toast-container {
  position: fixed;
  top: 1rem;
  right: 1rem;
  z-index: 9999;
  max-width: 400px;
  width: 100%;
}

@media (max-width: 640px) {
  .toast-container {
    top: 0.5rem;
    right: 0.5rem;
    left: 0.5rem;
    max-width: none;
  }
}

.toast {
  position: relative;
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  padding: 1rem;
  margin-bottom: 0.75rem;
  background: white;
  border-radius: 12px;
  box-shadow: 
    0 10px 15px -3px rgba(0, 0, 0, 0.1),
    0 4px 6px -2px rgba(0, 0, 0, 0.05),
    0 0 0 1px rgba(0, 0, 0, 0.05);
  border-left: 4px solid;
  overflow: hidden;
  backdrop-filter: blur(8px);
  min-height: 70px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.toast:hover {
  transform: translateY(-2px);
  box-shadow: 
    0 20px 25px -5px rgba(0, 0, 0, 0.1),
    0 10px 10px -5px rgba(0, 0, 0, 0.04),
    0 0 0 1px rgba(0, 0, 0, 0.05);
}

/* Toast Types */
.toast--success {
  border-left-color: #10b981;
  background: linear-gradient(135deg, #ffffff 0%, #f0fdf4 100%);
}

.toast--error {
  border-left-color: #ef4444;
  background: linear-gradient(135deg, #ffffff 0%, #fef2f2 100%);
}

.toast--warning {
  border-left-color: #f59e0b;
  background: linear-gradient(135deg, #ffffff 0%, #fffbeb 100%);
}

.toast--info {
  border-left-color: #3b82f6;
  background: linear-gradient(135deg, #ffffff 0%, #eff6ff 100%);
}

/* Icon */
.toast__icon {
  flex-shrink: 0;
  width: 1.5rem;
  height: 1.5rem;
  margin-top: 0.125rem;
}

.toast--success .toast__icon {
  color: #10b981;
}

.toast--error .toast__icon {
  color: #ef4444;
}

.toast--warning .toast__icon {
  color: #f59e0b;
}

.toast--info .toast__icon {
  color: #3b82f6;
}

.icon {
  width: 100%;
  height: 100%;
  filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.1));
}

/* Content */
.toast__content {
  flex: 1;
  min-width: 0;
}

.toast__title {
  margin: 0;
  font-size: 0.875rem;
  font-weight: 600;
  color: #111827;
  line-height: 1.4;
}

.toast__message {
  margin: 0.25rem 0 0 0;
  font-size: 0.8rem;
  color: #6b7280;
  line-height: 1.4;
}

/* Action Button */
.toast__action {
  flex-shrink: 0;
  padding: 0.375rem 0.75rem;
  background: transparent;
  border: 1px solid;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  margin-top: 0.125rem;
}

.toast--success .toast__action {
  color: #10b981;
  border-color: #10b981;
}

.toast--success .toast__action:hover {
  background: #10b981;
  color: white;
}

.toast--error .toast__action {
  color: #ef4444;
  border-color: #ef4444;
}

.toast--error .toast__action:hover {
  background: #ef4444;
  color: white;
}

.toast--warning .toast__action {
  color: #f59e0b;
  border-color: #f59e0b;
}

.toast--warning .toast__action:hover {
  background: #f59e0b;
  color: white;
}

.toast--info .toast__action {
  color: #3b82f6;
  border-color: #3b82f6;
}

.toast--info .toast__action:hover {
  background: #3b82f6;
  color: white;
}

/* Close Button */
.toast__close {
  flex-shrink: 0;
  width: 1.25rem;
  height: 1.25rem;
  padding: 0;
  background: transparent;
  border: none;
  color: #9ca3af;
  cursor: pointer;
  border-radius: 4px;
  transition: all 0.2s;
  margin-top: 0.125rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.toast__close:hover {
  color: #6b7280;
  background: #f3f4f6;
}

/* Progress Bar */
.toast__progress {
  position: absolute;
  bottom: 0;
  left: 0;
  height: 3px;
  background: currentColor;
  border-radius: 0 0 12px 12px;
  opacity: 0.3;
  animation: progress linear forwards;
  transform-origin: left;
}

@keyframes progress {
  from {
    transform: scaleX(1);
  }
  to {
    transform: scaleX(0);
  }
}

/* Animations */
.toast-enter-active {
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.toast-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 1, 1);
}

.toast-enter-from {
  opacity: 0;
  transform: translateX(100%) scale(0.8);
}

.toast-leave-to {
  opacity: 0;
  transform: translateX(100%) scale(0.9);
}

.toast-move {
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Persistent toast styling */
.toast--persistent {
  border-left-width: 6px;
  box-shadow: 
    0 20px 25px -5px rgba(0, 0, 0, 0.1),
    0 10px 10px -5px rgba(0, 0, 0, 0.04),
    0 0 0 1px rgba(0, 0, 0, 0.1);
}

.toast--persistent .toast__close {
  color: #ef4444;
}

.toast--persistent .toast__close:hover {
  color: #dc2626;
  background: #fee2e2;
}
</style>
