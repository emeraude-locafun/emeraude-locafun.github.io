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
          <tr v-for="(item, index) in prices" :key="index" class="hover:bg-emerald-50/50 transition-colors">
            <td class="p-4 font-bold text-gray-800">{{ item.name }}</td>
            <td class="p-4 text-center text-gray-600">{{ formatPrice(item.h1) }}</td>
            <td class="p-4 text-center text-gray-600">{{ formatPrice(item.h2) }}</td>
            <td class="p-4 text-center text-gray-600">{{ formatPrice(item.h3) }}</td>
            <td class="p-4 text-center text-gray-600">{{ formatPrice(item.h4) }}</td>
            <td class="p-4 text-center font-bold text-emerald-700">{{ formatPrice(item.day) }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Section Happy Hours (Page 27) -->
    <div class="bg-yellow-50 p-6 border-t border-yellow-100 flex items-start gap-4">
      <div class="text-3xl">☀️</div>
      <div>
        <h4 class="font-bold text-yellow-800 text-lg">Happy Hours en été !</h4>
        <p class="text-yellow-700 text-sm mt-1">
          Du 1er juillet au 31 août : <strong>1h offerte pour 2h consécutives achetées</strong>.
          <br><span class="text-xs opacity-75">(À utiliser avant 13h30 - Pagayez plus, profitez plus !)</span>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
const formatPrice = (price) => price ? `${price}€` : '-';

const prices = [
  { name: "Hobie Cat 16", h1: 56, h2: 96, h3: 130, h4: 160, day: 220 },
  { name: "Hobie Cat 15", h1: 50, h2: 89, h3: 119, h4: 145, day: 200 },
  { name: "Hobie Cat 16 EASY", h1: 50, h2: 89, h3: 119, h4: 145, day: 200 },
  { name: "Hobie Cat 14", h1: 50, h2: 89, h3: 119, h4: 145, day: 200 },
  { name: "Dériveur", h1: 45, h2: 77, h3: 96, h4: 123, day: 160 },
  { name: "Kayak simple", h1: 17, h2: 28, h3: 37, h4: 45, day: 72 },
  { name: "Kayak double", h1: 24, h2: 37, h3: 48, h4: 60, day: 100 },
  { name: "Paddle", h1: 17, h2: 28, h3: 37, h4: 45, day: 72 },
];
</script>