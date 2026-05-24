import api from './api';

export const commentService = {
  getByTask: (taskId) => api.get(`/comments/${taskId}`),
  add: (data) => api.post('/comments', data),
  delete: (id) => api.delete(`/comments/${id}`),
};

export const userService = {
  getAll: (params) => api.get('/users', { params }),
  updateRole: (id, role) => api.put(`/users/${id}/role`, { role }),
  delete: (id) => api.delete(`/users/${id}`),
};
