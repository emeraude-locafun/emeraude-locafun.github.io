<template>
  <div class="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 flex flex-col h-full">
    
    <!-- En-tête avec Sélecteur de Caméra -->
    <div class="bg-emerald-900 p-2 flex justify-center gap-2">
      <button 
        v-for="cam in cameras" 
        :key="cam.id"
        @click="switchCamera(cam.id)"
        class="px-4 py-2 rounded-lg text-sm font-bold transition-all duration-200 flex items-center gap-2"
        :class="activeCamId === cam.id 
          ? 'bg-white text-emerald-900 shadow-md transform scale-105' 
          : 'bg-emerald-800 text-emerald-100 hover:bg-emerald-700'"
      >
        <span v-if="activeCamId === cam.id" class="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
        {{ cam.name }}
      </button>
    </div>

    <!-- Zone Image -->
    <div class="relative aspect-video bg-gray-900 flex items-center justify-center group">
      
      <!-- Image Webcam -->
      <img 
        v-if="!error"
        :src="currentImageUrl"
        :key="refreshKey"
        :alt="currentCam.name" 
        class="w-full h-full object-cover transition-opacity duration-300"
        :class="loading ? 'opacity-40 blur-sm' : 'opacity-100'"
        @load="onImageLoad"
        @error="handleError"
      />

      <!-- Badge LIVE -->
      <div class="absolute top-4 left-4 flex items-center gap-2 bg-red-600/90 text-white px-3 py-1 rounded-full text-xs font-bold shadow-sm backdrop-blur-sm z-10">
        <span class="relative flex h-2 w-2">
          <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
          <span class="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
        </span>
        LIVE
      </div>

      <!-- Loader -->
      <div v-if="loading" class="absolute inset-0 flex items-center justify-center z-0">
        <div class="animate-spin rounded-full h-12 w-12 border-4 border-emerald-500 border-t-transparent"></div>
      </div>

      <!-- Erreur -->
      <div v-if="error" class="absolute inset-0 flex flex-col items-center justify-center bg-gray-800/90 text-white p-4 text-center z-20">
        <svg class="w-10 h-10 mb-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
        <p class="font-bold">Signal perdu</p>
        <button @click="forceRefresh" class="mt-4 px-4 py-2 bg-emerald-600 rounded hover:bg-emerald-500 transition text-sm">Réessayer</button>
      </div>
    </div>

    <!-- Barre d'infos Technique -->
    <div class="px-4 py-3 bg-gray-50 border-b border-gray-100 flex justify-between items-center text-xs text-gray-500">
      <div class="flex items-center gap-2">
        <span class="font-bold text-emerald-700">Vue : {{ currentCam.name }}</span>
        <span class="hidden sm:inline">| Mise à jour auto</span>
      </div>
      <div class="flex items-center gap-2">
        <span v-if="lastUpdate">Màj : {{ lastUpdate }}</span>
        <button  @click="forceRefresh"  class="text-sm hover:bg-emerald-700 px-3 py-2 rounded transition flex items-center gap-2">
          <svg class="w-4 h-4" :class="{'animate-spin': loading}" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
          <span class="hidden sm:inline">Rafraîchir</span>
        </button>
      </div>
    </div>

    <!-- Description Dynamique -->
    <div class="p-6 bg-white prose prose-sm prose-emerald max-w-none">
      <h3 class="mt-0 mb-2 font-heading">À propos de ce spot</h3>
      <!-- On injecte le HTML de la description ici -->
      <div v-html="currentCam.description"></div>
    </div>

  </div>
</template>
Raf
<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';

const CAMERAS: Record<string, string> = {
  islet: 'https://images.weserv.nl/?url=http://193.248.203.116:1700/record/current.jpg',
  saintsieu: 'https://images.weserv.nl/?url=http://193.252.218.74:1700/record/current.jpg'
};

