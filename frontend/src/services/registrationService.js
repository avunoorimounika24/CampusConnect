import api from './api';

export const registrationService = {
  registerForEvent: async (eventId) => {
    const res = await api.post(`/registrations/events/${eventId}`);
    return res.data;
  },

  getMyRegistrations: async () => {
    const res = await api.get('/registrations/my');
    return res.data;
  },

  getMyRegistrationById: async (registrationId) => {
    const res = await api.get(`/registrations/my/${registrationId}`);
    return res.data;
  },

  cancelRegistration: async (registrationId) => {
    const res = await api.delete(`/registrations/${registrationId}`);
    return res.data;
  }
};
