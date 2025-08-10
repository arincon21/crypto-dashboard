<script setup lang="ts">
import { useAuth } from '../composables/useAuth';
import { useTabs } from '../composables/useTabs';
import { useCryptoData } from '../composables/useCryptoData';

import ErrorBanner from '../components/dashboard/ErrorBanner.vue';
import Sidebar from '../components/dashboard/Sidebar.vue';
import Header from '../components/dashboard/Header.vue';
import OverviewTab from '../components/dashboard/OverviewTab.vue';
import PortfolioTab from '../components/dashboard/PortfolioTab.vue';
import MarketAnalysisTab from '../components/dashboard/MarketAnalysisTab.vue';
import NewsTab from '../components/dashboard/NewsTab.vue';
import WatchlistTab from '../components/dashboard/WatchlistTab.vue';
import PriceAlertsTab from '../components/dashboard/PriceAlertsTab.vue';
import LoadingSpinner from '../components/dashboard/LoadingSpinner.vue';

const { user, logout } = useAuth();
const { activeTab, setActiveTab } = useTabs('overview');
const {
	cryptoData,
	trendingCoins,
	fearGreedIndex,
	globalStats,
	newsData,
	loading,
	error,
	searchQuery,
	priceAlerts,
	watchlistCoins,
	portfolioData,
	topGainers,
	topLosers,
	mostVolume,
	totalPortfolioValue,
	totalInvested,
	portfolioPnL,
	filteredCrypto,
	fearGreedColor,
	bestPortfolioCoin,
	fetchMarketAnalysis,
	removeFromWatchlist,
	createPriceAlert,
	retryFailedCalls,
} = useCryptoData();

const handleSetTab = (tab: string) => {
	setActiveTab(tab);
	if (tab === 'market') {
		fetchMarketAnalysis();
	}
};

</script>

<template>
	<div class="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100">
		<ErrorBanner :error="error" @retry="retryFailedCalls" />

		<Sidebar :active-tab="activeTab" :error="error" @set-active-tab="handleSetTab" />

		<div class="ml-64 p-6" :class="{ 'mt-12': error }">
			<Header :active-tab="activeTab" :user="user" :global-stats="globalStats" :fear-greed-index="fearGreedIndex"
				:fear-greed-color="fearGreedColor" v-model:searchQuery="searchQuery" @logout="logout" />

			<OverviewTab v-if="activeTab === 'overview'" :total-portfolio-value="totalPortfolioValue"
				:portfolio-pn-l="portfolioPnL" :trending-coins="trendingCoins" :filtered-crypto="filteredCrypto"
				:portfolio-data="portfolioData" :best-portfolio-coin="bestPortfolioCoin" @set-active-tab="handleSetTab"
				:total-invested="totalInvested" :watchlist="watchlistCoins" :price-alerts="priceAlerts" />

			<PortfolioTab v-if="activeTab === 'portfolio'" :total-portfolio-value="totalPortfolioValue"
				:total-invested="totalInvested" :portfolio-pn-l="portfolioPnL" :portfolio-data="portfolioData"
				:best-portfolio-coin="bestPortfolioCoin" />

			<MarketAnalysisTab v-if="activeTab === 'market'" :top-gainers="topGainers" :top-losers="topLosers"
				:most-volume="mostVolume" :global-stats="globalStats" />

			<NewsTab v-if="activeTab === 'news'" :news-data="newsData" :trending-coins="trendingCoins" />

			<WatchlistTab v-if="activeTab === 'watchlist'" :watchlist-coins="watchlistCoins"
				@remove-from-watchlist="removeFromWatchlist" @create-price-alert="createPriceAlert" />

			<PriceAlertsTab v-if="activeTab === 'alerts'" :price-alerts="priceAlerts" :crypto-data="cryptoData"
				@create-price-alert="createPriceAlert" />

			<LoadingSpinner v-if="loading && !error" />
		</div>
	</div>
</template>

<style scoped>
.line-clamp-2 {
	display: -webkit-box;
	-webkit-line-clamp: 2;
	-webkit-box-orient: vertical;
	overflow: hidden;
}

