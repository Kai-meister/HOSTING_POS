import client from './client.js';

export const dashboardApi = {
  getStats: async () => {
    const { data } = await client.get('/api/dashboard/stats');
    return data;
  },
};
