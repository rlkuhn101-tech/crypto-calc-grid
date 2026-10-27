'use client';

import { useEffect, useState, type CSSProperties } from 'react';

const TOKENS = [
  ['BTC', 'Bitcoin'], ['ETH', 'Ethereum'], ['SOL', 'Solana'],
  ['XRP', 'Ripple'], ['ADA', 'Cardano'], ['DOGE', 'Dogecoin'],
  ['BNB', 'Binance Coin'], ['DOT', 'Polkadot'], ['LINK', 'Chainlink'],
  ['LTC', 'Litecoin'],
] as const;
type Prices = Record<string, number>;
const endpoint = `https://min-api.cryptocompare.com/data/pricemulti?fsyms=${TOKENS.map(([symbol]) => symbol).join(',')}&tsyms=USD`;
const field: CSSProperties = {
  width: '100%', boxSizing: 'border-box', padding: '14px', borderRadius: 10,
  border: '1px solid #475569', background: '#0f172a', color: '#e2e8f0',
  font: 'inherit', minHeight: 50, outlineColor: '#38bdf8',
};
const label: CSSProperties = { display: 'block', marginBottom: 10, color: '#cbd5e1', fontSize: 14, fontWeight: 600 };

export default function Home() {
  const [amount, setAmount] = useState('1');
  const [from, setFrom] = useState('BTC');
  const [to, setTo] = useState('ETH');
  const [prices, setPrices] = useState<Prices>({});
  const [error, setError] = useState('');
  const [updated, setUpdated] = useState<Date | null>(null);
  const [focused, setFocused] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    let pending = false;
    let controller: AbortController | null = null;
    const refresh = async () => {
      if (pending) return;
      pending = true;
      controller = new AbortController();
      const timeout = window.setTimeout(() => controller?.abort(), 12000);
      try {
        const response = await fetch(endpoint, { signal: controller.signal, cache: 'no-store' });
        if (!response.ok) throw new Error('Pricing service unavailable. Retrying every 30 seconds.');
        const data = await response.json();
        if (data.Response === 'Error') throw new Error('Pricing service rejected the request or reached its rate limit. Retrying every 30 seconds.');
        const next: Prices = {};
        for (const [symbol] of TOKENS) {
          const price = data[symbol]?.USD;
          if (typeof price !== 'number' || !Number.isFinite(price) || price <= 0) {
            throw new Error('Incomplete pricing data. Retrying every 30 seconds.');
          }
          next[symbol] = price;
        }
        if (active) { setPrices(next); setUpdated(new Date()); setError(''); }
      } catch (cause) {
        if (active) setError(cause instanceof Error && cause.name !== 'AbortError' ? cause.message : 'Could not load live prices. Check your connection; retrying every 30 seconds.');
      } finally {
        window.clearTimeout(timeout);
        pending = false;
      }
    };
    void refresh();
    const interval = window.setInterval(() => { void refresh(); }, 30000);
    return () => { active = false; window.clearInterval(interval); controller?.abort(); };
  }, []);

  const numeric = Number(amount);
  const valid = amount.trim() !== '' && Number.isFinite(numeric) && numeric >= 0;
  const result = valid && prices[from] && prices[to] ? numeric * (prices[from] / prices[to]) : null;
  const formatted = result !== null && Number.isFinite(result)
    ? new Intl.NumberFormat('en-US', { maximumSignificantDigits: 10 }).format(result)
    : '—';
  const inputStyle = (id: string): CSSProperties => ({ ...field, borderColor: focused === id ? '#38bdf8' : '#475569', boxShadow: focused === id ? '0 0 0 3px #38bdf826' : 'none' });

  return (
    <main style={{ minHeight: '100vh', boxSizing: 'border-box', background: '#0f172a', color: '#e2e8f0', fontFamily: 'system-ui, -apple-system, sans-serif', padding: 'clamp(24px, 7vw, 72px) 16px' }}>
      <div style={{ maxWidth: 680, margin: '0 auto' }}>
        <header style={{ textAlign: 'center', marginBottom: 32 }}>
          <p style={{ color: '#38bdf8', textTransform: 'uppercase', letterSpacing: 3, fontSize: 12, fontWeight: 700 }}>Ten assets. One simple converter.</p>
          <h1 style={{ fontSize: 'clamp(30px, 7vw, 44px)', letterSpacing: '-0.04em', margin: '12px 0', color: '#f8fafc' }}>Crypto Calc Grid</h1>
          <p style={{ color: '#94a3b8', lineHeight: 1.6 }}>Real-time crypto conversions, without the clutter.</p>
        </header>

        <section aria-label="Conversion inputs" style={{ padding: 'clamp(20px, 5vw, 32px)', borderRadius: 18, background: '#1e293b', border: '1px solid #334155' }}>
          <label htmlFor="amount" style={label}>Amount to convert</label>
          <input id="amount" type="number" inputMode="decimal" min="0" step="any" value={amount} onChange={(event) => setAmount(event.target.value)} onFocus={() => setFocused('amount')} onBlur={() => setFocused(null)} aria-invalid={!valid} aria-describedby={!valid ? 'amount-error' : undefined} style={inputStyle('amount')} />
          {!valid && <p id="amount-error" style={{ color: '#fda4af', fontSize: 13 }}>Enter a non-negative, finite amount.</p>}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 220px), 1fr))', gap: 18, marginTop: 24 }}>
            <div>
              <label htmlFor="from" style={label}>From asset</label>
              <select id="from" value={from} onChange={(event) => setFrom(event.target.value)} onFocus={() => setFocused('from')} onBlur={() => setFocused(null)} style={inputStyle('from')}>
                {TOKENS.map(([symbol, name]) => <option key={symbol} value={symbol}>{name} ({symbol})</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="to" style={label}>To asset</label>
              <select id="to" value={to} onChange={(event) => setTo(event.target.value)} onFocus={() => setFocused('to')} onBlur={() => setFocused(null)} style={inputStyle('to')}>
                {TOKENS.map(([symbol, name]) => <option key={symbol} value={symbol}>{name} ({symbol})</option>)}
              </select>
            </div>
          </div>
        </section>

        <section aria-label="Conversion result" style={{ border: '2px solid #38bdf8', borderRadius: 18, padding: '28px 20px', marginTop: 24, textAlign: 'center' }}>
          <h2 style={{ fontSize: 14, fontWeight: 500, color: '#94a3b8', margin: '0 0 16px' }}>Estimated conversion value</h2>
          <div role="status" aria-live="polite" aria-atomic="true">
            <p style={{ color: '#cbd5e1', margin: '0 0 8px', overflowWrap: 'anywhere' }}>{valid ? amount : '—'} {from} =</p>
            <p style={{ color: '#38bdf8', fontSize: 'clamp(28px, 6vw, 40px)', fontWeight: 800, margin: 0, overflowWrap: 'anywhere' }}>{formatted} {to}</p>
          </div>
          <p style={{ fontSize: 12, color: '#94a3b8', margin: '18px 0 0', lineHeight: 1.6 }}>{updated ? `Updated ${updated.toLocaleTimeString()} · Refreshes every 30 seconds` : error ? 'Live pricing currently unavailable' : 'Loading live prices…'}</p>
          {error && <p role="alert" style={{ color: '#fda4af', fontSize: 13, lineHeight: 1.6 }}>{updated ? 'Showing last available prices. ' : ''}{error}</p>}
        </section>
        <footer style={{ textAlign: 'center', color: '#94a3b8', fontSize: 12, lineHeight: 1.7, marginTop: 24 }}>Prices via <a href="https://www.cryptocompare.com" style={{ color: '#38bdf8' }}>CryptoCompare</a> · Indicative rates only. Fees and spreads not included.</footer>
      </div>
    </main>
  );
}
