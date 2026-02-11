<script setup lang="ts">
import { computed } from 'vue';

// Définition des props
interface Props {
  src: string;
  alt: string;
  width?: string | number; // Peut être un nombre (px) ou une string ("50%", "10rem")
  height?: string | number;
  objectFit?: 'cover' | 'contain' | 'fill'; // Pour gérer le redimensionnement si W et H sont fixés
  class?: string; // Pour ajouter des classes tailwind supplémentaires depuis le parent
}

const props = withDefaults(defineProps<Props>(), {
  objectFit: 'cover',
  class: '',
});

// Calcul des styles CSS en ligne (pour les largeurs/hauteurs précises)
const imageStyles = computed(() => {
  const styles: Record<string, string> = {};

  if (props.width) {
    styles.width = typeof props.width === 'number' ? `${props.width}px` : props.width;
  }
  
  if (props.height) {
    styles.height = typeof props.height === 'number' ? `${props.height}px` : props.height;
  }

  return styles;
});

// Calcul des classes Tailwind dynamiques
const imageClasses = computed(() => {
  const classes = [props.class]; // Récupère les classes passées en prop

  // Si aucune largeur n'est définie, on prend toute la largeur du parent (responsive)
  if (!props.width) {
    classes.push('w-full');
  }

  // Si aucune hauteur n'est définie, on garde le ratio d'aspect
  if (!props.height) {
    classes.push('h-auto');
  }

  // Gestion de l'object-fit via Tailwind
  if (props.objectFit === 'cover') classes.push('object-cover');
  if (props.objectFit === 'contain') classes.push('object-contain');
  if (props.objectFit === 'fill') classes.push('object-fill');

  return classes.join(' ');
});
</script>

<template>
  <img
    :src="src"
    :alt="alt"
    :class="imageClasses"
    :style="imageStyles"
  />
</template>