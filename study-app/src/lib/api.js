const BASE_URL = 'http://localhost:3000/api';

async function fetchWithAuth(url, options = {}) {
  const token = localStorage.getItem('authToken');
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
    Authorization: `Bearer ${token}`,
  };

  const response = await fetch(`${BASE_URL}${url}`, { ...options, headers });
  if (!response.ok) throw new Error('API request failed');
  return response.json();
}

export async function generateQuestions(topic, difficulty, examType, count) {
  return fetchWithAuth('/questions/generate', {
    method: 'POST',
    body: JSON.stringify({ topic, difficulty, examType, count }),
  });
}

export async function generateNotes(topic, examType, format) {
  return fetchWithAuth('/notes/generate', {
    method: 'POST',
    body: JSON.stringify({ topic, examType, format }),
  });
}