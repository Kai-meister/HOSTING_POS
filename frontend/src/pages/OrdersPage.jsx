import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ChevronDown, ChevronRight, ClipboardList, AlertCircle } from 'lucide-react';
import { ordersApi } from '../api/orders.js';

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  topBar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: '20px',
    fontWeight: '700',
    color: '#1a1a2e',
  },
  card: {
    background: '#fff',
    borderRadius: '12px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
    overflow: 'hidden',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  th: {
    padding: '12px 20px',
    textAlign: 'left',
    fontSize: '12px',
    fontWeight: '600',
    color: '#6b7280',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    background: '#f9fafb',
    borderBottom: '1px solid #f0f2f5',
  },
  td: {
    padding: '14px 20px',
    fontSize: '14px',
    color: '#374151',
    borderBottom: '1px solid #f0f2f5',
    verticalAlign: 'middle',
  },
  expandBtn: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    color: '#6b7280',
    display: 'flex',
    alignItems: 'center',
    padding: '0',
    transition: 'color 0.2s',
  },
  expandedRow: {
    background: '#f9fafb',
  },
  itemsTable: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  itemsTh: {
    padding: '8px 16px',
    textAlign: 'left',
    fontSize: '11px',
    fontWeight: '600',
    color: '#9ca3af',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  itemsTd: {
    padding: '8px 16px',
    fontSize: '13px',
    color: '#374151',
    borderTop: '1px solid #e5e7eb',
  },
  badge: {
    display: 'inline-block',
    padding: '3px 10px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: '600',
  },
  badgeCompleted: {
    background: '#dcfce7',
    color: '#16a34a',
  },
  badgeCash: {
    background: '#fef3c7',
    color: '#d97706',
  },
  badgeCard: {
    background: '#e0e7ff',
    color: '#4361ee',
  },
  loadingState: {
    padding: '48px',
    textAlign: 'center',
    color: '#9ca3af',
  },
  errorState: {
    padding: '48px',
    textAlign: 'center',
    color: '#ef4444',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '8px',
  },
  emptyState: {
    padding: '48px',
    textAlign: 'center',
    color: '#9ca3af',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '12px',
  },
};

