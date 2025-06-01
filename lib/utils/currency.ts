export const CURRENCIES = {
  USD: { symbol: "$", name: "US Dollar" },
  EUR: { symbol: "€", name: "Euro" },
  GBP: { symbol: "£", name: "British Pound" },
  JPY: { symbol: "¥", name: "Japanese Yen" },
  CAD: { symbol: "C$", name: "Canadian Dollar" },
  AUD: { symbol: "A$", name: "Australian Dollar" },
  CHF: { symbol: "CHF", name: "Swiss Franc" },
  CNY: { symbol: "¥", name: "Chinese Yuan" },
  INR: { symbol: "₹", name: "Indian Rupee" },
  BRL: { symbol: "R$", name: "Brazilian Real" },
}

export function formatCurrency(amount: number, currency = "USD"): string {
  const currencyInfo = CURRENCIES[currency as keyof typeof CURRENCIES]
  if (!currencyInfo) return `$${amount.toFixed(2)}`

  return `${currencyInfo.symbol}${amount.toFixed(2)}`
}

export function getCurrencySymbol(currency = "USD"): string {
  const currencyInfo = CURRENCIES[currency as keyof typeof CURRENCIES]
  return currencyInfo?.symbol || "$"
}
