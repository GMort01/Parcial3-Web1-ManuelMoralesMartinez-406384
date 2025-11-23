<script setup lang="ts">
import { ref, onMounted } from 'vue';
import api from '../services/api';
import AIAnalytics from '../components/AIAnalytics.vue';
import { useNotifications } from '../composables/useNotifications';
const { notify } = useNotifications();

// Props para recibir el modo (Corpo/Street) desde App.vue
defineProps<{ isCorpoMode: boolean }>();
const emits = defineEmits(['update-balance']);

const summary = ref<any>({ totalIncome: 0, totalExpense: 0, balance: 0 });
const transactions = ref([]);
const loading = ref(true);

const formatMoney = (n: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n);

onMounted(async () => {
  try {
    const [resSummary, resTrans] = await Promise.all([api.get('/summary'), api.get('/transactions')]);
    summary.value = resSummary.data;
    transactions.value = resTrans.data;
    // EMITIR el balance al padre para actualizar la barra XP
    emits('update-balance', summary.value.balance ?? 0);
  } catch (err) {
    console.error('Error cargando dashboard:', err);
    notify('Error al cargar datos del dashboard', 'error');
  } finally {
    loading.value = false;
  }
});
</script>

<template>
  <div class="space-y-8 animate-fade-in">
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div v-for="(val, label) in {Balance: summary.balance, Ingreso: summary.totalIncome, Gasto: summary.totalExpense}" :key="label"
           class="p-8 border-l-8 relative overflow-hidden transition-all group min-h-[160px] flex flex-col justify-center"
           :class="[isCorpoMode ? 'bg-white shadow-xl border-gray-400' : 'bg-[#0b1016] neon-border-cyan cyber-clip border-cyan-500', 
                    label==='Gasto' && !isCorpoMode ? 'neon-border-pink border-pink-500' : '']">
         <h3 class="text-sm uppercase tracking-[0.3em] opacity-70 mb-2 font-bold">{{ label }}</h3>
         <p class="text-5xl font-bold font-tech tracking-tighter"
            :class="label === 'Gasto' ? (isCorpoMode ? 'text-red-600' : 'text-pink-500') : (isCorpoMode ? 'text-gray-900' : 'text-white')">
            {{ formatMoney(val) }}
         </p>
      </div>
    </div>

    <section class="border p-8 flex flex-col relative min-h-[500px]"
      :class="isCorpoMode ? 'bg-white border-gray-300 shadow-lg' : 'bg-[#0b1016]/90 neon-border-pink cyber-clip'">
      <div class="flex justify-between items-center mb-6 border-b pb-4" :class="isCorpoMode ? 'border-gray-200' : 'border-pink-900/50'">
          <h3 class="font-bold uppercase text-sm tracking-[0.3em]" :class="isCorpoMode ? 'text-red-800' : 'text-pink-500'">CORTEX_AI // PREDICTIVE SUITE</h3>
      </div>
      <div class="flex-1">
          <AIAnalytics :transactions="transactions" :summary="summary" />
      </div>
    </section>
  </div>
</template>