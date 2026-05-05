import React, { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { Search, ShoppingCart, CreditCard, Banknote, Trash2, AlertCircle } from 'lucide-react';
import { productsApi } from '../api/products.js';
import { categoriesApi } from '../api/categories.js';
import { ordersApi } from '../api/orders.js';
import ProductCard from '../components/ProductCard.jsx';
import CartItem from '../components/CartItem.jsx';
import ReceiptModal from '../components/ReceiptModal.jsx';

const styles = {
  container: {
    display: 'flex',
    height: 'calc(100vh - 65px)',
    gap: '0',
    margin: '-24px',
  },
  left: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    padding: '20px',
    gap: '16px',
  },
  searchRow: {
    display: 'flex',
    gap: '12px',
    alignItems: 'center',
  },
  searchBox: {
    position: 'relative',
    flex: 1,
  },
  searchInput: {
    width: '100%',
    padding: '10px 16px 10px 40px',
    border: '1px solid #e5e7eb',
    borderRadius: '10px',
    fontSize: '14px',
    background: '#fff',
    outline: 'none',
    transition: 'border-color 0.2s',
  },
  searchIcon: {
    position: 'absolute',
    left: '12px',
    top: '50%',
    transform: 'translateY(-50%)',
    color: '#9ca3af',
  },
  categoryTabs: {
    display: 'flex',
    gap: '8px',
    flexWrap: 'wrap',
  },
  categoryTab: {
    padding: '6px 14px',
    borderRadius: '20px',
    border: '1px solid #e5e7eb',
    background: '#fff',
    fontSize: '13px',
    cursor: 'pointer',
    color: '#6b7280',
    fontWeight: '500',
    transition: 'all 0.2s',
    whiteSpace: 'nowrap',
  },
  categoryTabActive: {
    background: '#4361ee',
    color: '#fff',
    borderColor: '#4361ee',
  },
  productsGrid: {
    flex: 1,
    overflowY: 'auto',
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(155px, 1fr))',
    gap: '12px',
    alignContent: 'start',
    paddingRight: '4px',
  },
  right: {
    width: '340px',
    minWidth: '340px',
    background: '#fff',
    borderLeft: '1px solid #e5e7eb',
    display: 'flex',
    flexDirection: 'column',
    boxShadow: '-2px 0 8px rgba(0,0,0,0.05)',
  },
  cartHeader: {
    padding: '20px',
    borderBottom: '1px solid #f0f2f5',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cartTitle: {
    fontSize: '16px',
    fontWeight: '700',
    color: '#1a1a2e',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  cartBadge: {
    background: '#4361ee',
    color: '#fff',
    borderRadius: '12px',
    padding: '2px 8px',
    fontSize: '12px',
    fontWeight: '700',
  },
  clearBtn: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    color: '#ef4444',
    fontSize: '12px',
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    padding: '4px 8px',
    borderRadius: '6px',
    transition: 'background 0.2s',
  },
  cartItems: {
    flex: 1,
    overflowY: 'auto',
    padding: '0 20px',
  },
  emptyCart: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '200px',
    color: '#9ca3af',
    gap: '12px',
  },
  cartFooter: {
    padding: '20px',
    borderTop: '1px solid #e5e7eb',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  totalRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalLabel: {
    fontSize: '14px',
    color: '#6b7280',
  },
  totalAmount: {
    fontSize: '24px',
    fontWeight: '800',
    color: '#1a1a2e',
  },
  paymentMethodLabel: {
    fontSize: '13px',
    fontWeight: '600',
    color: '#374151',
    marginBottom: '6px',
  },
  paymentButtons: {
    display: 'flex',
    gap: '8px',
  },
  payBtn: {
    flex: 1,
    padding: '10px',
    border: '2px solid #e5e7eb',
    borderRadius: '8px',
    background: '#fff',
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: '600',
    color: '#6b7280',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '6px',
    transition: 'all 0.2s',
  },
  payBtnActive: {
    borderColor: '#4361ee',
    background: '#e0e7ff',
    color: '#4361ee',
  },
  amountInput: {
    width: '100%',
    padding: '10px 14px',
    border: '1px solid #e5e7eb',
    borderRadius: '8px',
    fontSize: '15px',
    fontWeight: '600',
    outline: 'none',
    transition: 'border-color 0.2s',
  },
  changeDisplay: {
    background: '#f0fdf4',
    border: '1px solid #bbf7d0',
    borderRadius: '8px',
    padding: '10px 14px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  changeLabel: {
    fontSize: '13px',
    color: '#16a34a',
    fontWeight: '600',
  },
  changeAmount: {
    fontSize: '16px',
    fontWeight: '800',
    color: '#16a34a',
  },
  insufficientLabel: {
    color: '#ef4444',
    fontSize: '12px',
  },
  processBtn: {
    width: '100%',
    padding: '14px',
    background: '#4361ee',
    color: '#fff',
    border: 'none',
    borderRadius: '10px',
    fontSize: '15px',
    fontWeight: '700',
    cursor: 'pointer',
    transition: 'background 0.2s, opacity 0.2s',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
  },
  processBtnDisabled: {
    opacity: 0.5,
    cursor: 'not-allowed',
  },
  loadingState: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '200px',
    color: '#9ca3af',
    fontSize: '14px',
  },
  errorState: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '200px',
    color: '#ef4444',
    gap: '8px',
    fontSize: '14px',
  },
};

