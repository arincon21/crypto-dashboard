
<script setup lang="ts">
import { defineProps, defineEmits } from 'vue';

defineProps<{ activeTab: string, error: string | null }>();
const emit = defineEmits(['set-active-tab']);

const setActiveTab = (tab: string) => {
    emit('set-active-tab', tab);
};
</script>

<template>
    <div class="fixed left-0 top-0 h-full w-64 bg-white shadow-lg z-10" :class="{ 'mt-12': error }">
        <div class="p-6">
            <!-- Logo -->
            <div class="flex items-center mb-8">
                <div class="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center mr-3">
                    <span class="text-white font-bold text-sm">C</span>
                </div>
                <span class="font-bold text-xl text-gray-800">Cryptowall</span>
            </div>

            <!-- Navigation -->
            <nav class="space-y-2">
                <button @click="setActiveTab('overview')" :class="activeTab === 'overview' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'" class="w-full flex items-center px-4 py-3 rounded-lg text-left transition-colors">
                    <svg class="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"></path>
                    </svg>
                    Dashboard
                </button>

                <button @click="setActiveTab('portfolio')" :class="activeTab === 'portfolio' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'" class="w-full flex items-center px-4 py-3 rounded-lg text-left transition-colors">
                    <svg class="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9 12a1 1 0 102 0V7a1 1 0 10-2 0v5zM4 7a1 1 0 112 0v5a1 1 0 11-2 0V7zM14 7a1 1 0 112 0v5a1 1 0 11-2 0V7z"></path>
                    </svg>
                    Portfolio
                </button>

                <button @click="setActiveTab('market')" :class="activeTab === 'market' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'" class="w-full flex items-center px-4 py-3 rounded-lg text-left transition-colors">
                    <svg class="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
                    </svg>
                    Market Analysis
                </button>

                <button @click="setActiveTab('news')" :class="activeTab === 'news' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'" class="w-full flex items-center px-4 py-3 rounded-lg text-left transition-colors">
                    <svg class="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M2 5a2 2 0 012-2h8a2 2 0 012 2v10a2 2 0 002 2H4a2 2 0 01-2-2V5zm3 1h6v4H5V6zm6 6H5v2h6v-2z" clip-rule="evenodd"></path>
                    </svg>
                    News & Events
                </button>

                <button @click="setActiveTab('watchlist')" :class="activeTab === 'watchlist' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'" class="w-full flex items-center px-4 py-3 rounded-lg text-left transition-colors">
                    <svg class="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                    </svg>
                    Watchlist
                </button>

                <button @click="setActiveTab('alerts')" :class="activeTab === 'alerts' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'" class="w-full flex items-center px-4 py-3 rounded-lg text-left transition-colors">
                    <svg class="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z"></path>
                    </svg>
                    Price Alerts
                </button>
            </nav>

            <!-- Discover Pro Card -->
            <div class="mt-8 p-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl text-white">
                <div class="flex items-center justify-center w-12 h-12 bg-white/20 rounded-lg mb-3">
                    <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                </div>
                <h4 class="font-semibold mb-1">Discover Pro</h4>
                <p class="text-sm text-white/80 mb-3">Advanced trading tools & analytics</p>
                <button class="w-full bg-white/20 hover:bg-white/30 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors">
                    Upgrade Now
                </button>
            </div>
        </div>
    </div>
</template>
