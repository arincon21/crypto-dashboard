<template>
    <div class="flex items-center justify-center min-h-screen bg-gray-100">
        <form @submit.prevent="login" class="bg-white p-8 rounded shadow-md w-full max-w-sm">
            <h2 class="text-2xl font-bold mb-6 text-center">Iniciar sesión</h2>
            <div class="mb-4">
                <label class="block text-gray-700 mb-2" for="email">Email</label>
                <input v-model="email" id="email" type="email" required
                    class="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300" />
            </div>
            <div class="mb-6">
                <label class="block text-gray-700 mb-2" for="password">Contraseña</label>
                <input v-model="password" id="password" type="password" required
                    class="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300" />
            </div>
            <button type="submit"
                class="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition mb-2">Entrar</button>
            <button type="button" @click="register"
                class="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600 transition">Registrarse</button>
            <p v-if="error" class="text-red-500 mt-4 text-center">{{ error }}</p>
            <p v-if="success" class="text-green-500 mt-2 text-center">{{ success }}</p>
        </form>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import { useRouter } from 'vue-router';

const email = ref('');
const password = ref('');
const error = ref('');
const success = ref('');
const router = useRouter();

const login = async () => {
    error.value = '';
    success.value = '';
    try {
        await signInWithEmailAndPassword(auth, email.value, password.value);
        router.push('/');
    } catch {
        error.value = 'Credenciales incorrectas o error de autenticación.';
    }
};

const register = async () => {
    error.value = '';
    success.value = '';
    try {
        await createUserWithEmailAndPassword(auth, email.value, password.value);
        success.value = 'Usuario registrado correctamente. Ahora puedes iniciar sesión.';
    } catch {
        error.value = 'No se pudo registrar el usuario. ¿Ya existe la cuenta?';
    }
};
</script>
