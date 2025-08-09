<script setup lang="ts">
import { useAuth } from '@/composables/useAuth';
import loginImg from '@/assets/login.png';
import { EnvelopeIcon, LockClosedIcon, EyeIcon, EyeSlashIcon } from '@heroicons/vue/24/solid';

const {
	email,
	password,
	error,
	emailError,
	passwordError,
	success,
	isLoading,
	showPassword,
	login,
	register,
	forgotPassword
} = useAuth();
</script>

<template>
	<div class="min-h-screen flex">
		<!-- Panel Izquierdo - Ilustración -->
		<div class="flex items-center justify-center relative bg-cover bg-center w-3/5"
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
				<div class="text-center mb-8">
					<h1 class="text-4xl font-bold text-gray-800">Bienvenido a Timee</h1>
					<p class="text-gray-500 mt-2">Inicia sesión para continuar</p>
				</div>

				<!-- Formulario de Inicio de Sesión -->
				<form @submit.prevent="login" class="space-y-6">
					<!-- Campo de Correo Electrónico -->
					<div>
						<label class="block text-sm font-medium text-gray-700 mb-2" for="email">
							Correo Electrónico
						</label>
						<div class="relative">
							<span class="absolute inset-y-0 left-0 flex items-center pl-3">
								<EnvelopeIcon class="h-5 w-5 text-gray-400" />
							</span>
							<input v-model="email" id="email" type="email" required placeholder="tu@email.com" :disabled="isLoading"
								:class="['w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-3 transition-all text-base', emailError ? 'border-red-500 focus:ring-red-100' : 'border-gray-200 focus:ring-blue-100 focus:border-blue-500']" />
						</div>
						<p v-if="emailError" class="text-red-600 text-sm mt-1">{{ emailError }}</p>
					</div>

					<!-- Campo de Contraseña -->
					<div>
						<label class="block text-sm font-medium text-gray-700 mb-2" for="password">
							Contraseña
						</label>
						<div class="relative">
							<span class="absolute inset-y-0 left-0 flex items-center pl-3">
								<LockClosedIcon class="h-5 w-5 text-gray-400" />
							</span>
							<input v-model="password" id="password" :type="showPassword ? 'text' : 'password'" required
								placeholder="Ingresa tu contraseña" :disabled="isLoading"
								:class="['w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-3 transition-all text-base', passwordError ? 'border-red-500 focus:ring-red-100' : 'border-gray-200 focus:ring-blue-100 focus:border-blue-500']" />
							<button type="button" @click="showPassword = !showPassword"
								class="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5">
								<component :is="showPassword ? EyeSlashIcon : EyeIcon" class="h-5 w-5 text-gray-500" />
							</button>
						</div>
						<p v-if="passwordError" class="text-red-600 text-sm mt-1">{{ passwordError }}</p>
					</div>

					<!-- Enlace de Olvidé mi Contraseña -->
					<div class="text-right">
						<a href="#" @click.prevent="forgotPassword"
							class="text-sm font-medium text-blue-600 hover:text-blue-500 transition-colors">
							¿Olvidaste tu contraseña?
						</a>
					</div>

					<!-- Botón de Iniciar Sesión -->
					<button type="submit" :disabled="isLoading"
						class="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors focus:outline-none focus:ring-3 focus:ring-blue-200 disabled:bg-blue-400 disabled:cursor-not-allowed flex items-center justify-center">
						<span v-if="!isLoading">Iniciar Sesión</span>
						<svg v-else class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none"
							viewBox="0 0 24 24">
							<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
							<path class="opacity-75" fill="currentColor"
								d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
							</path>
						</svg>
					</button>

					<div class="text-center text-sm text-gray-500">
						¿No tienes una cuenta? <a href="#" @click.prevent="register"
							class="font-medium text-blue-600 hover:text-blue-500">Regístrate aquí</a>
					</div>
				</form>

				<!-- Mensajes de Error/Éxito -->
				<Transition name="fade">
					<div v-if="error" class="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
						<p class="text-red-700 text-sm">{{ error }}</p>
					</div>
				</Transition>

				<Transition name="fade">
					<div v-if="success" class="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
						<p class="text-green-700 text-sm">{{ success }}</p>
					</div>
				</Transition>
			</div>
		</div>
	</div>
</template>
