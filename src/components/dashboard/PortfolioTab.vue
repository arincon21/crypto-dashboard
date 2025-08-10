
<script setup lang="ts">
import { defineProps } from 'vue';
import type { PortfolioCoin } from '../../types/types';
import { formatPrice, formatPercentage } from '../../utils/utils';

defineProps<{ 
    totalPortfolioValue: number, 
    totalInvested: number,
    portfolioPnL: { amount: number, percentage: number }, 
    portfolioData: PortfolioCoin[],
    bestPortfolioCoin: PortfolioCoin | null
}>();

</script>

<template>
    <div class="space-y-6">
        <!-- Portfolio Overview Cards -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div class="bg-white rounded-xl p-6">
                <h3 class="text-sm text-gray-500 mb-2">Valor Total del Portfolio</h3>
                <p class="text-2xl font-bold text-gray-800">{{ formatPrice(totalPortfolioValue) }}</p>
                <p :class="portfolioPnL.amount >= 0 ? 'text-green-500' : 'text-red-500'" class="text-sm mt-1">
                    {{ portfolioPnL.amount >= 0 ? '+' : '' }}{{ formatPrice(portfolioPnL.amount) }}
                </p>
            </div>

            <div class="bg-white rounded-xl p-6">
                <h3 class="text-sm text-gray-500 mb-2">Total Invertido</h3>
                <p class="text-2xl font-bold text-gray-800">{{ formatPrice(totalInvested) }}</p>
                <p class="text-sm text-gray-500 mt-1">Inversión inicial</p>
            </div>

            <div class="bg-white rounded-xl p-6">
                <h3 class="text-sm text-gray-500 mb-2">P&L 24h</h3>
                <p :class="portfolioPnL.percentage >= 0 ? 'text-green-500' : 'text-red-500'" class="text-2xl font-bold">
                    {{ formatPercentage(portfolioPnL.percentage) }}
                </p>
                <p class="text-sm text-gray-500 mt-1">Cambio del portfolio</p>
            </div>

            <div class="bg-white rounded-xl p-6">
                <h3 class="text-sm text-gray-500 mb-2">Mejor Rendimiento</h3>
                <p class="text-2xl font-bold text-green-500" v-if="bestPortfolioCoin">
                    {{ bestPortfolioCoin.symbol }}
                </p>
                <p class="text-sm text-gray-500 mt-1" v-if="bestPortfolioCoin">
                    +{{ bestPortfolioCoin.change.toFixed(2) }}%
                </p>
            </div>
        </div>

        <!-- Portfolio Holdings -->
        <div class="bg-white rounded-2xl p-6">
            <h3 class="text-lg font-semibold text-gray-800 mb-6">Holdings del Portfolio</h3>
            <div class="overflow-x-auto">
                <table class="w-full">
                    <thead>
                        <tr class="text-left text-gray-500 text-sm">
                            <th class="pb-4">Activo</th>
                            <th class="pb-4">Holdings</th>
                            <th class="pb-4">Precio</th>
                            <th class="pb-4">Valor</th>
                            <th class="pb-4">Cambio 24h</th>
                            <th class="pb-4">P&L</th>
                            <th class="pb-4">Asignación</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="coin in portfolioData" :key="coin.symbol" class="border-t border-gray-100">
                            <td class="py-4">
                                <div class="flex items-center">
                                    <div class="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold mr-3">
                                        {{ coin.symbol[0] }}
                                    </div>
                                    <div>
                                        <p class="font-medium">{{ coin.name }}</p>
                                        <p class="text-sm text-gray-500">{{ coin.symbol.toUpperCase() }}</p>
                                    </div>
                                </div>
                            </td>
                            <td class="py-4">
                                <div>
                                    <p class="font-semibold">{{ coin.balance }}</p>
                                    <p class="text-sm text-gray-500">{{ coin.symbol.toUpperCase() }}</p>
                                </div>
                            </td>
                            <td class="py-4 font-semibold">{{ formatPrice(coin.price) }}</td>
                            <td class="py-4 font-semibold">{{ formatPrice(coin.balance * coin.price) }}</td>
                            <td class="py-4" :class="coin.change > 0 ? 'text-green-500' : 'text-red-500'">
                                {{ formatPercentage(coin.change) }}
                            </td>
                            <td class="py-4" :class="(coin.balance * coin.price - coin.invested) > 0 ? 'text-green-500' : 'text-red-500'">
                                {{ formatPrice(coin.balance * coin.price - coin.invested) }}
                            </td>
                            <td class="py-4">
                                {{ totalPortfolioValue > 0 ? ((coin.balance * coin.price / totalPortfolioValue) * 100).toFixed(1) : '0' }}%
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>
