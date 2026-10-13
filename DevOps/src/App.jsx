import { useState, useEffect, useCallback, useMemo } from 'react'
import './App.css'

// 34 Global Currencies with flags and symbols
const CURRENCIES = [
  { code: 'USD', name: 'US Dollar', symbol: '$', flag: '🇺🇸', country: 'United States' },
  { code: 'EUR', name: 'Euro', symbol: '€', flag: '🇪🇺', country: 'European Union' },
  { code: 'GBP', name: 'British Pound', symbol: '£', flag: '🇬🇧', country: 'United Kingdom' },
  { code: 'INR', name: 'Indian Rupee', symbol: '₹', flag: '🇮🇳', country: 'India' },
  { code: 'JPY', name: 'Japanese Yen', symbol: '¥', flag: '🇯🇵', country: 'Japan' },
  { code: 'CAD', name: 'Canadian Dollar', symbol: 'CA$', flag: '🇨🇦', country: 'Canada' },
  { code: 'AUD', name: 'Australian Dollar', symbol: 'AU$', flag: '🇦🇺', country: 'Australia' },
  { code: 'CHF', name: 'Swiss Franc', symbol: 'CHF', flag: '🇨🇭', country: 'Switzerland' },
  { code: 'CNY', name: 'Chinese Yuan', symbol: '¥', flag: '🇨🇳', country: 'China' },
  { code: 'AED', name: 'UAE Dirham', symbol: 'AED', flag: '🇦🇪', country: 'United Arab Emirates' },
  { code: 'SGD', name: 'Singapore Dollar', symbol: 'S$', flag: '🇸🇬', country: 'Singapore' },
  { code: 'SAR', name: 'Saudi Riyal', symbol: 'SAR', flag: '🇸🇦', country: 'Saudi Arabia' },
  { code: 'NZD', name: 'New Zealand Dollar', symbol: 'NZ$', flag: '🇳🇿', country: 'New Zealand' },
  { code: 'BRL', name: 'Brazilian Real', symbol: 'R$', flag: '🇧🇷', country: 'Brazil' },
  { code: 'ZAR', name: 'South African Rand', symbol: 'R', flag: '🇿🇦', country: 'South Africa' },
  { code: 'MXN', name: 'Mexican Peso', symbol: 'Mex$', flag: '🇲🇽', country: 'Mexico' },
  { code: 'HKD', name: 'Hong Kong Dollar', symbol: 'HK$', flag: '🇭🇰', country: 'Hong Kong' },
  { code: 'KRW', name: 'South Korean Won', symbol: '₩', flag: '🇰🇷', country: 'South Korea' },
  { code: 'SEK', name: 'Swedish Krona', symbol: 'kr', flag: '🇸🇪', country: 'Sweden' },
  { code: 'NOK', name: 'Norwegian Krone', symbol: 'kr', flag: '🇳🇴', country: 'Norway' },
  { code: 'TRY', name: 'Turkish Lira', symbol: '₺', flag: '🇹🇷', country: 'Turkey' },
  { code: 'RUB', name: 'Russian Ruble', symbol: '₽', flag: '🇷🇺', country: 'Russia' },
  { code: 'THB', name: 'Thai Baht', symbol: '฿', flag: '🇹🇭', country: 'Thailand' },
  { code: 'IDR', name: 'Indonesian Rupiah', symbol: 'Rp', flag: '🇮🇩', country: 'Indonesia' },
  { code: 'MYR', name: 'Malaysian Ringgit', symbol: 'RM', flag: '🇲🇾', country: 'Malaysia' },
  { code: 'PHP', name: 'Philippine Peso', symbol: '₱', flag: '🇵🇭', country: 'Philippines' },
  { code: 'PLN', name: 'Polish Zloty', symbol: 'zł', flag: '🇵🇱', country: 'Poland' },
  { code: 'DKK', name: 'Danish Krone', symbol: 'kr', flag: '🇩🇰', country: 'Denmark' },
  { code: 'KWD', name: 'Kuwaiti Dinar', symbol: 'KD', flag: '🇰🇼', country: 'Kuwait' },
  { code: 'QAR', name: 'Qatari Riyal', symbol: 'QR', flag: '🇶🇦', country: 'Qatar' },
  { code: 'EGP', name: 'Egyptian Pound', symbol: 'E£', flag: '🇪🇬', country: 'Egypt' },
  { code: 'NGN', name: 'Nigerian Naira', symbol: '₦', flag: '🇳🇬', country: 'Nigeria' },
  { code: 'ILS', name: 'Israeli Shekel', symbol: '₪', flag: '🇮🇱', country: 'Israel' },
  { code: 'CLP', name: 'Chilean Peso', symbol: 'CLP$', flag: '🇨🇱', country: 'Chile' }
]

