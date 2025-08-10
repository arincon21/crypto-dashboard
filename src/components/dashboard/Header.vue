
<script setup lang="ts">
import { defineEmits } from 'vue';
import type { User } from 'firebase/auth';
import type { GlobalStats, FearGreedIndex } from '../../types/types';
import { formatLargeNumber } from '../../utils/utils';

defineProps<{ 
    activeTab: string, 
    user: User | null, 
    globalStats: Partial<GlobalStats>, 
    fearGreedIndex: FearGreedIndex | null,
    fearGreedColor: string,
    searchQuery: string
}>();

const emit = defineEmits(['logout', 'update:searchQuery']);

const logout = () => {
    emit('logout');
};

const updateSearchQuery = (event: Event) => {
    emit('update:searchQuery', (event.target as HTMLInputElement).value);
};

</script>

<template>
    <header class="flex items-center justify-between mb-8">
        <div>
            <h1 class="text-2xl font-bold text-gray-800">
                {{ activeTab === 'overview' ? 'Dashboard' :
                    activeTab === 'portfolio' ? 'Mi Portfolio' :
                        activeTab === 'market' ? 'Análisis de Mercado' :
                            activeTab === 'news' ? 'Noticias Crypto' :
                                activeTab === 'watchlist' ? 'Lista de Seguimiento' :
                                    'Alertas de Precios' }}
            </h1>
            <p class="text-gray-600" v-if="user">Bienvenido, {{ user.email }}</p>
        </div>

        <div class="flex items-center space-x-4">
            <!-- Global Stats -->
            <div class="hidden lg:flex items-center space-x-4 text-sm" v-if="globalStats.total_market_cap?.usd">
                <div class="text-center">
                    <p class="text-gray-500">Market Cap</p>
                    <p class="font-semibold">${{ formatLargeNumber(globalStats.total_market_cap.usd) }}</p>
                </div>
                <div class="text-center">
                    <p class="text-gray-500">24h Volume</p>
                    <p class="font-semibold">${{ formatLargeNumber(globalStats.total_volume?.usd || 0) }}</p>
                </div>
                <div class="text-center">
                    <p class="text-gray-500">BTC Dominance</p>
                    <p class="font-semibold">{{ globalStats.market_cap_percentage?.btc?.toFixed(1) || '0' }}%
                    </p>
                </div>
            </div>

            <!-- Fear & Greed Index -->
            <div class="text-center" v-if="fearGreedIndex">
                <p class="text-gray-500 text-xs">Fear & Greed</p>
                <p :class="fearGreedColor" class="font-bold text-lg">{{ fearGreedIndex.value }}</p>
            </div>

            <!-- Search -->
            <div class="relative">
                <input :value="searchQuery" @input="updateSearchQuery" type="text" placeholder="Buscar Crypto" class="pl-10 pr-4 py-2 bg-white rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 w-64">
                <svg class="absolute left-3 top-2.5 w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd"></path>
                </svg>
            </div>

            <!-- User Profile -->
            <div class="flex items-center space-x-3">
                <div class="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                    <span class="text-white font-medium text-sm">{{ user?.email?.[0]?.toUpperCase() || 'U' }}</span>
                </div>
                <div class="hidden md:block">
                    <p class="text-sm font-medium text-gray-800">{{ user?.email?.split('@')[0] || 'Usuario' }}</p>
                    <button @click="logout" class="text-xs text-gray-500 hover:text-red-500">Cerrar sesión</button>
                </div>
            </div>
        </div>
    </header>
</template>
