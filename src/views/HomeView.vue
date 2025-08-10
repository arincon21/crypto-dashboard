<script setup lang="ts">
import { ref, onMounted, computed, onUnmounted } from 'vue';
import { auth } from '../firebase';
import { signOut, onAuthStateChanged } from 'firebase/auth';
import type { User } from 'firebase/auth';
import { useRouter } from 'vue-router';

// Interfaces
interface CryptoCoin {
	id: string;
	symbol: string;
	name: string;
	image: string;
	current_price: number;
	market_cap: number;
	market_cap_rank: number;
	total_volume: number;
	price_change_percentage_24h: number;
	price_change_percentage_7d_in_currency?: number;
}

interface TrendingCoin {
	item: {
		id: string;
		name: string;
		symbol: string;
		market_cap_rank: number;
		thumb: string;
	};
}

interface FearGreedIndex {
	value: string;
	value_classification: string;
	timestamp: string;
	time_until_update: string;
}

interface GlobalStats {
	total_market_cap: { [key: string]: number };
	total_volume: { [key: string]: number };
	market_cap_percentage: { [key: string]: number };
	active_cryptocurrencies: number;
}

interface NewsArticle {
	title: string;
	description: string;
	time: string;
	source: string;
	image: string;
}

interface MarketData {
	id: string;
	symbol: string;
	name: string;
	image: string;
	current_price: number;
	price_change_percentage_24h: number;
	total_volume?: number;
}

interface TradingPair {
	pair: string;
	price: number;
	change: number;
}


interface PortfolioCoin {
	symbol: string;
	name: string;
	balance: number;
	price: number;
	change: number;
	invested: number;
}

interface PriceAlert {
	id: number;
	coin: string;
	symbol: string;
	currentPrice: number;
	targetPrice: number;
	condition: 'above' | 'below';
	active: boolean;
	created: Date;
}

// Authentication
const user = ref<User | null>(null);
const router = useRouter();

// State management
const activeTab = ref('overview');
const cryptoData = ref<CryptoCoin[]>([]);
const trendingCoins = ref<TrendingCoin[]>([]);
const fearGreedIndex = ref<FearGreedIndex | null>(null);
const globalStats = ref<Partial<GlobalStats>>({});
const newsData = ref<NewsArticle[]>([]);
const loading = ref(true);
const error = ref<string | null>(null);
const searchQuery = ref('');
const priceAlerts = ref<PriceAlert[]>([]);
const watchlist = ref(['bitcoin', 'ethereum', 'binancecoin', 'cardano', 'solana']);

// Portfolio data with more coins
const portfolioData = ref<PortfolioCoin[]>([
	{ symbol: 'BTC', name: 'Bitcoin', balance: 0.15, price: 0, change: 0, invested: 5000 },
	{ symbol: 'ETH', name: 'Ethereum', balance: 3.5, price: 0, change: 0, invested: 7500 },
	{ symbol: 'BNB', name: 'BNB', balance: 45, price: 0, change: 0, invested: 12000 },
	{ symbol: 'ADA', name: 'Cardano', balance: 2000, price: 0, change: 0, invested: 800 },
	{ symbol: 'SOL', name: 'Solana', balance: 25, price: 0, change: 0, invested: 3500 }
]);

// Trading pairs for price comparison
const tradingPairs = ref<TradingPair[]>([]);

// Market analysis
const topGainers = ref<MarketData[]>([]);
const topLosers = ref<MarketData[]>([]);
const mostVolume = ref<MarketData[]>([]);

// Auto-refresh interval
let refreshInterval: ReturnType<typeof setInterval> | null = null;

// API rate limiting
const apiCalls = ref(0);
const maxApiCalls = 10;
const apiResetTime = ref(Date.now());

onMounted(async () => {
	const unsubscribe = onAuthStateChanged(auth, (u) => {
		user.value = u;
	});

	await initializeDashboard();

	// Auto-refresh every 60 seconds (increased to reduce API calls)
	refreshInterval = setInterval(() => {
		if (activeTab.value === 'overview' && canMakeApiCall()) {
			refreshData();
		}
	}, 60000);

	// Store unsubscribe function for cleanup
	onUnmounted(() => {
		unsubscribe();
		if (refreshInterval) {
			clearInterval(refreshInterval);
		}
	});
});

