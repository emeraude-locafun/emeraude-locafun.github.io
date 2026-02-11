<template>
  <header class="sticky top-0 z-50 w-full transition-all duration-300" :class="isScrolled ? 'bg-white/95 shadow-md backdrop-blur-sm' : 'bg-white/80 backdrop-blur-sm'">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center h-20">
        
        <!-- Logo / Titre -->
        <div class="flex-shrink-0 flex items-center">
          <a href="/#" class="text-2xl font-extrabold text-emerald-700 tracking-tight font-heading">
            ÉMERAUDE <span class="text-emerald-500 font-normal">LOCA-FUN</span>
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