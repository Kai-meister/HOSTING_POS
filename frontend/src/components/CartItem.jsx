import React from 'react';
import { Plus, Minus, Trash2 } from 'lucide-react';

const styles = {
  item: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '10px 0',
    borderBottom: '1px solid #f0f2f5',
  },
  info: {
    flex: 1,
    minWidth: 0,
  },
  name: {
    fontSize: '13px',
    fontWeight: '600',
    color: '#1a1a2e',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  price: {
    fontSize: '12px',
    color: '#6b7280',
    marginTop: '2px',
  },
  controls: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    flexShrink: 0,
  },
  qtyBtn: {
    background: '#f0f2f5',
    border: 'none',
    borderRadius: '6px',
    width: '26px',
    height: '26px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    color: '#374151',
    transition: 'background 0.2s',
  },
  qty: {
    fontSize: '14px',
    fontWeight: '700',
    color: '#1a1a2e',
    minWidth: '20px',
    textAlign: 'center',
  },
  subtotal: {
    fontSize: '14px',
    fontWeight: '700',
    color: '#4361ee',
    minWidth: '60px',
    textAlign: 'right',
    flexShrink: 0,
  },
  removeBtn: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    color: '#ef4444',
    display: 'flex',
    alignItems: 'center',
    padding: '2px',
    borderRadius: '4px',
    flexShrink: 0,
    transition: 'opacity 0.2s',
  },
};

export default function CartItem({ item, onIncrease, onDecrease, onRemove }) {
  return (
    <div style={styles.item}>
      <div style={styles.info}>
        <div style={styles.name} title={item.product.name}>
          {item.product.name}
        </div>
        <div style={styles.price}>${Number(item.product.price).toFixed(2)} each</div>
      </div>

      <div style={styles.controls}>
        <button
          style={styles.qtyBtn}
          onClick={() => onDecrease(item.product.id)}
          title="Decrease quantity"
        >
          <Minus size={12} />
        </button>
        <span style={styles.qty}>{item.quantity}</span>
        <button
          style={styles.qtyBtn}
          onClick={() => onIncrease(item.product.id)}
          title="Increase quantity"
        >
          <Plus size={12} />
        </button>
      </div>

      <div style={styles.subtotal}>
        ${(Number(item.product.price) * item.quantity).toFixed(2)}
      </div>

      <button style={styles.removeBtn} onClick={() => onRemove(item.product.id)} title="Remove">
        <Trash2 size={14} />
      </button>
    </div>
  );
}