export default function POSPage() {
  const [cart, setCart] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('CASH');
  const [amountPaid, setAmountPaid] = useState('');
  const [receiptOrder, setReceiptOrder] = useState(null);
  const queryClient = useQueryClient();

  const { data: products = [], isLoading: productsLoading, error: productsError } = useQuery({
    queryKey: ['products'],
    queryFn: () => productsApi.getAll(),
  });

  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: categoriesApi.getAll,
  });

  const createOrderMutation = useMutation({
    mutationFn: ordersApi.create,
    onSuccess: (order) => {
      setReceiptOrder(order);
      setCart([]);
      setAmountPaid('');
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      toast.success('Sale processed successfully!');
    },
    onError: (err) => {
      toast.error(err.message || 'Failed to process sale');
    },
  });

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = selectedCategory === null || p.category?.id === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [products, search, selectedCategory]);

  const cartTotal = useMemo(
    () => cart.reduce((sum, item) => sum + Number(item.product.price) * item.quantity, 0),
    [cart]
  );

  const cartItemCount = useMemo(
    () => cart.reduce((sum, item) => sum + item.quantity, 0),
    [cart]
  );

  const change = useMemo(() => {
    const paid = parseFloat(amountPaid) || 0;
    return paid - cartTotal;
  }, [amountPaid, cartTotal]);

  const canProcess = useMemo(() => {
    if (cart.length === 0) return false;
    if (paymentMethod === 'CASH') {
      return parseFloat(amountPaid) >= cartTotal;
    }
    return true;
  }, [cart, paymentMethod, amountPaid, cartTotal]);

  const addToCart = (product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        if (existing.quantity >= product.stock) {
          toast.error(`Only ${product.stock} in stock`);
          return prev;
        }
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
  };

  const increaseQty = (productId) => {
    const product = products.find((p) => p.id === productId);
    const cartItem = cart.find((item) => item.product.id === productId);
    if (cartItem && product && cartItem.quantity >= product.stock) {
      toast.error(`Only ${product.stock} in stock`);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.product.id === productId
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    );
  };

  const decreaseQty = (productId) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.product.id === productId
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const removeItem = (productId) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const handleProcessSale = () => {
    if (!canProcess) return;
    const paid = paymentMethod === 'CARD' ? cartTotal : parseFloat(amountPaid);
    createOrderMutation.mutate({
      paymentMethod,
      amountPaid: paid,
      items: cart.map((item) => ({
        productId: item.product.id,
        quantity: item.quantity,
      })),
    });
  };

  return (
    <div style={styles.container}>
      {/* Left: Products */}
      <div style={styles.left}>
        <div style={styles.searchRow}>
          <div style={styles.searchBox}>
            <Search size={16} style={styles.searchIcon} />
            <input
              style={styles.searchInput}
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div style={styles.categoryTabs}>
          <button
            style={{
              ...styles.categoryTab,
              ...(selectedCategory === null ? styles.categoryTabActive : {}),
            }}
            onClick={() => setSelectedCategory(null)}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              style={{
                ...styles.categoryTab,
                ...(selectedCategory === cat.id ? styles.categoryTabActive : {}),
              }}
              onClick={() => setSelectedCategory(cat.id)}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {productsLoading && (
          <div style={styles.loadingState}>Loading products...</div>
        )}
        {productsError && (
          <div style={styles.errorState}>
            <AlertCircle size={24} />
            Failed to load products. Is the backend running?
          </div>
        )}
        {!productsLoading && !productsError && (
          <div style={styles.productsGrid}>
            {filteredProducts.length === 0 ? (
              <div style={{ gridColumn: '1/-1', textAlign: 'center', color: '#9ca3af', paddingTop: '40px' }}>
                No products found
              </div>
            ) : (
              filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} onAdd={addToCart} />
              ))
            )}
          </div>
        )}
      </div>

      {/* Right: Cart */}
      <div style={styles.right}>
        <div style={styles.cartHeader}>
          <div style={styles.cartTitle}>
            <ShoppingCart size={18} />
            Cart
            {cartItemCount > 0 && (
              <span style={styles.cartBadge}>{cartItemCount}</span>
            )}
          </div>
          {cart.length > 0 && (
            <button style={styles.clearBtn} onClick={() => setCart([])}>
              <Trash2 size={12} />
              Clear
            </button>
          )}
        </div>

        <div style={styles.cartItems}>
          {cart.length === 0 ? (
            <div style={styles.emptyCart}>
              <ShoppingCart size={40} strokeWidth={1} />
              <span>Cart is empty</span>
              <span style={{ fontSize: '12px' }}>Click products to add them</span>
            </div>
          ) : (
            cart.map((item) => (
              <CartItem
                key={item.product.id}
                item={item}
                onIncrease={increaseQty}
                onDecrease={decreaseQty}
                onRemove={removeItem}
              />
            ))
          )}
        </div>

        <div style={styles.cartFooter}>
          <div style={styles.totalRow}>
            <span style={styles.totalLabel}>Total</span>
            <span style={styles.totalAmount}>${cartTotal.toFixed(2)}</span>
          </div>

          <div>
            <div style={styles.paymentMethodLabel}>Payment Method</div>
            <div style={styles.paymentButtons}>
              <button
                style={{
                  ...styles.payBtn,
                  ...(paymentMethod === 'CASH' ? styles.payBtnActive : {}),
                }}
                onClick={() => setPaymentMethod('CASH')}
              >
                <Banknote size={16} />
                Cash
              </button>
              <button
                style={{
                  ...styles.payBtn,
                  ...(paymentMethod === 'CARD' ? styles.payBtnActive : {}),
                }}
                onClick={() => setPaymentMethod('CARD')}
              >
                <CreditCard size={16} />
                Card
              </button>
            </div>
          </div>

          {paymentMethod === 'CASH' && (
            <>
              <input
                style={styles.amountInput}
                type="number"
                placeholder="Amount paid ($)"
                value={amountPaid}
                min={0}
                step="0.01"
                onChange={(e) => setAmountPaid(e.target.value)}
              />
              {amountPaid !== '' && (
                <>
                  {change >= 0 ? (
                    <div style={styles.changeDisplay}>
                      <span style={styles.changeLabel}>Change</span>
                      <span style={styles.changeAmount}>${change.toFixed(2)}</span>
                    </div>
                  ) : (
                    <div style={styles.insufficientLabel}>
                      Insufficient payment. Need ${Math.abs(change).toFixed(2)} more.
                    </div>
                  )}
                </>
              )}
            </>
          )}

          <button
            style={{
              ...styles.processBtn,
              ...(!canProcess || createOrderMutation.isPending ? styles.processBtnDisabled : {}),
            }}
            onClick={handleProcessSale}
            disabled={!canProcess || createOrderMutation.isPending}
          >
            {createOrderMutation.isPending ? 'Processing...' : 'Process Sale'}
          </button>
        </div>
      </div>

      {receiptOrder && (
        <ReceiptModal order={receiptOrder} onClose={() => setReceiptOrder(null)} />
      )}
    </div>
  );
}