onUnmounted(() => {
	if (refreshInterval) {
		clearInterval(refreshInterval);
	}
});

// API rate limiting helper
const canMakeApiCall = (): boolean => {
	const now = Date.now();
	if (now - apiResetTime.value > 60000) {
		apiCalls.value = 0;
		apiResetTime.value = now;
	}
	return apiCalls.value < maxApiCalls;
};

const incrementApiCall = () => {
	apiCalls.value++;
};

const logout = async () => {
	try {
		await signOut(auth);
		router.push('/login');
	} catch (err) {
		console.error('Error signing out:', err);
		error.value = 'Error al cerrar sesión';
	}
};

const initializeDashboard = async () => {
	loading.value = true;
	error.value = null;

	try {
		const promises = [
			fetchCryptoData(),
			fetchTrendingCoins(),
			fetchFearGreedIndex(),
			fetchGlobalStats(),
			fetchCryptoNews(),
		];

		await Promise.allSettled(promises);
		await fetchMarketAnalysis();
		fetchTradingPairs(); // Non-critical, don't wait
	} catch (err) {
		console.error('Error initializing dashboard:', err);
		error.value = 'Error al cargar los datos. Intentando de nuevo...';
	} finally {
		loading.value = false;
	}
};

const refreshData = async () => {
	try {
		await Promise.allSettled([
			fetchCryptoData(),
			fetchGlobalStats()
		]);
	} catch (err) {
		console.error('Error refreshing data:', err);
	}
};

// Enhanced error handling for API calls
const handleApiError = (err: any, context: string) => {
	console.error(`Error in ${context}:`, err);
	if (err.name === 'TypeError' && err.message.includes('fetch')) {
		error.value = 'Error de conexión. Verifica tu conexión a internet.';
	} else if (err.status === 429) {
		error.value = 'Límite de API alcanzado. Esperando...';
	}
};

// CoinGecko API calls with improved error handling
const fetchCryptoData = async () => {
	if (!canMakeApiCall()) return;

	try {
		incrementApiCall();
		const response = await fetch(
			'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=true&price_change_percentage=1h%2C24h%2C7d',
			{
				headers: {
					'Accept': 'application/json',
				}
			}
		);

		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}

		const data: CryptoCoin[] = await response.json();
		cryptoData.value = data;

		// Update portfolio with real prices
		portfolioData.value.forEach(coin => {
			const cryptoCoin = data.find(c => c.symbol.toUpperCase() === coin.symbol);
			if (cryptoCoin) {
				coin.price = cryptoCoin.current_price;
				coin.change = cryptoCoin.price_change_percentage_24h || 0;
			}
		});
	} catch (err: any) {
		handleApiError(err, 'fetchCryptoData');
	}
};

const fetchTrendingCoins = async () => {
	if (!canMakeApiCall()) return;

	try {
		incrementApiCall();
		const response = await fetch('https://api.coingecko.com/api/v3/search/trending');

		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}

		const data = await response.json();
		trendingCoins.value = data.coins || [];
	} catch (err: any) {
		handleApiError(err, 'fetchTrendingCoins');
	}
};

const fetchFearGreedIndex = async () => {
	try {
		const response = await fetch('https://api.alternative.me/fng/');

		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}

		const data = await response.json();
		fearGreedIndex.value = data.data?.[0] || null;
	} catch (err: any) {
		handleApiError(err, 'fetchFearGreedIndex');
	}
};

const fetchGlobalStats = async () => {
	if (!canMakeApiCall()) return;

	try {
		incrementApiCall();
		const response = await fetch('https://api.coingecko.com/api/v3/global');

		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}

		const data = await response.json();
		globalStats.value = data.data || {};
	} catch (err: any) {
		handleApiError(err, 'fetchGlobalStats');
	}
};

