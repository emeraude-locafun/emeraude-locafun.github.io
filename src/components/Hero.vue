<template>
  <section class="relative h-[85vh] min-h-[600px] flex items-center justify-center overflow-hidden">
    
    <!-- Image de fond -->
    <div class="absolute inset-0 z-0">
      <img 
        :src="image" 
        :alt="title" 
        class="w-full h-full object-cover transition-transform duration-1000 scale-105 hover:scale-100"
      />
      <!-- Overlay sombre (dégradé) pour que le texte blanc ressorte bien -->
      <div class="absolute inset-0 bg-gradient-to-b from-gray-900/40 via-gray-900/20 to-emerald-900/90"></div>
    </div>

    <!-- Contenu Textuel -->
    <div class="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
      
      <!-- Petit badge saison -->
      <div class="inline-block mb-6 animate-fade-in">
        <span class="py-1 px-3 rounded-full bg-emerald-500/20 border border-emerald-400/50 text-emerald-200 text-sm font-bold tracking-wider backdrop-blur-sm">
          SAISON 2026
        </span>
      </div>

      <!-- Titre Principal -->
      <h1 class="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight mb-6 font-heading drop-shadow-lg leading-tight">
        {{ title }}
      </h1>

      <!-- Sous-titre (ex: La baie de Lancieux...) -->
      <h2 class="text-xl md:text-3xl text-emerald-300 font-medium mb-8 max-w-3xl mx-auto drop-shadow-md">
        {{ subtitle }}
      </h2>


      <!-- Boutons d'action -->
      <div class="flex flex-col sm:flex-row gap-4 justify-center items-center">
        <a href="#fleet" class="group px-8 py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-full transition-all transform hover:scale-105 shadow-lg shadow-emerald-900/30 flex items-center">
          Découvrir le matos
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </a>
        <a href="#contact" class="px-8 py-4 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/30 text-white font-bold rounded-full transition-all">
          Nous contacter
        </a>
      </div>
    </div>

    <!-- Indicateur de scroll (flèche qui rebondit) -->
    <div class="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce cursor-pointer">
      <a href="#fleet" class="text-white/70 hover:text-white transition" aria-label="Défiler vers le bas">
        <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
        </svg>
      </a>
    </div>

  </section>

        <!-- Description (Slot pour le texte riche ou HTML) -->
      <div class="text-lg md:text-xl text-back-100 max-w-2xl mx-auto leading-relaxed opacity-90 prose prose-emerald">
        <div class=" m-3">
        <slot />
        </div>
      </div>

</template>

<script setup>
defineProps({
  title: {
    type: String,
    required: true
  },
  subtitle: {
    type: String,
    required: true
  },
  image: {
    type: String,
    default: '/images/hero-bg.jpg' // Image par défaut si le CMS n'en fournit pas
  }
});
</script>

<style scoped>
.font-heading {
  font-family: 'Montserrat', sans-serif;
}
</style>