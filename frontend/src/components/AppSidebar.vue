<script setup lang="ts">
// Recibimos los datos del archivo padre (App.vue)
defineProps<{
  isCorpoMode: boolean,
  isExpanded: boolean,
  userHandle: string,
  userClass: string,
  currentBalance: number,
  reputation: any,
  xpPercentage: number,
  currentView: string
}>();

// Eventos para comunicarse con el padre
const emit = defineEmits(['toggle-sidebar', 'logout', 'navigate']);
</script>

<template>
  <aside 
    class="flex-shrink-0 border-r flex flex-col transition-all duration-300 relative z-40"
    :class="[
      isCorpoMode ? 'bg-white border-gray-300 shadow-xl' : 'bg-[#080c11] border-cyan-900/50', 
      isExpanded ? 'w-64' : 'w-20' 
    ]">
    
    <button @click="emit('toggle-sidebar')" 
       class="absolute -right-3 top-10 w-6 h-6 border rounded-full flex items-center justify-center text-xs z-50 cursor-pointer transition-transform hover:scale-110"
       :class="isCorpoMode ? 'bg-white border-gray-400 text-black' : 'bg-gray-900 border-cyan-500 text-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.5)]'">
       {{ isExpanded ? '<' : '>' }}
    </button>

    <div class="p-6 text-center border-b transition-all overflow-hidden whitespace-nowrap relative" 
         :class="isCorpoMode ? 'border-gray-300' : 'border-cyan-900/30'">
      
      <div class="mx-auto rounded-full border-2 mb-3 flex items-center justify-center font-bold transition-all"
           :class="[
             isCorpoMode ? 'border-red-600 bg-zinc-100 text-red-600' : 'border-cyan-500 bg-cyan-900/20 text-white shadow-[0_0_15px_rgba(6,182,212,0.4)]', 
             isExpanded ? 'w-16 h-16 text-2xl' : 'w-10 h-10 text-lg'
           ]">
        {{ userHandle.charAt(0)?.toUpperCase() }}
      </div>
      
      <div class="transition-opacity duration-300"
           :class="isExpanded ? 'opacity-100 visible' : 'opacity-0 invisible hidden'">
        
        <h2 class="font-bold uppercase tracking-widest truncate" :class="isCorpoMode ? 'text-black' : 'text-white'">
            {{ userHandle }}
        </h2>
        
        <p class="text-xs mt-1 font-bold tracking-widest uppercase" 
           :class="isCorpoMode ? 'text-red-600' : 'text-cyan-400'">
          {{ userClass }}
        </p>
        
        <div class="w-full mt-3 px-1">
          <div class="w-full h-2 bg-gray-800 rounded-full overflow-hidden border border-gray-600 relative">
             <div class="h-full transition-all duration-500 rounded-full" 
                 :class="isCorpoMode ? 'bg-red-600' : 'bg-cyan-500 shadow-[0_0_8px_rgba(6,182,212,0.9)]'"
                 :style="{ width: xpPercentage + '%' }">
            </div>
          </div>
          <p class="text-[9px] mt-1 opacity-60 font-tech text-right" :class="isCorpoMode ? 'text-black' : 'text-white'">
            XP: {{ Math.round(xpPercentage) }}%
          </p>
        </div>

      </div>
    </div>

    <nav class="flex-1 py-6 space-y-2 px-2 overflow-hidden">
      <button v-for="view in ['dashboard', 'transactions', 'stash', 'profile']" :key="view"
        @click="emit('navigate', view)"
        class="w-full text-left px-4 py-3 rounded flex items-center gap-3 transition-all uppercase text-xs font-bold group"
        :class="currentView === view 
          ? (isCorpoMode ? 'bg-red-50 text-red-700 border-l-4 border-red-600' : 'bg-cyan-900/20 text-cyan-300 border-l-4 border-cyan-500') 
          : (isCorpoMode ? 'text-gray-500 hover:bg-gray-100' : 'text-gray-400 hover:bg-white/5 hover:text-white')">
        
        <span class="text-sm font-bold w-5 text-center">{{ view.charAt(0).toUpperCase() }}</span>
        
        <span class="whitespace-nowrap transition-opacity duration-200"
              :class="isExpanded ? 'opacity-100' : 'opacity-0 hidden'">
            {{ view }}
        </span>
      </button>
    </nav>
    
    <div class="p-4 border-t" :class="isCorpoMode ? 'border-gray-300' : 'border-cyan-900/30'">
        <button @click="emit('logout')" 
           class="w-full py-2 text-xs uppercase font-bold text-red-500 hover:text-red-400 flex items-center justify-center gap-2 transition-all">
          <span>[X]</span>
          <span :class="isExpanded ? 'block' : 'hidden'">SALIR</span>
        </button>
    </div>
  </aside>
</template>