/* Custom scrollbar for tables */
.overflow-x-auto::-webkit-scrollbar {
	height: 8px;
}

.overflow-x-auto::-webkit-scrollbar-track {
	background: #f1f1f1;
	border-radius: 4px;
}

.overflow-x-auto::-webkit-scrollbar-thumb {
	background: #c1c1c1;
	border-radius: 4px;
}

.overflow-x-auto::-webkit-scrollbar-thumb:hover {
	background: #a8a8a8;
}

/* Responsive table */
@media (max-width: 768px) {
	.overflow-x-auto table {
		min-width: 600px;
	}

	.ml-64 {
		margin-left: 0;
		padding-left: 1rem;
		padding-right: 1rem;
	}

	.fixed.w-64 {
		transform: translateX(-100%);
	}
}

/* Animation for trend indicators */
.trend-up {
	animation: pulse-green 2s infinite;
}

.trend-down {
	animation: pulse-red 2s infinite;
}

@keyframes pulse-green {

	0%,
	100% {
		opacity: 1;
	}

	50% {
		opacity: 0.7;
	}
}

@keyframes pulse-red {

	0%,
	100% {
		opacity: 1;
	}

	50% {
		opacity: 0.7;
	}
}

/* Gradient text for large numbers */
.gradient-text {
	background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
	-webkit-background-clip: text;
	-webkit-text-fill-color: transparent;
	background-clip: text;
}

/* Hover effects for cards */
.hover-lift {
	transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
}

.hover-lift:hover {
	transform: translateY(-2px);
	box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
}

/* Status indicators */
.status-dot {
	width: 8px;
	height: 8px;
	border-radius: 50%;
	display: inline-block;
	margin-right: 8px;
}

.status-online {
	background-color: #10b981;
	animation: pulse-dot 2s infinite;
}

.status-offline {
	background-color: #ef4444;
}

@keyframes pulse-dot {

	0%,
	100% {
		opacity: 1;
	}

	50% {
		opacity: 0.5;
	}
}

/* Custom button styles */
.btn-gradient {
	background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
	transition: all 0.3s ease;
}

.btn-gradient:hover {
	background: linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%);
	transform: translateY(-1px);
}

/* Transition classes */
.transition-colors {
	transition: color 0.15s ease-in-out, background-color 0.15s ease-in-out, border-color 0.15s ease-in-out;
}

/* Loading skeleton */
.skeleton {
	background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
	background-size: 200% 100%;
	animation: loading 1.5s infinite;
}

@keyframes loading {
	0% {
		background-position: 200% 0;
	}

	100% {
		background-position: -200% 0;
	}
}

/* Responsive typography */
@media (max-width: 640px) {
	.text-2xl {
		font-size: 1.5rem;
	}

	.text-3xl {
		font-size: 2rem;
	}

	.text-xl {
		font-size: 1.125rem;
	}
}

/* Error banner animation */
@keyframes slideDown {
	from {
		transform: translateY(-100%);
	}

	to {
		transform: translateY(0);
	}
}

.fixed.top-0 {
	animation: slideDown 0.3s ease-out;
}

/* Focus styles for better accessibility */
button:focus,
input:focus,
select:focus {
	outline: 2px solid #3b82f6;
	outline-offset: 2px;
}

/* Improved hover states */
button:hover,
.cursor-pointer:hover {
	transform: translateY(-1px);
}

/* Loading spinner improvements */
@keyframes spin {
	to {
		transform: rotate(360deg);
	}
}

.animate-spin {
	animation: spin 1s linear infinite;
}

/* Better focus indicators for keyboard navigation */
.focus\:outline-none:focus {
	outline: 2px solid transparent;
	outline-offset: 2px;
}

.focus\:ring-2:focus {
	--tw-ring-offset-shadow: var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color);
	--tw-ring-shadow: var(--tw-ring-inset) 0 0 0 calc(2px + var(--tw-ring-offset-width)) var(--tw-ring-color);
	box-shadow: var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow, 0 0 #0000);
}

.focus\:ring-blue-500:focus {
	--tw-ring-color: #3b82f6;
}

.focus\:border-blue-500:focus {
	border-color: #3b82f6;
}
</style>