// Baseline fallback rates relative to 1 USD for offline or instantaneous loading
const BASELINE_USD_RATES = {
  USD: 1.0,
  EUR: 0.92,
  GBP: 0.79,
  INR: 83.35,
  JPY: 154.20,
  CAD: 1.36,
  AUD: 1.52,
  CHF: 0.91,
  CNY: 7.24,
  AED: 3.67,
  SGD: 1.35,
  SAR: 3.75,
  NZD: 1.66,
  BRL: 5.15,
  ZAR: 18.50,
  MXN: 16.90,
  HKD: 7.82,
  KRW: 1375.0,
  SEK: 10.75,
  NOK: 10.90,
  TRY: 32.25,
  RUB: 92.50,
  THB: 36.80,
  IDR: 16150.0,
  MYR: 4.75,
  PHP: 57.50,
  PLN: 4.02,
  DKK: 6.88,
  KWD: 0.31,
  QAR: 3.64,
  EGP: 47.80,
  NGN: 1420.0,
  ILS: 3.72,
  CLP: 940.0
}

const POPULAR_PAIRS = [
  { from: 'USD', to: 'EUR', label: 'US Dollar to Euro' },
  { from: 'USD', to: 'INR', label: 'US Dollar to Indian Rupee' },
  { from: 'GBP', to: 'USD', label: 'British Pound to US Dollar' },
  { from: 'EUR', to: 'GBP', label: 'Euro to British Pound' },
  { from: 'USD', to: 'JPY', label: 'US Dollar to Japanese Yen' },
  { from: 'AUD', to: 'USD', label: 'Australian Dollar to US Dollar' }
]

