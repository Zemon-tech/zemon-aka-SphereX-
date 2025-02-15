export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export const api = {
  baseUrl: API_BASE_URL,
  endpoints: {
    repos: '/api/repos',
    news: '/api/news',
    store: '/api/store',
    events: '/api/events',
    auth: '/api/auth',
  },

  async login(email: string, password: string) {
    const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });
    
    if (!res.ok) {
      throw new Error('Login failed');
    }
    
    return res.json();
  },

  async register(name: string, email: string, password: string) {
    const res = await fetch(`${API_BASE_URL}/api/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, email, password }),
    });
    
    if (!res.ok) {
      throw new Error('Registration failed');
    }
    
    return res.json();
  },

  async githubAuth(code: string) {
    const res = await fetch(`${API_BASE_URL}/api/auth/github`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ code }),
    });
    
    if (!res.ok) {
      throw new Error('GitHub authentication failed');
    }
    
    return res.json();
  },
}; 