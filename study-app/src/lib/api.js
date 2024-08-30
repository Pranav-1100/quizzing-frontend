const BASE_URL = 'https://quizzing-1.onrender.com/api';

async function fetchWithAuth(url, options = {}) {
  const token = localStorage.getItem('authToken');
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
    Authorization: `Bearer ${token}`,
  };

  const response = await fetch(`${BASE_URL}${url}`, { ...options, headers });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Something went wrong');
  }
  return response.json();
}

export const api = {
  auth: {
    login: (credentials) => fetchWithAuth('/auth/login', { method: 'POST', body: JSON.stringify(credentials) }),
    register: (userData) => fetchWithAuth('/auth/register', { method: 'POST', body: JSON.stringify(userData) }),
    getMe: () => fetchWithAuth('/auth/me'),
  },
  questions: {
    generate: (params) => fetchWithAuth('/questions/generate', { method: 'POST', body: JSON.stringify(params) }),
    getByDifficulty: (difficulty) => fetchWithAuth(`/questions/by-difficulty/${difficulty}`),
  },
  notes: {
    generate: (params) => fetchWithAuth('/notes/generate', { method: 'POST', body: JSON.stringify(params) }),
    share: (noteId) => fetchWithAuth(`/notes/${noteId}/share`, { method: 'POST' }),
    generateFlashcards: (noteId) => fetchWithAuth(`/notes/${noteId}/flashcards`, { method: 'POST' }),
  },
  studyPlan: {
    generate: (params) => fetchWithAuth('/study-plan/generate', { method: 'POST', body: JSON.stringify(params) }),
    updateProgress: (planId, progress) => fetchWithAuth(`/study-plan/${planId}/progress`, { method: 'PUT', body: JSON.stringify({ progress }) }),
  },
  doubts: {
    create: (doubt) => fetchWithAuth('/doubts', { method: 'POST', body: JSON.stringify(doubt) }),
    getAll: (page, limit) => fetchWithAuth(`/doubts?page=${page}&limit=${limit}`),
    getById: (id) => fetchWithAuth(`/doubts/${id}`),
    addComment: (id, comment) => fetchWithAuth(`/doubts/${id}/comments`, { method: 'POST', body: JSON.stringify(comment) }),
    resolve: (id) => fetchWithAuth(`/doubts/${id}/resolve`, { method: 'PATCH' }),
  },
  profile: {
    get: () => fetchWithAuth('/profile'),
    update: (profileData) => fetchWithAuth('/profile', { method: 'PUT', body: JSON.stringify(profileData) }),
  },
};