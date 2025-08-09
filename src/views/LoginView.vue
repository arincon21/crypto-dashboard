<template>
	<div class="min-h-screen flex">
		<!-- Panel Izquierdo - Ilustración -->
		<div class="flex-1 flex items-center justify-center relative bg-cover bg-center"
			:style="{ backgroundImage: `url(${loginImg})` }">
		</div>

		<!-- Panel Derecho - Formulario de Inicio de Sesión -->
		<div class="flex-1 flex items-center justify-center bg-white p-12 relative">
			<!-- Spinner de Carga -->
			<div v-if="isLoading" class="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-10">
				<div class="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
			</div>

			<div class="w-full max-w-md">
				<!-- Encabezado -->
				<div class="mb-8">
					<h1 class="text-2xl font-semibold text-gray-900 mb-2">¡Buenos días!</h1>
					<h2 class="text-2xl font-semibold text-gray-900 mb-4">Inicia sesión en Timee</h2>
					<p class="text-gray-500 text-sm leading-relaxed">
						Necesitas proporcionar tus datos de acceso para<br>
						ingresar a nuestro sistema.
					</p>
				</div>

				<!-- Formulario de Inicio de Sesión -->
				<form @submit.prevent="login" class="space-y-6">
					<!-- Campo de Correo Electrónico -->
					<div>
						<label class="block text-sm font-medium text-gray-700 mb-2" for="email">
							Mi correo electrónico
						</label>
						<input v-model="email" id="email" type="email" required placeholder="Ingresa tu correo electrónico" :disabled="isLoading"
							class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-3 focus:ring-blue-100 focus:border-blue-500 transition-all text-base" />
					</div>

					<!-- Campo de Contraseña -->
					<div>
						<label class="block text-sm font-medium text-gray-700 mb-2" for="password">
							Contraseña
						</label>
						<div class="relative">
							<input v-model="password" id="password" :type="showPassword ? 'text' : 'password'" required
								placeholder="Ingresa tu contraseña" :disabled="isLoading"
								class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-3 focus:ring-blue-100 focus:border-blue-500 transition-all text-base" />
							<button type="button" @click="showPassword = !showPassword"
								class="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5">
								<span v-if="showPassword" class="text-gray-600 hover:text-blue-600">Ocultar</span>
								<span v-else class="text-gray-600 hover:text-blue-600">Mostrar</span>
							</button>
						</div>
					</div>

					<!-- Enlace de Olvidé mi Contraseña -->
					<div class="text-right">
						<a href="#" @click.prevent="forgotPassword" class="text-sm font-medium text-blue-600 hover:text-blue-500 transition-colors">
							¿Olvidaste tu contraseña?
						</a>
					</div>

					<!-- Botón de Iniciar Sesión -->
					<button type="submit" :disabled="isLoading"
						class="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors focus:outline-none focus:ring-3 focus:ring-blue-100 disabled:bg-blue-400 disabled:cursor-not-allowed">
						INICIAR SESIÓN
					</button>

					<!-- Botón de Registrarse -->
					<button type="button" @click="register" :disabled="isLoading"
						class="w-full bg-gray-50 text-gray-700 py-3 px-4 rounded-lg font-medium border border-gray-200 hover:bg-gray-100 transition-colors focus:outline-none focus:ring-3 focus:ring-gray-100 disabled:bg-gray-200 disabled:cursor-not-allowed">
						Crear Cuenta
					</button>
				</form>

				<!-- Mensajes de Error/Éxito -->
				<div v-if="error" class="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
					<p class="text-red-700 text-sm">{{ error }}</p>
				</div>

				<div v-if="success" class="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
					<p class="text-green-700 text-sm">{{ success }}</p>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../firebase';
import { useRouter } from 'vue-router';
import loginImg from '@/assets/login.png';
import { FirebaseError } from 'firebase/app';

const email = ref('');
const password = ref('');
const error = ref('');
const success = ref('');
const isLoading = ref(false);
const showPassword = ref(false);
const router = useRouter();

const login = async () => {
	error.value = '';
	success.value = '';
	isLoading.value = true;
	try {
		await signInWithEmailAndPassword(auth, email.value, password.value);
		router.push('/');
	} catch (err) {
		if (err instanceof FirebaseError) {
			switch (err.code) {
				case 'auth/user-not-found':
					error.value = 'No existe una cuenta con este correo electrónico.';
					break;
				case 'auth/wrong-password':
					error.value = 'La contraseña es incorrecta.';
					break;
				default:
					error.value = 'Credenciales incorrectas o error de autenticación.';
					break;
			}
		} else {
			error.value = 'Ocurrió un error inesperado.';
		}
	} finally {
		isLoading.value = false;
	}
};

const register = async () => {
	error.value = '';
	success.value = '';
	isLoading.value = true;
	try {
		await createUserWithEmailAndPassword(auth, email.value, password.value);
		success.value = 'Usuario registrado correctamente. Ahora puedes iniciar sesión.';
	} catch (err) {
		if (err instanceof FirebaseError) {
			if (err.code === 'auth/email-already-in-use') {
				error.value = 'Este correo electrónico ya está en uso.';
			} else {
				error.value = 'No se pudo registrar el usuario. ¿Ya existe la cuenta?';
			}
		} else {
			error.value = 'Ocurrió un error inesperado.';
		}
	} finally {
		isLoading.value = false;
	}
};

const forgotPassword = async () => {
	if (!email.value) {
		error.value = 'Por favor, ingresa tu correo electrónico para restablecer la contraseña.';
		return;
	}
	error.value = '';
	success.value = '';
	isLoading.value = true;
	try {
		await sendPasswordResetEmail(auth, email.value);
		success.value = 'Se ha enviado un correo de restablecimiento de contraseña. Revisa tu bandeja de entrada.';
	} catch (err) {
		if (err instanceof FirebaseError) {
			if (err.code === 'auth/user-not-found') {
				error.value = 'No existe una cuenta con este correo electrónico.';
			} else {
				error.value = 'No se pudo enviar el correo de restablecimiento de contraseña.';
			}
		} else {
			error.value = 'Ocurrió un error inesperado.';
		}
	} finally {
		isLoading.value = false;
	}
};
</script>