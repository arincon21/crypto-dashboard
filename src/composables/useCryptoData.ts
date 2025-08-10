
import { ref, onMounted, computed, onUnmounted } from 'vue';
import type { CryptoCoin, TrendingCoin, FearGreedIndex, GlobalStats, NewsArticle, MarketData, TradingPair, PortfolioCoin, PriceAlert } from '../types/types';
import { formatPrice } from '../utils/utils';

export function useCryptoData() {
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

    const portfolioData = ref<PortfolioCoin[]>([
        { symbol: 'BTC', name: 'Bitcoin', balance: 0.15, price: 0, change: 0, invested: 5000 },
        { symbol: 'ETH', name: 'Ethereum', balance: 3.5, price: 0, change: 0, invested: 7500 },
        { symbol: 'BNB', name: 'BNB', balance: 45, price: 0, change: 0, invested: 12000 },
        { symbol: 'ADA', name: 'Cardano', balance: 2000, price: 0, change: 0, invested: 800 },
        { symbol: 'SOL', name: 'Solana', balance: 25, price: 0, change: 0, invested: 3500 }
    ]);

    const tradingPairs = ref<TradingPair[]>([]);
    const topGainers = ref<MarketData[]>([]);
    const topLosers = ref<MarketData[]>([]);
    const mostVolume = ref<MarketData[]>([]);

    let refreshInterval: ReturnType<typeof setInterval> | null = null;

    const apiCalls = ref(0);
    const maxApiCalls = 10;
    const apiResetTime = ref(Date.now());

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

    const handleApiError = (err: any, context: string) => {
        console.error(`Error in ${context}:`, err);
        if (err.name === 'TypeError' && err.message.includes('fetch')) {
            error.value = 'Error de conexión. Verifica tu conexión a internet.';
        } else if (err.status === 429) {
            error.value = 'Límite de API alcanzado. Esperando...';
        }
    };

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
            if (cryptoData.value.length === 0) {
                await fetchCryptoData();
            }

            const data = cryptoData.value.slice(0, 10);

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
            fetchTradingPairs();
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

    onMounted(async () => {
        await initializeDashboard();

        refreshInterval = setInterval(() => {
            if (canMakeApiCall()) {
                refreshData();
            }
        }, 60000);
    });

    onUnmounted(() => {
        if (refreshInterval) {
            clearInterval(refreshInterval);
        }
    });

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

    const removeFromWatchlist = (coinId: string) => {
        const index = watchlist.value.indexOf(coinId);
        if (index > -1) {
            watchlist.value.splice(index, 1);
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
    };

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

    const bestPortfolioCoin = computed(() => {
        if (portfolioData.value.length === 0) return null;

        return portfolioData.value
            .filter(coin => isFinite(coin.change))
            .sort((a, b) => b.change - a.change)[0] || null;
    });

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

    return {
        cryptoData,
        trendingCoins,
        fearGreedIndex,
        globalStats,
        newsData,
        loading,
        error,
        searchQuery,
        priceAlerts,
        watchlist,
        portfolioData,
        tradingPairs,
        topGainers,
        topLosers,
        mostVolume,
        totalPortfolioValue,
        totalInvested,
        portfolioPnL,
        filteredCrypto,
        watchlistCoins,
        fearGreedColor,
        bestPortfolioCoin,
        fetchMarketAnalysis,
        removeFromWatchlist,
        createPriceAlert,
        retryFailedCalls,
    };
}
