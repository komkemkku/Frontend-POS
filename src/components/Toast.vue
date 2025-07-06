<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <TransitionRoot
    as="template"
    :show="show"
    enter="transform ease-out duration-500 transition"
    enter-from="translate-x-full opacity-0 scale-95"
    enter-to="translate-x-0 opacity-100 scale-100"
    leave="transition ease-in duration-300"
    leave-from="translate-x-0 opacity-100 scale-100"
    leave-to="translate-x-full opacity-0 scale-95"
  >
    <div class="pointer-events-auto w-full max-w-sm overflow-hidden rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-10 border-l-4 transition-all duration-300 hover:shadow-xl"
         :class="{
           'border-green-400': type === 'success',
           'border-red-400': type === 'error', 
           'border-blue-400': type === 'info',
           'border-yellow-400': type === 'warning'
         }">
      <div class="p-4">
        <div class="flex items-start">
          <div class="flex-shrink-0">
            <div class="flex h-8 w-8 items-center justify-center rounded-full transition-transform duration-200 hover:scale-110"
                 :class="{
                   'bg-green-100': type === 'success',
                   'bg-red-100': type === 'error',
                   'bg-blue-100': type === 'info', 
                   'bg-yellow-100': type === 'warning'
                 }">
              <CheckCircleIcon v-if="type === 'success'" class="h-5 w-5 text-green-600" aria-hidden="true" />
              <XCircleIcon v-else-if="type === 'error'" class="h-5 w-5 text-red-600" aria-hidden="true" />
              <InformationCircleIcon v-else-if="type === 'info'" class="h-5 w-5 text-blue-600" aria-hidden="true" />
              <ExclamationTriangleIcon v-else class="h-5 w-5 text-yellow-600" aria-hidden="true" />
            </div>
          </div>
          <div class="ml-3 w-0 flex-1 pt-0.5">
            <p class="text-sm font-semibold leading-tight"
               :class="{
                 'text-green-800': type === 'success',
                 'text-red-800': type === 'error',
                 'text-blue-800': type === 'info',
                 'text-yellow-800': type === 'warning'
               }">{{ title }}</p>
            <p v-if="message" class="mt-1 text-xs text-gray-600 leading-relaxed">{{ message }}</p>
          </div>
          <div class="ml-4 flex flex-shrink-0">
            <button
              type="button"
              class="inline-flex rounded-md bg-white text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-200 hover:bg-gray-50"
              :class="{
                'focus:ring-green-500': type === 'success',
                'focus:ring-red-500': type === 'error',
                'focus:ring-blue-500': type === 'info',
                'focus:ring-yellow-500': type === 'warning'
              }"
              @click="$emit('close')"
            >
              <span class="sr-only">Close</span>
              <XMarkIcon class="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </div>
  </TransitionRoot>
</template>

<script setup lang="ts">
import { TransitionRoot } from '@headlessui/vue'
import {
  CheckCircleIcon,
  XCircleIcon,
  InformationCircleIcon,
  ExclamationTriangleIcon,
  XMarkIcon
} from '@heroicons/vue/24/outline'

export type ToastType = 'success' | 'error' | 'warning' | 'info'

interface Props {
  show: boolean
  type: ToastType
  title: string
  message?: string
}

interface Emits {
  close: []
}

const props = withDefaults(defineProps<Props>(), {
  show: false,
  type: 'success',
  title: '',
  message: ''
})

defineEmits<Emits>()
</script>
