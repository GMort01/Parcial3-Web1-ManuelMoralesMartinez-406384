<script setup lang="ts">
import { useNotifications } from '../composables/useNotifications';

const { notifications, remove } = useNotifications();
</script>

<template>
  <div class="fixed top-4 right-4 z-50 flex flex-col gap-3 pointer-events-none">
    <transition-group name="toast">
      <div v-for="n in notifications" :key="n.id"
           class="pointer-events-auto min-w-[300px] p-4 border-l-4 shadow-2xl backdrop-blur-md relative overflow-hidden font-tech uppercase tracking-wider text-sm flex items-center justify-between"
           :class="{
             'bg-gray-900/90 border-green-500 text-green-400': n.type === 'success',
             'bg-gray-900/90 border-red-500 text-red-400': n.type === 'error',
             'bg-gray-900/90 border-cyan-500 text-cyan-400': n.type === 'info'
           }">
        
        <div class="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
        
        <div class="flex items-center gap-3 relative z-10">
           <span class="text-xl">{{ n.type === 'success' ? '✅' : n.type === 'error' ? '⚠️' : 'ℹ️' }}</span>
           <span>{{ n.message }}</span>
        </div>

        <button @click="remove(n.id)" class="relative z-10 hover:text-white transition-colors text-xs opacity-50 hover:opacity-100">✕</button>
      </div>
    </transition-group>
  </div>
</template>

<style scoped>
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}
.toast-enter-from {
  opacity: 0;
  transform: translateX(30px);
}
.toast-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
</style>