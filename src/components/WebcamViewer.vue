<template>
  <div class="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
    <div class="relative aspect-video bg-gray-900 flex items-center justify-center">
      
      <!-- Image Webcam -->
      <img 
        :src="imageUrl" 
        alt="Webcam de l'Islet Lancieux" 
        class="w-full h-full object-cover transition-opacity duration-500"
        :class="loading ? 'opacity-50' : 'opacity-100'"
        @load="loading = false"
        @error="handleError"
      />

      <!-- Badge "EN DIRECT" -->
      <div class="absolute top-4 left-4 flex items-center gap-2 bg-red-600/90 text-white px-3 py-1 rounded-full text-xs font-bold shadow-sm backdrop-blur-sm animate-pulse">
        <span class="w-2 h-2 bg-white rounded-full"></span>
        LIVE
      </div>

      <!-- Spinner de chargement -->
      <div v-if="loading" class="absolute inset-0 flex items-center justify-center">
        <div class="animate-spin rounded-full h-12 w-12 border-4 border-emerald-500 border-t-transparent"></div>
      </div>

      <!-- Message d'erreur -->
      <div v-if="error" class="absolute inset-0 flex flex-col items-center justify-center bg-gray-800/80 text-white p-4 text-center">
        <svg class="w-10 h-10 mb-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"></path></svg>
        <p>Impossible de charger la webcam.</p>
        <button @click="refreshImage" class="mt-4 px-4 py-2 bg-emerald-600 rounded-lg hover:bg-emerald-700 text-sm font-bold">Réessayer</button>
      </div>
    </div>

    <!-- Barre d'infos -->
    <div class="p-4 bg-emerald-900 text-white flex justify-between items-center">
      <div>
        <h3 class="font-bold font-heading text-lg">L'Islet - Lancieux</h3>
        <p class="text-emerald-300 text-xs">Mise à jour automatique</p>
      </div>
      <button 
        @click="refreshImage" 
        class="text-sm bg-emerald-800 hover:bg-emerald-700 px-3 py-2 rounded transition flex items-center gap-2"
        :disabled="loading"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
        <span class="hidden sm:inline">Rafraîchir</span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

// On pointe vers notre proxy interne
const PROXY_URL = 'https://images.weserv.nl/?url=http://193.248.203.116:1700/record/current.jpg';

const imageUrl = ref('');
const loading = ref(true);
const error = ref(false);
let timer = null;

const refreshImage = () => {
  loading.value = true;
  error.value = false;
  imageUrl.value = `${PROXY_URL}?rand=${Date.now()}`;
};

const handleError = () => {
  loading.value = false;
  error.value = true;
};

onMounted(() => {
  refreshImage();
  // Rafraîchir toutes les 60 secondes automatiquement
  timer = setInterval(refreshImage, 60000);
});

onUnmounted(() => {
  if (timer) clearInterval(timer);
});
</script>