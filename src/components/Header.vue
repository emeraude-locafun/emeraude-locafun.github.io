<template>
  <header class="sticky top-0 z-50 w-full transition-all duration-300" :class="isScrolled ? 'bg-white/95 shadow-md backdrop-blur-sm' : 'bg-white/80 backdrop-blur-sm'">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center h-20">
        
        <!-- Logo / Titre -->
        <div class="flex-shrink-0 flex items-center">
<!--          <a href="/#" class="text-2xl font-extrabold text-emerald-700 tracking-tight font-heading">
            ÉMERAUDE <span class="text-emerald-500 font-normal">LOCA-FUN</span>
          </a>-->
        <a href="/#" class="flex items-center gap-2">
      
<svg
   viewBox="0 0 383.43903 43.689034"
   fill="none"
   aria-label="Logo Émeraude Loca-fun"
   version="1.1"
   id="svg5"
   width="343.43903"
   height="43.689034"
   xmlns="http://www.w3.org/2000/svg"
   xmlns:svg="http://www.w3.org/2000/svg">
  <!-- Définitions de dégradés pour un effet moderne -->
  <defs
     id="defs2">
    <linearGradient
       id="sailGradient"
       x1="60.722263"
       y1="3.4583693"
       x2="109.13943"
       y2="51.875538"
       gradientTransform="scale(0.69167384,1.4457681)"
       gradientUnits="userSpaceOnUse">
      <stop
         offset="0%"
         style="stop-color:#34D399;stop-opacity:1"
         id="stop1" />
      <!-- emerald-400 -->
      <stop
         offset="100%"
         style="stop-color:#059669;stop-opacity:1"
         id="stop2" />
      <!-- emerald-600 -->
    </linearGradient>
  </defs>
  <!-- Groupe Icône (Voile + Vague) -->
  <g
     transform="matrix(0.50128347,0,0,0.51084518,-3.759626,-2.5542259)"
     id="g4">
    <!-- La Grande Voile (Catamaran) -->
    <path
       d="m 45,5 c 0,0 35,35 30,70 H 42 Z"
       fill="url(#sailGradient)"
       id="path2"
       style="fill:url(#sailGradient)" />
    <!-- Le Foc (Petite voile avant) -->
    <path
       d="m 38,25 c 0,0 -23,30 -8,50 h 8 z"
       fill="#064e3b"
       opacity="0.9"
       id="path3" />
    <!-- emerald-900 -->
    <!-- La Vague / Coque (Suggère le mouvement) -->
    <path
       d="M 10,82 Q 45,95 85,80"
       stroke="#059669"
       stroke-width="5"
       stroke-linecap="round"
       fill="none"
       id="path4" />
  </g>
  <!-- Texte -->
  <g
     font-family="Montserrat, sans-serif"
     transform="matrix(0.73835022,0,0,0.83745684,42.88765,33.197018)"
     id="g5">
    <!-- ÉMERAUDE (Vert foncé pour la lisibilité) -->
    <text
       x="0"
       y="0"
       font-size="38px"
       font-weight="800"
       fill="#065f46"
       letter-spacing="-1"
       id="text4">ÉMERAUDE</text>
    <!-- LOCA-FUN (Vert émeraude vif pour le côté fun) -->
    <text
       x="225"
       y="0"
       font-size="38px"
       font-weight="400"
       fill="#10b981"
       letter-spacing="0"
       id="text5">LOCA-FUN</text>
  </g>
</svg>

</a>

        </div>

        <!-- Menu Desktop -->
        <nav class="hidden md:flex space-x-8 items-center">
          <a v-for="item in navItems" :key="item.name" :href="item.href" class="text-gray-700 hover:text-emerald-600 font-medium transition-colors">
            {{ item.name }}
          </a>
          <a href="#contact" class="px-5 py-2.5 bg-emerald-600 text-white font-bold rounded-lg shadow hover:bg-emerald-700 transition transform hover:-translate-y-0.5">
            Réserver
          </a>
        </nav>

        <!-- Bouton Mobile -->
        <div class="flex md:hidden">
          <button @click="isMobileMenuOpen = !isMobileMenuOpen" type="button" class="text-gray-700 hover:text-emerald-600 focus:outline-none p-2">
            <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path v-if="!isMobileMenuOpen" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
              <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Menu Mobile -->
    <div v-show="isMobileMenuOpen" class="md:hidden bg-white border-t border-gray-100 shadow-lg absolute w-full">
      <div class="px-2 pt-2 pb-3 space-y-1 sm:px-3">
        <a v-for="item in navItems" :key="item.name" :href="item.href" 
           @click="isMobileMenuOpen = false"
           class="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-emerald-600 hover:bg-emerald-50">
          {{ item.name }}
        </a>
        <a href="#contact" @click="isMobileMenuOpen = false" class="block w-full text-center mt-4 px-5 py-3 bg-emerald-600 text-white font-bold rounded-lg">
          Réserver
        </a>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

const isMobileMenuOpen = ref(false);
const isScrolled = ref(false);

const navItems = [
  { name: 'Accueil', href: '/#' },
  { name: 'Actualités', href: '/actualites' },
  { name: 'La Flotte', href: '/#fleet' },
  { name: 'Autres prestations', href: '/#prestations' },
  { name: 'Tarifs', href: '/#pricing' }
];

const handleScroll = () => {
  isScrolled.value = window.scrollY > 20;
};

onMounted(() => window.addEventListener('scroll', handleScroll));
onUnmounted(() => window.removeEventListener('scroll', handleScroll));
</script>