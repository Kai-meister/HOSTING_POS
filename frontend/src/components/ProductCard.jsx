import React from 'react';
import { ShoppingCart, AlertTriangle } from 'lucide-react';

const styles = {
  card: {
    background: '#fff',
    borderRadius: '12px',
    padding: '16px',
    cursor: 'pointer',
    border: '2px solid transparent',
    transition: 'all 0.2s',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
  },
  cardHover: {
    borderColor: '#4361ee',
    boxShadow: '0 4px 12px rgba(67,97,238,0.15)',
    transform: 'translateY(-2px)',
  },
  cardDisabled: {
    opacity: 0.5,
    cursor: 'not-allowed',
  },
  image: {
    width: '100%',
    height: '100px',
    background: '#f0f2f5',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '36px',
    marginBottom: '4px',
  },
  name: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#1a1a2e',
    lineHeight: '1.3',
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
  },
  category: {
    fontSize: '11px',
    color: '#6b7280',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  footer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 'auto',
  },
  price: {
    fontSize: '16px',
    fontWeight: '700',
    color: '#4361ee',
  },
  stock: {
    fontSize: '12px',
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
  },
  stockLow: {
    color: '#f59e0b',
  },
  stockOut: {
    color: '#ef4444',
  },
  stockOk: {
    color: '#22c55e',
  },
  addBtn: {
    background: '#4361ee',
    border: 'none',
    borderRadius: '6px',
    padding: '6px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    color: '#fff',
    transition: 'background 0.2s',
  },
};

const categoryEmojis = {
  'Food & Drinks': '🍔',
  Electronics: '📱',
  Clothing: '👕',
};

export default function ProductCard({ product, onAdd }) {
  const [hovered, setHovered] = React.useState(false);
  const outOfStock = product.stock === 0;
  const lowStock = product.stock > 0 && product.stock < 5;
  const emoji = categoryEmojis[product.category?.name] || '📦';

  return (
    <div
      style={{
        ...styles.card,
        ...(hovered && !outOfStock ? styles.cardHover : {}),
        ...(outOfStock ? styles.cardDisabled : {}),
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => !outOfStock && onAdd(product)}
    >
      <div style={styles.image}>
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px' }}
          />
        ) : (
          <span style={{ fontSize: '32px' }}>{emoji}</span>
        )}
      </div>

      {product.category && (
        <div style={styles.category}>{product.category.name}</div>
      )}

      <div style={styles.name}>{product.name}</div>

      <div style={styles.footer}>
        <div style={styles.price}>${Number(product.price).toFixed(2)}</div>
        <div
          style={{
            ...styles.stock,
            ...(outOfStock ? styles.stockOut : lowStock ? styles.stockLow : styles.stockOk),
          }}
        >
          {outOfStock ? (
            <>
              <AlertTriangle size={12} />
              Out of stock
            </>
          ) : lowStock ? (
            <>
              <AlertTriangle size={12} />
              {product.stock} left
            </>
          ) : (
            <span style={{ color: '#6b7280', fontSize: '12px' }}>Stock: {product.stock}</span>
          )}
        </div>
      </div>
    </div>
  );
}
