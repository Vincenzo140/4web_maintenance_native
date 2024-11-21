const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';


// Unified error handler
function handleError(error: any) {
  if (error instanceof Response) {
    console.error(`Error: ${error.status} - ${error.statusText}`);
  } else if (error.detail) {
    console.error(`Error: ${error.detail}`);
  } else if (error.message) {
    console.error(`Error: ${error.message}`);
  } else {
    console.error('An unknown error occurred');
  }
  throw error;
}

// Login function
export async function login(username: string, password: string) {
  if (!username || !password) {
    throw new Error('Username and password must be provided');
  }

  const formData = new URLSearchParams();
  formData.append('username', username);
  formData.append('password', password);

  try {
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
  } catch (error) {
    handleError(error);
  }
}

// Authenticated fetch function
export async function fetchWithAuth(endpoint: string, options: RequestInit = {}) {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('No authentication token found');
  }

  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
    ...options.headers,
  };

  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers,
    });

    if (response.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
      throw new Error('Authentication expired. Please log in again.');
    }

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'API error occurred');
    }

    return response.json();
  } catch (error) {
    handleError(error);
  }
}

// Machine-related APIs
export interface MachineData {
  name: string;
  type: string;
  model: string;
  serial_number: string;
  location: string;
  maintenance_history: string[];
  status: 'operando' | 'Quebrado' | 'Em Manutenção';
}

export async function getMachines() {
  return fetchWithAuth('/machines', { method: 'GET' });
}

export async function getMachine(serialNumber: string) {
  return fetchWithAuth(`/machines/${encodeURIComponent(serialNumber)}`, { method: 'GET' });
}

export async function createMachine(data: MachineData) {
  return fetchWithAuth('/machines', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function updateMachine(serialNumber: string, data: Partial<MachineData>) {
  return fetchWithAuth(`/machines/${encodeURIComponent(serialNumber)}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export async function deleteMachine(serialNumber: string) {
  return fetchWithAuth(`/machines/${encodeURIComponent(serialNumber)}`, { method: 'DELETE' });
}

// Part-related APIs
export interface PartData {
  partName: string;
  manufacturer: string;
  // Add other relevant fields as needed
}

export async function createPart(data: PartData) {
  return fetchWithAuth('/parts', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

// Team-related APIs
export interface TeamData {
  teamName: string;
  members: string[];
}

export async function createTeam(data: TeamData) {
  return fetchWithAuth('/teams', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}
