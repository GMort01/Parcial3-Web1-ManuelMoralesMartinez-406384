<script setup lang="ts">
import { computed } from 'vue';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'vue-chartjs';

// Registramos los elementos necesarios de Chart.js
ChartJS.register(ArcElement, Tooltip, Legend);

const props = defineProps<{
  transactions: any[]
}>();

// Colores Cyberpunk para las categorías
const neonColors = [
  '#ff00ff', // Magenta
  '#00f3ff', // Cyan
  '#facc15', // Amarillo
  '#10b981', // Verde
  '#6366f1', // Indigo
];

// Calculamos los datos automáticamente
const chartData = computed(() => {
  // 1. Filtramos solo los GASTOS
  const expenses = props.transactions.filter(t => t.type === 'EXPENSE');
  
  // 2. Agrupamos por nombre de categoría
  const groups: Record<string, number> = {};
  expenses.forEach(t => {
    const catName = t.category.name;
    if (!groups[catName]) groups[catName] = 0;
    groups[catName] += t.amount;
  });

  return {
    labels: Object.keys(groups),
    datasets: [
      {
        backgroundColor: neonColors,
        borderColor: '#000000', // Borde negro para separar segmentos
        borderWidth: 2,
        data: Object.values(groups)
      }
    ]
  };
});

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'right' as const,
      labels: {
        color: '#9ca3af', // Color del texto de la leyenda
        font: { family: 'Share Tech Mono' } // Tu fuente técnica
      }
    }
  }
};
</script>

<template>
  <div class="h-64 w-full flex items-center justify-center">
    <Doughnut v-if="chartData.datasets[0].data.length > 0" :data="chartData" :options="chartOptions" />
    
    <div v-else class="text-gray-500 text-sm font-tech uppercase">
      /// SIN DATOS DE GASTO ///
    </div>
  </div>
</template>