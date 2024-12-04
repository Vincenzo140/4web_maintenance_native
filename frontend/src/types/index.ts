export interface Machine {
  machine_id?: string;
  name: string;
  type: string;
  model: string;
  serial_number: string;
  location: string;
  maintenance_history: string[];
  status: string;
}

export interface Maintenance {
  maintenance_register_id: number;
  problem_description: string;
  request_date: string;
  priority: string;
  assigned_team_id: string;
  status: string;
  machine_id: string;
}

export interface Part {
  code: string;
  name: string;
  description: string;
  quantity: number;
  location: string;
}

export interface Team {
  team_id?: string;
  name: string;
  members: (string | number)[];
  specialites: string[];
}

export interface User {
  username: string;
  email: string;
  full_name: string;
  role: string;
}

export interface AuthToken {
  access_token: string;
  token_type: string;
}