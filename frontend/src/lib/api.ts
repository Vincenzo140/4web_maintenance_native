const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export async function login(username: string, password: string) {
  if (!username || !password) {
    throw new Error('Username and password must be provided');
  }

  const formData = new URLSearchParams();
  formData.append('username', username);
  formData.append('password', password);

  const response = await fetch(`${API_URL}/token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: formData.toString(),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail?.[0]?.msg || 'Login failed');
  }

  const data = await response.json();
  return data;
}

async function fetchWithAuth(endpoint: string, options: RequestInit = {}) {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('No authentication token found');
  }

  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
    ...options.headers,
  };

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'API error occurred');
  }

  return response.json();
}

interface MachineData {
  serial_number: string;
  name: string;
  manufacturer: string;
  manufacture_date: string;
  model: string;
  specifications: string;
  type: string;
  location: string;
  status: string;
}

export async function getMachines() {
  return fetchWithAuth('/machines', { method: 'GET' });
}

export async function getMachine(serialNumber: string) {
  return fetchWithAuth(`/machines/${serialNumber}`, { method: 'GET' });
}

export async function createMachine(data: MachineData) {
  return fetchWithAuth('/machines', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function updateMachine(serialNumber: string, data: Partial<MachineData>) {
  return fetchWithAuth(`/machines/${serialNumber}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export async function deleteMachine(serialNumber: string) {
  return fetchWithAuth(`/machines/${serialNumber}`, { method: 'DELETE' });
}

export async function createPart(data: any) {
  return fetchWithAuth('/parts', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function createTeam(data: any) {
  return fetchWithAuth('/teams', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}