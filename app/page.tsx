'use client';
import React, { useState, useEffect } from 'react';

const ASSET_MATRIX = [
  { id: 'BTC', name: 'Bitcoin', symbol: 'BTC' }, { id: 'ETH', name: 'Ethereum', symbol: 'ETH' },
  { id: 'SOL', name: 'Solana', symbol: 'SOL' }, { id: 'XRP', name: 'Ripple', symbol: 'XRP' },
  { id: 'ADA', name: 'Cardano', symbol: 'ADA' }, { id: 'DOGE', name: 'Dogecoin', symbol: 'DOGE' },
  { id: 'BNB', name: 'Binance Coin', symbol: 'BNB' }, { id: 'DOT', name: 'Polkadot', symbol: 'DOT' },
  { id: 'LINK', name: 'Chainlink', symbol: 'LINK' }, { id: 'LTC', name: 'Litecoin', symbol: 'LTC' },
  { id: 'AVAX', name: 'Avalanche', symbol: 'AVAX' }, { id: 'MATIC', name: 'Polygon', symbol: 'MATIC' },
  { id: 'TRX', name: 'TRON', symbol: 'TRX' }, { id: 'UNI', name: 'Uniswap', symbol: 'UNI' },
  { id: 'XLM', name: 'Stellar', symbol: 'XLM' }, { id: 'ATOM', name: 'Cosmos', symbol: 'ATOM' },
  { id: 'XMR', name: 'Monero', symbol: 'XMR' }, { id: 'ETC', name: 'Ethereum Classic', symbol: 'ETC' },
  { id: 'HBAR', name: 'Hedera', symbol: 'HBAR' }, { id: 'ICP', name: 'Internet Computer', symbol: 'ICP' },
  { id: 'FIL', name: 'Filecoin', symbol: 'FIL' }, { id: 'APT', name: 'Aptos', symbol: 'APT' },
  { id: 'ARB', name: 'Arbitrum', symbol: 'ARB' }, { id: 'VET', name: 'VeChain', symbol: 'VET' },
  { id: 'NEAR', name: 'NEAR Protocol', symbol: 'NEAR' }, { id: 'MKR', name: 'Maker', symbol: 'MKR' },
  { id: 'OP', name: 'Optimism', symbol: 'OP' }, { id: 'GRT', name: 'The Graph', symbol: 'GRT' },
  { id: 'THETA', name: 'Theta Network', symbol: 'THETA' }, { id: 'FTM', name: 'Fantom', symbol: 'FTM' },
  { id: 'AAVE', name: 'Aave', symbol: 'AAVE' }, { id: 'ALGO', name: 'Algorand', symbol: 'ALGO' },
  { id: 'SAND', name: 'The Sandbox', symbol: 'SAND' }, { id: 'MANA', name: 'Decentraland', symbol: 'MANA' },
  { id: 'EOS', name: 'EOS', symbol: 'EOS' }, { id: 'XTZ', name: 'Tezos', symbol: 'XTZ' },
  { id: 'GALA', name: 'Gala', symbol: 'GALA' }, { id: 'BAT', name: 'Basic Attention', symbol: 'BAT' },
  { id: 'SUSHI', name: 'SushiSwap', symbol: 'SUSHI' }, { id: 'ZIL', name: 'Zilliqa', symbol: 'ZIL' }
];

