'use client';
import React, { useState, useEffect } from 'react';

const ASSET_MATRIX = [
  { id: 'BTC', name: 'Bitcoin', symbol: 'BTC', fallbackPrice: 65000 },
  { id: 'ETH', name: 'Ethereum', symbol: 'ETH', fallbackPrice: 26000 },
  { id: 'SOL', name: 'Solana', symbol: 'SOL', fallbackPrice: 150 },
  { id: 'XRP', name: 'Ripple', symbol: 'XRP', fallbackPrice: 0.55 },
  { id: 'ADA', name: 'Cardano', symbol: 'ADA', fallbackPrice: 0.35 },
  { id: 'DOGE', name: 'Dogecoin', symbol: 'DOGE', fallbackPrice: 0.12 },
  { id: 'BNB', name: 'Binance Coin', symbol: 'BNB', fallbackPrice: 580 },
  { id: 'DOT', name: 'Polkadot', symbol: 'DOT', fallbackPrice: 4.50 },
  { id: 'LINK', name: 'Chainlink', symbol: 'LINK', fallbackPrice: 11.20 },
  { id: 'LTC', name: 'Litecoin', symbol: 'LTC', fallbackPrice: 68.00 },
  { id: 'AVAX', name: 'Avalanche', symbol: 'AVAX', fallbackPrice: 28.50 },
  { id: 'MATIC', name: 'Polygon', symbol: 'MATIC', fallbackPrice: 0.42 },
  { id: 'TRX', name: 'TRON', symbol: 'TRX', fallbackPrice: 0.16 },
  { id: 'UNI', name: 'Uniswap', symbol: 'UNI', fallbackPrice: 7.80 },
  { id: 'XLM', name: 'Stellar', symbol: 'XLM', fallbackPrice: 0.10 },
  { id: 'ATOM', name: 'Cosmos', symbol: 'ATOM', fallbackPrice: 4.80 },
  { id: 'XMR', name: 'Monero', symbol: 'XMR', fallbackPrice: 162.00 },
  { id: 'ETC', name: 'Ethereum Classic', symbol: 'ETC', fallbackPrice: 18.50 },
  { id: 'HBAR', name: 'Hedera', symbol: 'HBAR', fallbackPrice: 0.05 },
  { id: 'ICP', name: 'Internet Computer', symbol: 'ICP', fallbackPrice: 8.10 },
  { id: 'FIL', name: 'Filecoin', symbol: 'FIL', fallbackPrice: 3.60 },
  { id: 'APT', name: 'Aptos', symbol: 'APT', fallbackPrice: 9.20 },
  { id: 'ARB', name: 'Arbitrum', symbol: 'ARB', fallbackPrice: 0.58 },
  { id: 'VET', name: 'VeChain', symbol: 'VET', fallbackPrice: 0.02 },
  { id: 'NEAR', name: 'NEAR Protocol', symbol: 'NEAR', fallbackPrice: 4.90 },
  { id: 'MKR', name: 'Maker', symbol: 'MKR', fallbackPrice: 1250.00 },
  { id: 'OP', name: 'Optimism', symbol: 'OP', fallbackPrice: 1.75 },
  { id: 'GRT', name: 'The Graph', symbol: 'GRT', fallbackPrice: 0.17 },
  { id: 'THETA', name: 'Theta Network', symbol: 'THETA', fallbackPrice: 1.30 },
  { id: 'FTM', name: 'Fantom', symbol: 'FTM', fallbackPrice: 0.72 },
  { id: 'AAVE', name: 'Aave', symbol: 'AAVE', fallbackPrice: 145.00 },
  { id: 'ALGO', name: 'Algorand', symbol: 'ALGO', fallbackPrice: 0.13 },
  { id: 'SAND', name: 'The Sandbox', symbol: 'SAND', fallbackPrice: 0.26 },
  { id: 'MANA', name: 'Decentraland', symbol: 'MANA', fallbackPrice: 0.28 },
  { id: 'EOS', name: 'EOS', symbol: 'EOS', fallbackPrice: 0.48 },
  { id: 'XTZ', name: 'Tezos', symbol: 'XTZ', fallbackPrice: 0.68 },
  { id: 'GALA', name: 'Gala', symbol: 'GALA', fallbackPrice: 0.02 },
  { id: 'BAT', name: 'Basic Attention', symbol: 'BAT', fallbackPrice: 0.18 },
  { id: 'SUSHI', name: 'SushiSwap', symbol: 'SUSHI', fallbackPrice: 0.78 },
  { id: 'ZIL', name: 'Zilliqa', symbol: 'ZIL', fallbackPrice: 0.01 }
];

