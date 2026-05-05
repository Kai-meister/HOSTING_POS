import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { Plus, Pencil, Trash2, X, AlertCircle, Package } from 'lucide-react';
import { productsApi } from '../api/products.js';
import { categoriesApi } from '../api/categories.js';

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
  addBtn: {
    background: '#4361ee',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    padding: '10px 18px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    transition: 'background 0.2s',
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
  actionBtns: {
    display: 'flex',
    gap: '8px',
  },
  editBtn: {
    background: '#e0e7ff',
    color: '#4361ee',
    border: 'none',
    borderRadius: '6px',
    padding: '6px 10px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    fontSize: '12px',
    fontWeight: '500',
    transition: 'background 0.2s',
  },
  deleteBtn: {
    background: '#fee2e2',
    color: '#ef4444',
    border: 'none',
    borderRadius: '6px',
    padding: '6px 10px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    fontSize: '12px',
    fontWeight: '500',
    transition: 'background 0.2s',
  },
  stockBadge: {
    display: 'inline-block',
    padding: '3px 10px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: '600',
  },
  stockOk: { background: '#dcfce7', color: '#16a34a' },
  stockLow: { background: '#fef3c7', color: '#d97706' },
  stockOut: { background: '#fee2e2', color: '#ef4444' },
  activeBadge: {
    display: 'inline-block',
    padding: '3px 10px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: '600',
    background: '#dcfce7',
    color: '#16a34a',
  },
  inactiveBadge: {
    display: 'inline-block',
    padding: '3px 10px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: '600',
    background: '#f0f2f5',
    color: '#6b7280',
  },
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
    maxWidth: '480px',
    maxHeight: '90vh',
    overflowY: 'auto',
    boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
  },
  modalHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '24px',
  },
  modalTitle: {
    fontSize: '20px',
    fontWeight: '700',
    color: '#1a1a2e',
  },
  closeBtn: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    color: '#6b7280',
    display: 'flex',
    alignItems: 'center',
    padding: '4px',
    borderRadius: '6px',
  },
  formGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '16px',
  },
  formGroupFull: {
    gridColumn: '1 / -1',
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  label: {
    fontSize: '13px',
    fontWeight: '600',
    color: '#374151',
  },
  input: {
    padding: '10px 14px',
    border: '1px solid #e5e7eb',
    borderRadius: '8px',
    fontSize: '14px',
    outline: 'none',
    transition: 'border-color 0.2s',
    width: '100%',
  },
  select: {
    padding: '10px 14px',
    border: '1px solid #e5e7eb',
    borderRadius: '8px',
    fontSize: '14px',
    outline: 'none',
    background: '#fff',
    width: '100%',
  },
  formActions: {
    display: 'flex',
    gap: '10px',
    justifyContent: 'flex-end',
    marginTop: '24px',
  },
  cancelBtn: {
    padding: '10px 20px',
    background: '#f0f2f5',
    color: '#374151',
    border: 'none',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  saveBtn: {
    padding: '10px 20px',
    background: '#4361ee',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
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
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '12px',
  },
};

const defaultForm = {
  name: '',
  price: '',
  stock: '',
  categoryId: '',
  description: '',
  imageUrl: '',
};

export default function ProductsPage() {
  const [showModal, setShowModal] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [form, setForm] = useState(defaultForm);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const queryClient = useQueryClient();

  const { data: products = [], isLoading, error } = useQuery({
    queryKey: ['products-all'],
    queryFn: () => productsApi.getAll(),
  });

  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: categoriesApi.getAll,
  });

  const createMutation = useMutation({
    mutationFn: productsApi.create,
    onSuccess: () => {
      toast.success('Product created');
      closeModal();
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['products-all'] });
    },
    onError: (err) => toast.error(err.message),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => productsApi.update(id, data),
    onSuccess: () => {
      toast.success('Product updated');
      closeModal();
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['products-all'] });
    },
    onError: (err) => toast.error(err.message),
  });

  const deleteMutation = useMutation({
    mutationFn: productsApi.delete,
    onSuccess: () => {
      toast.success('Product deleted');
      setConfirmDelete(null);
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['products-all'] });
    },
    onError: (err) => toast.error(err.message),
  });

  const openCreate = () => {
    setEditProduct(null);
    setForm(defaultForm);
    setShowModal(true);
  };

  const openEdit = (product) => {
    setEditProduct(product);
    setForm({
      name: product.name || '',
      price: product.price || '',
      stock: product.stock ?? '',
      categoryId: product.category?.id || '',
      description: product.description || '',
      imageUrl: product.imageUrl || '',
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditProduct(null);
    setForm(defaultForm);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      name: form.name,
      price: parseFloat(form.price),
      stock: parseInt(form.stock) || 0,
      categoryId: form.categoryId ? parseInt(form.categoryId) : null,
      description: form.description || null,
      imageUrl: form.imageUrl || null,
    };
    if (editProduct) {
      updateMutation.mutate({ id: editProduct.id, data: payload });
    } else {
      createMutation.mutate(payload);
    }
  };

  const getStockStyle = (stock) => {
    if (stock === 0) return { ...styles.stockBadge, ...styles.stockOut };
    if (stock < 5) return { ...styles.stockBadge, ...styles.stockLow };
    return { ...styles.stockBadge, ...styles.stockOk };
  };

  const isSaving = createMutation.isPending || updateMutation.isPending;

  return (
    <div style={styles.container}>
      <div style={styles.topBar}>
        <h2 style={styles.title}>Products</h2>
        <button style={styles.addBtn} onClick={openCreate}>
          <Plus size={16} />
          Add Product
        </button>
      </div>

      <div style={styles.card}>
        {isLoading && <div style={styles.loadingState}>Loading products...</div>}
        {error && (
          <div style={styles.errorState}>
            <AlertCircle size={20} style={{ marginBottom: '8px' }} />
            Failed to load products
          </div>
        )}
        {!isLoading && !error && products.length === 0 && (
          <div style={styles.emptyState}>
            <Package size={40} strokeWidth={1} />
            <span>No products yet. Add your first product!</span>
          </div>
        )}
        {!isLoading && !error && products.length > 0 && (
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Name</th>
                <th style={styles.th}>Category</th>
                <th style={styles.th}>Price</th>
                <th style={styles.th}>Stock</th>
                <th style={styles.th}>Status</th>
                <th style={styles.th}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id}>
                  <td style={{ ...styles.td, fontWeight: '600', color: '#1a1a2e' }}>
                    {product.name}
                    {product.description && (
                      <div style={{ fontSize: '12px', color: '#9ca3af', fontWeight: '400', marginTop: '2px' }}>
                        {product.description}
                      </div>
                    )}
                  </td>
                  <td style={styles.td}>{product.category?.name || '—'}</td>
                  <td style={{ ...styles.td, fontWeight: '700', color: '#4361ee' }}>
                    ${Number(product.price).toFixed(2)}
                  </td>
                  <td style={styles.td}>
                    <span style={getStockStyle(product.stock)}>{product.stock}</span>
                  </td>
                  <td style={styles.td}>
                    <span style={product.active ? styles.activeBadge : styles.inactiveBadge}>
                      {product.active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td style={styles.td}>
                    <div style={styles.actionBtns}>
                      <button style={styles.editBtn} onClick={() => openEdit(product)}>
                        <Pencil size={12} />
                        Edit
                      </button>
                      <button
                        style={styles.deleteBtn}
                        onClick={() => setConfirmDelete(product)}
                      >
                        <Trash2 size={12} />
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div style={styles.overlay} onClick={(e) => e.target === e.currentTarget && closeModal()}>
          <div style={styles.modal}>
            <div style={styles.modalHeader}>
              <h2 style={styles.modalTitle}>
                {editProduct ? 'Edit Product' : 'Add Product'}
              </h2>
              <button style={styles.closeBtn} onClick={closeModal}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div style={styles.formGrid}>
                <div style={{ ...styles.formGroup, ...styles.formGroupFull }}>
                  <label style={styles.label}>Product Name *</label>
                  <input
                    style={styles.input}
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Enter product name"
                  />
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>Price ($) *</label>
                  <input
                    style={styles.input}
                    type="number"
                    step="0.01"
                    min="0"
                    required
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                    placeholder="0.00"
                  />
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>Stock</label>
                  <input
                    style={styles.input}
                    type="number"
                    min="0"
                    value={form.stock}
                    onChange={(e) => setForm({ ...form, stock: e.target.value })}
                    placeholder="0"
                  />
                </div>

                <div style={{ ...styles.formGroup, ...styles.formGroupFull }}>
                  <label style={styles.label}>Category</label>
                  <select
                    style={styles.select}
                    value={form.categoryId}
                    onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
                  >
                    <option value="">— No Category —</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div style={{ ...styles.formGroup, ...styles.formGroupFull }}>
                  <label style={styles.label}>Description</label>
                  <input
                    style={styles.input}
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    placeholder="Optional description"
                  />
                </div>

                <div style={{ ...styles.formGroup, ...styles.formGroupFull }}>
                  <label style={styles.label}>Image URL</label>
                  <input
                    style={styles.input}
                    value={form.imageUrl}
                    onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
                    placeholder="https://..."
                  />
                </div>
              </div>

              <div style={styles.formActions}>
                <button type="button" style={styles.cancelBtn} onClick={closeModal}>
                  Cancel
                </button>
                <button type="submit" style={styles.saveBtn} disabled={isSaving}>
                  {isSaving ? 'Saving...' : editProduct ? 'Update Product' : 'Create Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirm Delete Modal */}
      {confirmDelete && (
        <div style={styles.overlay} onClick={(e) => e.target === e.currentTarget && setConfirmDelete(null)}>
          <div style={{ ...styles.modal, maxWidth: '380px' }}>
            <div style={styles.modalHeader}>
              <h2 style={styles.modalTitle}>Delete Product</h2>
              <button style={styles.closeBtn} onClick={() => setConfirmDelete(null)}>
                <X size={20} />
              </button>
            </div>
            <p style={{ color: '#6b7280', marginBottom: '24px', lineHeight: '1.6' }}>
              Are you sure you want to delete <strong>{confirmDelete.name}</strong>? This will
              mark the product as inactive and it won't appear in the POS.
            </p>
            <div style={styles.formActions}>
              <button style={styles.cancelBtn} onClick={() => setConfirmDelete(null)}>
                Cancel
              </button>
              <button
                style={{ ...styles.saveBtn, background: '#ef4444' }}
                onClick={() => deleteMutation.mutate(confirmDelete.id)}
                disabled={deleteMutation.isPending}
              >
                {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
