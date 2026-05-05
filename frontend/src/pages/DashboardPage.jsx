import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { ShoppingBag, DollarSign, Package, AlertTriangle, RefreshCw } from 'lucide-react';
import { dashboardApi } from '../api/dashboard.js';
import { ordersApi } from '../api/orders.js';

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: '16px',
  },
  statCard: {
    background: '#fff',
    borderRadius: '12px',
    padding: '24px',
    display: 'flex',
    alignItems: 'flex-start',
    gap: '16px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
    transition: 'box-shadow 0.2s',
  },
  statIcon: {
    width: '48px',
    height: '48px',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  statInfo: {
    flex: 1,
  },
  statLabel: {
    fontSize: '13px',
    color: '#6b7280',
    fontWeight: '500',
    marginBottom: '4px',
  },
  statValue: {
    fontSize: '28px',
    fontWeight: '800',
    color: '#1a1a2e',
    lineHeight: 1.2,
  },
  statSub: {
    fontSize: '12px',
    color: '#9ca3af',
    marginTop: '4px',
  },
  section: {
    background: '#fff',
    borderRadius: '12px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
    overflow: 'hidden',
  },
  sectionHeader: {
    padding: '20px 24px',
    borderBottom: '1px solid #f0f2f5',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: '16px',
    fontWeight: '700',
    color: '#1a1a2e',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  th: {
    padding: '12px 24px',
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
    padding: '14px 24px',
    fontSize: '14px',
    color: '#374151',
    borderBottom: '1px solid #f0f2f5',
    verticalAlign: 'middle',
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
  loadingState: {
    padding: '48px',
    textAlign: 'center',
    color: '#9ca3af',
  },
  errorState: {
    padding: '48px',
    textAlign: 'center',
    color: '#ef4444',
  },
  emptyState: {
    padding: '48px',
    textAlign: 'center',
    color: '#9ca3af',
  },
};

const statCards = [
  {
    key: 'todaySales',
    label: "Today's Sales",
    icon: ShoppingBag,
    color: '#4361ee',
    bg: '#e0e7ff',
    format: (v) => v,
    sub: 'transactions today',
  },
  {
    key: 'todayRevenue',
    label: "Today's Revenue",
    icon: DollarSign,
    color: '#22c55e',
    bg: '#dcfce7',
    format: (v) => `$${Number(v).toFixed(2)}`,
    sub: 'earned today',
  },
  {
    key: 'totalProducts',
    label: 'Total Products',
    icon: Package,
    color: '#f59e0b',
    bg: '#fef3c7',
    format: (v) => v,
    sub: 'active products',
  },
  {
    key: 'lowStockCount',
    label: 'Low Stock',
    icon: AlertTriangle,
    color: '#ef4444',
    bg: '#fee2e2',
    format: (v) => v,
    sub: 'items below 5 units',
  },
];

function formatDate(dateStr) {
  if (!dateStr) return '-';
  return new Date(dateStr).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function DashboardPage() {
  const {
    data: stats,
    isLoading: statsLoading,
    error: statsError,
    refetch: refetchStats,
  } = useQuery({
    queryKey: ['dashboard'],
    queryFn: dashboardApi.getStats,
    refetchInterval: 60000,
  });

  const { data: orders = [], isLoading: ordersLoading } = useQuery({
    queryKey: ['orders'],
    queryFn: ordersApi.getAll,
  });

  const recentOrders = orders.slice(0, 10);

  return (
    <div style={styles.container}>
      {/* Stats */}
      <div style={styles.statsGrid}>
        {statCards.map(({ key, label, icon: Icon, color, bg, format, sub }) => (
          <div key={key} style={styles.statCard}>
            <div style={{ ...styles.statIcon, background: bg }}>
              <Icon size={24} color={color} />
            </div>
            <div style={styles.statInfo}>
              <div style={styles.statLabel}>{label}</div>
              {statsLoading ? (
                <div style={{ ...styles.statValue, fontSize: '16px', color: '#9ca3af' }}>
                  Loading...
                </div>
              ) : statsError ? (
                <div style={{ ...styles.statValue, fontSize: '16px', color: '#ef4444' }}>
                  Error
                </div>
              ) : (
                <>
                  <div style={styles.statValue}>{format(stats?.[key] ?? 0)}</div>
                  <div style={styles.statSub}>{sub}</div>
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Recent Orders */}
      <div style={styles.section}>
        <div style={styles.sectionHeader}>
          <span style={styles.sectionTitle}>Recent Orders</span>
          <button
            onClick={() => refetchStats()}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: '#4361ee',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              fontSize: '13px',
              fontWeight: '500',
            }}
          >
            <RefreshCw size={14} />
            Refresh
          </button>
        </div>
        {ordersLoading ? (
          <div style={styles.loadingState}>Loading orders...</div>
        ) : recentOrders.length === 0 ? (
          <div style={styles.emptyState}>No orders yet. Start selling!</div>
        ) : (
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Order #</th>
                <th style={styles.th}>Date</th>
                <th style={styles.th}>Items</th>
                <th style={styles.th}>Payment</th>
                <th style={styles.th}>Total</th>
                <th style={styles.th}>Status</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((order) => (
                <tr key={order.id}>
                  <td style={{ ...styles.td, fontWeight: '600', color: '#4361ee' }}>
                    {order.orderNumber}
                  </td>
                  <td style={styles.td}>{formatDate(order.createdAt)}</td>
                  <td style={styles.td}>{order.items?.length ?? 0} items</td>
                  <td style={styles.td}>{order.paymentMethod}</td>
                  <td style={{ ...styles.td, fontWeight: '700' }}>
                    ${Number(order.total).toFixed(2)}
                  </td>
                  <td style={styles.td}>
                    <span style={{ ...styles.badge, ...styles.badgeCompleted }}>
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
