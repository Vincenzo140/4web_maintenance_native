import { AuthToken } from "../types";

/**
 * API base URL for making HTTP requests.
 */
const API_URL = 'http://localhost:8000';

/**
 * Authenticates a user by sending their credentials to the login endpoint.
 *
 * @param username - The username of the user trying to log in.
 * @param password - The password of the user trying to log in.
 * @returns A promise that resolves to an AuthToken object containing the authentication token.
 * @throws An error if the login request fails, with a message from the server response or a default message.
 */
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

export async function SignUp(username: string, password: string, email: string): Promise<AuthToken> {
  const formData = new FormData();
  formData.append('username', username);
  formData.append('password', password);
  formData.append('email', email);

  const response = await fetch(`${API_URL}/CreateUserAccount`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.detail || 'Criação de Conta failed');
  }

  return response.json();
}



/**
 * Makes an authenticated API request to a specified endpoint.
 *
 * @param endpoint - The API endpoint to send the request to.
 * @param options - Optional settings for the request, such as method and headers.
 * @returns A promise that resolves to the response data, which could be an object, array, or null (for DELETE requests).
 * @throws An error if the request fails, with a message from the server response or a default message.
 */
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

/**
 * Helper function to ensure that the returned data is always an array.
 *
 * @param data - The data to be checked, which could be a single item, an array, or null/undefined.
 * @returns An array of items, ensuring that single items are wrapped in an array and null/undefined returns an empty array.
 */
export function ensureArray<T>(data: T | T[] | null | undefined): T[] {
  if (!data) return [];
  return Array.isArray(data) ? data : [data];
}
