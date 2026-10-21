import api from './api';

export const eventService = {
  getEvents: async (params = {}) => {
    const res = await api.get('/events', { params });
    return res.data;
  },

  getEventById: async (id) => {
    const res = await api.get(`/events/${id}`);
    return res.data;
  },

  getFeaturedEvents: async (limit = 3) => {
    const res = await api.get('/events/featured', { params: { limit } });
    return res.data;
  },

  getCategories: async () => {
    const res = await api.get('/events/categories');
    return res.data;
  },

  getPublicStats: async () => {
    const res = await api.get('/stats');
    return res.data;
  }
};
