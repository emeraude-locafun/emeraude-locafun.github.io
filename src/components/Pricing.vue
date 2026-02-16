<script setup lang="ts">
defineProps({
  items: {
    type: Array,
    required: true,
    default: () => []
  },
  happyHourTitle: String,
  happyHourHtml: String,
  happyHourSubtext: String
});

const formatPrice = (price: number | null | undefined) => {
  if (price === null || price === undefined) return '-';
  return `${price}€`;
};
</script>

<template>
  <div class="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
    <div class="p-6 bg-emerald-600 text-white text-center">
      <h3 class="text-2xl font-bold font-heading">Nos Tarifs Location</h3>
      <p class="text-emerald-100 text-sm mt-1">Tout inclus : combinaison, gilet, harnais</p>
    </div>
    
    <div class="overflow-x-auto">
      <table class="w-full text-left border-collapse">
        <thead>
          <tr class="bg-gray-50 text-gray-600 text-sm uppercase tracking-wider border-b border-gray-200">
            <th class="p-4 font-semibold">Support</th>
            <th class="p-4 font-semibold text-center">1h</th>
            <th class="p-4 font-semibold text-center">2h</th>
            <th class="p-4 font-semibold text-center">3h</th>
            <th class="p-4 font-semibold text-center">4h</th>
            <th class="p-4 font-semibold text-center">Journée</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100">
          <tr v-for="(row, index) in items" :key="index" class="hover:bg-emerald-50/50 transition-colors">
            <td class="p-4 font-bold text-gray-800">{{ row.name }}</td>
            <td class="p-4 text-center text-gray-600">{{ formatPrice(row.price_1h) }}</td>
            <td class="p-4 text-center text-gray-600">{{ formatPrice(row.price_2h) }}</td>
            <td class="p-4 text-center text-gray-600">{{ formatPrice(row.price_3h) }}</td>
            <td class="p-4 text-center text-gray-600">{{ formatPrice(row.price_4h) }}</td>
            <td class="p-4 text-center font-bold text-emerald-700">{{ formatPrice(row.price_day) }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Section Happy Hours Dynamique -->
    <div v-if="happyHourTitle" class="bg-yellow-50 p-6 border-t border-yellow-100 flex items-start gap-4">
      <div class="text-3xl">☀️</div>
      <div>
        <h4 class="font-bold text-yellow-800 text-lg">{{ happyHourTitle }}</h4>
   <div 
          class="text-yellow-700 text-sm mt-1 prose prose-yellow prose-p:m-0 prose-strong:text-yellow-900" 
          v-html="happyHourHtml">
        </div>

        <!-- Le Subtext avec le style spécifique demandé -->
        <div v-if="happyHourSubtext" class="mt-1">
          <span class="text-xs text-yellow-800 opacity-75">
            {{ happyHourSubtext }}
          </span>
        </div>
       </div>
    </div>
  </div>
</template>


<style scoped></style>