function formatDate(dateStr) {
  if (!dateStr) return '-';
  return new Date(dateStr).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function OrdersPage() {
  const [expandedId, setExpandedId] = useState(null);

  const { data: orders = [], isLoading, error } = useQuery({
    queryKey: ['orders'],
    queryFn: ordersApi.getAll,
  });

  const toggleExpand = (id) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  const getPaymentStyle = (method) => {
    if (!method) return {};
    if (method.toUpperCase() === 'CASH') return { ...styles.badge, ...styles.badgeCash };
    if (method.toUpperCase() === 'CARD') return { ...styles.badge, ...styles.badgeCard };
    return styles.badge;
  };

  return (
    <div style={styles.container}>
      <div style={styles.topBar}>
        <h2 style={styles.title}>Order History</h2>
        <span style={{ fontSize: '14px', color: '#6b7280' }}>
          {orders.length} total order{orders.length !== 1 ? 's' : ''}
        </span>
      </div>

      <div style={styles.card}>
        {isLoading && <div style={styles.loadingState}>Loading orders...</div>}
        {error && (
          <div style={styles.errorState}>
            <AlertCircle size={24} />
            Failed to load orders
          </div>
        )}
        {!isLoading && !error && orders.length === 0 && (
          <div style={styles.emptyState}>
            <ClipboardList size={40} strokeWidth={1} />
            <span>No orders yet. Start selling from the POS page!</span>
          </div>
        )}
        {!isLoading && !error && orders.length > 0 && (
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={{ ...styles.th, width: '32px' }}></th>
                <th style={styles.th}>Order #</th>
                <th style={styles.th}>Date</th>
                <th style={styles.th}>Items</th>
                <th style={styles.th}>Payment</th>
                <th style={styles.th}>Total</th>
                <th style={styles.th}>Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <React.Fragment key={order.id}>
                  <tr
                    style={{ cursor: 'pointer' }}
                    onClick={() => toggleExpand(order.id)}
                  >
                    <td style={styles.td}>
                      <button style={styles.expandBtn}>
                        {expandedId === order.id ? (
                          <ChevronDown size={16} />
                        ) : (
                          <ChevronRight size={16} />
                        )}
                      </button>
                    </td>
                    <td style={{ ...styles.td, fontWeight: '700', color: '#4361ee' }}>
                      {order.orderNumber}
                    </td>
                    <td style={styles.td}>{formatDate(order.createdAt)}</td>
                    <td style={styles.td}>
                      {order.items?.length ?? 0} item{order.items?.length !== 1 ? 's' : ''}
                    </td>
                    <td style={styles.td}>
                      <span style={getPaymentStyle(order.paymentMethod)}>
                        {order.paymentMethod}
                      </span>
                    </td>
                    <td style={{ ...styles.td, fontWeight: '700' }}>
                      ${Number(order.total).toFixed(2)}
                    </td>
                    <td style={styles.td}>
                      <span style={{ ...styles.badge, ...styles.badgeCompleted }}>
                        {order.status}
                      </span>
                    </td>
                  </tr>

                  {expandedId === order.id && (
                    <tr style={styles.expandedRow}>
                      <td colSpan={7} style={{ padding: '0 0 0 32px' }}>
                        <table style={styles.itemsTable}>
                          <thead>
                            <tr>
                              <th style={styles.itemsTh}>Product</th>
                              <th style={styles.itemsTh}>Unit Price</th>
                              <th style={styles.itemsTh}>Quantity</th>
                              <th style={styles.itemsTh}>Subtotal</th>
                            </tr>
                          </thead>
                          <tbody>
                            {order.items?.map((item, i) => (
                              <tr key={i}>
                                <td style={styles.itemsTd}>{item.productName}</td>
                                <td style={styles.itemsTd}>
                                  ${Number(item.price).toFixed(2)}
                                </td>
                                <td style={styles.itemsTd}>{item.quantity}</td>
                                <td style={{ ...styles.itemsTd, fontWeight: '600' }}>
                                  ${Number(item.subtotal).toFixed(2)}
                                </td>
                              </tr>
                            ))}
                            <tr>
                              <td
                                colSpan={3}
                                style={{
                                  ...styles.itemsTd,
                                  fontWeight: '700',
                                  textAlign: 'right',
                                  paddingRight: '20px',
                                  color: '#1a1a2e',
                                }}
                              >
                                Total
                              </td>
                              <td
                                style={{
                                  ...styles.itemsTd,
                                  fontWeight: '800',
                                  color: '#4361ee',
                                }}
                              >
                                ${Number(order.total).toFixed(2)}
                              </td>
                            </tr>
                            {order.paymentMethod?.toUpperCase() === 'CASH' && (
                              <>
                                <tr>
                                  <td
                                    colSpan={3}
                                    style={{
                                      ...styles.itemsTd,
                                      textAlign: 'right',
                                      paddingRight: '20px',
                                      color: '#6b7280',
                                    }}
                                  >
                                    Amount Paid
                                  </td>
                                  <td style={styles.itemsTd}>
                                    ${Number(order.amountPaid).toFixed(2)}
                                  </td>
                                </tr>
                                <tr>
                                  <td
                                    colSpan={3}
                                    style={{
                                      ...styles.itemsTd,
                                      textAlign: 'right',
                                      paddingRight: '20px',
                                      color: '#16a34a',
                                      fontWeight: '600',
                                    }}
                                  >
                                    Change
                                  </td>
                                  <td
                                    style={{
                                      ...styles.itemsTd,
                                      fontWeight: '700',
                                      color: '#16a34a',
                                    }}
                                  >
                                    ${Number(order.change).toFixed(2)}
                                  </td>
                                </tr>
                              </>
                            )}
                          </tbody>
                        </table>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
