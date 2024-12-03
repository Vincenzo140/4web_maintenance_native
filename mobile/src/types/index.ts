// Common types used across the application
export interface Machine {
  name: string;
  type: string;
  model: string;
  serial_number: string;
  location: string;
  maintenance_history: string[];
  status: string;
}

export interface Maintenance {
  maintenance_register_id: string;
  problem_description: string;
  request_date: string;
  priority: string;
  assigned_team_id: string;
  status: string;
  machine_id: string;
}

export interface Team {
  team_id?: string;
  name: string;
  members: Array<string | number>;
  specialities: string;
}

export interface Part {
  code: string;
  description: string;
  location: string;
  name: string;
  quantity: number;
}