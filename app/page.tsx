'use client';

import { useEffect, useState, type CSSProperties } from 'react';

const COINS = [
  ['BTC', 'Bitcoin'],
  ['ETH', 'Ethereum'],
  ['SOL', 'Solana'],
  ['XRP', 'Ripple'],
  ['ADA', 'Cardano'],
  ['DOGE', 'Dogecoin'],
  ['BNB', 'Binance Coin'],
  ['DOT', 'Polkadot'],
  ['LINK', 'Chainlink'],
  ['LTC', 'Litecoin'],
  ['AVAX', 'Avalanche'],
  ['MATIC', 'Polygon'],
  ['TRX', 'TRON'],
  ['UNI', 'Uniswap'],
  ['XLM', 'Stellar'],
  ['ATOM', 'Cosmos'],
  ['XMR', 'Monero'],
  ['ETC', 'Ethereum Classic'],
  ['HBAR', 'Hedera'],
  ['ICP', 'Internet Computer'],
  ['FIL', 'Filecoin'],
  ['APT', 'Aptos'],
  ['ARB', 'Arbitrum'],
  ['VET', 'VeChain'],
  ['NEAR', 'NEAR Protocol'],
  ['MKR', 'Maker'],
  ['OP', 'Optimism'],
  ['GRT', 'The Graph'],
  ['THETA', 'Theta Network'],
  ['FTM', 'Fantom'],
  ['AAVE', 'Aave'],
  ['ALGO', 'Algorand'],
  ['SAND', 'The Sandbox'],
  ['MANA', 'Decentraland'],
  ['EOS', 'EOS'],
  ['XTZ', 'Tezos'],
  ['GALA', 'Gala'],
  ['BAT', 'Basic Attention'],
  ['SUSHI', 'SushiSwap'],
  ['ZIL', 'Zilliqa'],
] as const;
const PRICE_URL = `https://min-api.cryptocompare.com/data/price?fsym=USD&tsyms=${COINS.map(([symbol]) => symbol).join(',')}`;
const card: CSSProperties = { background: '#1e293b', border: '1px solid #334155', borderRadius: 20, padding: 'clamp(20px, 5vw, 32px)' };
const label: CSSProperties = { display: 'block', color: '#cbd5e1', fontSize: 14, fontWeight: 600, marginBottom: 10 };

