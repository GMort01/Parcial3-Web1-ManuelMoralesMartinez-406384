<script setup lang="ts">
import { computed } from 'vue';
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  ArcElement
} from 'chart.js';
import { Bar, Doughnut } from 'vue-chartjs';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

const props = defineProps<{
  transactions: any[],
  summary: any
}>();

// --- 1. DATOS BARRAS (GASTOS POR CATEGORÍA - AHORA MÁS ANCHO) ---
const barData = computed(() => {
  const expenses = props.transactions.filter(t => t.type === 'EXPENSE');
  const groups: Record<string, number> = {};
  
  expenses.forEach(t => {
    const name = t.category.name;
    groups[name] = (groups[name] || 0) + t.amount;
  });

  return {
    labels: Object.keys(groups),
    datasets: [{
      label: 'Créditos',
      backgroundColor: 'rgba(236, 72, 153, 0.6)', // Pink transparente
      borderColor: '#ec4899', // Pink sólido
      borderWidth: 1,
      hoverBackgroundColor: '#f472b6',
      barPercentage: 0.6, // Barras más gorditas
      data: Object.values(groups)
    }]
  };
});

// --- 2. TORTA A: SOLO INGRESOS (POR CATEGORÍA) ---
const incomePieData = computed(() => {
  const incomes = props.transactions.filter(t => t.type === 'INCOME');
  const groups: Record<string, number> = {};
  
  incomes.forEach(t => {
    const name = t.category.name;
    groups[name] = (groups[name] || 0) + t.amount;
  });

  return {
    labels: Object.keys(groups),
    datasets: [{
      backgroundColor: ['#10b981', '#34d399', '#059669', '#6ee7b7'], // Variaciones de verde
      borderColor: '#0b1016',
      borderWidth: 2,
      data: Object.values(groups)
    }]
  };
});

// --- 3. TORTA B: SOLO GASTOS (POR CATEGORÍA) ---
const expensePieData = computed(() => {
  const expenses = props.transactions.filter(t => t.type === 'EXPENSE');
  const groups: Record<string, number> = {};
  
  expenses.forEach(t => {
    const name = t.category.name;
    groups[name] = (groups[name] || 0) + t.amount;
  });

  return {
    labels: Object.keys(groups),
    datasets: [{
      backgroundColor: ['#ec4899', '#be185d', '#db2777', '#f472b6'], // Variaciones de rosa
      borderColor: '#0b1016',
      borderWidth: 2,
      data: Object.values(groups)
    }]
  };
});

// --- 4. TORTA C: GLOBAL (INGRESO VS GASTO) ---
const globalPieData = computed(() => {
  return {
    labels: ['INGRESOS', 'GASTOS'],
    datasets: [{
      backgroundColor: ['#10b981', '#ef4444'], // Green vs Red
      borderColor: '#0b1016', 
      borderWidth: 2,
      data: [props.summary.totalIncome, props.summary.totalExpense]
    }]
  };
});

// --- IA MESSAGE ---
const aiMessage = computed(() => {
  const balance = props.summary.balance;
  if (balance < 0) return "⚠️ CRÍTICO: BANCARROTA INMINENTE. LIQUIDAR ACTIVOS.";
  if (balance < 1000) return "⚠️ PRECAUCIÓN: FONDOS BAJOS. EVITE GASTOS SUPERFLUOS.";
  if (balance > 5000) return "✅ ÓPTIMO: EXCEDENTE DETECTADO. INVERTIR EN ARASAKA.";
  return "ℹ️ ESTABLE: FLUJO DE CAJA NORMAL.";
});

// Opciones Chart.js
const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  animation: { duration: 700, easing: 'easeOutQuart' },
  plugins: {
    legend: {
      position: 'bottom' as const, // Leyenda abajo para ahorrar espacio lateral
      labels: { color: '#0ff', font: { family: 'Share Tech Mono', size: 10 }, boxWidth: 10 }
    },
    tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
        titleColor: '#0ff',
        bodyColor: '#fff',
        borderColor: '#0ff',
        borderWidth: 1,
        bodyFont: { family: 'Share Tech Mono' }
    }
  },
  scales: {
    x: {
      ticks: { color: '#9ca3af', font: { family: 'Share Tech Mono', size: 10 } },
      grid: { color: '#374151', drawBorder: false }
    },
    y: {
      ticks: { color: '#9ca3af', font: { family: 'Share Tech Mono', size: 10 } },
      grid: { color: '#374151', drawBorder: false }
    }
  }
};
</script>

