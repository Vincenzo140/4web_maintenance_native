import React, { useState, useEffect } from 'react';
import { PlusIcon } from 'lucide-react';
import { Table } from '../components/ui/Table';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { Maintenance, Machine, Team } from '../types';
import { fetchWithAuth } from '../services/api';
import { toast } from 'react-hot-toast';

export function MaintenancePage() {
  const [maintenanceRecords, setMaintenanceRecords] = useState<Maintenance[]>([]);
  const [machines, setMachines] = useState<Machine[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMaintenance, setSelectedMaintenance] = useState<Maintenance | null>(null);
  const [formData, setFormData] = useState<Partial<Maintenance>>({
    maintenance_register_id: 0,
    problem_description: '',
    request_date: new Date().toISOString().split('T')[0],
    priority: '',
    assigned_team_id: '',
    status: '',
    machine_id: '',
  });

  useEffect(() => {
    Promise.all([
      fetchMaintenanceRecords(),
      fetchMachines(),
      fetchTeams(),
    ]).finally(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    if (selectedMaintenance) {
      setFormData(selectedMaintenance);
    } else {
      setFormData({
        maintenance_register_id: 0,
        problem_description: '',
        request_date: new Date().toISOString().split('T')[0],
        priority: '',
        assigned_team_id: '',
        status: '',
        machine_id: '',
      });
    }
  }, [selectedMaintenance]);

  const fetchMaintenanceRecords = async () => {
    try {
      const data = await fetchWithAuth('/maintenance');
      setMaintenanceRecords(Array.isArray(data) ? data : []);
    } catch (error) {
      toast.error('Failed to fetch maintenance records');
    }
  };

  const fetchMachines = async () => {
    try {
      const data = await fetchWithAuth('/machines');
      setMachines(Array.isArray(data) ? data : []);
    } catch (error) {
      toast.error('Failed to fetch machines');
    }
  };

  const fetchTeams = async () => {
    try {
      const data = await fetchWithAuth('/teams');
      setTeams(Array.isArray(data) ? data : []);
    } catch (error) {
      toast.error('Failed to fetch teams');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const method = selectedMaintenance ? 'PUT' : 'POST';
      const endpoint = selectedMaintenance 
        ? `/maintenance/${selectedMaintenance.maintenance_register_id}`
        : '/maintenance';

      const payload = {
        maintenance_register_id: formData.maintenance_register_id || 0,
        problem_description: formData.problem_description || '',
        request_date: formData.request_date || new Date().toISOString().split('T')[0],
        priority: formData.priority || '',
        assigned_team_id: formData.assigned_team_id || '',
        status: formData.status || '',
        machine_id: formData.machine_id || '',
      };

      await fetchWithAuth(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      toast.success(`Maintenance record ${selectedMaintenance ? 'updated' : 'created'} successfully`);
      setIsModalOpen(false);
      fetchMaintenanceRecords();
    } catch (error) {
      console.error('Error submitting maintenance:', error);
      toast.error(`Failed to ${selectedMaintenance ? 'update' : 'create'} maintenance record`);
    }
  };

  const handleDelete = async (maintenance: Maintenance) => {
    if (window.confirm('Are you sure you want to delete this maintenance record?')) {
      try {
        await fetchWithAuth(`/maintenance/${maintenance.maintenance_register_id}`, {
          method: 'DELETE',
        });
        toast.success('Maintenance record deleted successfully');
        fetchMaintenanceRecords();
      } catch (error) {
        toast.error('Failed to delete maintenance record');
      }
    }
  };

  const getMachineNameById = (machineId: string) => {
    const machine = machines.find(m => m.serial_number === machineId);
    return machine ? `${machine.name} (${machine.serial_number})` : machineId;
  };

  const columns = [
    { 
      header: 'Machine',
      accessor: 'machine_id' as keyof Maintenance,
      render: (machineId: string) => getMachineNameById(machineId)
    },
    { header: 'Problem', accessor: 'problem_description' as keyof Maintenance },
    { header: 'Date', accessor: 'request_date' as keyof Maintenance },
    { header: 'Priority', accessor: 'priority' as keyof Maintenance },
    { 
      header: 'Team',
      accessor: 'assigned_team_id' as keyof Maintenance,
    },
    { header: 'Status', accessor: 'status' as keyof Maintenance },
    {
      header: 'Actions',
      accessor: 'maintenance_register_id' as keyof Maintenance,
      render: (_, maintenance) => (
        <Button variant="danger" size="sm" onClick={() => handleDelete(maintenance)}>
          Delete
        </Button>
      ),
    },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Maintenance Records</h1>
        <Button
          onClick={() => {
            setSelectedMaintenance(null);
            setIsModalOpen(true);
          }}
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Add Maintenance Record
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
        </div>
      ) : (
        <Table
          data={maintenanceRecords}
          columns={columns}
          onRowClick={(maintenance) => {
            setSelectedMaintenance(maintenance);
            setIsModalOpen(true);
          }}
        />
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedMaintenance ? 'Edit Maintenance Record' : 'Add Maintenance Record'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Machine</label>
            <select
              value={formData.machine_id || ''}
              onChange={(e) => setFormData({ ...formData, machine_id: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            >
              <option value="">Select machine</option>
              {machines.map((machine) => (
                <option key={machine.serial_number} value={machine.serial_number}>
                  {machine.name} ({machine.serial_number})
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Problem Description</label>
            <textarea
              value={formData.problem_description || ''}
              onChange={(e) => setFormData({ ...formData, problem_description: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              rows={3}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Request Date</label>
            <input
              type="date"
              value={formData.request_date || ''}
              onChange={(e) => setFormData({ ...formData, request_date: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Priority</label>
            <select
              value={formData.priority || ''}
              onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            >
              <option value="">Select priority</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="critical">Critical</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Assigned Team</label>
            <select
              value={formData.assigned_team_id || ''}
              onChange={(e) => setFormData({ ...formData, assigned_team_id: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            >
              <option value="">Select team</option>
              {teams.map((team) => (
                <option key={team.name} value={`team:${team.name}`}>
                  {team.name} - {team.specialites.join(', ')}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Status</label>
            <select
              value={formData.status || ''}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            >
              <option value="">Select status</option>
              <option value="pending">Pending</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
          <div className="flex justify-end space-x-3 mt-6">
            <Button variant="secondary" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">
              {selectedMaintenance ? 'Update' : 'Create'} Record
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}