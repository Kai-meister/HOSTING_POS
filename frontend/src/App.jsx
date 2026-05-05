import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout.jsx';
import POSPage from './pages/POSPage.jsx';
import ProductsPage from './pages/ProductsPage.jsx';
import OrdersPage from './pages/OrdersPage.jsx';
import DashboardPage from './pages/DashboardPage.jsx';

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Navigate to="/pos" replace />} />
        <Route path="/pos" element={<POSPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/orders" element={<OrdersPage />} />
        <Route path="*" element={<Navigate to="/pos" replace />} />
      </Routes>
    </Layout>
  );
}
