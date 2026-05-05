import client from './client.js';

export const categoriesApi = {
  getAll: async () => {
    const { data } = await client.get('/api/categories');
    return data;
  },

  getById: async (id) => {
    const { data } = await client.get(`/api/categories/${id}`);
    return data;
  },

  create: async (category) => {
    const { data } = await client.post('/api/categories', category);
    return data;
  },

  update: async (id, category) => {
    const { data } = await client.put(`/api/categories/${id}`, category);
    return data;
  },

  delete: async (id) => {
    await client.delete(`/api/categories/${id}`);
  },
};
