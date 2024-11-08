import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000',
});

export interface Machine {
  name: string;
  type: string;
  model: string;
  manufacture_data: string; // date in ISO format
  serial_number: string;
  location: string;
  maintenance_history: string[];
  status?: string;
}

export interface Maintenance {
  maintenance_register_id: number;
  problem_description: string;
  request_date: string; // date in ISO format
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
  members: number[];
  specialites?: string[];
}

// Machines
export const getMachines = () => api.get<Machine[]>('/machines').then(res => res.data);
export const getMachine = (serial: string) => api.get<Machine>(`/machines/${serial}`).then(res => res.data);
export const createMachine = (data: Omit<Machine, 'serial_number' | 'maintenance_history'>) => 
  api.post('/machines', { ...data, maintenance_history: [] }).then(res => res.data);
export const updateMachine = (serial: string, data: Partial<Machine>) => 
  api.put(`/machines/${serial}`, data).then(res => res.data);
export const deleteMachine = (serial: string) => api.delete(`/machines/${serial}`);

// Maintenance
export const getMaintenances = (machine_id?: string) => 
  api.get<Maintenance[]>('/maintenance', { params: { machine_id } }).then(res => res.data);
export const getMaintenance = (id: number) => 
  api.get<Maintenance>(`/maintenance/${id}`).then(res => res.data);
export const createMaintenance = (data: Omit<Maintenance, 'maintenance_register_id' | 'status'>) => 
  api.post('/maintenance', { ...data, status: 'pending' }).then(res => res.data);
export const updateMaintenance = (id: number, data: Partial<Maintenance>) => 
  api.put(`/maintenance/${id}`, data).then(res => res.data);
export const deleteMaintenance = (id: number) => api.delete(`/maintenance/${id}`);

// Parts
export const getParts = () => api.get<Part[]>('/parts').then(res => res.data);
export const getPart = (code: string) => api.get<Part>(`/parts/${code}`).then(res => res.data);
export const createPart = (data: Omit<Part, 'code'>) => api.post('/parts', data).then(res => res.data);
export const registerPartEntry = (code: string, quantity: number) => 
  api.post(`/parts/${code}/entry`, { quantity, entry_date: new Date().toISOString() }).then(res => res.data);
export const registerPartExit = (code: string, quantity: number) => 
  api.post(`/parts/${code}/exit`, { quantity, exit_date: new Date().toISOString() }).then(res => res.data);

// Teams
export const getTeams = () => api.get<Team[]>('/teams').then(res => res.data);
export const getTeam = (name: string) => api.get<Team>(`/teams/${name}`).then(res => res.data);
export const createTeam = (data: Team) => api.post('/teams', data).then(res => res.data);
export const updateTeam = (name: string, data: Partial<Team>) => 
  api.put(`/teams/${name}`, data).then(res => res.data);
export const deleteTeam = (name: string) => api.delete(`/teams/${name}`);