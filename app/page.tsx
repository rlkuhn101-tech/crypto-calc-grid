'use client';

import React, { useState, useEffect } from 'react';

// Hardcoded top 10 high-demand cryptocurrency assets to guarantee instant loading metrics
const TOP_COINS = [
  { id: 'BTC', name: 'Bitcoin', symbol: 'BTC' },
  { id: 'ETH', name: 'Ethereum', symbol: 'ETH' },
  { id: 'SOL', name: 'Solana', symbol: 'SOL' },
  { id: 'XRP', name: 'Ripple', symbol: 'XRP' },
  { id: 'ADA', name: 'Cardano', symbol: 'ADA' },
  { id: 'DOGE', name: 'Dogecoin', symbol: 'DOGE' },
  { id: 'BNB', name: 'Binance Coin', symbol: 'BNB' },
  { id: 'DOT', name: 'Polkadot', symbol: 'DOT' },
  { id: 'LINK', name: 'Chainlink', symbol: 'LINK' },
  { id: 'LTC', name: 'Litecoin', symbol: 'LTC' }
];

export default function Home() {
  const [amount, setAmount] = useState<string>('1');
  const [fromCrypto, setFromCrypto] = useState<string>('BTC');
  const [toCrypto, setToCrypto] = useState<string>('ETH');
  const [result, setResult] = useState<string>('0.00');
  const [prices, setPrices] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState<boolean>(true);

  // Fetch robust multi-asset conversions directly via CryptoCompare public endpoints
  const fetchPrices = async () => {
    try {
      const res = await fetch(
        'https://cryptocompare.com'
      );
      const data = await res.json();
      
      const priceMap: Record<string, number> = {};
      if (data && typeof data === 'object') {
        Object.keys(data).forEach((key) => {
          if (data[key] && data[key].USD) {
            priceMap[key] = data[key].USD;
          }
        });
      }
      
      setPrices(priceMap);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching global crypto valuation feeds:', err);
    }
  };

  useEffect(() => {
    fetchPrices();
    
    // Smooth 30-second loop intervals to prevent flashing metrics while guarding API limits
    const interval = setInterval(() => {
      fetchPrices();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  // Compute clean dual-column currency cross-conversions directly in browser memories
  useEffect(() => {
    if (!prices[fromCrypto] || !prices[toCrypto]) return;

    const fromPriceUsd = prices[fromCrypto];
    const toPriceUsd = prices[toCrypto];
    const calculated = (parseFloat(amount) * fromPriceUsd) / toPriceUsd;
    
    setResult(isNaN(calculated) ? '0.00' : calculated.toFixed(4));
  }, [amount, fromCrypto, toCrypto, prices]);

  return (
    <div style={{ backgroundColor: '#0f172a', minHeight: '100vh', width: '100%' }}>
      <main style={{
        fontFamily: 'system-ui, -apple-system, sans-serif',
        maxWidth: '700px',
        margin: '0 auto',
        padding: '40px 16px',
        color: '#e2e8f0',
        boxSizing: 'border-box'
      }}>
        {/* Header Block Layout */}
        <header style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h1 style={{ fontSize: '2.5rem', fontWeight: '800', margin: '0 0 6px 0', color: '#fff', letterSpacing: '-0.025em' }}>
            Crypto Calc Grid
          </h1>
          <p style={{ color: '#94a3b8', margin: 0, fontSize: '1.1rem' }}>
            Free Instant Real-Time Crypto Conversion Hub
          </p>
        </header>

        {/* Dual Column Input Framework Module */}
        <section style={{
          backgroundColor: '#1e293b',
          border: '1px solid #334155',
          borderRadius: '16px',
          padding: '24px',
          marginBottom: '30px',
          boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)'
        }}>
          {loading ? (
            <p style={{ textAlign: 'center', color: '#94a3b8' }}>Establishing network exchange endpoints...</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              
              {/* Quantifiable Amount Selector box */}
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', fontSize: '0.9rem', color: '#94a3b8' }}>
                  Enter Amount to Convert
                </label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  style={{ width: '100%', padding: '12px 14px', backgroundColor: '#0f172a', border: '1px solid #475569', borderRadius: '8px', fontSize: '1.1rem', color: '#fff', boxSizing: 'border-box' }}
                />
              </div>

              {/* Hub Spoke Split Layout Structure */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                {/* Side A Selector */}
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', fontSize: '0.9rem', color: '#94a3b8' }}>
                    From Asset
                  </label>
                  <select
                    value={fromCrypto}
                    onChange={(e) => setFromCrypto(e.target.value)}
                    style={{ width: '100%', padding: '12px', backgroundColor: '#0f172a', border: '1px solid #475569', borderRadius: '8px', fontSize: '1rem', color: '#fff', cursor: 'pointer' }}
                  >
                    {TOP_COINS.map((coin) => (
                      <option key={coin.id} value={coin.id}>
                        {coin.name} ({coin.symbol})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Side B Selector */}
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', fontSize: '0.9rem', color: '#94a3b8' }}>
                    To Asset
                  </label>
                  <select
                    value={toCrypto}
                    onChange={(e) => setToCrypto(e.target.value)}
                    style={{ width: '100%', padding: '12px', backgroundColor: '#0f172a', border: '1px solid #475569', borderRadius: '8px', fontSize: '1rem', color: '#fff', cursor: 'pointer' }}
                  >
                    {TOP_COINS.map((coin) => (
                      <option key={coin.id} value={coin.id}>
                        {coin.name} ({coin.symbol})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

            </div>
          )}
        </section>

        {/* Real-time Dynamic Exchange Metrics Box Layout */}
        <section style={{
          border: '2px solid #38bdf8',
          borderRadius: '16px',
          padding: '24px',
          backgroundColor: '#0f172a',
          boxShadow: '0 10px 15px -3px rgba(56, 189, 248, 0.1)',
          textAlign: 'center'
        }}>
          <h2 style={{ fontSize: '1.1rem', margin: '0 0 10px 0', fontWeight: '600', color: '#94a3b8' }}>
            Live Exchange Yield Matrix
          </h2>
          <div style={{ fontSize: '2.25rem', fontWeight: '800', color: '#38bdf8' }}>
            {amount} {fromCrypto} = {result} {toCrypto}
          </div>
          <p style={{ color: '#64748b', fontSize: '0.8rem', margin: '12px 0 0 0' }}>
            Token valuations update smoothly every 30 seconds.
          </p>
        </section>
      </main>
    </div>
  );
}