const fetchCryptoNews = async () => {
	try {
		// Using CoinGecko's trending as news substitute since free news APIs are limited
		if (cryptoData.value.length === 0) {
			await fetchCryptoData();
		}

		const data = cryptoData.value.slice(0, 10);

		// Mock news data based on price movements
		newsData.value = data.slice(0, 5).map(coin => ({
			title: coin.price_change_percentage_24h > 0
				? `${coin.name} Surges ${Math.abs(coin.price_change_percentage_24h).toFixed(1)}% in 24 Hours`
				: `${coin.name} Drops ${Math.abs(coin.price_change_percentage_24h).toFixed(1)}% Amid Market Volatility`,
			description: `${coin.name} (${coin.symbol.toUpperCase()}) is currently trading at ${formatPrice(coin.current_price)}`,
			time: `${Math.floor(Math.random() * 12) + 1}h ago`,
			source: 'CryptoNews',
			image: coin.image
		}));
	} catch (err: any) {
		handleApiError(err, 'fetchCryptoNews');
	}
};

const fetchMarketAnalysis = async () => {
	try {
		if (cryptoData.value.length === 0) return;

		const data = cryptoData.value.slice(0, 50);

		topGainers.value = data
			.filter(coin => coin.price_change_percentage_24h > 0)
			.sort((a, b) => b.price_change_percentage_24h - a.price_change_percentage_24h)
			.slice(0, 5);

		topLosers.value = data
			.filter(coin => coin.price_change_percentage_24h < 0)
			.sort((a, b) => a.price_change_percentage_24h - b.price_change_percentage_24h)
			.slice(0, 5);

		mostVolume.value = data
			.sort((a, b) => (b.total_volume || 0) - (a.total_volume || 0))
			.slice(0, 5);
	} catch (err: any) {
		handleApiError(err, 'fetchMarketAnalysis');
	}
};

const fetchTradingPairs = async () => {
	try {
		// Simulate trading pairs data based on actual crypto data
		if (cryptoData.value.length >= 5) {
			tradingPairs.value = cryptoData.value.slice(0, 5).map(coin => ({
				pair: `${coin.symbol.toUpperCase()}USDT`,
				price: coin.current_price,
				change: coin.price_change_percentage_24h
			}));
		}
	} catch (err: any) {
		handleApiError(err, 'fetchTradingPairs');
	}
};

// Computed properties with null checks
const totalPortfolioValue = computed(() => {
	return portfolioData.value.reduce((sum, coin) => {
		const value = coin.balance * (coin.price || 0);
		return sum + (isFinite(value) ? value : 0);
	}, 0);
});

const totalInvested = computed(() => {
	return portfolioData.value.reduce((sum, coin) => sum + (coin.invested || 0), 0);
});

const portfolioPnL = computed(() => {
	const current = totalPortfolioValue.value;
	const invested = totalInvested.value;
	const amount = current - invested;
	const percentage = invested > 0 ? ((current - invested) / invested) * 100 : 0;

	return {
		amount: isFinite(amount) ? amount : 0,
		percentage: isFinite(percentage) ? percentage : 0
	};
});

const filteredCrypto = computed(() => {
	if (!searchQuery.value) return cryptoData.value.slice(0, 10);
	return cryptoData.value.filter(coin =>
		coin.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
		coin.symbol.toLowerCase().includes(searchQuery.value.toLowerCase())
	).slice(0, 10);
});

const watchlistCoins = computed(() => {
	return cryptoData.value.filter(coin =>
		watchlist.value.includes(coin.id)
	);
});

// Utility functions with better error handling
const formatPrice = (price: number): string => {
	if (!isFinite(price) || price === null || price === undefined) return '$0.00';

	try {
		return new Intl.NumberFormat('en-US', {
			style: 'currency',
			currency: 'USD',
			minimumFractionDigits: 2,
			maximumFractionDigits: price < 1 ? 6 : 2
		}).format(price);
	} catch (err: any) {
		console.error('Error formatting price:', err)
		return `$${price.toFixed(2)}`;
	}
};

