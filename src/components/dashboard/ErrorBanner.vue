
<script setup lang="ts">
import { defineProps } from 'vue';

defineProps<{ error: string | null }>();

const emit = defineEmits(['retry']);

const retry = () => {
    emit('retry');
};
</script>

<template>
    <div v-if="error" class="fixed top-0 left-0 right-0 bg-red-500 text-white px-4 py-2 z-50 flex items-center justify-between">
        <span>{{ error }}</span>
        <button @click="retry" class="bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-sm">
            Reintentar
        </button>
    </div>
</template>
