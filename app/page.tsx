'use client';

import React, { useState, useEffect } from 'react';

export default function Home() {
  const [cryptoList, setCryptoList] = useState<any[]>([]);
  const [amount, setAmount] = useState<string>('1');
  const [fromCrypto, setFromCrypto] = useState<string>('bitcoin');
  const [toCrypto, setToCrypto] = useState<string>('ethereum');
  const [result, setResult] = useState<string>('0.00');
  const [loading, setLoading] = useState<boolean>(true);

  // Fetch top 100 Cryptocurrencies (CoinGecko API)
  const fetchPrices = async () => {
    try {
      const res = await fetch(
        'https://coingecko.com'
      );
      const data = await res.json();
      if (Array.isArray(data)) {
        setCryptoList(data);
      }
      setLoading(false);
    } catch (err) {
      console.error('Error fetching crypto data:', err);
    }
  };

  // Run initial fetch on mount
  useEffect(() => {
    fetchPrices();
    
    // Slower refresh rate (Every 30 seconds) to avoid distracting flashing updates
    const interval = setInterval(() => {
      fetchPrices();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  // Calculate Conversion Rate locally when inputs change
  useEffect(() => {
    if (cryptoList.length === 0) return;

    const fromCoin = cryptoList.find((c) => c.id === fromCrypto);
    const toCoin = cryptoList.find((c) => c.id === toCrypto);

    if (fromCoin && toCoin) {
      const fromPriceUsd = fromCoin.current_price;
      const toPriceUsd = toCoin.current_price;
      const calculated = (parseFloat(amount) * fromPriceUsd) / toPriceUsd;
      setResult(isNaN(calculated) ? '0.00' : calculated.toFixed(4));
    }
  }, [amount, fromCrypto, toCrypto, cryptoList]);

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
        {/* Header Block */}
        <header style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h1 style={{ fontSize: '2.5rem', fontWeight: '800', margin: '0 0 6px 0', color: '#fff', letterSpacing: '-0.025em' }}>
            Crypto Calc Grid
          </h1>
          <p style={{ color: '#94a3b8', margin: 0, fontSize: '1.1rem' }}>
            Free Instant Real-Time Crypto Conversion Hub
          </p>
        </header>

        {/* Dual-Column Interactive Panel */}
        <section style={{
          backgroundColor: '#1e293b',
          border: '1px solid #334155',
          borderRadius: '16px',
          padding: '28px',
          marginBottom: '30px',
          boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)'
        }}>
          {loading ? (
            <p style={{ textAlign: 'center', color: '#94a3b8' }}>Loading live pricing metrics...</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              
              {/* Input Value Field */}
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

              {/* Dual Layout Selection Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                {/* Column 1: From Crypto */}
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', fontSize: '0.9rem', color: '#94a3b8' }}>
                    From Asset
                  </label>
                  <select
                    value={fromCrypto}
                    onChange={(e) => setFromCrypto(e.target.value)}
                    style={{ width: '100%', padding: '12px', backgroundColor: '#0f172a', border: '1px solid #475569', borderRadius: '8px', fontSize: '1rem', color: '#fff', cursor: 'pointer' }}
                  >
                    {cryptoList.map((coin) => (
                      <option key={coin.id} value={coin.id}>
                        {coin.name} ({coin.symbol.toUpperCase()})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Column 2: To Crypto */}
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', fontSize: '0.9rem', color: '#94a3b8' }}>
                    To Asset
                  </label>
                  <select
                    value={toCrypto}
                    onChange={(e) => setToCrypto(e.target.value)}
                    style={{ width: '100%', padding: '12px', backgroundColor: '#0f172a', border: '1px solid #475569', borderRadius: '8px', fontSize: '1rem', color: '#fff', cursor: 'pointer' }}
                  >
                    {cryptoList.map((coin) => (
                      <option key={coin.id} value={coin.id}>
                        {coin.name} ({coin.symbol.toUpperCase()})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

            </div>
          )}
        </section>

        {/* Live Estimation Output Panel */}
        <section style={{
          border: '2px solid #38bdf8',
          borderRadius: '16px',
          padding: '24px',
          backgroundColor: '#0f172a',
          boxShadow: '0 10px 15px -3px rgba(56, 189, 248, 0.1)',
          textAlign: 'center'
        }}>
          <h2 style={{ fontSize: '1.1rem', margin: '0 0 10px 0', fontWeight: '600', color: '#94a3b8' }}>
            Live Value Exchange Estimation
          </h2>
          <div style={{ fontSize: '2.25rem', fontWeight: '800', color: '#38bdf8' }}>
            {amount} {cryptoList.find(c => c.id === fromCrypto)?.symbol.toUpperCase() || ''} = {result} {cryptoList.find(c => c.id === toCrypto)?.symbol.toUpperCase() || ''}
          </div>
          <p style={{ color: '#64748b', fontSize: '0.8rem', margin: '12px 0 0 0' }}>
            Pricing updates automatically every 30 seconds.
          </p>
        </section>
      </main>
    </div>
  );
}

