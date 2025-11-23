<script setup lang="ts">
import { ref } from 'vue';
import api from '../services/api';
import { useNotifications } from '../composables/useNotifications';

const { notify } = useNotifications();

defineProps<{ isCorpoMode: boolean }>();

const userClass = ref(localStorage.getItem('edis_class') || 'NETRUNNER');
const roles = ['NETRUNNER', 'SOLO', 'TECHIE', 'CORPO'];

// --- FUNCIÓN PARA CAMBIAR CLASE (SOLUCIÓN AL PROBLEMA) ---
const selectRole = (role: string) => {
  // 1. Cambiamos el valor visual
  userClass.value = role;
  // 2. Guardamos en memoria
  localStorage.setItem('edis_class', role);
  
  // 3. EL TRUCO: Recargamos la página automáticamente para que 
  // la barra lateral lea el nuevo dato y se actualice.
  setTimeout(() => {
    window.location.reload();
  }, 200);
};

// --- FUNCIÓN PARA BORRAR TODO (AHORA SÍ FUNCIONA) ---
const resetDb = async () => {
  if(!confirm("⚠️ ¿ESTÁS SEGURO? ESTO BORRARÁ TODO TU DINERO Y TRANSACCIONES.")) return;
  
  try {
    notify("Iniciando purga de sistema...", "info");
    
    // 1. Obtenemos todas las transacciones
    const res = await api.get('/transactions');
    const transactions = res.data;

    // 2. Borramos una por una (porque JSON-Server a veces no deja borrar todo de golpe)
    // Usamos Promise.all para que sea rápido
    await Promise.all(transactions.map((t: any) => api.delete(`/transactions/${t.id}`)));

    notify("Sistema reiniciado correctamente", "success");
    
    // Recargamos para que el saldo vuelva a 0
    setTimeout(() => window.location.reload(), 1000);
    
  } catch (error) {
    console.error(error);
    notify("Error al intentar borrar la base de datos", "error");
  }
};

// --- EXPORTAR A EXCEL (CSV) ---
const exportCSV = async () => {
  try {
    const res = await api.get('/transactions');
    const transactions = res.data;

    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "ID,DESCRIPCION,MONTO,TIPO,CATEGORIA,FECHA\n";

    transactions.forEach((t: any) => {
      const row = `${t.id},"${t.description}",${t.amount},${t.type},${t.category?.name || 'N/A'},${t.date}`;
      csvContent += row + "\n";
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `EDIS_DATA_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    notify("Descarga iniciada", "success");
  } catch (error) {
    notify("Error al descargar datos", "error");
  }
};
</script>

<template>
  <div class="max-w-2xl mx-auto relative z-10 animate-fade-in h-full overflow-y-auto custom-scrollbar">
    <div class="p-8 border mb-10" :class="isCorpoMode ? 'bg-white border-gray-300' : 'bg-[#0b1016] neon-border-pink cyber-clip'">
      <h2 class="text-2xl font-bold uppercase mb-8 border-b pb-4" :class="isCorpoMode ? 'border-gray-200' : 'border-pink-900/50 text-pink-500'">Configuración de Netrunner</h2>
      
      <div class="space-y-8">
        
        <div>
          <label class="block text-xs uppercase tracking-widest mb-3 opacity-70">Clase de Personaje</label>
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button v-for="role in roles" :key="role" @click="selectRole(role)"
              class="p-3 text-xs font-bold border text-center transition-all hover:scale-105"
              :class="userClass === role 
                ? (isCorpoMode ? 'bg-red-600 text-white border-red-600' : 'bg-pink-600 text-white border-pink-400 shadow-[0_0_10px_rgba(236,72,153,0.5)]') 
                : 'border-gray-600 opacity-50 hover:opacity-100'">
              {{ role }}
            </button>
          </div>
          <p class="text-[10px] mt-2 opacity-50 text-center">* Al seleccionar, el sistema se reiniciará brevemente.</p>
        </div>
        
        <div>
          <label class="block text-xs uppercase tracking-widest mb-3 opacity-70">Gestión de Datos</label>
          
          <button @click="exportCSV" 
             class="w-full py-4 border font-bold uppercase tracking-widest transition-colors mb-4 flex items-center justify-center gap-2"
             :class="isCorpoMode ? 'border-gray-400 hover:bg-gray-100 text-gray-700' : 'border-green-500 text-green-500 hover:bg-green-900/20'">
            <span>💾</span> DESCARGAR REPORTE .CSV (EXCEL)
          </button>

          <button @click="resetDb" class="w-full py-4 border border-red-900 text-red-600 font-bold uppercase tracking-widest hover:bg-red-900/20 transition-colors">
            ⚠️ RESETEAR BASE DE DATOS COMPLETA
          </button>
        </div>

      </div>
    </div>
  </div>
</template>