
export const formatPrice = (price: number): string => {
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

export const formatLargeNumber = (num: number): string => {
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

export const formatPercentage = (percentage: number): string => {
	if (!isFinite(percentage) || percentage === null || percentage === undefined) return '0.00%';

	const sign = percentage > 0 ? '+' : '';
	return `${sign}${percentage.toFixed(2)}%`;
};
