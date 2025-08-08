<script setup lang="ts">
defineProps<{
  msg: string
}>()
</script>

<template>
  <div class="text-center md:text-left my-8">
    <h1 class="text-4xl font-bold text-emerald-600 mb-2">{{ msg }}</h1>
    <h3 class="text-lg text-gray-700">
      Has creado exitosamente un proyecto con
      <a href="https://vite.dev/" target="_blank" rel="noopener"
        class="text-blue-600 underline hover:text-blue-800">Vite</a> +
      <a href="https://vuejs.org/" target="_blank" rel="noopener"
        class="text-green-600 underline hover:text-green-800">Vue 3</a>. ¿Qué sigue?
    </h3>
  </div>
</template>
