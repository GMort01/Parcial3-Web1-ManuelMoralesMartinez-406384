<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import api from '../services/api'; // Asegúrate que esta ruta sea correcta
import { useNotifications } from '../composables/useNotifications'; 

const { notify } = useNotifications();
defineProps<{ isCorpoMode: boolean }>();
const emit = defineEmits(['update-balance']);

const transactions = ref([]);
const categories = ref([]);
const searchQuery = ref('');
const filterType = ref('ALL');
const showTransModal = ref(false);

// Datos del formulario
const transForm = ref({ 
  description: '', 
  amount: 0, 
  type: 'EXPENSE', 
  categoryId: '' 
});

// Cargar datos al iniciar
const fetchData = async () => {
  try {
    const [resTrans, resCats] = await Promise.all([api.get('/transactions'), api.get('/categories')]);
    transactions.value = resTrans.data || [];
    categories.value = resCats.data || [];
  } catch (e) { 
    console.error(e);
  }
};

onMounted(fetchData);

// --- FUNCIÓN PARA GUARDAR (ARREGLADA) ---
const saveTransaction = async () => {
  // Revisar que no esté vacío
  if (!transForm.value.description || !transForm.value.categoryId) {
      alert("Por favor llena los datos");
      return;
  }

  try {
    // Guardar en base de datos
    await api.post('/transactions', transForm.value);
    
    // Actualizar la tabla
    await fetchData();
    
    // Actualizar el dinero total arriba
    const resSummary = await api.get('/summary');
    emit('update-balance', resSummary.data.balance ?? 0);
    
    notify('Guardado con éxito', 'success');
    showTransModal.value = false; // Cerrar modal
    
    // Limpiar formulario
    transForm.value = { description: '', amount: 0, type: 'EXPENSE', categoryId: '' };
  } catch (e) {
    console.error(e);
    alert("Error al guardar");
  }
};

// --- FUNCIÓN PARA BORRAR (ARREGLADA) ---
const deleteTransaction = async (id: number) => {
  if(!confirm("¿Seguro que quieres borrar esto?")) return;
  
  try {
    await api.delete(`/transactions/${id}`);
    await fetchData(); // Recargar tabla
    
    const resSummary = await api.get('/summary');
    emit('update-balance', resSummary.data.balance ?? 0);
    
    notify('Borrado', 'info');
  } catch (e) {
    console.error(e);
  }
};

// Filtros del buscador
const filteredTransactions = computed(() => {
  return transactions.value.filter((t: any) => {
    const catName = t.category ? t.category.name : '';
    const matchesSearch = t.description.toLowerCase().includes(searchQuery.value.toLowerCase()) || 
                          catName.toLowerCase().includes(searchQuery.value.toLowerCase());
    const matchesType = filterType.value === 'ALL' || t.type === filterType.value;
    return matchesSearch && matchesType;
  });
});

const formatMoney = (n: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n);
</script>

<template>
  <div class="h-full flex flex-col">
    
    <div class="mb-6 flex flex-col md:flex-row gap-4 p-4 border items-center justify-between"
        :class="isCorpoMode ? 'bg-white border-gray-300' : 'bg-[#0b1016] border-cyan-900/50 text-cyan-400'">
        
        <div class="flex gap-4 items-center w-full md:w-auto flex-wrap">
            <button @click="showTransModal = true" 
               class="px-6 py-2 font-bold border-l-4 cursor-pointer text-white"
               :class="isCorpoMode ? 'bg-red-600' : 'bg-cyan-700'">
               + NUEVA OPERACIÓN
            </button>

            <input v-model="searchQuery" type="text" placeholder="BUSCAR..." 
                   class="border p-2 bg-transparent focus:outline-none"
                   :class="isCorpoMode ? 'border-gray-400 text-black' : 'border-cyan-800 text-white'">
            
            <div class="flex gap-2">
                <button v-for="ft in ['ALL', 'INCOME', 'EXPENSE']" :key="ft" @click="filterType = ft"
                   class="px-3 py-2 border"
                   :class="filterType === ft ? 'bg-gray-500 text-white' : ''">
                   {{ ft === 'ALL' ? 'TODO' : ft === 'INCOME' ? 'ING' : 'GST' }}
                </button>
            </div>
        </div>
    </div>

    <div class="flex-1 overflow-y-auto border" :class="isCorpoMode ? 'bg-white' : 'bg-[#0b1016]'">
        <table class="w-full text-left text-sm">
            <thead class="sticky top-0" :class="isCorpoMode ? 'bg-gray-200 text-black' : 'bg-black text-cyan-500'">
                <tr><th class="p-4">DESCRIPCIÓN</th><th class="p-4">CATEGORÍA</th><th class="p-4">MONTO</th><th class="p-4">ACCIÓN</th></tr>
            </thead>
            <tbody>
                <tr v-for="t in filteredTransactions" :key="t.id" class="border-b hover:bg-opacity-10 hover:bg-gray-500">
                    <td class="p-4 font-bold" :class="t.type === 'INCOME' ? 'text-green-500' : 'text-red-500'">{{ t.description }}</td>
                    <td class="p-4">{{ t.category ? t.category.name : '---' }}</td>
                    <td class="p-4 font-bold">{{ formatMoney(t.amount) }}</td>
                    <td class="p-4">
                        <button @click="deleteTransaction(t.id)" class="text-xs border px-2 py-1 text-red-500 border-red-500 hover:bg-red-500 hover:text-white">
                            ELIMINAR
                        </button>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>

    <div v-if="showTransModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
      <div class="p-8 w-full max-w-md border-l-4 bg-gray-900 text-white border-cyan-500">
        <h2 class="text-xl font-bold mb-6">Nueva Operación</h2>
        
        <div class="space-y-4">
          <input v-model="transForm.description" class="w-full border p-3 bg-black text-white" placeholder="DESCRIPCIÓN">
          
          <div class="grid grid-cols-2 gap-4">
            <input v-model="transForm.amount" type="number" class="w-full border p-3 bg-black text-white" placeholder="MONTO">
            <select v-model="transForm.type" class="w-full border p-3 bg-black text-white">
               <option value="INCOME">INGRESO</option>
               <option value="EXPENSE">GASTO</option>
            </select>
          </div>
          
          <select v-model="transForm.categoryId" class="w-full border p-3 bg-black text-white">
            <option value="" disabled>ELIGE CATEGORÍA...</option>
            <option v-for="c in categories" :key="c.id" :value="c.id">{{ c.name }}</option>
          </select>
          
          <div class="flex gap-4 mt-6">
              <button @click="showTransModal = false" class="flex-1 py-3 border border-gray-600 text-gray-300">CANCELAR</button>
              <button @click="saveTransaction" class="flex-1 py-3 font-bold bg-cyan-700 hover:bg-cyan-600 text-white">CONFIRMAR</button>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>