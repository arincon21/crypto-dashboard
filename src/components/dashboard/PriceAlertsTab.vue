
<script setup lang="ts">
import { defineProps, ref } from 'vue';
import type { PriceAlert, CryptoCoin } from '../../types/types';
import { formatPrice } from '../../utils/utils';

defineProps<{ 
    priceAlerts: PriceAlert[],
    cryptoData: CryptoCoin[]
}>();

const emit = defineEmits(['create-price-alert', 'remove-price-alert']);

const newAlertCoin = ref('');
const newAlertPrice = ref(0);
const newAlertCondition = ref<'above' | 'below'>('above');

const createPriceAlert = () => {
    const coin = cryptoData.value.find(c => c.id === newAlertCoin.value);
    if (coin) {
        emit('create-price-alert', coin, newAlertPrice.value, newAlertCondition.value);
    }
};

const removePriceAlert = (alertId: number) => {
    emit('remove-price-alert', alertId);
};

</script>

<template>
    <div class="space-y-6">
        <div class="bg-white rounded-2xl p-6">
            <div class="flex items-center justify-between mb-6">
                <h3 class="text-lg font-semibold text-gray-800">Alertas de Precios</h3>
                <button @click="createPriceAlert" class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center transition-colors">
                    <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clip-rule="evenodd"></path>
                    </svg>
                    Crear Alerta
                </button>
            </div>

            <div v-if="priceAlerts.length === 0" class="text-center py-12 text-gray-500">
                <svg class="w-12 h-12 mx-auto mb-4 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z"></path>
                </svg>
                <p class="text-lg font-medium mb-2">No hay alertas de precio configuradas</p>
                <p class="text-sm">Crea tu primera alerta de precio para recibir notificaciones cuando tus monedas favoritas alcancen precios objetivo.</p>
            </div>

            <div v-else class="space-y-4">
                <div v-for="alert in priceAlerts" :key="alert.id" class="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div class="flex items-center">
                        <div class="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                            <svg class="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z"></path>
                            </svg>
                        </div>
                        <div>
                            <p class="font-medium">{{ alert.coin }} ({{ alert.symbol.toUpperCase() }})</p>
                            <p class="text-sm text-gray-500">
                                Alertar cuando el precio {{ alert.condition === 'above' ? 'suba por encima de' : 'baje por debajo de' }} {{ formatPrice(alert.targetPrice) }}
                            </p>
                            <p class="text-xs text-gray-400">Precio actual: {{ formatPrice(alert.currentPrice) }}</p>
                        </div>
                    </div>
                    <div class="flex items-center space-x-2">
                        <div :class="alert.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'" class="px-2 py-1 rounded-full text-xs font-medium">
                            {{ alert.active ? 'Activa' : 'Inactiva' }}
                        </div>
                        <button @click="removePriceAlert(alert.id)" class="text-red-500 hover:text-red-700 p-1 transition-colors" title="Eliminar alerta">
                            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path fill-rule="evenodd" d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" clip-rule="evenodd"></path>
                                <path fill-rule="evenodd" d="M10 5a1 1 0 011 1v3l1.5 1.5a1 1 0 01-1.414 1.414L10 10.414l-1.086 1.086a1 1 0 01-1.414-1.414L9 9V6a1 1 0 011-1z" clip-rule="evenodd"></path>
                                <path fill-rule="evenodd" d="M3 5a2 2 0 012-2h1a1 1 0 000 2H5v8a2 2 0 002 2h6a2 2 0 002-2V5h-1a1 1 0 100-2h1a2 2 0 012 2v8a4 4 0 01-4 4H7a4 4 0 01-4-4V5z" clip-rule="evenodd"></path>
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Create Alert Form -->
        <div class="bg-white rounded-2xl p-6">
            <h4 class="text-lg font-semibold text-gray-800 mb-4">Crear Nueva Alerta</h4>
            <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Seleccionar Moneda</label>
                    <select v-model="newAlertCoin" class="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                        <option value="">Elige una moneda...</option>
                        <option v-for="coin in cryptoData.slice(0, 20)" :key="coin.id" :value="coin.id">
                            {{ coin.name }} ({{ coin.symbol.toUpperCase() }})
                        </option>
                    </select>
                </div>

                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Precio Objetivo</label>
                    <input v-model.number="newAlertPrice" type="number" step="0.01" placeholder="0.00" class="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                </div>

                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Condición</label>
                    <select v-model="newAlertCondition" class="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                        <option value="above">El precio sube por encima de</option>
                        <option value="below">El precio baja por debajo de</option>
                    </select>
                </div>

                <div class="flex items-end">
                    <button @click="createPriceAlert" class="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 font-medium transition-colors">
                        Crear Alerta
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>
