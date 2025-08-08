<script setup lang="ts">
import TheWelcome from '../components/TheWelcome.vue'
import { ref, onMounted } from 'vue';
import { auth } from '../firebase';
import { signOut, onAuthStateChanged } from 'firebase/auth';
import type { User } from 'firebase/auth';
import { useRouter } from 'vue-router';

const user = ref<User | null>(null);
const router = useRouter();

onMounted(() => {
  onAuthStateChanged(auth, (u) => {
    user.value = u;
  });
});

const logout = async () => {
  await signOut(auth);
  router.push('/login');
};
</script>

<template>
  <main class="p-8">
    <div class="flex justify-between items-center mb-6">
      <div>
        <h1 class="text-2xl font-bold">Home</h1>
        <p v-if="user" class="text-gray-600">Bienvenido, {{ user.email }}</p>
      </div>
      <button @click="logout" class="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition">Cerrar
        sesión</button>
    </div>
    <TheWelcome />
  </main>
</template>
