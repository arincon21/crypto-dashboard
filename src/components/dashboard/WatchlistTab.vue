
<script setup lang="ts">
import { defineProps, defineEmits } from 'vue';
import type { CryptoCoin } from '../../types/types';
import { formatPrice, formatLargeNumber, formatPercentage } from '../../utils/utils';

defineProps<{ 
    watchlistCoins: CryptoCoin[]
}>();

const emit = defineEmits(['remove-from-watchlist', 'create-price-alert']);

const removeFromWatchlist = (coinId: string) => {
    emit('remove-from-watchlist', coinId);
};

const createPriceAlert = (coin: CryptoCoin, targetPrice: number, condition: 'above' | 'below') => {
    emit('create-price-alert', coin, targetPrice, condition);
};

</script>

<template>
    <div class="space-y-6">
        <div class="bg-white rounded-2xl p-6">
            <div class="flex items-center justify-between mb-6">
                <h3 class="text-lg font-semibold text-gray-800">Mi Lista de Seguimiento</h3>
                <button class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center transition-colors">
                    <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clip-rule="evenodd"></path>
                    </svg>
                    Agregar Moneda
                </button>
            </div>

            <div v-if="watchlistCoins.length === 0" class="text-center py-12 text-gray-500">
                <svg class="w-12 h-12 mx-auto mb-4 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                </svg>
                <p class="text-lg font-medium mb-2">No hay monedas en la lista de seguimiento</p>
                <p class="text-sm">Agrega tus criptomonedas favoritas para hacer seguimiento de sus precios.</p>
            </div>

            <div v-else class="overflow-x-auto">
                <table class="w-full">
                    <thead>
                        <tr class="text-left text-gray-500 text-sm">
                            <th class="pb-4">Moneda</th>
                            <th class="pb-4">Precio</th>
                            <th class="pb-4">Cambio 24h</th>
                            <th class="pb-4">Cambio 7d</th>
                            <th class="pb-4">Market Cap</th>
                            <th class="pb-4">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="coin in watchlistCoins" :key="coin.id" class="border-t border-gray-100">
                            <td class="py-4">
                                <div class="flex items-center">
                                    <img :src="coin.image" :alt="coin.name" class="w-10 h-10 mr-3" loading="lazy">
                                    <div>
                                        <p class="font-medium">{{ coin.name }}</p>
                                        <p class="text-sm text-gray-500">{{ coin.symbol.toUpperCase() }}</p>
                                    </div>
                                </div>
                            </td>
                            <td class="py-4 font-semibold">{{ formatPrice(coin.current_price) }}</td>
                            <td class="py-4" :class="coin.price_change_percentage_24h > 0 ? 'text-green-500' : 'text-red-500'">
                                {{ formatPercentage(coin.price_change_percentage_24h) }}
                            </td>
                            <td class="py-4" :class="(coin.price_change_percentage_7d_in_currency || 0) > 0 ? 'text-green-500' : 'text-red-500'">
                                {{ coin.price_change_percentage_7d_in_currency ? formatPercentage(coin.price_change_percentage_7d_in_currency) : 'N/A' }}
                            </td>
                            <td class="py-4">${{ formatLargeNumber(coin.market_cap) }}</td>
                            <td class="py-4">
                                <div class="flex items-center space-x-2">
                                    <button @click="removeFromWatchlist(coin.id)" class="text-red-500 hover:text-red-700 p-1 transition-colors" title="Eliminar">
                                        <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                            <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path>
                                        </svg>
                                    </button>
                                    <button @click="createPriceAlert(coin, coin.current_price * 1.1, 'above')" class="text-blue-500 hover:text-blue-700 p-1 transition-colors" title="Crear Alerta">
                                        <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z"></path>
                                        </svg>
                                    </button>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>