export default function Home() {
  const [amount, setAmount] = useState('1');
  const [from, setFrom] = useState('BTC');
  const [to, setTo] = useState('ETH');
  const [prices, setPrices] = useState<Record<string, number>>({});
  const [error, setError] = useState('');
  const [updated, setUpdated] = useState<Date | null>(null);
  const [loading, setLoading] = useState(true);
  const [focused, setFocused] = useState('');

  useEffect(() => {
    let disposed = false;
    let active: AbortController | null = null;
    async function refresh() {
      if (active) return;
      const controller = new AbortController();
      active = controller;
      const timeout = setTimeout(() => controller.abort(), 10000);
      try {
        const response = await fetch(PRICE_URL, { signal: controller.signal, cache: 'no-store' });
        if (!response.ok) throw new Error('Price service unavailable');
        const data: unknown = await response.json();
        if (!data || typeof data !== 'object' || ('Response' in data && data.Response === 'Error')) throw new Error('Invalid price response');
        const next: Record<string, number> = {};
        for (const [symbol] of COINS) {
          const value = (data as Record<string, unknown>)[symbol];
          // USD -> asset rates are inverted into USD prices for local cross conversion.
          if (typeof value === 'number' && Number.isFinite(value) && value > 0 && Number.isFinite(1 / value)) next[symbol] = 1 / value;
        }
        if (Object.keys(next).length === 0) throw new Error('No valid rates');
        if (!disposed) { setPrices(next); setUpdated(new Date()); setError(''); }
      } catch {
        if (!disposed) setError('Unable to refresh prices. The service may be unavailable or rate-limited. Retrying every 30 seconds.');
      } finally {
        clearTimeout(timeout);
        active = null;
        if (!disposed) setLoading(false);
      }
    }
    void refresh();
    const interval = setInterval(() => void refresh(), 30000);
    return () => { disposed = true; clearInterval(interval); active?.abort(); };
  }, []);

  const numericAmount = Number(amount);
  const valid = amount.trim() !== '' && Number.isFinite(numericAmount) && numericAmount >= 0;
  const calculated = valid && prices[from] && prices[to] ? numericAmount * (prices[from] / prices[to]) : null;
  const result = calculated !== null && Number.isFinite(calculated) ? calculated : null;
  const field = (id: string): CSSProperties => ({ width: '100%', minWidth: 0, padding: '14px 16px', borderRadius: 10, border: `1px solid ${focused === id ? '#38bdf8' : '#475569'}`, outline: focused === id ? '2px solid #38bdf8' : undefined, outlineOffset: 3, backgroundColor: '#0f172a', color: '#f1f5f9', fontSize: 16, transition: 'border-color 150ms', colorScheme: 'dark' });

  return (
    <main style={{ maxWidth: 760, margin: '0 auto', padding: 'clamp(36px, 8vw, 80px) 20px', minHeight: '100vh' }}>
      <header style={{ textAlign: 'center', marginBottom: 36 }}>
        <p style={{ color: '#38bdf8', fontSize: 12, fontWeight: 700, letterSpacing: '0.18em' }}>40 ASSETS · ONE SIMPLE CONVERTER</p>
        <h1 style={{ fontSize: 'clamp(30px, 6vw, 46px)', letterSpacing: '-0.04em', color: '#f8fafc', margin: '16px 0 12px' }}>Crypto Calc Grid</h1>
        <p style={{ color: '#94a3b8', lineHeight: 1.6 }}>Live crypto conversions, without the clutter.</p>
      </header>
      <section aria-label="Conversion inputs" style={card}>
        <label htmlFor="amount" style={label}>Amount to convert</label>
        <input id="amount" type="number" min="0" step="any" inputMode="decimal" value={amount} onChange={event => setAmount(event.target.value)} onFocus={() => setFocused('amount')} onBlur={() => setFocused('')} aria-invalid={!valid} aria-describedby={!valid ? 'amount-error' : undefined} style={{ ...field('amount'), fontSize: 24 }} />
        {!valid && <p id="amount-error" style={{ color: '#fda4af', fontSize: 14 }}>Enter a finite, non-negative amount.</p>}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 230px), 1fr))', gap: 20, marginTop: 28 }}>
          {(['from', 'to'] as const).map(id => (
            <div key={id}>
              <label htmlFor={id} style={label}>{id === 'from' ? 'From asset' : 'To asset'}</label>
              <select id={id} value={id === 'from' ? from : to} onChange={event => (id === 'from' ? setFrom : setTo)(event.target.value)} onFocus={() => setFocused(id)} onBlur={() => setFocused('')} style={field(id)}>
                {COINS.map(([symbol, name]) => <option key={symbol} value={symbol}>{name} ({symbol})</option>)}
              </select>
            </div>
          ))}
        </div>
      </section>
      <section aria-label="Conversion result" style={{ ...card, marginTop: 24, border: '2px solid #38bdf8', background: '#0f172a', textAlign: 'center' }}>
        <h2 style={{ color: '#94a3b8', fontSize: 14, fontWeight: 500, margin: '0 0 16px' }}>Conversion estimate{error && updated ? ' · last available prices' : ''}</h2>
        <output aria-live="polite" style={{ display: 'block', color: '#38bdf8', fontSize: 'clamp(24px, 5vw, 36px)', fontWeight: 750, overflowWrap: 'anywhere' }}>
          {result !== null ? `${numericAmount.toLocaleString('en-US', { maximumSignificantDigits: 12 })} ${from} = ${result.toLocaleString('en-US', { maximumSignificantDigits: 10 })} ${to}` : loading ? 'Loading live prices…' : !valid ? 'Enter a valid amount' : 'Selected asset prices unavailable'}
        </output>
        <p style={{ color: '#94a3b8', fontSize: 13, margin: '20px 0 0', lineHeight: 1.6 }}>Updates every 30 seconds{updated ? ` · Last updated ${updated.toLocaleTimeString()}` : ''}</p>
        {error && <p role="alert" style={{ color: '#fcd34d', fontSize: 14, lineHeight: 1.6 }}>{error}</p>}
      </section>
      <footer style={{ textAlign: 'center', color: '#94a3b8', fontSize: 12, lineHeight: 1.8, marginTop: 24 }}>Market data from CryptoCompare. Estimates exclude trading fees.<br />For information only, not financial advice.</footer>
    </main>
  );
}