// --- Configuration des caméras ---
const cameras = [
  {
    id: 'saintsieu',
    name: 'Plage de Saint-Sieu, Lancieux',
    description: `
      <p>La vue principale sur la <strong>grande plage de Saint-Sieu</strong>, cœur de l'activité nautique à Lancieux.</p>
      <ul>
        <li><strong>En direct :</strong> Vérifiez l'affluence sur la plage et les conditions de vent.</li>
        <li><strong>Marée :</strong> Idéal pour voir jusqu'où remonte la mer (elle vient lécher la digue à marée haute !).</li>
      </ul>`
  },
  {
    id: 'islet',
    name: "L'Islet, Lancieux",
    description: `
            <p>
              Cette vue donne sur <strong>l'Islet</strong>, un point stratégique de la baie de Lancieux. 
              C'est un excellent indicateur pour la marée et l'état du plan d'eau.
            </p>
            <ul>
              <li><strong>Marée haute :</strong> L'Islet est entouré d'eau, idéal pour le Kayak et le Paddle.</li>
              <li><strong>Marée basse :</strong> La plage s'étend à perte de vue, parfait pour le char à voile (en hiver) ou la pêche à pied.</li>
            </ul>`
  }
];



// --- State ---
const activeCamId = ref('islet'); // Caméra par défaut
const refreshKey = ref(0);
const loading = ref(true);
const error = ref(false);
const lastUpdate = ref('');
let timer:any = null;

// --- Computed ---
const currentCam = computed(() => {
  return cameras.find(c => c.id === activeCamId.value) || cameras[0];
});

const currentImageUrl = computed(() => {
  // On passe l'ID en paramètre GET à notre proxy
  
//  return `${PROXY_URL}?id=${activeCamId.value}&ts=${refreshKey.value}`;
  console.error('CAMERAS', CAMERAS[activeCamId.value] ? `${CAMERAS[activeCamId.value]}?rand=${Date.now()}` : '');
  return CAMERAS[activeCamId.value] ? `${CAMERAS[activeCamId.value]}?rand=${Date.now()}` : '';

});

// --- Actions ---
const switchCamera = (id:string) => {
  activeCamId.value = id;
  forceRefresh();
};


const forceRefresh = () => {
  loading.value = true;
  error.value = false;
  refreshKey.value = Date.now(); // Force le rechargement de l'URL
};

const onImageLoad = () => {
  loading.value = false;
  const now = new Date();
  lastUpdate.value = now.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
};


const handleError = () => {
  loading.value = false;
  error.value = true;
};

// --- Lifecycle ---
onMounted(() => {
  // Rafraîchir toutes les 60 secondes
  timer = setInterval(forceRefresh, 60000);
});

onUnmounted(() => {
  if (timer) clearInterval(timer);
});
</script>


<!--
<template>
  <div class="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
    <div class="relative aspect-video bg-gray-900 flex items-center justify-center">
      
      <img 
        :src="imageUrl" 
        alt="Webcam de l'Islet Lancieux" 
        class="w-full h-full object-cover transition-opacity duration-500"
        :class="loading ? 'opacity-50' : 'opacity-100'"
        @load="loading = false"
        @error="handleError"
      />

      <div class="absolute top-4 left-4 flex items-center gap-2 bg-red-600/90 text-white px-3 py-1 rounded-full text-xs font-bold shadow-sm backdrop-blur-sm animate-pulse">
        <span class="w-2 h-2 bg-white rounded-full"></span>
        LIVE
      </div>

      <div v-if="loading" class="absolute inset-0 flex items-center justify-center">
        <div class="animate-spin rounded-full h-12 w-12 border-4 border-emerald-500 border-t-transparent"></div>
      </div>

      <div v-if="error" class="absolute inset-0 flex flex-col items-center justify-center bg-gray-800/80 text-white p-4 text-center">
        <svg class="w-10 h-10 mb-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"></path></svg>
        <p>Impossible de charger la webcam.</p>
        <button @click="refreshImage" class="mt-4 px-4 py-2 bg-emerald-600 rounded-lg hover:bg-emerald-700 text-sm font-bold">Réessayer</button>
      </div>
    </div>

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
-->
<!--<script setup>
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
</script>-->