export default function Home() {
  const [amount, setAmount] = useState<string>('12');
  const [fromCrypto, setFromCrypto] = useState<string>('BTC');
  const [toCrypto, setToCrypto] = useState<string>('XRP');
  const [result, setResult] = useState<string>('0.00');
  const [prices, setPrices] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState<boolean>(true);

  const fetchPrices = async () => {
    try {
      const symbols = ASSET_MATRIX.map(c => c.id).join(',');
      const res = await fetch(`https://cryptocompare.com{symbols}`);
      const data = await res.json();
      
      if (data && typeof data === 'object') {
        const priceMap: Record<string, number> = {};
        Object.keys(data).forEach((key) => {
          if (data[key] > 0) {
            // Force the dictionary mapping keys to remain completely uppercase to ensure exact matching loops
            priceMap[key.toUpperCase()] = 1 / data[key];
          }
        });
        setPrices(priceMap);
        setLoading(false);
      }
    } catch (err) {
      console.error('Error establishing clean pricing parameters:', err);
    }
  };

  useEffect(() => {
    fetchPrices();
    const interval = setInterval(fetchPrices, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!prices[fromCrypto] || !prices[toCrypto]) return;
    const calculated = (parseFloat(amount) * prices[fromCrypto]) / prices[toCrypto];
    setResult(isNaN(calculated) ? '0.00' : calculated.toFixed(4));
  }, [amount, fromCrypto, toCrypto, prices]);

  return (
    <div style={{ backgroundColor: '#0f172a', minHeight: '100vh', color: '#e2e8f0', fontFamily: 'sans-serif' }}>
      <main style={{ maxWidth: '650px', margin: '0 auto', padding: '40px 16px', boxSizing: 'border-box' }}>
        <header style={{ textAlign: 'center', marginBottom: '45px' }}>
          <h1 style={{ fontSize: '2.5rem', fontWeight: '800', margin: '0 0 6px 0', color: '#fff', letterSpacing: '-0.025em' }}>Crypto Calc Grid</h1>
          <p style={{ color: '#94a3b8', margin: 0, fontSize: '1.1rem' }}>Free Instant Real-Time Crypto Conversion Hub</p>
        </header>

        <section style={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '16px', padding: '28px', marginBottom: '30px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', fontSize: '0.9rem', color: '#94a3b8' }}>Enter Amount to Convert</label>
              <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} style={{ width: '100%', padding: '14px', backgroundColor: '#0f172a', border: '1px solid #475569', borderRadius: '8px', fontSize: '1.1rem', color: '#fff', boxSizing: 'border-box' }} />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', fontSize: '0.9rem', color: '#94a3b8' }}>From Asset</label>
                <select value={fromCrypto} onChange={(e) => setFromCrypto(e.target.value)} style={{ width: '100%', padding: '14px', backgroundColor: '#0f172a', border: '1px solid #475569', borderRadius: '8px', fontSize: '1rem', color: '#fff', cursor: 'pointer' }}>
                  {ASSET_MATRIX.map((c) => ( <option key={c.id} value={c.id}>{c.name} ({c.symbol})</option> ))}
                </select>
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', fontSize: '0.9rem', color: '#94a3b8' }}>To Asset</label>
                <select value={toCrypto} onChange={(e) => setToCrypto(e.target.value)} style={{ width: '100%', padding: '14px', backgroundColor: '#0f172a', border: '1px solid #475569', borderRadius: '8px', fontSize: '1rem', color: '#fff', cursor: 'pointer' }}>
                  {ASSET_MATRIX.map((c) => ( <option key={c.id} value={c.id}>{c.name} ({c.symbol})</option> ))}
                </select>
              </div>
            </div>
          </div>
        </section>

        <section style={{ border: '2px solid #38bdf8', borderRadius: '16px', padding: '24px', backgroundColor: '#0f172a', textAlign: 'center', boxShadow: '0 10px 15px -3px rgba(56, 189, 248, 0.1)' }}>
          <h2 style={{ fontSize: '1.1rem', margin: '0 0 10px 0', color: '#94a3b8', fontWeight: '600' }}>Live Exchange Matrix</h2>
          <div style={{ fontSize: '2.25rem', fontWeight: '800', color: '#38bdf8' }}>
            {amount} {fromCrypto} = {loading ? '---' : result} {toCrypto}
          </div>
          <p style={{ color: '#64748b', fontSize: '0.8rem', margin: '12px 0 0 0' }}>Token valuations update smoothly every 30 seconds.</p>
        </section>
      </main>
    </div>
  );
}
