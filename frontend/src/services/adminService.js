import api from './api';

export const adminService = {
  getDashboardStats: async () => {
    const res = await api.get('/admin/dashboard/stats');
    return res.data;
  },

  getAllEvents: async (params = {}) => {
    const res = await api.get('/admin/events', { params });
    return res.data;
  },

  createEvent: async (eventData) => {
    const res = await api.post('/admin/events', eventData);
    return res.data;
  },

  updateEvent: async (id, eventData) => {
    const res = await api.put(`/admin/events/${id}`, eventData);
    return res.data;
  },

  deleteEvent: async (id) => {
    const res = await api.delete(`/admin/events/${id}`);
    return res.data;
  },

  updateEventStatus: async (id, status) => {
    const res = await api.patch(`/admin/events/${id}/status`, { status });
    return res.data;
  },

  getEventRegistrations: async (eventId) => {
    const res = await api.get(`/admin/events/${eventId}/registrations`);
    return res.data;
  },

  getAllRegistrations: async (limit = 50) => {
    const res = await api.get('/admin/registrations', { params: { limit } });
    return res.data;
  },

  getContactMessages: async () => {
    const res = await api.get('/contact/messages');
    return res.data;
  }
};
