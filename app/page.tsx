'use client';
import React, { useState, useEffect } from 'react';

// Full 40-crypto mapping matrix utilizing case-insensitive CoinGecko API parameters
const ASSET_MATRIX = [
  { id: 'BTC', name: 'Bitcoin', symbol: 'BTC', geckoId: 'bitcoin' },
  { id: 'ETH', name: 'Ethereum', symbol: 'ETH', geckoId: 'ethereum' },
  { id: 'SOL', name: 'Solana', symbol: 'SOL', geckoId: 'solana' },
  { id: 'XRP', name: 'Ripple', symbol: 'XRP', geckoId: 'ripple' },
  { id: 'ADA', name: 'Cardano', symbol: 'ADA', geckoId: 'cardano' },
  { id: 'DOGE', name: 'Dogecoin', symbol: 'DOGE', geckoId: 'dogecoin' },
  { id: 'BNB', name: 'Binance Coin', symbol: 'BNB', geckoId: 'binancecoin' },
  { id: 'DOT', name: 'Polkadot', symbol: 'DOT', geckoId: 'polkadot' },
  { id: 'LINK', name: 'Chainlink', symbol: 'LINK', geckoId: 'chainlink' },
  { id: 'LTC', name: 'Litecoin', symbol: 'LTC', geckoId: 'litecoin' },
  { id: 'AVAX', name: 'Avalanche', symbol: 'AVAX', geckoId: 'avalanche-2' },
  { id: 'MATIC', name: 'Polygon', symbol: 'MATIC', geckoId: 'polygon' },
  { id: 'TRX', name: 'TRON', symbol: 'TRX', geckoId: 'tron' },
  { id: 'UNI', name: 'Uniswap', symbol: 'UNI', geckoId: 'uniswap' },
  { id: 'XLM', name: 'Stellar', symbol: 'XLM', geckoId: 'stellar' },
  { id: 'ATOM', name: 'Cosmos', symbol: 'ATOM', geckoId: 'cosmos' },
  { id: 'XMR', name: 'Monero', symbol: 'XMR', geckoId: 'monero' },
  { id: 'ETC', name: 'Ethereum Classic', symbol: 'ETC', geckoId: 'ethereum-classic' },
  { id: 'HBAR', name: 'Hedera', symbol: 'HBAR', geckoId: 'hedera-hashgraph' },
  { id: 'ICP', name: 'Internet Computer', symbol: 'ICP', geckoId: 'internet-computer' },
  { id: 'FIL', name: 'Filecoin', symbol: 'FIL', geckoId: 'filecoin' },
  { id: 'APT', name: 'Aptos', symbol: 'APT', geckoId: 'aptos' },
  { id: 'ARB', name: 'Arbitrum', symbol: 'ARB', geckoId: 'arbitrum' },
  { id: 'VET', name: 'VeChain', symbol: 'VET', geckoId: 'vechain' },
  { id: 'NEAR', name: 'NEAR Protocol', symbol: 'NEAR', geckoId: 'near' },
  { id: 'MKR', name: 'Maker', symbol: 'MKR', geckoId: 'maker' },
  { id: 'OP', name: 'Optimism', symbol: 'OP', geckoId: 'optimism' },
  { id: 'GRT', name: 'The Graph', symbol: 'GRT', geckoId: 'the-graph' },
  { id: 'THETA', name: 'Theta Network', symbol: 'THETA', geckoId: 'theta-token' },
  { id: 'FTM', name: 'Fantom', symbol: 'FTM', geckoId: 'fantom' },
  { id: 'AAVE', name: 'Aave', symbol: 'AAVE', geckoId: 'aave' },
  { id: 'ALGO', name: 'Algorand', symbol: 'ALGO', geckoId: 'algorand' },
  { id: 'SAND', name: 'The Sandbox', symbol: 'SAND', geckoId: 'the-sandbox' },
  { id: 'MANA', name: 'Decentraland', symbol: 'MANA', geckoId: 'decentraland' },
  { id: 'EOS', name: 'EOS', symbol: 'EOS', geckoId: 'eos' },
  { id: 'XTZ', name: 'Tezos', symbol: 'XTZ', geckoId: 'tezos' },
  { id: 'GALA', name: 'Gala', symbol: 'GALA', geckoId: 'gala' },
  { id: 'BAT', name: 'Basic Attention', symbol: 'BAT', geckoId: 'basic-attention-token' },
  { id: 'SUSHI', name: 'SushiSwap', symbol: 'SUSHI', geckoId: 'sushiswap' },
  { id: 'ZIL', name: 'Zilliqa', symbol: 'ZIL', geckoId: 'zilliqa' }
];

export default function Home() {
  const [amount, setAmount] = useState<string>('1');
  const [fromCrypto, setFromCrypto] = useState<string>('BTC');
  const [toCrypto, setToCrypto] = useState<string>('ETH');
  const [result, setResult] = useState<string>('0.0000');
  const [prices, setPrices] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState<boolean>(true);

  const fetchPrices = async () => {
    try {
      const ids = ASSET_MATRIX.map(c => c.geckoId).join(',');
      const res = await fetch(`https://coingecko.com{ids}&vs_currencies=usd`);
      const data = await res.json();
      
      if (data && typeof data === 'object') {
        const priceMap: Record<string, number> = {};
        ASSET_MATRIX.forEach((coin) => {
          if (data[coin.geckoId] && data[coin.geckoId].usd) {
            priceMap[coin.id] = Number(data[coin.geckoId].usd);
          }
        });
        setPrices(priceMap);
        setLoading(false);
      }
    } catch (err) {
      console.error('Error tracking live metrics:', err);
    }
  };

  useEffect(() => {
    fetchPrices();
    const interval = setInterval(fetchPrices, 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!prices[fromCrypto] || !prices[toCrypto]) return;
    const fromPrice = prices[fromCrypto];
    const toPrice = prices[toCrypto];
    const calculated = (parseFloat(amount) * fromPrice) / toPrice;
    
    if (isNaN(calculated) || calculated === 0) {
      setResult('0.0000');
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
    color: '#ffffff',
    border: '1px solid #475569',
    borderRadius: '8px',
    fontSize: '1rem',
    cursor: 'pointer'
  };
    return (
    <div style={{ backgroundColor: '#0f172a', minHeight: '100vh', color: '#e2e8f0', fontFamily: 'system-ui, sans-serif', padding: '40px 16px', boxSizing: 'border-box' }}>
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
                  {ASSET_MATRIX.map((c) => ( <option key={c.id} value={c.id} style={{ backgroundColor: '#1e293b', color: '#ffffff' }}>{c.name} ({c.symbol})</option> ))}
                </select>
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', fontSize: '0.9rem', color: '#94a3b8' }}>To Asset</label>
                <select value={toCrypto} onChange={(e) => setToCrypto(e.target.value)} style={selectStyle}>
                  {ASSET_MATRIX.map((c) => ( <option key={c.id} value={c.id} style={{ backgroundColor: '#1e293b', color: '#ffffff' }}>{c.name} ({c.symbol})</option> ))}
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
          <p style={{ color: '#64748b', fontSize: '0.8rem', margin: '12px 0 0 0' }}>Token valuations update smoothly every 60 seconds.</p>
        </section>
      </main>
    </div>
  );
}

