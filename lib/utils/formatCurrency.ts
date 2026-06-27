export function formatCurrency(
    amount: number,
    currency: 'INR' | 'USD' = 'INR'
): string {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency,
        maximumFractionDigits: 2,
    }).format(amount)
}

export function formatPercent(value: number): string {
    const sign = value >= 0 ? '+' : ''
    return `${sign}${value.toFixed(2)}%`
}

export function cn(...classes: string[]): string {
    return classes.filter(Boolean).join(' ')
}