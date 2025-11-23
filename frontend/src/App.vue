<script setup lang="ts">
import { ref, watch, computed, onMounted, onUnmounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import NeuralToast from './components/NeuralToast.vue';
import AppSidebar from './components/AppSidebar.vue';
import useHotkeys from './composables/useHotkeys';

const router = useRouter();
const route = useRoute();

// --- DATOS DEL USUARIO ---
const userHandle = ref(localStorage.getItem('edis_user') || '');
const isLoggedIn = ref(!!userHandle.value);
const isCorpoMode = ref(localStorage.getItem('edis_theme') === 'corpo');
const userClass = ref(localStorage.getItem('edis_class') || 'NETRUNNER');
const isSidebarExpanded = ref(true);
const currentView = ref('dashboard');

const currentBalance = ref(0);

// Guardar el tema (rojo o azul) en memoria
watch(isCorpoMode, (val) => localStorage.setItem('edis_theme', val ? 'corpo' : 'street'));

// --- NIVELES DE JUEGO ---
const reputation = computed(() => {
  const money = currentBalance.value;
  if (money < 500) return { level: 1, title: 'RATA CALLEJERA', next: 500 };
  if (money < 2000) return { level: 5, title: 'NOVATO', next: 2000 };
  if (money < 5000) return { level: 15, title: 'MERCENARIO', next: 5000 };
  if (money < 10000) return { level: 30, title: 'FIXER', next: 10000 };
  return { level: 50, title: 'LEYENDA', next: 100000 };
});

const xpPercentage = computed(() => {
  const { next } = reputation.value;
  if (currentBalance.value >= next) return 100;
  return Math.min((currentBalance.value / next) * 100, 100);
});

// modal control + handler con log
const showTransModal = ref(false);
const openTransModal = (e?: Event) => {
  console.log('[app] openTransModal triggered', e);
  showTransModal.value = true;
};

// montar/limpiar listener global (misma referencia)
onMounted(() => {
  window.addEventListener('trigger-new-modal', openTransModal);
});
onUnmounted(() => {
  window.removeEventListener('trigger-new-modal', openTransModal);
});

// atajos: añadimos alt+n + ctrl+n y una alternativa ctrl+alt+n
useHotkeys({
  'alt+n': () => { console.log('[hotkey] alt+n'); window.dispatchEvent(new Event('trigger-new-modal')); },
  'ctrl+n': () => { console.log('[hotkey] ctrl+n'); window.dispatchEvent(new Event('trigger-new-modal')); },
  'ctrl+alt+n': () => { console.log('[hotkey] ctrl+alt+n'); window.dispatchEvent(new Event('trigger-new-modal')); },
  'n': () => { /* opcional: atajo sin modificador si lo quieres */ }
}, { ignoreInputs: true });

// --- FUNCIONES DE BOTONES ---
const login = () => {
  if (!userHandle.value.trim()) return;
  localStorage.setItem('edis_user', userHandle.value);
  isLoggedIn.value = true;
  router.push({ name: 'dashboard' }).catch(() => {}); 
};

const logout = () => {
  if(!confirm("¿DESCONEXIÓN FORZADA?")) return;
  localStorage.removeItem('edis_user');
  isLoggedIn.value = false;
  userHandle.value = '';
  router.push('/');
};

const updateBalance = (newBalance: number) => {
  currentBalance.value = newBalance;
}

const handleNavigate = (view: string) => { 
    currentView.value = view; 
    router.push({ name: view }).catch(() => {}); 
};
</script>

<template>
  <div :class="['min-h-screen flex transition-colors duration-700 font-sans overflow-hidden', 
    isCorpoMode ? 'bg-zinc-50 text-black' : 'bg-[#050a0e] text-white']">

    <NeuralToast />

    <div v-if="!isLoggedIn" class="fixed inset-0 z-50 flex items-center justify-center bg-black">
      <div class="p-10 border border-cyan-500/30 bg-gray-900 w-full max-w-md text-center">
        <h1 class="text-5xl font-bold text-white mb-2">EdisFlow</h1>
        <p class="text-cyan-600 text-xs tracking-[0.4em] mb-10">ACCESO REQUERIDO</p>
        <input v-model="userHandle" @keyup.enter="login" type="text" placeholder="TU NOMBRE..." class="w-full bg-black border-b-2 border-cyan-500 p-4 text-center text-white mb-8 uppercase">
        <button @click="login" class="w-full bg-cyan-700 hover:bg-cyan-600 text-white py-4 font-bold uppercase">ENTRAR</button>
      </div>
    </div>

    <div v-else class="flex w-full h-screen">
      
      <AppSidebar
        :is-corpo-mode="isCorpoMode"
        :is-expanded="isSidebarExpanded"
        :user-handle="userHandle"
        :user-class="userClass"
        :current-balance="currentBalance"
        :reputation="reputation"
        :xp-percentage="xpPercentage"
        :current-view="currentView"
        @toggle-sidebar="isSidebarExpanded = !isSidebarExpanded"
        @logout="logout"
        @navigate="handleNavigate"
      />

      <main class="flex-1 overflow-y-auto relative p-4 md:p-10">
          <header class="flex justify-between items-center mb-8 pb-6 border-b"
             :class="isCorpoMode ? 'border-gray-300' : 'border-cyan-900/50'">
             <div>
                <h1 class="text-4xl font-bold uppercase">
                  {{ route.name || 'DASHBOARD' }}
                </h1>
             </div>
             
             <button @click="isCorpoMode = !isCorpoMode" class="border px-4 py-2 text-xs font-bold uppercase">
                {{ isCorpoMode ? '🔴 MODO: ARASAKA' : '🔵 MODO: NIGHT CITY' }}
             </button>
          </header>

          <RouterView :isCorpoMode="isCorpoMode" @update-balance="updateBalance" />
          
      </main>
    </div>

    <!-- muestra el modal para probar -->
    <div v-if="showTransModal" class="fixed inset-0 z-50 flex items-center justify-center">
      <div class="bg-black/80 absolute inset-0" @click="showTransModal = false"></div>
      <div class="bg-white p-6 z-60 rounded">
        <p>Modal abierto por hotkey</p>
        <button @click="showTransModal = false">Cerrar</button>
      </div>
    </div>
  </div>
</template>