<template>
  <div class="space-y-4 h-full flex flex-col overflow-hidden">
    
    <div class="border border-dashed p-2 font-tech text-xs tracking-widest bg-black/30 glitch-effect relative z-10 flex-shrink-0"
         :class="summary.balance < 0 ? 'border-red-500 text-red-400' : 'border-cyan-500 text-cyan-400'">
      <span class="animate-pulse mr-2 text-lg leading-none">●</span> <span class="glitch-text-static">{{ aiMessage }}</span>
    </div>

    <div class="flex-1 min-h-0 overflow-y-auto custom-scrollbar pr-2 space-y-6">
      
      <div class="relative w-full h-64 shrink-0 cyber-panel-2 p-2 pt-6">
        <h4 class="absolute top-0 left-0 right-0 p-1 text-[10px] uppercase tracking-widest opacity-80 font-bold text-center bg-cyan-900/20 text-cyan-400 border-b border-cyan-700/50">
            ANÁLISIS DE GASTO POR CATEGORÍA
        </h4>
        <div class="relative h-full w-full">
            <Bar :data="barData" :options="chartOptions" />
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        <div class="relative h-56 cyber-panel-2 p-2 pt-6 flex flex-col items-center">
             <h4 class="absolute top-0 left-0 right-0 p-1 text-[10px] uppercase tracking-widest opacity-80 font-bold text-center bg-green-900/20 text-green-400 border-b border-green-700/50">
                FUENTES DE INGRESO
            </h4>
            <div class="relative h-full w-full"> 
                <Doughnut :data="incomePieData" :options="{ ...chartOptions, scales: {} }" />
            </div>
        </div>

        <div class="relative h-56 cyber-panel-2 p-2 pt-6 flex flex-col items-center">
             <h4 class="absolute top-0 left-0 right-0 p-1 text-[10px] uppercase tracking-widest opacity-80 font-bold text-center bg-pink-900/20 text-pink-400 border-b border-pink-700/50">
                DISTRIBUCIÓN DE GASTO
            </h4>
            <div class="relative h-full w-full"> 
                <Doughnut :data="expensePieData" :options="{ ...chartOptions, scales: {} }" />
            </div>
        </div>

        <div class="relative h-56 cyber-panel-2 p-2 pt-6 flex flex-col items-center">
             <h4 class="absolute top-0 left-0 right-0 p-1 text-[10px] uppercase tracking-widest opacity-80 font-bold text-center bg-cyan-900/20 text-cyan-400 border-b border-cyan-700/50">
                BALANCE GLOBAL
            </h4>
            <div class="relative h-full w-full"> 
                <Doughnut :data="globalPieData" :options="{ ...chartOptions, scales: {} }" />
            </div>
        </div>

      </div>

    </div>
  </div>
</template>

<style>
/* Estilos Cyberpunk (Mismos que antes, asegurándonos de que estén aquí) */
.glitch-effect {
  position: relative;
  box-shadow: 0 0 10px var(--tw-border-opacity, 1) rgba(0,243,255,0.4);
}

.glitch-text-static { text-shadow: 0 0 5px rgba(0,243,255,0.5); }

.cyber-panel-2 {
  background-color: rgba(11, 16, 22, 0.7);
  border: 1px solid rgba(0, 243, 255, 0.3);
  position: relative;
  overflow: hidden;
  box-shadow: 0 0 20px rgba(0,243,255,0.1);
}

.cyber-panel-2::before {
  content: '';
  position: absolute;
  top: 0; left: 0; width: 100%; height: 100%;
  background: repeating-linear-gradient(rgba(0,0,0,0.1) 0px, transparent 1px, transparent 3px);
  opacity: 0.1;
  pointer-events: none;
}

.cyber-panel-2::after {
  content: '';
  position: absolute;
  top: -2px; left: -2px; right: -2px; bottom: -2px;
  background: linear-gradient(45deg, rgba(0,243,255,0.5) 0%, transparent 40%, transparent 60%, rgba(236,72,153,0.5) 100%);
  z-index: -1;
  filter: blur(8px);
  opacity: 0.2;
}

.chartjs-render-monitor { font-family: 'Share Tech Mono', monospace; }
</style>