import React, { useState, useEffect } from 'react';
import { PlusIcon } from 'lucide-react';
import { Table } from '../components/ui/Table';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { Machine } from '../types';
import { fetchWithAuth } from '../services/api';
import { toast } from 'react-hot-toast';

export function MachinesPage() {
  const [machines, setMachines] = useState<Machine[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMachine, setSelectedMachine] = useState<Machine | null>(null);
  const [formData, setFormData] = useState<Partial<Machine>>({
    name: '',
    type: '',
    model: '',
    serial_number: '',
    location: '',
    status: '',
    maintenance_history: [],
  });

  useEffect(() => {
    fetchMachines();
  }, []);

  useEffect(() => {
    if (selectedMachine) {
      setFormData(selectedMachine);
    } else {
      setFormData({
        name: '',
        type: '',
        model: '',
        serial_number: '',
        location: '',
        status: '',
        maintenance_history: [],
      });
    }
  }, [selectedMachine]);

  const fetchMachines = async () => {
    try {
      const data = await fetchWithAuth('/machines');
      if (Array.isArray(data)) {
        setMachines(data);
      } else {
        console.error('Unexpected response format:', data);
        toast.error('Failed to fetch machines: Invalid response format');
      }
    } catch (error) {
      console.error('Error fetching machines:', error);
      toast.error('Failed to fetch machines');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const method = selectedMachine ? 'PUT' : 'POST';
      const endpoint = selectedMachine 
        ? `/machines/${selectedMachine.serial_number}`
        : '/machines';

      const response = await fetchWithAuth(endpoint, {
        method,
        body: JSON.stringify(formData),
      });

      if (response) {
        // If it's a new machine, add it to the list
        if (!selectedMachine) {
          setMachines(prev => [...prev, response]);
        } else {
          // If updating, replace the old machine with the updated one
          setMachines(prev =>
            prev.map(machine =>
              machine.serial_number === selectedMachine.serial_number ? response : machine
            )
          );
        }
        
        toast.success(`Machine ${selectedMachine ? 'updated' : 'created'} successfully`);
        setIsModalOpen(false);
        await fetchMachines(); // Refresh the list
      }
    } catch (error) {
      console.error('Error submitting machine:', error);
      toast.error(`Failed to ${selectedMachine ? 'update' : 'create'} machine`);
    }
  };

  const handleDelete = async (machine: Machine) => {
    if (window.confirm('Are you sure you want to delete this machine?')) {
      try {
        await fetchWithAuth(`/machines/${machine.serial_number}`, {
          method: 'DELETE',
        });
        setMachines(prev => prev.filter(m => m.serial_number !== machine.serial_number));
        toast.success('Machine deleted successfully');
      } catch (error) {
        console.error('Error deleting machine:', error);
        toast.error('Failed to delete machine');
      }
    }
  };

  const columns = [
    { header: 'Name', accessor: 'name' as keyof Machine },
    { header: 'Type', accessor: 'type' as keyof Machine },
    { header: 'Model', accessor: 'model' as keyof Machine },
    { header: 'Serial Number', accessor: 'serial_number' as keyof Machine },
    { header: 'Location', accessor: 'location' as keyof Machine },
    { header: 'Status', accessor: 'status' as keyof Machine },
    {
      header: 'Actions',
      accessor: 'serial_number' as keyof Machine,
      render: (_, machine) => (
        <Button variant="danger" size="sm" onClick={(e) => {
          e.stopPropagation();
          handleDelete(machine);
        }}>
          Delete
        </Button>
      ),
    },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Machines</h1>
        <Button
          onClick={() => {
            setSelectedMachine(null);
            setIsModalOpen(true);
          }}
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Add Machine
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
        </div>
      ) : (
        <Table
          data={machines}
          columns={columns}
          onRowClick={(machine) => {
            setSelectedMachine(machine);
            setIsModalOpen(true);
          }}
        />
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedMachine ? 'Edit Machine' : 'Add Machine'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              value={formData.name || ''}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Type</label>
            <input
              type="text"
              value={formData.type || ''}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Model</label>
            <input
              type="text"
              value={formData.model || ''}
              onChange={(e) => setFormData({ ...formData, model: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Serial Number</label>
            <input
              type="text"
              value={formData.serial_number || ''}
              onChange={(e) => setFormData({ ...formData, serial_number: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Location</label>
            <input
              type="text"
              value={formData.location || ''}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
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
              <option value="operational">Operational</option>
              <option value="maintenance">Under Maintenance</option>
              <option value="broken">Broken</option>
              <option value="retired">Retired</option>
            </select>
          </div>
          <div className="flex justify-end space-x-3 mt-6">
            <Button variant="secondary" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">
              {selectedMachine ? 'Update' : 'Create'} Machine
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}