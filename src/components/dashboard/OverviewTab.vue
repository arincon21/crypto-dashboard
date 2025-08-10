
<script setup lang="ts">
import { defineProps, defineEmits } from 'vue';
import type { CryptoCoin, TrendingCoin, PortfolioCoin } from '../../types/types';
import { formatPrice, formatLargeNumber, formatPercentage } from '../../utils/utils';

defineProps<{
    totalPortfolioValue: number,
    portfolioPnL: { amount: number, percentage: number },
    trendingCoins: TrendingCoin[],
    filteredCrypto: CryptoCoin[],
    portfolioData: PortfolioCoin[],
    bestPortfolioCoin: PortfolioCoin | null,
    totalInvested: number,
    watchlist: any[],
    priceAlerts: any[]
}>();

const emit = defineEmits(['set-active-tab']);

const setActiveTab = (tab: string) => {
    emit('set-active-tab', tab);
};

</script>

<template>
    <div>
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <!-- Main Content Area -->
            <div class="lg:col-span-2 space-y-6">
                <!-- Hero Card -->
                <div class="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-6 text-white relative overflow-hidden">
                    <div class="relative z-10">
                        <h2 class="text-xl font-semibold mb-2">Portfolio Value: {{ formatPrice(totalPortfolioValue) }}</h2>
                        <div class="flex items-center space-x-4 mb-4">
                            <span :class="portfolioPnL.amount >= 0 ? 'text-green-300' : 'text-red-300'">
                                {{ portfolioPnL.amount >= 0 ? '+' : '' }}{{ formatPrice(portfolioPnL.amount) }}
                            </span>
                            <span :class="portfolioPnL.percentage >= 0 ? 'text-green-300' : 'text-red-300'">
                                {{ formatPercentage(portfolioPnL.percentage) }}
                            </span>
                        </div>
                        <button @click="setActiveTab('portfolio')" class="bg-white/20 hover:bg-white/30 text-white px-6 py-2 rounded-lg font-medium transition-colors">
                            Ver Detalles
                        </button>
                    </div>
                </div>

                <!-- Trending Coins -->
                <div class="bg-white rounded-2xl p-6" v-if="trendingCoins.length">
                    <h3 class="text-lg font-semibold text-gray-800 mb-4">🔥 Trending Ahora</h3>
                    <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
                        <div v-for="coin in trendingCoins.slice(0, 6)" :key="coin.item.id" class="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors">
                            <img :src="coin.item.thumb" :alt="coin.item.name" class="w-8 h-8 mr-3">
                            <div>
                                <p class="font-medium text-sm">{{ coin.item.symbol }}</p>
                                <p class="text-xs text-gray-500">#{{ coin.item.market_cap_rank }}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Live Prices Table -->
                <div class="bg-white rounded-2xl p-6">
                    <h3 class="text-lg font-semibold text-gray-800 mb-4">Precios en Vivo</h3>
                    <div class="overflow-x-auto">
                        <table class="w-full">
                            <thead>
                                <tr class="text-left text-gray-500 text-sm">
                                    <th class="pb-3">Moneda</th>
                                    <th class="pb-3">Precio</th>
                                    <th class="pb-3">24h</th>
                                    <th class="pb-3">Volumen</th>
                                    <th class="pb-3">Market Cap</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="crypto in filteredCrypto.slice(0, 8)" :key="crypto.id" class="border-t border-gray-100 hover:bg-gray-50 transition-colors">
                                    <td class="py-3">
                                        <div class="flex items-center">
                                            <img :src="crypto.image" :alt="crypto.name" class="w-8 h-8 mr-3" loading="lazy">
                                            <div>
                                                <p class="font-medium">{{ crypto.name }}</p>
                                                <p class="text-sm text-gray-500">{{ crypto.symbol.toUpperCase() }}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td class="py-3 font-semibold">{{ formatPrice(crypto.current_price) }}</td>
                                    <td class="py-3" :class="crypto.price_change_percentage_24h > 0 ? 'text-green-500' : 'text-red-500'">
                                        {{ formatPercentage(crypto.price_change_percentage_24h) }}
                                    </td>
                                    <td class="py-3">${{ formatLargeNumber(crypto.total_volume) }}</td>
                                    <td class="py-3">${{ formatLargeNumber(crypto.market_cap) }}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <!-- Right Sidebar -->
            <div class="space-y-6">
                <!-- Portfolio Summary -->
                <div class="bg-gradient-to-r from-cyan-500 to-blue-500 rounded-2xl p-6 text-white">
                    <h3 class="text-lg font-semibold mb-2">Resumen Portfolio</h3>
                    <div class="mb-4">
                        <p class="text-cyan-100">Valor Total</p>
                        <p class="text-3xl font-bold">{{ formatPrice(totalPortfolioValue) }}</p>
                    </div>
                    <div class="mb-4">
                        <p class="text-cyan-100">Total Invertido</p>
                        <p class="text-xl font-semibold">{{ formatPrice(totalInvested) }}</p>
                    </div>
                    <div class="grid grid-cols-2 gap-2">
                        <button @click="setActiveTab('portfolio')" class="bg-white/20 hover:bg-white/30 px-3 py-2 rounded-lg text-sm font-medium transition-colors">
                            Ver Portfolio
                        </button>
                        <button @click="setActiveTab('alerts')" class="bg-white/20 hover:bg-white/30 px-3 py-2 rounded-lg text-sm font-medium transition-colors">
                            Crear Alertas
                        </button>
                    </div>
                </div>

                <!-- Quick Stats -->
                <div class="bg-white rounded-2xl p-6">
                    <h3 class="text-lg font-semibold text-gray-800 mb-4">Estadísticas</h3>
                    <div class="space-y-4">
                        <div class="flex justify-between items-center">
                            <span class="text-gray-600">Monedas Activas</span>
                            <span class="font-semibold">{{ portfolioData.length }}</span>
                        </div>
                        <div class="flex justify-between items-center">
                            <span class="text-gray-600">Watchlist</span>
                            <span class="font-semibold">{{ watchlist.length }}</span>
                        </div>
                        <div class="flex justify-between items-center">
                            <span class="text-gray-600">Alertas de Precio</span>
                            <span class="font-semibold">{{ priceAlerts.length }}</span>
                        </div>
                        <div class="flex justify-between items-center" v-if="bestPortfolioCoin">
                            <span class="text-gray-600">Mejor Rendimiento</span>
                            <span class="text-green-500 font-semibold">
                                {{ bestPortfolioCoin.symbol }}
                            </span>
                        </div>
                    </div>
                </div>

                <!-- Recent Activity -->
                <div class="bg-white rounded-2xl p-6">
                    <h3 class="text-lg font-semibold text-gray-800 mb-4">Actividad Reciente</h3>
                    <div class="space-y-3">
                        <div v-for="i in 4" :key="i" class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div class="flex items-center">
                                <div class="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
                                    <svg class="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                                        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.293l-3-3a1 1 0 00-1.414 1.414L10.586 9.5 9.293 8.207a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4a1 1 0 00-1.414-1.414L13.707 9.793z" clip-rule="evenodd"></path>
                                    </svg>
                                </div>
                                <div>
                                    <p class="text-sm font-medium">Alerta de Precio Activada</p>
                                    <p class="text-xs text-gray-500">{{ Math.floor(Math.random() * 5) + 1 }}h ago</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
