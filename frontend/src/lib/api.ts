import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000',
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface Machine {
  name: string;
  type: string;
  model: string;
  manufacture_data: string; // date in ISO format 'YYYY-MM-DD'
  serial_number: string;
  location: string;
  maintenance_history: string[];
  status: 'operando' | 'Quebrado' | 'Em Manuntenção';
}

export interface Maintenance {
  maintenance_register_id: number;
  problem_description: string;
  request_date: string; // date in ISO format 'YYYY-MM-DD'
  priority: string;
  assigned_team: string;
  status: string;
  machine_id: string;
}

export interface Part {
  name: string;
  code: string;
  supplier: string;
  quantity: number;
  unit_price: number;
}

export interface Team {
  name: string;
  members: string[];
  specialites: string[]; // single string to match backend type
}

// Machines
export const getMachines = () =>
  api.get<Machine[]>('/machines').then((res) => res.data);

export const getMachine = (serial: string) =>
  api.get<Machine>(`/machines/${serial}`).then((res) => res.data);

export const createMachine = (data: Omit<Machine, 'serial_number' | 'maintenance_history'>) => {
  const payload = {
    ...data,
    manufacture_data: new Date(data.manufacture_data).toISOString().split('T')[0],
    maintenance_history: [],
  };
  return api.post('/machines', payload).then((res) => res.data);
};

export const updateMachine = (serial: string, data: Partial<Machine>) => {
  const payload = {
    ...data,
    manufacture_data: data.manufacture_data
      ? new Date(data.manufacture_data).toISOString().split('T')[0]
      : undefined,
  };
  return api.put(`/machines/${serial}`, payload).then((res) => res.data);
};

export const deleteMachine = (serial: string) =>
  api.delete(`/machines/${serial}`);

// Maintenance
export const getMaintenances = (machine_id?: string) =>
  api.get<Maintenance[]>('/maintenance', { params: { machine_id } }).then((res) => res.data);

export const getMaintenance = (id: number) =>
  api.get<Maintenance>(`/maintenance/${id}`).then((res) => res.data);

export const createMaintenance = (data: Omit<Maintenance, 'maintenance_register_id' | 'status'>) => {
  const payload = {
    ...data,
    request_date: new Date(data.request_date).toISOString().split('T')[0],
    status: 'pending',
  };
  return api.post('/maintenance', payload).then((res) => res.data);
};

export const updateMaintenance = (id: number, data: Partial<Maintenance>) => {
  const payload = {
    ...data,
    request_date: data.request_date
      ? new Date(data.request_date).toISOString().split('T')[0]
      : undefined,
  };
  return api.put(`/maintenance/${id}`, payload).then((res) => res.data);
};

export const deleteMaintenance = (id: number) =>
  api.delete(`/maintenance/${id}`);

// Parts
export const getParts = () =>
  api.get<Part[]>('/parts').then((res) => res.data);

export const getPart = (code: string) =>
  api.get<Part>(`/parts/${code}`).then((res) => res.data);

export const createPart = (data: Omit<Part, 'code'>) =>
  api.post('/parts', data).then((res) => res.data);

export const registerPartEntry = (code: string, quantity: number) => {
  const payload = {
    quantity,
    entry_date: new Date().toISOString().split('T')[0],
  };
  return api.post(`/parts/${code}/entry`, payload).then((res) => res.data);
};

export const registerPartExit = (code: string, quantity: number) => {
  const payload = {
    quantity,
    exit_date: new Date().toISOString().split('T')[0],
  };
  return api.post(`/parts/${code}/exit`, payload).then((res) => res.data);
};

// Teams
export const getTeams = () =>
  api.get<Team[]>('/teams').then((res) => res.data);

export const getTeam = (name: string) =>
  api.get<Team>(`/teams/${name}`).then((res) => res.data);

export const createTeam = (data: Team) => {
  const payload = {
    ...data,
    specialites: Array.isArray(data.specialites) ? data.specialites.join(', ') : data.specialites,
  };
  return api.post('/teams', payload).then((res) => res.data);
};

export const updateTeam = (name: string, data: Partial<Team>) => {
  const payload = {
    ...data,
    specialites: data.specialites && Array.isArray(data.specialites) ? data.specialites.join(', ') : data.specialites,
  };
  return api.put(`/teams/${name}`, payload).then((res) => res.data);
};

export const deleteTeam = (name: string) =>
  api.delete(`/teams/${name}`);
