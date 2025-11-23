<script setup lang="ts">
import { ref, onMounted } from 'vue';
import api from '../services/api';
import { useNotifications } from '../composables/useNotifications';

const { notify } = useNotifications();
defineProps<{ isCorpoMode: boolean }>();

const goals = ref<any[]>([]);
const showGoalModal = ref(false);
const goalForm = ref({ name: '', targetAmount: 0, icon: '🎯' });

const fetchData = async () => {
  const res = await api.get('/goals');
  goals.value = res.data;
};
onMounted(fetchData);

const saveGoal = async () => {
  if(!goalForm.value.name || !goalForm.value.targetAmount) return notify("Faltan datos", "error");
  try {
    await api.post('/goals', { ...goalForm.value, targetAmount: Number(goalForm.value.targetAmount) });
    showGoalModal.value = false;
    goalForm.value = { name: '', targetAmount: 0, icon: '🎯' };
    fetchData();
    notify("Objetivo establecido", "success");
  } catch(e) { notify("Error al guardar", "error"); }
};

const addFundsToGoal = async (goal: any) => {
  const amount = prompt(`¿Cuántos Edis inyectar a: ${goal.name}?`);
  if (!amount) return;
  try {
    await api.put(`/goals/${goal.id}/add`, { amount: Number(amount) });
    fetchData();
    notify("Fondos transferidos", "success");
  } catch(e) { notify("Error al transferir", "error"); }
};

const deleteGoal = async (id: number) => {
  if(!confirm("¿ABORTAR MISIÓN?")) return;
  try {
    await api.delete(`/goals/${id}`);
    fetchData();
    notify("Objetivo eliminado", "info");
  } catch(e) { notify("Error al eliminar", "error"); }
};

const getProgress = (current: number, target: number) => Math.min((current / target) * 100, 100);
const formatMoney = (n: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n);
</script>

<template>
  <div class="h-full animate-fade-in relative flex flex-col">
    
    <div class="mb-8 flex justify-end">
        <button @click="showGoalModal = true" 
           class="px-6 py-2 font-bold uppercase text-xs tracking-widest border-l-4 transition-all shadow-lg"
           :class="isCorpoMode 
             ? 'bg-purple-700 text-white border-purple-900 hover:bg-purple-800' 
             : 'btn-cyber bg-gradient-to-r from-purple-700 to-indigo-900 text-white border-purple-400'">
           + Nueva Meta
        </button>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-for="g in goals" :key="g.id" 
           class="p-6 relative group border transition-all"
           :class="isCorpoMode ? 'bg-white border-gray-300 shadow-xl text-black' : 'bg-[#0b1016] neon-border-cyan cyber-clip border-cyan-500 text-white'">
        
        <div class="flex justify-between items-start mb-4">
          <div class="text-4xl">{{ g.icon }}</div>
          <button @click="deleteGoal(g.id)" class="text-xs text-red-500 opacity-0 group-hover:opacity-100 transition-opacity font-bold border border-red-500 px-2 py-1 hover:bg-red-500 hover:text-white">ELIMINAR</button>
        </div>
        
        <h3 class="text-xl font-bold uppercase mb-1">{{ g.name }}</h3>
        <div class="flex justify-between text-xs font-tech opacity-70 mb-2">
          <span>ACTUAL: {{ formatMoney(g.currentAmount) }}</span>
          <span>META: {{ formatMoney(g.targetAmount) }}</span>
        </div>
        
        <div class="w-full h-4 rounded-full overflow-hidden border relative"
             :class="isCorpoMode ? 'bg-gray-200 border-gray-300' : 'bg-gray-800 border-gray-700'">
          <div class="h-full transition-all duration-1000 relative"
               :style="{ width: getProgress(g.currentAmount, g.targetAmount) + '%' }"
               :class="getProgress(g.currentAmount, g.targetAmount) >= 100 ? 'bg-green-500' : 'bg-gradient-to-r from-cyan-500 to-blue-600'">
               <div v-if="!isCorpoMode" class="absolute top-0 left-0 w-full h-full bg-white/20 animate-pulse"></div>
          </div>
        </div>
        
        <button @click="addFundsToGoal(g)" 
          class="mt-6 w-full py-2 border border-dashed text-xs uppercase font-bold tracking-widest hover:bg-opacity-10 transition-colors"
          :class="isCorpoMode ? 'border-gray-400 text-gray-600 hover:bg-gray-100' : 'border-cyan-500 text-cyan-400 hover:bg-cyan-500'">
          + Inyectar Fondos
        </button>
      </div>
      
      <div v-if="goals.length === 0" class="col-span-full text-center py-20 opacity-50 font-tech" :class="isCorpoMode ? 'text-black' : 'text-white'">
        /// NO HAY OBJETIVOS ACTIVOS /// INICIE PROTOCOLO DE AHORRO
      </div>
    </div>

    <div v-if="showGoalModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div class="p-8 w-full max-w-md shadow-2xl border-l-4 relative"
           :class="isCorpoMode ? 'bg-white text-black border-purple-700' : 'bg-[#0b1016] text-white border-purple-500 cyber-clip neon-border-pink'">
        <h2 class="text-xl font-bold uppercase mb-6" :class="isCorpoMode ? 'text-purple-700' : 'text-purple-400'">Nuevo Objetivo</h2>
        <div class="space-y-4">
          <input v-model="goalForm.name" class="w-full border p-3 focus:outline-none uppercase" 
             :class="isCorpoMode ? 'bg-gray-50 border-gray-300 focus:border-purple-700' : 'bg-gray-900 border-gray-700 focus:border-purple-500 text-white'" placeholder="NOMBRE">
          <input v-model="goalForm.targetAmount" type="number" class="w-full border p-3 focus:outline-none" 
             :class="isCorpoMode ? 'bg-gray-50 border-gray-300 focus:border-purple-700' : 'bg-gray-900 border-gray-700 focus:border-purple-500 text-white'" placeholder="MONTO META">
          
          <div class="flex gap-2 overflow-x-auto pb-2">
             <button v-for="ic in ['🎯','🚗','🏠','🦾','💊','🎸','💻']" :key="ic" @click="goalForm.icon = ic"
               class="p-3 border text-xl transition-colors" 
               :class="[
                 goalForm.icon===ic 
                   ? (isCorpoMode ? 'border-purple-700 bg-purple-100' : 'border-purple-500 bg-purple-900/30') 
                   : (isCorpoMode ? 'border-gray-300 hover:bg-gray-100' : 'border-gray-700 hover:bg-purple-900/50')
               ]">{{ ic }}</button>
          </div>

          <div class="flex gap-4 mt-6">
              <button @click="showGoalModal = false" class="flex-1 py-3 border hover:bg-opacity-10" :class="isCorpoMode ? 'border-gray-400 text-gray-600 hover:bg-gray-200' : 'border-gray-600 text-gray-300 hover:bg-white'">CANCELAR</button>
              <button @click="saveGoal" class="flex-1 py-3 font-bold text-white" :class="isCorpoMode ? 'bg-purple-700 hover:bg-purple-800' : 'bg-purple-700 hover:bg-purple-600'">INICIAR</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>