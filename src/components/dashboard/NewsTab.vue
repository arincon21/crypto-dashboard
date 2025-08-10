
<script setup lang="ts">
import { defineProps } from 'vue';
import type { NewsArticle, TrendingCoin } from '../../types/types';

defineProps<{ 
    newsData: NewsArticle[], 
    trendingCoins: TrendingCoin[]
}>();

</script>

<template>
    <div class="space-y-6">
        <div class="bg-white rounded-2xl p-6">
            <h3 class="text-lg font-semibold text-gray-800 mb-6">Últimas Noticias Crypto</h3>
            <div class="space-y-4">
                <article v-for="article in newsData" :key="article.title" class="flex items-start space-x-4 p-4 border border-gray-100 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                    <img :src="article.image" :alt="article.title" class="w-16 h-16 rounded-lg object-cover flex-shrink-0" loading="lazy">
                    <div class="flex-1">
                        <h4 class="font-semibold text-gray-800 mb-2 line-clamp-2">{{ article.title }}</h4>
                        <p class="text-gray-600 text-sm mb-2">{{ article.description }}</p>
                        <div class="flex items-center text-xs text-gray-500">
                            <span class="mr-4">{{ article.source }}</span>
                            <span>{{ article.time }}</span>
                        </div>
                    </div>
                </article>
            </div>
        </div>

        <!-- Trending Topics -->
        <div class="bg-white rounded-2xl p-6" v-if="trendingCoins.length">
            <h3 class="text-lg font-semibold text-gray-800 mb-6">Temas Trending</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div v-for="coin in trendingCoins.slice(0, 9)" :key="coin.item.id" class="p-4 border border-gray-100 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                    <div class="flex items-center mb-3">
                        <img :src="coin.item.thumb" :alt="coin.item.name" class="w-8 h-8 mr-3" loading="lazy">
                        <div>
                            <p class="font-medium">{{ coin.item.name }}</p>
                            <p class="text-sm text-gray-500">Rank #{{ coin.item.market_cap_rank }}</p>
                        </div>
                    </div>
                    <div class="text-xs text-gray-600">
                        Trending en discusiones crypto y menciones en redes sociales.
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