const formatLargeNumber = (num: number): string => {
	if (!isFinite(num) || num === null || num === undefined) return '0';

	try {
		if (Math.abs(num) >= 1e12) return (num / 1e12).toFixed(2) + 'T';
		if (Math.abs(num) >= 1e9) return (num / 1e9).toFixed(2) + 'B';
		if (Math.abs(num) >= 1e6) return (num / 1e6).toFixed(2) + 'M';
		if (Math.abs(num) >= 1e3) return (num / 1e3).toFixed(2) + 'K';
		return num.toFixed(2);
	} catch (err) {
		console.error('Error formatting large number:', err);
		return num.toString();
	}
};

const formatPercentage = (percentage: number): string => {
	if (!isFinite(percentage) || percentage === null || percentage === undefined) return '0.00%';

	const sign = percentage > 0 ? '+' : '';
	return `${sign}${percentage.toFixed(2)}%`;
};

const removeFromWatchlist = (coinId: string) => {
	const index = watchlist.value.indexOf(coinId);
	if (index > -1) {
		watchlist.value.splice(index, 1);
		// Here you could save to localStorage or backend
	}
};

const createPriceAlert = (coin: CryptoCoin, targetPrice: number, condition: 'above' | 'below') => {
	if (!coin || !isFinite(targetPrice) || targetPrice <= 0) return;

	priceAlerts.value.push({
		id: Date.now(),
		coin: coin.name,
		symbol: coin.symbol,
		currentPrice: coin.current_price,
		targetPrice,
		condition,
		active: true,
		created: new Date()
	});
	// Here you could save to localStorage or backend
};

// Tab switching
const setActiveTab = (tab: string) => {
	activeTab.value = tab;

	// Load data specific to the tab if needed
	if (tab === 'market' && topGainers.value.length === 0) {
		fetchMarketAnalysis();
	}
};

// Fear & Greed Index color with null check
const fearGreedColor = computed(() => {
	if (!fearGreedIndex.value?.value) return 'text-gray-500';

	const value = parseInt(fearGreedIndex.value.value);
	if (isNaN(value)) return 'text-gray-500';

	if (value <= 25) return 'text-red-500';
	if (value <= 45) return 'text-orange-500';
	if (value <= 55) return 'text-yellow-500';
	if (value <= 75) return 'text-green-400';
	return 'text-green-500';
});

// Get best performing portfolio coin safely
const bestPortfolioCoin = computed(() => {
	if (portfolioData.value.length === 0) return null;

	return portfolioData.value
		.filter(coin => isFinite(coin.change))
		.sort((a, b) => b.change - a.change)[0] || null;
});

// Retry failed API calls
const retryFailedCalls = async () => {
	error.value = null;
	loading.value = true;

	try {
		await initializeDashboard();
	} catch (err) {
		console.error('Retry failed:', err);
		error.value = 'Error al recargar los datos';
	} finally {
		loading.value = false;
	}
};
</script>

