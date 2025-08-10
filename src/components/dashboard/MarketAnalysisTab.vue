
<script setup lang="ts">
import { defineProps } from 'vue';
import type { MarketData, GlobalStats } from '../../types/types';
import { formatPrice, formatLargeNumber } from '../../utils/utils';

defineProps<{ 
    topGainers: MarketData[], 
    topLosers: MarketData[], 
    mostVolume: MarketData[],
    globalStats: Partial<GlobalStats>
}>();

</script>

<template>
    <div class="space-y-6">
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <!-- Top Gainers -->
            <div class="bg-white rounded-2xl p-6">
                <h3 class="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                    <svg class="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M5.293 7.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L10 4.414 6.707 7.707a1 1 0 01-1.414 0z" clip-rule="evenodd"></path>
                    </svg>
                    Top Ganadores
                </h3>
                <div class="space-y-3">
                    <div v-for="coin in topGainers" :key="coin.id" class="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                        <div class="flex items-center">
                            <img :src="coin.image" :alt="coin.name" class="w-8 h-8 mr-3" loading="lazy">
                            <div>
                                <p class="font-medium text-sm">{{ coin.symbol.toUpperCase() }}</p>
                                <p class="text-xs text-gray-500">{{ formatPrice(coin.current_price) }}</p>
                            </div>
                        </div>
                        <span class="text-green-500 font-semibold">
                            +{{ coin.price_change_percentage_24h.toFixed(2) }}%
                        </span>
                    </div>
                </div>
            </div>

            <!-- Top Losers -->
            <div class="bg-white rounded-2xl p-6">
                <h3 class="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                    <svg class="w-5 h-5 text-red-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M14.707 12.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L10 15.586l3.293-3.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                    </svg>
                    Top Perdedores
                </h3>
                <div class="space-y-3">
                    <div v-for="coin in topLosers" :key="coin.id" class="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                        <div class="flex items-center">
                            <img :src="coin.image" :alt="coin.name" class="w-8 h-8 mr-3" loading="lazy">
                            <div>
                                <p class="font-medium text-sm">{{ coin.symbol.toUpperCase() }}</p>
                                <p class="text-xs text-gray-500">{{ formatPrice(coin.current_price) }}</p>
                            </div>
                        </div>
                        <span class="text-red-500 font-semibold">
                            {{ coin.price_change_percentage_24h.toFixed(2) }}%
                        </span>
                    </div>
                </div>
            </div>

            <!-- Highest Volume -->
            <div class="bg-white rounded-2xl p-6">
                <h3 class="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                    <svg class="w-5 h-5 text-blue-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9 12a1 1 0 102 0V7a1 1 0 10-2 0v5zM4 7a1 1 0 112 0v5a1 1 0 11-2 0V7zM14 7a1 1 0 112 0v5a1 1 0 11-2 0V7z"></path>
                    </svg>
                    Mayor Volumen
                </h3>
                <div class="space-y-3">
                    <div v-for="coin in mostVolume" :key="coin.id" class="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                        <div class="flex items-center">
                            <img :src="coin.image" :alt="coin.name" class="w-8 h-8 mr-3" loading="lazy">
                            <div>
                                <p class="font-medium text-sm">{{ coin.symbol.toUpperCase() }}</p>
                                <p class="text-xs text-gray-500">{{ formatPrice(coin.current_price) }}</p>
                            </div>
                        </div>
                        <span class="text-blue-500 font-semibold">
                            ${{ formatLargeNumber(coin.total_volume || 0) }}
                        </span>
                    </div>
                </div>
            </div>
        </div>

        <!-- Market Overview -->
        <div class="bg-white rounded-2xl p-6" v-if="globalStats.total_market_cap?.usd">
            <h3 class="text-lg font-semibold text-gray-800 mb-6">Vista General del Mercado Global</h3>
            <div class="grid grid-cols-2 md:grid-cols-5 gap-6">
                <div class="text-center">
                    <h4 class="text-sm text-gray-500 mb-2">Total Market Cap</h4>
                    <p class="text-xl font-bold text-gray-800">${{ formatLargeNumber(globalStats.total_market_cap.usd) }}</p>
                    <p class="text-sm text-green-500">+2.4%</p>
                </div>
                <div class="text-center">
                    <h4 class="text-sm text-gray-500 mb-2">Volumen 24h</h4>
                    <p class="text-xl font-bold text-gray-800">${{ formatLargeNumber(globalStats.total_volume?.usd || 0) }}</p>
                    <p class="text-sm text-blue-500">Trading</p>
                </div>
                <div class="text-center">
                    <h4 class="text-sm text-gray-500 mb-2">Dominancia BTC</h4>
                    <p class="text-xl font-bold text-gray-800">{{ globalStats.market_cap_percentage?.btc?.toFixed(1) || '0' }}%</p>
                    <p class="text-sm text-orange-500">Bitcoin</p>
                </div>
                <div class="text-center">
                    <h4 class="text-sm text-gray-500 mb-2">Dominancia ETH</h4>
                    <p class="text-xl font-bold text-gray-800">{{ globalStats.market_cap_percentage?.eth?.toFixed(1) || '0' }}%</p>
                    <p class="text-sm text-purple-500">Ethereum</p>
                </div>
                <div class="text-center">
                    <h4 class="text-sm text-gray-500 mb-2">Cryptos Activas</h4>
                    <p class="text-xl font-bold text-gray-800">{{ globalStats.active_cryptocurrencies?.toLocaleString() || '0' }}</p>
                    <p class="text-sm text-gray-500">Monedas</p>
                </div>
            </div>
        </div>
    </div>
</template>
