<template>
  <div class="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden relative group font-sans">
    
    <!-- En-tête : Localisation & Météo Globale -->
    <div class="bg-emerald-900 p-4 text-white">
      <div class="flex justify-between items-start mb-2">
        <div>
          <h3 class="font-bold text-lg font-heading">Météo Plage</h3>
          <p class="text-emerald-300 text-xs flex items-center">
            <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
            Lancieux (Saint-Sieu)
          </p>
        </div>
        
        <!-- Bloc Température & Icône -->
        <div v-if="!loading && current" class="text-right flex flex-col items-end">
          <div class="flex items-center gap-2">
            <!-- Icône Météo Dynamique -->
            <div v-html="weatherIcon.svg" class="w-8 h-8 text-yellow-300 filter drop-shadow-sm"></div>
            <span class="text-3xl font-bold leading-none">{{ current.temp }}°</span>
          </div>
          <p class="text-emerald-200 text-xs font-medium mt-1">{{ weatherIcon.label }}</p>
        </div>
        
        <!-- Loading Spinner -->
        <div v-if="loading" class="animate-spin h-6 w-6 border-2 border-emerald-500 rounded-full border-t-transparent"></div>
      </div>
    </div>

    <!-- Corps : Détails Vent & Mer -->
    <div v-if="!loading && current" class="p-5">
      <div class="flex items-center justify-between gap-4">
        
        <!-- Bloc VENT -->
        <div class="flex items-center">
          <!-- Boussole Vent -->
          <div class="relative w-14 h-14 bg-gray-50 rounded-full flex items-center justify-center border border-emerald-100 mr-3 shadow-inner">
            <!-- La flèche tourne selon la direction du vent -->
            <div 
              class="w-full h-full absolute transition-transform duration-700 ease-out" 
              :style="{ transform: `rotate(${current.windDir}deg)` }"
            >
              <svg class="w-5 h-5 text-emerald-600 absolute top-1 left-1/2 transform -translate-x-1/2 drop-shadow-sm" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2L4.5 20.29C4.24 20.89 4.96 21.46 5.54 21.05L12 16.5L18.46 21.05C19.04 21.46 19.76 20.89 19.5 20.29L12 2Z" />
              </svg>
            </div>
            <span class="text-[9px] font-bold text-gray-400">N</span>
          </div>
          
          <div>
            <p class="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Vent Moyen</p>
            <div class="flex items-baseline">
              <span class="text-2xl font-bold text-gray-800">{{ current.windSpeed }}</span>
              <span class="text-xs text-gray-500 ml-1 font-medium">nds</span>
            </div>
          </div>
        </div>

        <!-- Indicateur Visuel (Feu tricolore navigation) -->
        <div class="text-center bg-gray-50 px-3 py-2 rounded-lg border border-gray-100 min-w-[90px]">
          <div 
            class="w-3 h-3 rounded-full mx-auto mb-1 ring-2 ring-white shadow-sm"
            :class="navigationStatus.color"
          ></div>
          <span class="text-[10px] font-bold block uppercase tracking-wide leading-tight" :class="navigationStatus.textColor">
            {{ navigationStatus.text }}
          </span>
          <!-- Affichage rafales si significatives -->
          <span v-if="current.gusts > current.windSpeed + 5" class="text-[9px] text-gray-400 block mt-1">
            Raf. {{ current.gusts }} nds
          </span>
        </div>

      </div>

      <!-- Prévisions horaires simplifiées -->
      <div class="mt-5 pt-3 border-t border-gray-100">
        <p class="text-[10px] uppercase text-gray-400 mb-2 font-bold tracking-wider">À venir (GFS)</p>
        <div class="grid grid-cols-4 gap-2 text-center">
          <div v-for="(hour, i) in forecast" :key="i" class="bg-emerald-50/50 rounded p-1.5 border border-emerald-50">
            <span class="block text-[10px] text-gray-500 mb-0.5">{{ hour.time }}h</span>
            <span class="block font-bold text-emerald-800 text-sm">{{ hour.wind }} <span class="text-[9px] font-normal text-emerald-600">nds</span></span>
          </div>
        </div>
      </div>
    </div>

    <!-- Footer : Lien Windguru externe -->
    <a 
      href="https://www.windguru.cz/48507" 
      target="_blank"
      class="block bg-gray-50 hover:bg-emerald-50 p-2.5 text-center text-xs text-emerald-600 font-bold transition border-t border-gray-100 group-hover:text-emerald-700"
    >
      Voir détails complets sur Windguru ↗
    </a>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';

const loading = ref(true);
const current = ref(null);
const forecast = ref([]);