<template>
	<div class="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100">
		<!-- Error Banner -->
		<div v-if="error"
			class="fixed top-0 left-0 right-0 bg-red-500 text-white px-4 py-2 z-50 flex items-center justify-between">
			<span>{{ error }}</span>
			<button @click="retryFailedCalls" class="bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-sm">
				Reintentar
			</button>
		</div>

		<!-- Sidebar -->
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
					<button @click="setActiveTab('overview')"
						:class="activeTab === 'overview' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'"
						class="w-full flex items-center px-4 py-3 rounded-lg text-left transition-colors">
						<svg class="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20">
							<path
								d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z">
							</path>
						</svg>
						Dashboard
					</button>

					<button @click="setActiveTab('portfolio')"
						:class="activeTab === 'portfolio' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'"
						class="w-full flex items-center px-4 py-3 rounded-lg text-left transition-colors">
						<svg class="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20">
							<path
								d="M9 12a1 1 0 102 0V7a1 1 0 10-2 0v5zM4 7a1 1 0 112 0v5a1 1 0 11-2 0V7zM14 7a1 1 0 112 0v5a1 1 0 11-2 0V7z">
							</path>
						</svg>
						Portfolio
					</button>

					<button @click="setActiveTab('market')"
						:class="activeTab === 'market' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'"
						class="w-full flex items-center px-4 py-3 rounded-lg text-left transition-colors">
						<svg class="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20">
							<path fill-rule="evenodd"
								d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
								clip-rule="evenodd"></path>
						</svg>
						Market Analysis
					</button>

					<button @click="setActiveTab('news')"
						:class="activeTab === 'news' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'"
						class="w-full flex items-center px-4 py-3 rounded-lg text-left transition-colors">
						<svg class="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20">
							<path fill-rule="evenodd"
								d="M2 5a2 2 0 012-2h8a2 2 0 012 2v10a2 2 0 002 2H4a2 2 0 01-2-2V5zm3 1h6v4H5V6zm6 6H5v2h6v-2z"
								clip-rule="evenodd"></path>
						</svg>
						News & Events
					</button>

					<button @click="setActiveTab('watchlist')"
						:class="activeTab === 'watchlist' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'"
						class="w-full flex items-center px-4 py-3 rounded-lg text-left transition-colors">
						<svg class="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20">
							<path
								d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z">
							</path>
						</svg>
						Watchlist
					</button>

					<button @click="setActiveTab('alerts')"
						:class="activeTab === 'alerts' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'"
						class="w-full flex items-center px-4 py-3 rounded-lg text-left transition-colors">
						<svg class="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20">
							<path
								d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z">
							</path>
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
					<button
						class="w-full bg-white/20 hover:bg-white/30 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors">
						Upgrade Now
					</button>
				</div>
			</div>
		</div>

		<!-- Main Content -->
		<div class="ml-64 p-6" :class="{ 'mt-12': error }">
			<!-- Header -->
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
						<input v-model="searchQuery" type="text" placeholder="Buscar Crypto"
							class="pl-10 pr-4 py-2 bg-white rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 w-64">
						<svg class="absolute left-3 top-2.5 w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
							<path fill-rule="evenodd"
								d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
								clip-rule="evenodd"></path>
						</svg>
					</div>

					<!-- User Profile -->
					<div class="flex items-center space-x-3">
						<div class="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
							<span class="text-white font-medium text-sm">{{ user?.email?.[0]?.toUpperCase() || 'U'
							}}</span>
						</div>
						<div class="hidden md:block">
							<p class="text-sm font-medium text-gray-800">{{ user?.email?.split('@')[0] || 'Usuario' }}
							</p>
							<button @click="logout" class="text-xs text-gray-500 hover:text-red-500">Cerrar
								sesión</button>
						</div>
					</div>
				</div>
			</header>

			<!-- Overview Tab -->
			<div v-if="activeTab === 'overview'">
				<div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
					<!-- Main Content Area -->
					<div class="lg:col-span-2 space-y-6">
						<!-- Hero Card -->
						<div
							class="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-6 text-white relative overflow-hidden">
							<div class="relative z-10">
								<h2 class="text-xl font-semibold mb-2">Portfolio Value: {{
									formatPrice(totalPortfolioValue) }}</h2>
								<div class="flex items-center space-x-4 mb-4">
									<span :class="portfolioPnL.amount >= 0 ? 'text-green-300' : 'text-red-300'">
										{{ portfolioPnL.amount >= 0 ? '+' : '' }}{{ formatPrice(portfolioPnL.amount) }}
									</span>
									<span :class="portfolioPnL.percentage >= 0 ? 'text-green-300' : 'text-red-300'">
										{{ formatPercentage(portfolioPnL.percentage) }}
									</span>
								</div>
								<button @click="setActiveTab('portfolio')"
									class="bg-white/20 hover:bg-white/30 text-white px-6 py-2 rounded-lg font-medium transition-colors">
									Ver Detalles
								</button>
							</div>
						</div>

						<!-- Trending Coins -->
						<div class="bg-white rounded-2xl p-6" v-if="trendingCoins.length">
							<h3 class="text-lg font-semibold text-gray-800 mb-4">🔥 Trending Ahora</h3>
							<div class="grid grid-cols-2 md:grid-cols-3 gap-4">
								<div v-for="coin in trendingCoins.slice(0, 6)" :key="coin.item.id"
									class="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors">
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
										<tr v-for="crypto in filteredCrypto.slice(0, 8)" :key="crypto.id"
											class="border-t border-gray-100 hover:bg-gray-50 transition-colors">
											<td class="py-3">
												<div class="flex items-center">
													<img :src="crypto.image" :alt="crypto.name" class="w-8 h-8 mr-3" loading="lazy">
													<div>
														<p class="font-medium">{{ crypto.name }}</p>
														<p class="text-sm text-gray-500">{{ crypto.symbol.toUpperCase()
														}}</p>
													</div>
												</div>
											</td>
											<td class="py-3 font-semibold">{{ formatPrice(crypto.current_price) }}</td>
											<td class="py-3"
												:class="crypto.price_change_percentage_24h > 0 ? 'text-green-500' : 'text-red-500'">
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
								<button @click="setActiveTab('portfolio')"
									class="bg-white/20 hover:bg-white/30 px-3 py-2 rounded-lg text-sm font-medium transition-colors">
									Ver Portfolio
								</button>
								<button @click="setActiveTab('alerts')"
									class="bg-white/20 hover:bg-white/30 px-3 py-2 rounded-lg text-sm font-medium transition-colors">
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
								<div v-for="i in 4" :key="i"
									class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
									<div class="flex items-center">
										<div class="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
											<svg class="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
												<path fill-rule="evenodd"
													d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.293l-3-3a1 1 0 00-1.414 1.414L10.586 9.5 9.293 8.207a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4a1 1 0 00-1.414-1.414L13.707 9.793z"
													clip-rule="evenodd"></path>
											</svg>
										</div>
										<div>
											<p class="text-sm font-medium">Alerta de Precio Activada</p>
											<p class="text-xs text-gray-500">{{ Math.floor(Math.random() * 5) + 1 }}h
												ago</p>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>

			<!-- Portfolio Tab -->
			<div v-if="activeTab === 'portfolio'" class="space-y-6">
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
						<p :class="portfolioPnL.percentage >= 0 ? 'text-green-500' : 'text-red-500'"
							class="text-2xl font-bold">
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
											<div
												class="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold mr-3">
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
									<td class="py-4"
										:class="(coin.balance * coin.price - coin.invested) > 0 ? 'text-green-500' : 'text-red-500'">
										{{ formatPrice(coin.balance * coin.price - coin.invested) }}
									</td>
									<td class="py-4">
										{{ totalPortfolioValue > 0 ? ((coin.balance * coin.price / totalPortfolioValue)
											* 100).toFixed(1) :
											'0' }}%
									</td>
								</tr>
							</tbody>
						</table>
					</div>
				</div>
			</div>

			<!-- Market Analysis Tab -->
			<div v-if="activeTab === 'market'" class="space-y-6">
				<div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
					<!-- Top Gainers -->
					<div class="bg-white rounded-2xl p-6">
						<h3 class="text-lg font-semibold text-gray-800 mb-4 flex items-center">
							<svg class="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
								<path fill-rule="evenodd"
									d="M5.293 7.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L10 4.414 6.707 7.707a1 1 0 01-1.414 0z"
									clip-rule="evenodd"></path>
							</svg>
							Top Ganadores
						</h3>
						<div class="space-y-3">
							<div v-for="coin in topGainers" :key="coin.id"
								class="flex items-center justify-between p-3 bg-green-50 rounded-lg">
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
								<path fill-rule="evenodd"
									d="M14.707 12.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L10 15.586l3.293-3.293a1 1 0 011.414 0z"
									clip-rule="evenodd"></path>
							</svg>
							Top Perdedores
						</h3>
						<div class="space-y-3">
							<div v-for="coin in topLosers" :key="coin.id"
								class="flex items-center justify-between p-3 bg-red-50 rounded-lg">
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
								<path
									d="M9 12a1 1 0 102 0V7a1 1 0 10-2 0v5zM4 7a1 1 0 112 0v5a1 1 0 11-2 0V7zM14 7a1 1 0 112 0v5a1 1 0 11-2 0V7z">
								</path>
							</svg>
							Mayor Volumen
						</h3>
						<div class="space-y-3">
							<div v-for="coin in mostVolume" :key="coin.id"
								class="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
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
							<p class="text-xl font-bold text-gray-800">${{
								formatLargeNumber(globalStats.total_market_cap.usd) }}</p>
							<p class="text-sm text-green-500">+2.4%</p>
						</div>
						<div class="text-center">
							<h4 class="text-sm text-gray-500 mb-2">Volumen 24h</h4>
							<p class="text-xl font-bold text-gray-800">${{
								formatLargeNumber(globalStats.total_volume?.usd || 0) }}
							</p>
							<p class="text-sm text-blue-500">Trading</p>
						</div>
						<div class="text-center">
							<h4 class="text-sm text-gray-500 mb-2">Dominancia BTC</h4>
							<p class="text-xl font-bold text-gray-800">{{
								globalStats.market_cap_percentage?.btc?.toFixed(1) || '0'
							}}%</p>
							<p class="text-sm text-orange-500">Bitcoin</p>
						</div>
						<div class="text-center">
							<h4 class="text-sm text-gray-500 mb-2">Dominancia ETH</h4>
							<p class="text-xl font-bold text-gray-800">{{
								globalStats.market_cap_percentage?.eth?.toFixed(1) || '0'
							}}%</p>
							<p class="text-sm text-purple-500">Ethereum</p>
						</div>
						<div class="text-center">
							<h4 class="text-sm text-gray-500 mb-2">Cryptos Activas</h4>
							<p class="text-xl font-bold text-gray-800">{{
								globalStats.active_cryptocurrencies?.toLocaleString() || '0'
							}}</p>
							<p class="text-sm text-gray-500">Monedas</p>
						</div>
					</div>
				</div>
			</div>

			<!-- News Tab -->
			<div v-if="activeTab === 'news'" class="space-y-6">
				<div class="bg-white rounded-2xl p-6">
					<h3 class="text-lg font-semibold text-gray-800 mb-6">Últimas Noticias Crypto</h3>
					<div class="space-y-4">
						<article v-for="article in newsData" :key="article.title"
							class="flex items-start space-x-4 p-4 border border-gray-100 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
							<img :src="article.image" :alt="article.title"
								class="w-16 h-16 rounded-lg object-cover flex-shrink-0" loading="lazy">
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
						<div v-for="coin in trendingCoins.slice(0, 9)" :key="coin.item.id"
							class="p-4 border border-gray-100 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
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

			<!-- Watchlist Tab -->
			<div v-if="activeTab === 'watchlist'" class="space-y-6">
				<div class="bg-white rounded-2xl p-6">
					<div class="flex items-center justify-between mb-6">
						<h3 class="text-lg font-semibold text-gray-800">Mi Lista de Seguimiento</h3>
						<button
							class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center transition-colors">
							<svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
								<path fill-rule="evenodd"
									d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z"
									clip-rule="evenodd"></path>
							</svg>
							Agregar Moneda
						</button>
					</div>

					<div v-if="watchlistCoins.length === 0" class="text-center py-12 text-gray-500">
						<svg class="w-12 h-12 mx-auto mb-4 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
							<path
								d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z">
							</path>
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
									<td class="py-4"
										:class="coin.price_change_percentage_24h > 0 ? 'text-green-500' : 'text-red-500'">
										{{ formatPercentage(coin.price_change_percentage_24h) }}
									</td>
									<td class="py-4"
										:class="(coin.price_change_percentage_7d_in_currency || 0) > 0 ? 'text-green-500' : 'text-red-500'">
										{{ coin.price_change_percentage_7d_in_currency ?
											formatPercentage(coin.price_change_percentage_7d_in_currency) : 'N/A' }}
									</td>
									<td class="py-4">${{ formatLargeNumber(coin.market_cap) }}</td>
									<td class="py-4">
										<div class="flex items-center space-x-2">
											<button @click="removeFromWatchlist(coin.id)"
												class="text-red-500 hover:text-red-700 p-1 transition-colors" title="Eliminar">
												<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
													<path fill-rule="evenodd"
														d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
														clip-rule="evenodd"></path>
												</svg>
											</button>
											<button @click="createPriceAlert(coin, coin.current_price * 1.1, 'above')"
												class="text-blue-500 hover:text-blue-700 p-1 transition-colors"
												title="Crear Alerta">
												<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
													<path
														d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z">
													</path>
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

			<!-- Price Alerts Tab -->
			<div v-if="activeTab === 'alerts'" class="space-y-6">
				<div class="bg-white rounded-2xl p-6">
					<div class="flex items-center justify-between mb-6">
						<h3 class="text-lg font-semibold text-gray-800">Alertas de Precios</h3>
						<button
							class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center transition-colors">
							<svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
								<path fill-rule="evenodd"
									d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z"
									clip-rule="evenodd"></path>
							</svg>
							Crear Alerta
						</button>
					</div>

					<div v-if="priceAlerts.length === 0" class="text-center py-12 text-gray-500">
						<svg class="w-12 h-12 mx-auto mb-4 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
							<path
								d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z">
							</path>
						</svg>
						<p class="text-lg font-medium mb-2">No hay alertas de precio configuradas</p>
						<p class="text-sm">Crea tu primera alerta de precio para recibir notificaciones cuando tus
							monedas favoritas
							alcancen precios objetivo.</p>
					</div>

					<div v-else class="space-y-4">
						<div v-for="alert in priceAlerts" :key="alert.id"
							class="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
							<div class="flex items-center">
								<div class="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-4">
									<svg class="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
										<path
											d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z">
										</path>
									</svg>
								</div>
								<div>
									<p class="font-medium">{{ alert.coin }} ({{ alert.symbol.toUpperCase() }})</p>
									<p class="text-sm text-gray-500">
										Alertar cuando el precio {{ alert.condition === 'above' ? 'suba por encima de' :
											'baje por debajode'
										}} {{ formatPrice(alert.targetPrice) }}
									</p>
									<p class="text-xs text-gray-400">Precio actual: {{ formatPrice(alert.currentPrice)
									}}</p>
								</div>
							</div>
							<div class="flex items-center space-x-2">
								<div :class="alert.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'"
									class="px-2 py-1 rounded-full text-xs font-medium">
									{{ alert.active ? 'Activa' : 'Inactiva' }}
								</div>
								<button @click="priceAlerts = priceAlerts.filter(a => a.id !== alert.id)"
									class="text-red-500 hover:text-red-700 p-1 transition-colors" title="Eliminar alerta">
									<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
										<path fill-rule="evenodd" d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" clip-rule="evenodd">
										</path>
										<path fill-rule="evenodd"
											d="M10 5a1 1 0 011 1v3l1.5 1.5a1 1 0 01-1.414 1.414L10 10.414l-1.086 1.086a1 1 0 01-1.414-1.414L9 9V6a1 1 0 011-1z"
											clip-rule="evenodd"></path>
										<path fill-rule="evenodd"
											d="M3 5a2 2 0 012-2h1a1 1 0 000 2H5v8a2 2 0 002 2h6a2 2 0 002-2V5h-1a1 1 0 100-2h1a2 2 0 012 2v8a4 4 0 01-4 4H7a4 4 0 01-4-4V5z"
											clip-rule="evenodd"></path>
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
							<select
								class="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
								<option value="">Elige una moneda...</option>
								<option v-for="coin in cryptoData.slice(0, 20)" :key="coin.id" :value="coin.id">
									{{ coin.name }} ({{ coin.symbol.toUpperCase() }})
								</option>
							</select>
						</div>

						<div>
							<label class="block text-sm font-medium text-gray-700 mb-2">Precio Objetivo</label>
							<input type="number" step="0.01" placeholder="0.00"
								class="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
						</div>

						<div>
							<label class="block text-sm font-medium text-gray-700 mb-2">Condición</label>
							<select
								class="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
								<option value="above">El precio sube por encima de</option>
								<option value="below">El precio baja por debajo de</option>
							</select>
						</div>

						<div class="flex items-end">
							<button
								class="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 font-medium transition-colors">
								Crear Alerta
							</button>
						</div>
					</div>
				</div>
			</div>

			<!-- Loading State -->
			<div v-if="loading && !error" class="flex items-center justify-center py-20">
				<div class="text-center">
					<div class="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
					<p class="text-gray-600">Cargando datos de criptomonedas...</p>
				</div>
			</div>
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