export default function App() {
  const [amount, setAmount] = useState('1000')
  const [fromCurrency, setFromCurrency] = useState('USD')
  const [toCurrency, setToCurrency] = useState('INR')
  const [rates, setRates] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const [isLive, setIsLive] = useState(true)
  const [lastUpdated, setLastUpdated] = useState('')
  const [theme, setTheme] = useState('dark')
  const [copied, setCopied] = useState(false)
  const [toast, setToast] = useState(null)

  // Initialize history lazily from localStorage
  const [history, setHistory] = useState(() => {
    try {
      const saved = localStorage.getItem('currency_history')
      return saved ? JSON.parse(saved) : []
    } catch {
      return []
    }
  })

  // Show Toast helper
  const showToast = useCallback((message) => {
    setToast(message)
    setTimeout(() => {
      setToast((prev) => (prev === message ? null : prev))
    }, 3000)
  }, [])

  // Setup theme on HTML element
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  // Fetch Exchange Rates helper
  const fetchRates = useCallback(async (baseCode) => {
    setIsLoading(true)
    try {
      const res = await fetch(`https://open.er-api.com/v6/latest/${baseCode}`)
      if (!res.ok) throw new Error('Network response failed')
      const data = await res.json()
      if (data && data.rates) {
        setRates(data.rates)
        setIsLive(true)
        const dateStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
        setLastUpdated(dateStr)
      } else {
        throw new Error('Invalid rate data')
      }
    } catch {
      // Fallback calculation using baseline rates
      const baseToUSD = 1 / (BASELINE_USD_RATES[baseCode] || 1)
      const calculatedRates = {}
      for (const [curr, val] of Object.entries(BASELINE_USD_RATES)) {
        calculatedRates[curr] = val * baseToUSD
      }
      setRates(calculatedRates)
      setIsLive(false)
      setLastUpdated('Offline (Cached standard rates)')
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Sync rates when fromCurrency changes
  useEffect(() => {
    let ignore = false
    const syncRates = async () => {
      try {
        const res = await fetch(`https://open.er-api.com/v6/latest/${fromCurrency}`)
        if (!res.ok) throw new Error('Network failure')
        const data = await res.json()
        if (!ignore && data?.rates) {
          setRates(data.rates)
          setIsLive(true)
          setLastUpdated(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }))
        }
      } catch {
        if (!ignore) {
          const baseToUSD = 1 / (BASELINE_USD_RATES[fromCurrency] || 1)
          const fallback = {}
          for (const [curr, val] of Object.entries(BASELINE_USD_RATES)) {
            fallback[curr] = val * baseToUSD
          }
          setRates(fallback)
          setIsLive(false)
          setLastUpdated('Offline (Standard rates)')
        }
      }
    }

    syncRates()
    return () => {
      ignore = true
    }
  }, [fromCurrency])

  // Current rate from -> to
  const currentRate = useMemo(() => {
    if (fromCurrency === toCurrency) return 1
    if (rates[toCurrency]) return rates[toCurrency]
    // Fallback if not yet loaded
    const baseToUSD = 1 / (BASELINE_USD_RATES[fromCurrency] || 1)
    return (BASELINE_USD_RATES[toCurrency] || 1) * baseToUSD
  }, [rates, fromCurrency, toCurrency])

  // Inverted rate to -> from
  const invertedRate = useMemo(() => {
    if (!currentRate || currentRate === 0) return 0
    return 1 / currentRate
  }, [currentRate])

  // Calculated converted amount
  const numericAmount = parseFloat(amount) || 0
  const convertedAmount = useMemo(() => {
    return numericAmount * currentRate
  }, [numericAmount, currentRate])

  // Format currency helpers
  const fromInfo = useMemo(() => CURRENCIES.find((c) => c.code === fromCurrency) || CURRENCIES[0], [fromCurrency])
  const toInfo = useMemo(() => CURRENCIES.find((c) => c.code === toCurrency) || CURRENCIES[3], [toCurrency])

  const formatNumber = (num, minDec = 2, maxDec = 4) => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: minDec,
      maximumFractionDigits: maxDec,
    }).format(num)
  }

  // Swap currencies
  const handleSwap = () => {
    const temp = fromCurrency
    setFromCurrency(toCurrency)
    setToCurrency(temp)
    showToast(`Swapped to ${toCurrency} → ${fromCurrency}`)
  }

  // Preset adjustments
  const handlePreset = (addVal) => {
    if (addVal === 'reset') {
      setAmount('1000')
    } else {
      const current = parseFloat(amount) || 0
      setAmount((current + addVal).toString())
    }
  }

  // Copy result
  const handleCopy = () => {
    const text = `${formatNumber(numericAmount)} ${fromCurrency} = ${formatNumber(convertedAmount, 2, 2)} ${toCurrency} (Rate: 1 ${fromCurrency} = ${formatNumber(currentRate, 4, 4)} ${toCurrency})`
    navigator.clipboard.writeText(text)
    setCopied(true)
    showToast('Conversion result copied to clipboard!')
    setTimeout(() => setCopied(false), 2000)
  }

  // Save to history
  const handleSaveConversion = () => {
    if (numericAmount <= 0) return
    const newEntry = {
      id: Date.now(),
      amount: numericAmount,
      from: fromCurrency,
      to: toCurrency,
      result: convertedAmount,
      rate: currentRate,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }
    const updated = [newEntry, ...history.slice(0, 9)]
    setHistory(updated)
    try {
      localStorage.setItem('currency_history', JSON.stringify(updated))
    } catch {
      // Ignore
    }
    showToast('Saved to conversion history!')
  }

  // Clear history
  const handleClearHistory = () => {
    setHistory([])
    try {
      localStorage.removeItem('currency_history')
    } catch {
      // Ignore
    }
    showToast('History cleared')
  }

  // Apply a popular pair
  const handleSelectPair = (pair) => {
    setFromCurrency(pair.from)
    setToCurrency(pair.to)
    showToast(`Loaded pair: ${pair.from} / ${pair.to}`)
  }

  return (
    <div className="app-wrapper">
      {/* Ambient background glows */}
      <div className="ambient-glow-1" />
      <div className="ambient-glow-2" />

      {/* Top Header */}
      <header className="app-header">
        <div className="brand-container">
          <div className="brand-icon">💱</div>
          <div className="brand-text">
            <span>CurrencyX</span>
            <span className="brand-badge">DevOps Pro</span>
          </div>
        </div>

        <div className="header-actions">
          <div className={`live-indicator ${!isLive ? 'offline' : ''}`}>
            <span className="pulsing-dot" />
            <span>{isLive ? 'Live Forex Feed' : 'Offline Mode'}</span>
          </div>

          <button
            type="button"
            className="theme-toggle-btn"
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} mode`}
            onClick={() => setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'))}
          >
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="main-content">
        {/* Hero Section */}
        <section className="hero-section">
          <div className="hero-pill">
            <span>⚡ Zero Markup Real-Time Rates</span>
          </div>
          <h1 className="hero-title">
            Global <span className="gradient-text">Currency Converter</span>
          </h1>
          <p className="hero-subtitle">
            Reliable live foreign exchange rates, transparent mid-market pricing, and instant currency conversions.
          </p>
        </section>

        {/* Currency Converter Form Card */}
        <div className="converter-card">
          <div className="form-section">
            {/* Amount Input */}
            <div className="amount-input-group">
              <div className="form-group-label">
                <span>Enter Amount</span>
                <span>Base Currency: {fromCurrency}</span>
              </div>
              <div className="amount-input-container">
                <span className="amount-prefix">{fromInfo.symbol}</span>
                <input
                  id="currency-amount-input"
                  type="number"
                  min="0"
                  step="any"
                  className="amount-input"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
                {amount && (
                  <button
                    type="button"
                    className="clear-input-btn"
                    title="Clear input"
                    onClick={() => setAmount('')}
                  >
                    ✕
                  </button>
                )}
              </div>

              {/* Quick Presets */}
              <div className="presets-row">
                <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginRight: '4px' }}>Quick Add:</span>
                <button type="button" className="preset-chip" onClick={() => handlePreset(50)}>+$50</button>
                <button type="button" className="preset-chip" onClick={() => handlePreset(100)}>+$100</button>
                <button type="button" className="preset-chip" onClick={() => handlePreset(500)}>+$500</button>
                <button type="button" className="preset-chip" onClick={() => handlePreset(1000)}>+$1,000</button>
                <button type="button" className="preset-chip" onClick={() => handlePreset('reset')}>Reset to 1k</button>
              </div>
            </div>

            {/* Currency Selector Grid (From - Swap - To) */}
            <div className="currency-selector-grid">
              {/* FROM Currency */}
              <div className="currency-card-picker">
                <span className="picker-label">From Currency</span>
                <div className="picker-select-wrapper">
                  <span className="currency-flag">{fromInfo.flag}</span>
                  <div className="currency-info">
                    <div className="currency-code-text">{fromInfo.code}</div>
                    <div className="currency-name-text">{fromInfo.name}</div>
                  </div>
                  <span className="chevron-icon">▼</span>
                </div>
                <select
                  id="from-currency-select"
                  className="select-dropdown-native"
                  value={fromCurrency}
                  onChange={(e) => setFromCurrency(e.target.value)}
                  aria-label="Select source currency"
                >
                  {CURRENCIES.map((c) => (
                    <option key={`from-${c.code}`} value={c.code}>
                      {c.flag} {c.code} - {c.name} ({c.symbol})
                    </option>
                  ))}
                </select>
              </div>

              {/* SWAP BUTTON */}
              <div className="swap-btn-container">
                <button
                  type="button"
                  id="swap-currencies-btn"
                  className="swap-btn"
                  title="Swap currencies"
                  onClick={handleSwap}
                >
                  ⇄
                </button>
              </div>

              {/* TO Currency */}
              <div className="currency-card-picker">
                <span className="picker-label">To Currency</span>
                <div className="picker-select-wrapper">
                  <span className="currency-flag">{toInfo.flag}</span>
                  <div className="currency-info">
                    <div className="currency-code-text">{toInfo.code}</div>
                    <div className="currency-name-text">{toInfo.name}</div>
                  </div>
                  <span className="chevron-icon">▼</span>
                </div>
                <select
                  id="to-currency-select"
                  className="select-dropdown-native"
                  value={toCurrency}
                  onChange={(e) => setToCurrency(e.target.value)}
                  aria-label="Select destination currency"
                >
                  {CURRENCIES.map((c) => (
                    <option key={`to-${c.code}`} value={c.code}>
                      {c.flag} {c.code} - {c.name} ({c.symbol})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Form Actions */}
            <div className="form-actions-row">
              <button
                type="button"
                id="convert-submit-btn"
                className="convert-btn-primary"
                onClick={() => {
                  fetchRates(fromCurrency)
                  showToast('Rates recalculated!')
                }}
              >
                <span>Convert Currency</span>
                <span>→</span>
              </button>

              <button
                type="button"
                className="action-btn-secondary"
                onClick={() => fetchRates(fromCurrency)}
                disabled={isLoading}
              >
                <span className={isLoading ? 'spinning' : ''}>🔄</span>
                <span>{isLoading ? 'Updating...' : 'Refresh Rates'}</span>
              </button>
            </div>
          </div>

          {/* Results Showcase Section */}
          <div className="result-showcase-box">
            <div className="result-header">
              <div className="source-amount-display">
                {formatNumber(numericAmount)} {fromInfo.code} =
              </div>
              <div className="result-actions-wrap">
                <button
                  type="button"
                  className={`icon-action-btn ${copied ? 'success' : ''}`}
                  onClick={handleCopy}
                  title="Copy result"
                >
                  <span>{copied ? '✓' : '📋'}</span>
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
                <button
                  type="button"
                  className="icon-action-btn"
                  onClick={handleSaveConversion}
                  title="Save this conversion"
                >
                  <span>⭐</span>
                  <span>Save</span>
                </button>
              </div>
            </div>

            <div className="target-amount-display">
              <span className="currency-symbol">{toInfo.symbol}</span>
              <span>{formatNumber(convertedAmount, 2, 2)}</span>
              <span style={{ fontSize: '1.25rem', color: 'var(--text-muted)', marginLeft: '0.5rem', fontWeight: 600 }}>
                {toInfo.code}
              </span>
            </div>

            <div className="rate-details-row">
              <div className="rate-pills-wrap">
                <div className="rate-pill">
                  1 {fromInfo.code} = <strong>{formatNumber(currentRate, 4, 4)} {toInfo.code}</strong>
                </div>
                <div className="rate-pill">
                  1 {toInfo.code} = <strong>{formatNumber(invertedRate, 4, 4)} {fromInfo.code}</strong>
                </div>
                <div className="rate-pill highlight">
                  ✓ Mid-Market Rate
                </div>
              </div>

              {lastUpdated && (
                <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
                  Rates synced: {lastUpdated}
                </span>
              )}
            </div>
          </div>

          {/* Transparent Rate & Fee Breakdown */}
          <div className="breakdown-grid">
            <div className="breakdown-card">
              <span className="breakdown-title">Estimated Bank Markup</span>
              <span className="breakdown-val" style={{ color: '#ef4444' }}>~3.5% ($ {formatNumber(numericAmount * 0.035, 2, 2)})</span>
              <span className="breakdown-note">Standard high street retail bank fee</span>
            </div>
            <div className="breakdown-card">
              <span className="breakdown-title">CurrencyX Rate Fee</span>
              <span className="breakdown-val" style={{ color: '#10b981' }}>0.00% (Free)</span>
              <span className="breakdown-note">Pure mid-market interbank rate</span>
            </div>
            <div className="breakdown-card">
              <span className="breakdown-title">Your Net Savings</span>
              <span className="breakdown-val savings">+ {fromInfo.symbol}{formatNumber(numericAmount * 0.035, 2, 2)}</span>
              <span className="breakdown-note">Compared to typical bank transfers</span>
            </div>
          </div>
        </div>

        {/* Popular Currency Pairs Quick Access */}
        <section style={{ marginBottom: '2.5rem' }}>
          <div className="section-header">
            <h2 className="section-title">
              <span>🔥</span>
              <span>Popular Currency Pairs</span>
            </h2>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-dim)' }}>Click to load pair</span>
          </div>

          <div className="popular-pairs-grid">
            {POPULAR_PAIRS.map((pair) => {
              const fromC = CURRENCIES.find((c) => c.code === pair.from)
              const toC = CURRENCIES.find((c) => c.code === pair.to)
              // Calculate estimated rate
              const rateVal = (BASELINE_USD_RATES[pair.to] || 1) / (BASELINE_USD_RATES[pair.from] || 1)
              return (
                <div
                  key={`${pair.from}-${pair.to}`}
                  className="pair-card"
                  onClick={() => handleSelectPair(pair)}
                  role="button"
                  tabIndex={0}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                    <div className="pair-flags">
                      <span>{fromC?.flag}</span>
                      <span>{toC?.flag}</span>
                    </div>
                    <div className="pair-names">
                      <span className="pair-code">{pair.from} / {pair.to}</span>
                      <span className="pair-label">{pair.label}</span>
                    </div>
                  </div>
                  <div className="pair-rate-info">
                    <div className="pair-rate-val">{formatNumber(rateVal, 3, 3)}</div>
                    <div className="pair-trend-badge">▲ Live</div>
                  </div>
                </div>
              )
            })}
          </div>
        </section>

        {/* Conversion History Section */}
        {history.length > 0 && (
          <section className="history-container">
            <div className="section-header" style={{ marginBottom: '0.5rem' }}>
              <h2 className="section-title">
                <span>🕒</span>
                <span>Recent Conversions</span>
              </h2>
              <button
                type="button"
                className="text-btn danger"
                onClick={handleClearHistory}
              >
                Clear History
              </button>
            </div>

            <div className="history-list">
              {history.map((item) => (
                <div key={item.id} className="history-item">
                  <div>
                    <div className="history-main-text">
                      {formatNumber(item.amount)} {item.from} = {formatNumber(item.result, 2, 2)} {item.to}
                    </div>
                    <div className="history-sub-text">
                      Rate: 1 {item.from} = {formatNumber(item.rate, 4, 4)} {item.to} • {item.time}
                    </div>
                  </div>
                  <div className="history-actions">
                    <button
                      type="button"
                      className="text-btn"
                      onClick={() => {
                        setAmount(item.amount.toString())
                        setFromCurrency(item.from)
                        setToCurrency(item.to)
                        showToast(`Restored conversion: ${item.from} → ${item.to}`)
                      }}
                    >
                      Use Again
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>

      {/* Toast Notification */}
      {toast && (
        <div className="toast-notification">
          <span>✨</span>
          <span>{toast}</span>
        </div>
      )}

      {/* Footer */}
      <footer className="app-footer">
        <div>CurrencyX • Fast, accurate real-time currency conversion tool for modern web applications.</div>
        <div className="footer-links">
          <span className="footer-link">Free Mid-Market Rates</span>
          <span>•</span>
          <span className="footer-link">34 World Currencies</span>
          <span>•</span>
          <span className="footer-link">React 19 & Vite</span>
        </div>
      </footer>
    </div>
  )
}
