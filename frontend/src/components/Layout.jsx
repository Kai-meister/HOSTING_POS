import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  ClipboardList,
  Menu,
  X,
  Store,
} from 'lucide-react';

const navItems = [
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/pos', label: 'POS', icon: ShoppingCart },
  { path: '/products', label: 'Products', icon: Package },
  { path: '/orders', label: 'Orders', icon: ClipboardList },
];

const styles = {
  container: {
    display: 'flex',
    height: '100vh',
    overflow: 'hidden',
  },
  sidebar: {
    width: '240px',
    minWidth: '240px',
    background: '#1a1a2e',
    color: '#fff',
    display: 'flex',
    flexDirection: 'column',
    transition: 'width 0.3s ease',
    overflowY: 'auto',
  },
  sidebarCollapsed: {
    width: '64px',
    minWidth: '64px',
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '20px 16px',
    borderBottom: '1px solid rgba(255,255,255,0.1)',
    cursor: 'pointer',
  },
  logoIcon: {
    background: '#4361ee',
    borderRadius: '8px',
    padding: '6px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  logoText: {
    fontSize: '18px',
    fontWeight: '700',
    color: '#fff',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
  },
  nav: {
    flex: 1,
    padding: '12px 8px',
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  navLink: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '10px 12px',
    borderRadius: '8px',
    color: 'rgba(255,255,255,0.65)',
    textDecoration: 'none',
    fontSize: '14px',
    fontWeight: '500',
    transition: 'all 0.2s',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
  },
  navLinkActive: {
    background: '#4361ee',
    color: '#fff',
  },
  navLinkHover: {
    background: 'rgba(255,255,255,0.08)',
    color: '#fff',
  },
  main: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  },
  topbar: {
    background: '#fff',
    borderBottom: '1px solid #e5e7eb',
    padding: '12px 24px',
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
  },
  menuBtn: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '4px',
    borderRadius: '6px',
    display: 'flex',
    alignItems: 'center',
    color: '#6b7280',
  },
  pageTitle: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#1a1a2e',
  },
  content: {
    flex: 1,
    overflow: 'auto',
    padding: '24px',
    background: '#f0f2f5',
  },
};

export default function Layout({ children }) {
  const [collapsed, setCollapsed] = useState(false);
  const [hovered, setHovered] = useState(null);
  const location = useLocation();

  const currentPage = navItems.find((item) => location.pathname === item.path)?.label || 'POS System';

  return (
    <div style={styles.container}>
      <aside
        style={{
          ...styles.sidebar,
          ...(collapsed ? styles.sidebarCollapsed : {}),
        }}
      >
        <div style={styles.logo} onClick={() => setCollapsed(!collapsed)}>
          <div style={styles.logoIcon}>
            <Store size={20} color="#fff" />
          </div>
          {!collapsed && <span style={styles.logoText}>POS System</span>}
        </div>

        <nav style={styles.nav}>
          {navItems.map(({ path, label, icon: Icon }) => (
            <NavLink
              key={path}
              to={path}
              style={({ isActive }) => ({
                ...styles.navLink,
                ...(isActive ? styles.navLinkActive : {}),
                ...(hovered === path && !location.pathname.startsWith(path)
                  ? styles.navLinkHover
                  : {}),
              })}
              onMouseEnter={() => setHovered(path)}
              onMouseLeave={() => setHovered(null)}
              title={collapsed ? label : ''}
            >
              <Icon size={20} style={{ flexShrink: 0 }} />
              {!collapsed && <span>{label}</span>}
            </NavLink>
          ))}
        </nav>
      </aside>

      <div style={styles.main}>
        <header style={styles.topbar}>
          <button style={styles.menuBtn} onClick={() => setCollapsed(!collapsed)}>
            {collapsed ? <Menu size={22} /> : <X size={22} />}
          </button>
          <h1 style={styles.pageTitle}>{currentPage}</h1>
        </header>
        <main style={styles.content}>{children}</main>
      </div>
    </div>
  );
}
