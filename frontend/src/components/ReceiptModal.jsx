import React from 'react';
import { X, Printer, CheckCircle } from 'lucide-react';

const styles = {
  overlay: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(0,0,0,0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    padding: '16px',
  },
  modal: {
    background: '#fff',
    borderRadius: '16px',
    padding: '32px',
    width: '100%',
    maxWidth: '420px',
    maxHeight: '90vh',
    overflowY: 'auto',
    boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
  },
  header: {
    textAlign: 'center',
    marginBottom: '24px',
  },
  successIcon: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: '12px',
  },
  title: {
    fontSize: '22px',
    fontWeight: '700',
    color: '#1a1a2e',
    marginBottom: '4px',
  },
  orderNumber: {
    fontSize: '13px',
    color: '#6b7280',
  },
  divider: {
    border: 'none',
    borderTop: '1px dashed #e5e7eb',
    margin: '16px 0',
  },
  store: {
    textAlign: 'center',
    marginBottom: '16px',
  },
  storeName: {
    fontSize: '16px',
    fontWeight: '700',
    color: '#1a1a2e',
  },
  storeDate: {
    fontSize: '12px',
    color: '#6b7280',
    marginTop: '4px',
  },
  itemsTable: {
    width: '100%',
    borderCollapse: 'collapse',
    marginBottom: '8px',
  },
  tableHead: {
    fontSize: '11px',
    color: '#6b7280',
    textTransform: 'uppercase',
    borderBottom: '1px solid #e5e7eb',
    paddingBottom: '6px',
    textAlign: 'left',
  },
  tableRow: {
    borderBottom: '1px solid #f0f2f5',
  },
  tableCell: {
    padding: '8px 0',
    fontSize: '13px',
    color: '#374151',
    verticalAlign: 'top',
  },
  tableCellRight: {
    textAlign: 'right',
  },
  totals: {
    marginTop: '12px',
  },
  totalRow: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '4px 0',
    fontSize: '14px',
    color: '#374151',
  },
  grandTotal: {
    fontWeight: '700',
    fontSize: '18px',
    color: '#1a1a2e',
    padding: '8px 0',
    borderTop: '2px solid #1a1a2e',
    marginTop: '4px',
  },
  changeHighlight: {
    color: '#22c55e',
    fontWeight: '700',
  },
  paymentBadge: {
    display: 'inline-block',
    background: '#e0e7ff',
    color: '#4361ee',
    borderRadius: '20px',
    padding: '4px 12px',
    fontSize: '12px',
    fontWeight: '600',
  },
  actions: {
    display: 'flex',
    gap: '10px',
    marginTop: '24px',
  },
  btnPrimary: {
    flex: 1,
    background: '#4361ee',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    padding: '12px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '6px',
    transition: 'background 0.2s',
  },
  btnSecondary: {
    flex: 1,
    background: '#f0f2f5',
    color: '#374151',
    border: 'none',
    borderRadius: '8px',
    padding: '12px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '6px',
    transition: 'background 0.2s',
  },
};

function formatDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return d.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function ReceiptModal({ order, onClose }) {
  if (!order) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div style={styles.overlay} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div style={styles.modal}>
        <div style={styles.header}>
          <div style={styles.successIcon}>
            <CheckCircle size={48} color="#22c55e" />
          </div>
          <h2 style={styles.title}>Sale Complete!</h2>
          <div style={styles.orderNumber}>Order #{order.orderNumber}</div>
        </div>

        <div style={styles.store}>
          <div style={styles.storeName}>POS System</div>
          <div style={styles.storeDate}>{formatDate(order.createdAt)}</div>
        </div>

        <hr style={styles.divider} />

        <table style={styles.itemsTable}>
          <thead>
            <tr>
              <th style={styles.tableHead}>Item</th>
              <th style={{ ...styles.tableHead, textAlign: 'center' }}>Qty</th>
              <th style={{ ...styles.tableHead, textAlign: 'right' }}>Price</th>
              <th style={{ ...styles.tableHead, textAlign: 'right' }}>Total</th>
            </tr>
          </thead>
          <tbody>
            {order.items?.map((item, i) => (
              <tr key={i} style={styles.tableRow}>
                <td style={styles.tableCell}>{item.productName}</td>
                <td style={{ ...styles.tableCell, textAlign: 'center' }}>{item.quantity}</td>
                <td style={{ ...styles.tableCell, textAlign: 'right' }}>
                  ${Number(item.price).toFixed(2)}
                </td>
                <td style={{ ...styles.tableCell, textAlign: 'right' }}>
                  ${Number(item.subtotal).toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <hr style={styles.divider} />

        <div style={styles.totals}>
          <div style={styles.totalRow}>
            <span>Subtotal</span>
            <span>${Number(order.total).toFixed(2)}</span>
          </div>
          <div style={styles.totalRow}>
            <span>Payment Method</span>
            <span style={styles.paymentBadge}>{order.paymentMethod}</span>
          </div>
          <div style={styles.totalRow}>
            <span>Amount Paid</span>
            <span>${Number(order.amountPaid).toFixed(2)}</span>
          </div>
          <div style={{ ...styles.totalRow, ...styles.grandTotal }}>
            <span>Total</span>
            <span>${Number(order.total).toFixed(2)}</span>
          </div>
          {order.paymentMethod?.toUpperCase() === 'CASH' && (
            <div style={{ ...styles.totalRow, ...styles.changeHighlight }}>
              <span>Change</span>
              <span>${Number(order.change).toFixed(2)}</span>
            </div>
          )}
        </div>

        <div style={styles.actions}>
          <button style={styles.btnSecondary} onClick={handlePrint}>
            <Printer size={16} />
            Print
          </button>
          <button style={styles.btnPrimary} onClick={onClose}>
            <X size={16} />
            New Sale
          </button>
        </div>
      </div>
    </div>
  );
}
