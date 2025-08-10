
export interface CryptoCoin {
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

export interface TrendingCoin {
	item: {
		id: string;
		name: string;
		symbol: string;
		market_cap_rank: number;
		thumb: string;
	};
}

export interface FearGreedIndex {
	value: string;
	value_classification: string;
	timestamp: string;
	time_until_update: string;
}

export interface GlobalStats {
	total_market_cap: { [key: string]: number };
	total_volume: { [key: string]: number };
	market_cap_percentage: { [key: string]: number };
	active_cryptocurrencies: number;
}

export interface NewsArticle {
	title: string;
	description: string;
	time: string;
	source: string;
	image: string;
}

export interface MarketData {
	id: string;
	symbol: string;
	name: string;
	image: string;
	current_price: number;
	price_change_percentage_24h: number;
	total_volume?: number;
}

export interface TradingPair {
	pair: string;
	price: number;
	change: number;
}


export interface PortfolioCoin {
	symbol: string;
	name: string;
	balance: number;
	price: number;
	change: number;
	invested: number;
}

export interface PriceAlert {
	id: number;
	coin: string;
	symbol: string;
	currentPrice: number;
	targetPrice: number;
	condition: 'above' | 'below';
	active: boolean;
	created: Date;
}
