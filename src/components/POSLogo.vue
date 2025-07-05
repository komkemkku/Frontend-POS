<template>
  <div class="flex flex-col items-center">
    <!-- Professional Logo -->
    <div 
      :class="[
        'gradient-logo rounded-3xl flex items-center justify-center shadow-logo transform transition-all duration-300 border-2 border-blue-100/50',
        size === 'large' ? 'h-24 w-24 mb-6 hover:scale-105' : 
        size === 'medium' ? 'h-16 w-16 mb-4 hover:scale-102' :
        'h-12 w-12 mb-3'
      ]"
    >
      <div class="relative">
        <!-- Main Building/Store Icon -->
        <svg 
          :class="[
            'text-white drop-shadow-sm',
            size === 'large' ? 'h-11 w-11' :
            size === 'medium' ? 'h-7 w-7' : 
            'h-5 w-5'
          ]" 
          fill="currentColor" 
          viewBox="0 0 24 24"
        >
          <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
        </svg>
        <!-- POS Terminal Icon Overlay -->
        <div 
          :class="[
            'absolute bg-white rounded-lg flex items-center justify-center shadow-md border border-blue-100',
            size === 'large' ? '-bottom-1 -right-1 h-6 w-6' :
            size === 'medium' ? '-bottom-0.5 -right-0.5 h-4 w-4' :
            '-bottom-0.5 -right-0.5 h-3 w-3'
          ]"
        >
          <svg 
            :class="[
              'text-blue-600',
              size === 'large' ? 'h-3.5 w-3.5' :
              size === 'medium' ? 'h-2.5 w-2.5' :
              'h-2 w-2'
            ]" 
            fill="currentColor" 
            viewBox="0 0 20 20"
          >
            <path fill-rule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm0 4a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1V8zm8 0a1 1 0 011-1h4a1 1 0 011 1v2a1 1 0 01-1 1h-4a1 1 0 01-1-1V8z" clip-rule="evenodd" />
          </svg>
        </div>
      </div>
    </div>
    
    <!-- Brand Name (only show for large size) -->
    <div v-if="showBrand && size === 'large'" class="text-center">
      <h1 class="text-4xl font-bold text-gray-900 mb-2 tracking-tight">
        POS<span class="text-gradient">Dev</span>
      </h1>
      <div class="flex items-center justify-center">
        <div class="h-0.5 w-12 bg-gradient-to-r from-transparent via-blue-600 to-transparent rounded-full mr-3"></div>
        <span class="text-xs font-semibold text-gray-500 uppercase tracking-widest">Management System</span>
        <div class="h-0.5 w-12 bg-gradient-to-r from-transparent via-blue-600 to-transparent rounded-full ml-3"></div>
      </div>
    </div>
    
    <!-- Simple Brand Name (for medium/small) -->
    <div v-else-if="showBrand" class="text-center">
      <h2 
        :class="[
          'font-bold text-gray-900 tracking-tight',
          size === 'medium' ? 'text-xl' : 'text-lg'
        ]"
      >
        POS<span class="text-gradient">Dev</span>
      </h2>
    </div>
  </div>
</template>

<script setup>
defineProps({
  size: {
    type: String,
    default: 'large',
    validator: (value) => ['small', 'medium', 'large'].includes(value)
  },
  showBrand: {
    type: Boolean,
    default: true
  }
})
</script>
