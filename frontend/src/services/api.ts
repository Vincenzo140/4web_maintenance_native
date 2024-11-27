import { AuthToken } from '../types';

const API_URL = 'http://localhost:8000';

export async function login(username: string, password: string): Promise<AuthToken> {
  const formData = new FormData();
  formData.append('username', username);
  formData.append('password', password);

  const response = await fetch(`${API_URL}/token`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.detail || 'Login failed');
  }

  return response.json();
}

export async function fetchWithAuth(endpoint: string, options: RequestInit = {}) {
  const storedToken = localStorage.getItem('auth_token');
  const token = storedToken ? JSON.parse(storedToken) : null;
  
  if (!token) {
    throw new Error('No authentication token');
  }

  const headers = new Headers(options.headers || {});
  headers.set('Authorization', `Bearer ${token.access_token}`);
  
  // Always set Content-Type for POST and PUT requests
  if ((options.method === 'POST' || options.method === 'PUT') && options.body) {
    headers.set('Content-Type', 'application/json');
  }

  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      console.error('API Error:', errorData);
      throw new Error(errorData?.detail || `API request failed: ${response.statusText}`);
    }

    // For DELETE requests, return null as there's usually no response body
    if (options.method === 'DELETE') {
      return null;
    }

    // For other requests, try to parse JSON response
    const data = await response.json();
    
    // Ensure we always return an array for list endpoints
    if (endpoint.match(/\/(machines|teams|parts|maintenance)$/)) {
      return Array.isArray(data) ? data : [];
    }

    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
}

// Helper function to ensure arrays
export function ensureArray<T>(data: T | T[] | null | undefined): T[] {
  if (!data) return [];
  return Array.isArray(data) ? data : [data];
}