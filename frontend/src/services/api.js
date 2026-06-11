const BASE = import.meta.env.VITE_API_URL || '';

function getToken() {
  return localStorage.getItem('token');
}

async function request(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, {
    ...options,
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}`, ...options.headers }
  });
  if (res.status === 401) { localStorage.removeItem('token'); window.location.href = '/login'; }
  return res.json();
}

export const api = {
  login: (email, password) => request('/api/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }),

  getNews: () => request('/api/news'),
  createNews: (data) => request('/api/news', { method: 'POST', body: JSON.stringify(data) }),
  updateNews: (id, data) => request(`/api/news/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteNews: (id) => request(`/api/news/${id}`, { method: 'DELETE' }),

  getStores: () => request('/api/stores'),
  createStore: (data) => request('/api/stores', { method: 'POST', body: JSON.stringify(data) }),
  updateStore: (id, data) => request(`/api/stores/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteStore: (id) => request(`/api/stores/${id}`, { method: 'DELETE' }),

  getOffers: () => request('/api/offers'),
  createOffer: (data) => request('/api/offers', { method: 'POST', body: JSON.stringify(data) }),
  updateOffer: (id, data) => request(`/api/offers/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteOffer: (id) => request(`/api/offers/${id}`, { method: 'DELETE' }),

  getWriters: () => request('/api/writers'),
  createWriter: (data) => request('/api/writers', { method: 'POST', body: JSON.stringify(data) }),
  updateWriter: (id, data) => request(`/api/writers/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteWriter: (id) => request(`/api/writers/${id}`, { method: 'DELETE' }),

  getSettings: () => request('/api/settings'),
  updateSettings: (data) => request('/api/settings', { method: 'PUT', body: JSON.stringify(data) }),

  getFriends: () => request('/api/friends'),
  updateFriend: (id, data) => request(`/api/friends/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),

  getFootprints: (uid) => request(`/api/footprints/user/${uid}`),
};
