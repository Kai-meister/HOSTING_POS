import client from './client.js';

export const productsApi = {
  getAll: async (categoryId) => {
    const params = categoryId ? { categoryId } : {};
    const { data } = await client.get('/api/products', { params });
    return data;
  },

  getById: async (id) => {
    const { data } = await client.get(`/api/products/${id}`);
    return data;
  },

  create: async (product) => {
    const { data } = await client.post('/api/products', product);
    return data;
  },

  update: async (id, product) => {
    const { data } = await client.put(`/api/products/${id}`, product);
    return data;
  },

  delete: async (id) => {
    await client.delete(`/api/products/${id}`);
  },
};