export default function Home() {
  const [amount, setAmount] = useState<string>('1');
  const [fromCrypto, setFromCrypto] = useState<string>('BTC');
  const [toCrypto, setToCrypto] = useState<string>('ETH');
  const [result, setResult] = useState<string>('0.00');
  const [prices, setPrices] = useState<Record<string, number>>({});

  useEffect(() => {
    const baselineMap: Record<string, number> = {};
    ASSET_MATRIX.forEach(c => { baselineMap[c.id] = c.fallbackPrice; });
    setPrices(baselineMap);

    const fetchPrices = async () => {
      try {
        const symbols = ASSET_MATRIX.map(c => c.id).join(',');
        const res = await fetch(`https://cryptocompare.com{symbols}&tsyms=USD`);
        const data = await res.json();
        
        if (data && typeof data === 'object' && !data.Response) {
          const apiMap: Record<string, number> = {};
          Object.keys(data).forEach((key) => {
            if (data[key] && data[key].USD) { apiMap[key.toUpperCase()] = data[key].USD; }
          });
          setPrices(prev => ({ ...prev, ...apiMap }));
        }
      } catch (err) {
        console.error('API running on internal market matrix:', err);
      }
    };

    fetchPrices();
    const interval = setInterval(fetchPrices, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!prices[fromCrypto] || !prices[toCrypto]) return;
    const fromPriceUsd = prices[fromCrypto];
    const toPriceUsd = prices[toCrypto];
    const calculated = (parseFloat(amount) * fromPriceUsd) / toPriceUsd;
    
    if (isNaN(calculated) || calculated === 0) {
      setResult('0.00');
    } else if (calculated < 0.01) {
      setResult(calculated.toFixed(6));
    } else {
      setResult(calculated.toFixed(4));
    }
  }, [amount, fromCrypto, toCrypto, prices]);

  const selectStyle: React.CSSProperties = {
    width: '100%',
    padding: '14px',
    backgroundColor: '#0f172a',
    color: '#fff',
    border: '1px solid #475569',
    borderRadius: '8px',
    fontSize: '1rem',
    cursor: 'pointer',
    WebkitAppearance: 'none',
    MozAppearance: 'none',
    appearance: 'none',
    backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://w3.org' viewBox='0 0 24 24' fill='none' stroke='%2338bdf8' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e")`,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'right 14px center',
    backgroundSize: '16px'
  };

  return (
    <div style={{ backgroundColor: '#0f172a', minHeight: '100vh', color: '#e2e8f0', fontFamily: 'sans-serif', padding: '40px 16px', boxSizing: 'border-box' }}>
      <main style={{ maxWidth: '600px', margin: '0 auto' }}>
        <header style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h1 style={{ fontSize: '2.5rem', fontWeight: '800', margin: '0 0 6px 0', color: '#fff', letterSpacing: '-0.025em' }}>Crypto Calc Grid</h1>
          <p style={{ color: '#94a3b8', margin: 0, fontSize: '1.1rem' }}>Free Instant Real-Time Crypto Conversion Hub</p>
        </header>

        <section style={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '16px', padding: '24px', marginBottom: '30px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', fontSize: '0.9rem', color: '#94a3b8' }}>Enter Amount to Convert</label>
              <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} style={{ width: '100%', padding: '14px', backgroundColor: '#0f172a', border: '1px solid #475569', borderRadius: '8px', fontSize: '1.1rem', color: '#fff', boxSizing: 'border-box' }} />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', fontSize: '0.9rem', color: '#94a3b8' }}>From Asset</label>
                <select value={fromCrypto} onChange={(e) => setFromCrypto(e.target.value)} style={selectStyle}>
                  {ASSET_MATRIX.map((c) => ( <option key={c.id} value={c.id} style={{ backgroundColor: '#1e293b', color: '#fff' }}>{c.name} ({c.symbol})</option> ))}
                </select>
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', fontSize: '0.9rem', color: '#94a3b8' }}>To Asset</label>
                <select value={toCrypto} onChange={(e) => setToCrypto(e.target.value)} style={selectStyle}>
                  {ASSET_MATRIX.map((c) => ( <option key={c.id} value={c.id} style={{ backgroundColor: '#1e293b', color: '#fff' }}>{c.name} ({c.symbol})</option> ))}
                </select>
              </div>
            </div>
          </div>
        </section>

        <section style={{ border: '2px solid #38bdf8', borderRadius: '16px', padding: '24px', backgroundColor: '#0f172a', textAlign: 'center', boxShadow: '0 10px 15px -3px rgba(56, 189, 248, 0.1)' }}>
          <h2 style={{ fontSize: '1.1rem', margin: '0 0 10px 0', color: '#94a3b8', fontWeight: '600' }}>Live Exchange Matrix</h2>
          <div style={{ fontSize: '2.25rem', fontWeight: '800', color: '#38bdf8' }}>
            {amount} {fromCrypto} = {result} {toCrypto}
          </div>
          <p style={{ color: '#64748b', fontSize: '0.8rem', margin: '12px 0 0 0' }}>Token valuations update smoothly every 30 seconds.</p>
        </section>
      </main>
    </div>
  );
}
