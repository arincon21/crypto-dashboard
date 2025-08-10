<script setup lang="ts">
import { useAuth } from '@/composables/useAuth';
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
	<div class="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 flex items-center justify-center p-4">
		<!-- Contenedor Principal -->
		<div class="w-full max-w-5xl bg-white rounded-3xl shadow-2xl overflow-hidden flex">
			<!-- Panel Izquierdo - Ilustración y Branding -->
			<div class="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 to-purple-600 relative overflow-hidden">
				<!-- Elementos decorativos de fondo -->
				<div class="absolute inset-0 opacity-10">
					<div class="absolute top-10 left-10 w-32 h-32 bg-white rounded-full"></div>
					<div class="absolute top-32 right-16 w-24 h-24 bg-white rounded-full"></div>
					<div class="absolute bottom-16 left-16 w-40 h-40 bg-white rounded-full"></div>
					<div class="absolute bottom-32 right-10 w-20 h-20 bg-white rounded-full"></div>
				</div>

				<div class="relative z-10 flex flex-col items-center justify-center h-full p-12 text-white text-center">
					<!-- Logo de la empresa -->
					<div class="flex items-center mb-8">
						<div class="w-16 h-16 bg-white bg-opacity-20 rounded-2xl flex items-center justify-center mr-4">
							<span class="text-white font-bold text-2xl">C</span>
						</div>
						<span class="font-bold text-4xl">Cryptowall</span>
					</div>

					<!-- Título principal -->
					<h1 class="text-4xl font-bold mb-4">
						Bienvenido de vuelta
					</h1>
					<p class="text-xl text-blue-100 mb-8 leading-relaxed">
						Accede a tu dashboard de criptomonedas y mantente al día con el mercado en tiempo real
					</p>

					<!-- Características destacadas -->
					<div class="space-y-4 text-left w-full max-w-sm">
						<div class="flex items-center">
							<div class="w-8 h-8 bg-white bg-opacity-20 rounded-lg flex items-center justify-center mr-3">
								<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
									<path fill-rule="evenodd"
										d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
										clip-rule="evenodd"></path>
								</svg>
							</div>
							<span class="text-blue-100">Portfolio en tiempo real</span>
						</div>
						<div class="flex items-center">
							<div class="w-8 h-8 bg-white bg-opacity-20 rounded-lg flex items-center justify-center mr-3">
								<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
									<path fill-rule="evenodd"
										d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
										clip-rule="evenodd"></path>
								</svg>
							</div>
							<span class="text-blue-100">Alertas de precios</span>
						</div>
						<div class="flex items-center">
							<div class="w-8 h-8 bg-white bg-opacity-20 rounded-lg flex items-center justify-center mr-3">
								<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
									<path fill-rule="evenodd"
										d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
										clip-rule="evenodd"></path>
								</svg>
							</div>
							<span class="text-blue-100">Análisis del mercado</span>
						</div>
						<div class="flex items-center">
							<div class="w-8 h-8 bg-white bg-opacity-20 rounded-lg flex items-center justify-center mr-3">
								<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
									<path fill-rule="evenodd"
										d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
										clip-rule="evenodd"></path>
								</svg>
							</div>
							<span class="text-blue-100">Noticias y tendencias</span>
						</div>
					</div>
				</div>
			</div>

			<!-- Panel Derecho - Formulario de Login -->
			<div class="w-full lg:w-1/2 p-8 lg:p-12 relative">
				<!-- Spinner de Carga -->
				<div v-if="isLoading"
					class="absolute inset-0 bg-white bg-opacity-90 flex items-center justify-center z-20 rounded-r-3xl">
					<div class="text-center">
						<div class="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
						<p class="text-gray-600 font-medium">Iniciando sesión...</p>
					</div>
				</div>

				<!-- Header móvil (solo visible en pantallas pequeñas) -->
				<div class="lg:hidden text-center mb-8">
					<div class="flex items-center justify-center mb-4">
						<div class="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center mr-3">
							<span class="text-white font-bold text-lg">C</span>
						</div>
						<span class="font-bold text-2xl text-gray-800">Cryptowall</span>
					</div>
				</div>

				<div class="h-full flex flex-col justify-center">
					<!-- Encabezado del formulario -->
					<div class="mb-8">
						<h2 class="text-3xl font-bold text-gray-800 mb-2">Iniciar Sesión</h2>
						<p class="text-gray-600">Ingresa tus credenciales para acceder a tu cuenta</p>
					</div>

					<!-- Formulario -->
					<form @submit.prevent="login" class="space-y-6">
						<!-- Campo de Correo Electrónico -->
						<div>
							<label class="block text-sm font-semibold text-gray-700 mb-3" for="email">
								Correo Electrónico
							</label>
							<div class="relative">
								<span class="absolute inset-y-0 left-0 flex items-center pl-4">
									<EnvelopeIcon class="h-5 w-5 text-gray-400" />
								</span>
								<input v-model="email" id="email" type="email" required placeholder="tu@email.com" :disabled="isLoading"
									:class="[
										'w-full pl-12 pr-4 py-4 border-2 rounded-xl focus:outline-none focus:ring-4 transition-all duration-200 text-base bg-gray-50 focus:bg-white',
										emailError
											? 'border-red-300 focus:border-red-500 focus:ring-red-100'
											: 'border-gray-200 focus:border-blue-500 focus:ring-blue-100'
									]" />
							</div>
							<Transition name="fade">
								<p v-if="emailError" class="text-red-600 text-sm mt-2 flex items-center">
									<svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
										<path fill-rule="evenodd"
											d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
											clip-rule="evenodd"></path>
									</svg>
									{{ emailError }}
								</p>
							</Transition>
						</div>

						<!-- Campo de Contraseña -->
						<div>
							<label class="block text-sm font-semibold text-gray-700 mb-3" for="password">
								Contraseña
							</label>
							<div class="relative">
								<span class="absolute inset-y-0 left-0 flex items-center pl-4">
									<LockClosedIcon class="h-5 w-5 text-gray-400" />
								</span>
								<input v-model="password" id="password" :type="showPassword ? 'text' : 'password'" required
									placeholder="Ingresa tu contraseña" :disabled="isLoading" :class="[
										'w-full pl-12 pr-12 py-4 border-2 rounded-xl focus:outline-none focus:ring-4 transition-all duration-200 text-base bg-gray-50 focus:bg-white',
										passwordError
											? 'border-red-300 focus:border-red-500 focus:ring-red-100'
											: 'border-gray-200 focus:border-blue-500 focus:ring-blue-100'
									]" />
								<button type="button" @click="showPassword = !showPassword"
									class="absolute inset-y-0 right-0 pr-4 flex items-center hover:bg-gray-100 rounded-r-xl transition-colors">
									<component :is="showPassword ? EyeSlashIcon : EyeIcon" class="h-5 w-5 text-gray-500" />
								</button>
							</div>
							<Transition name="fade">
								<p v-if="passwordError" class="text-red-600 text-sm mt-2 flex items-center">
									<svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
										<path fill-rule="evenodd"
											d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
											clip-rule="evenodd"></path>
									</svg>
									{{ passwordError }}
								</p>
							</Transition>
						</div>

						<!-- Recordar sesión y olvidar contraseña -->
						<div class="flex items-center justify-between">
							<div class="flex items-center">
								<input id="remember-me" name="remember-me" type="checkbox"
									class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded">
								<label for="remember-me" class="ml-2 block text-sm text-gray-700">
									Recordar sesión
								</label>
							</div>
							<button type="button" @click.prevent="forgotPassword"
								class="text-sm font-semibold text-blue-600 hover:text-blue-800 transition-colors">
								¿Olvidaste tu contraseña?
							</button>
						</div>

						<!-- Botón de Iniciar Sesión -->
						<button type="submit" :disabled="isLoading"
							class="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 px-6 rounded-xl font-semibold text-lg hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-4 focus:ring-blue-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center shadow-lg">
							<span v-if="!isLoading">Iniciar Sesión</span>
							<div v-else class="flex items-center">
								<svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none"
									viewBox="0 0 24 24">
									<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
									<path class="opacity-75" fill="currentColor"
										d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
									</path>
								</svg>
								Iniciando sesión...
							</div>
						</button>

						<!-- Separador -->
						<div class="relative my-6">
							<div class="absolute inset-0 flex items-center">
								<div class="w-full border-t border-gray-200"></div>
							</div>
							<div class="relative flex justify-center text-sm">
								<span class="px-4 bg-white text-gray-500">o</span>
							</div>
						</div>

						<!-- Botón de registro -->
						<button type="button" @click.prevent="register"
							class="w-full border-2 border-gray-200 text-gray-700 py-4 px-6 rounded-xl font-semibold text-lg hover:bg-gray-50 hover:border-gray-300 focus:outline-none focus:ring-4 focus:ring-gray-100 transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]">
							Crear cuenta nueva
						</button>
					</form>

					<!-- Mensajes de Error/Éxito -->
					<Transition name="slide-up">
						<div v-if="error" class="mt-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg">
							<div class="flex items-center">
								<svg class="w-5 h-5 text-red-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
									<path fill-rule="evenodd"
										d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
										clip-rule="evenodd"></path>
								</svg>
								<p class="text-red-700 text-sm font-medium">{{ error }}</p>
							</div>
						</div>
					</Transition>

					<Transition name="slide-up">
						<div v-if="success" class="mt-6 p-4 bg-green-50 border-l-4 border-green-500 rounded-lg">
							<div class="flex items-center">
								<svg class="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
									<path fill-rule="evenodd"
										d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
										clip-rule="evenodd"></path>
								</svg>
								<p class="text-green-700 text-sm font-medium">{{ success }}</p>
							</div>
						</div>
					</Transition>

					<!-- Footer del formulario -->
					<div class="mt-8 text-center text-sm text-gray-500">
						<p>¿Necesitas ayuda? <a href="#"
								class="font-medium text-blue-600 hover:text-blue-800 transition-colors">Contacta
								soporte</a></p>
					</div>
				</div>
			</div>
		</div>

		<!-- Elementos decorativos de fondo -->
		<div class="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
			<div
				class="absolute -top-40 -right-32 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob">
			</div>
			<div
				class="absolute -bottom-40 -left-32 w-80 h-80 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000">
			</div>
			<div
				class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-cyan-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000">
			</div>
		</div>
	</div>
