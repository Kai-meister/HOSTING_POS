import client from './client.js';

export const ordersApi = {
  getAll: async () => {
    const { data } = await client.get('/api/orders');
    return data;
  },

  getById: async (id) => {
    const { data } = await client.get(`/api/orders/${id}`);
    return data;
  },

  create: async (order) => {
    const { data } = await client.post('/api/orders', order);
    return data;
  },
};