// Coordonnées de Lancieux
const LAT = 48.6095;
const LON = -2.1485;

const API_URL = `https://api.open-meteo.com/v1/forecast?latitude=${LAT}&longitude=${LON}&current=temperature_2m,wind_speed_10m,wind_direction_10m,wind_gusts_10m,weather_code&hourly=wind_speed_10m&models=gfs_seamless&wind_speed_unit=kn&timezone=Europe%2FParis&forecast_days=1`;

const fetchWeather = async () => {
  try {
    const res = await fetch(API_URL);
    const data = await res.json();

    current.value = {
      temp: Math.round(data.current.temperature_2m),
      windSpeed: Math.round(data.current.wind_speed_10m),
      windDir: data.current.wind_direction_10m,
      gusts: Math.round(data.current.wind_gusts_10m),
      code: data.current.weather_code // Code WMO (0-99)
    };

    // Prévisions prochaines heures
    const currentHour = new Date().getHours();
    const nextHours = [];
    for(let i = 0; i < data.hourly.time.length; i++) {
      const date = new Date(data.hourly.time[i]);
      if (date.getHours() > currentHour && nextHours.length < 4) {
        nextHours.push({
          time: date.getHours(),
          wind: Math.round(data.hourly.wind_speed_10m[i])
        });
      }
    }
    forecast.value = nextHours;

  } catch (e) {
    console.error("Erreur météo", e);
  } finally {
    loading.value = false;
  }
};

// Logique des icônes météo (SVG inline pour éviter les dépendances)
const weatherIcon = computed(() => {
  if (!current.value) return { label: '--', svg: '' };
  const code = current.value.code;

  // SOLEIL (Code 0)
  if (code === 0) return {
    label: 'Ensoleillé',
    svg: `<svg fill="none" viewBox="0 0 24 24" stroke="currentColor" class="animate-spin-slow"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>`
  };

  // PEU NUAGEUX (Code 1, 2)
  if (code <= 2) return {
    label: 'Peu Nuageux',
    svg: `<svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" class="opacity-50"></path></svg>`
  };

  // COUVERT / BROUILLARD (Code 3, 45, 48)
  if (code === 3 || code === 45 || code === 48) return {
    label: 'Nuageux',
    svg: `<svg class="text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"></path></svg>`
  };

  // PLUIE (Code 51-67, 80-82)
  if ((code >= 51 && code <= 67) || (code >= 80 && code <= 82)) return {
    label: 'Pluvieux',
    svg: `<svg class="text-blue-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 16.2A4.5 4.5 0 0017.5 8h-1.8c-.7-3.2-3.4-5.6-6.7-5.6-3.8 0-6.9 3.1-6.9 6.9 0 .3 0 .7.1 1C2.2 11.1 0 13.3 0 16c0 2.8 2.2 5 5 5h12.5c2.5 0 4.5-2 4.5-4.5V16c0-.1 0-.1 0-.1zM14 13l-2 3 2 3M10 13l-2 3 2 3"></path></svg>`
  };

  // NEIGE (Code 71-77, 85-86) - Rare à Lancieux l'été, mais on sait jamais !
  if ((code >= 71 && code <= 77) || (code >= 85 && code <= 86)) return {
    label: 'Neige',
    svg: `<svg class="text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v2m0 14v2m9-9h-2M5 12H3m14 5.66l-1.41-1.41M7.41 7.41L6 6m12 0l-1.41 1.41M7.41 16.59L6 18"></path></svg>`
  };

  // ORAGE (Code 95-99)
  if (code >= 95) return {
    label: 'Orageux',
    svg: `<svg class="text-purple-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>`
  };

  return { label: 'Variable', svg: '' };
});

const navigationStatus = computed(() => {
  if (!current.value) return { color: 'bg-gray-300', text: '...', textColor: 'text-gray-400' };
  const wind = current.value.windSpeed;
  
  if (wind < 4) return { color: 'bg-blue-400', text: 'Pétole', textColor: 'text-blue-600' };
  if (wind < 12) return { color: 'bg-green-500', text: 'Top !', textColor: 'text-green-600' };
  if (wind < 20) return { color: 'bg-emerald-500', text: 'Sportif', textColor: 'text-emerald-700' };
  if (wind < 28) return { color: 'bg-orange-500', text: 'Fort', textColor: 'text-orange-600' };
  return { color: 'bg-red-600', text: 'Baston', textColor: 'text-red-600' };
});

onMounted(() => {
  fetchWeather();
});
</script>

<style scoped>
/* Petite animation lente pour le soleil */
.animate-spin-slow {
  animation: spin 10s linear infinite;
}
@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
</style>