</template>

<style scoped>
/* Transiciones */
.fade-enter-active,
.fade-leave-active {
	transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
	opacity: 0;
}

.slide-up-enter-active {
	transition: all 0.3s ease-out;
}

.slide-up-leave-active {
	transition: all 0.3s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-up-enter-from {
	transform: translateY(20px);
	opacity: 0;
}

.slide-up-leave-to {
	transform: translateY(-20px);
	opacity: 0;
}

/* Animaciones de blob */
@keyframes blob {
	0% {
		transform: translate(0px, 0px) scale(1);
	}

	33% {
		transform: translate(30px, -50px) scale(1.1);
	}

	66% {
		transform: translate(-20px, 20px) scale(0.9);
	}

	100% {
		transform: translate(0px, 0px) scale(1);
	}
}

.animate-blob {
	animation: blob 7s infinite;
}

.animation-delay-2000 {
	animation-delay: 2s;
}

.animation-delay-4000 {
	animation-delay: 4s;
}

/* Efectos hover mejorados */
.hover-lift {
	transition: all 0.2s ease-in-out;
}

.hover-lift:hover {
	transform: translateY(-2px);
	box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
}

/* Estilos responsive */
@media (max-width: 1024px) {
	.animate-blob {
		display: none;
	}
}

@media (max-width: 640px) {
	.text-4xl {
		font-size: 2rem;
	}

	.text-3xl {
		font-size: 1.875rem;
	}

	.py-4 {
		padding-top: 0.875rem;
		padding-bottom: 0.875rem;
	}
}

/* Focus states mejorados */
input:focus,
button:focus {
	outline: none;
}

/* Estados de loading */
.loading-shimmer {
	background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
	background-size: 200% 100%;
	animation: loading-shimmer 1.5s infinite;
}

@keyframes loading-shimmer {
	0% {
		background-position: 200% 0;
	}

	100% {
		background-position: -200% 0;
	}
}

/* Mejoras de accesibilidad */
@media (prefers-reduced-motion: reduce) {

	.animate-spin,
	.animate-blob,
	.loading-shimmer {
		animation: none;
	}

	.transition-all,
	.transition-colors {
		transition: none;
	}
}

/* Estados activos */
button:active {
	transition-duration: 0.1s;
}

/* Gradientes consistentes */
.bg-gradient-to-br {
	background-image: linear-gradient(to bottom right, var(--tw-gradient-stops));
}

.bg-gradient-to-r {
	background-image: linear-gradient(to right, var(--tw-gradient-stops));
}
</style>
