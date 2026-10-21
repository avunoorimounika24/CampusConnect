import api from './api';

export const contactService = {
  submitMessage: async (formData) => {
    const res = await api.post('/contact', formData);
    return res.data;
  }
};
