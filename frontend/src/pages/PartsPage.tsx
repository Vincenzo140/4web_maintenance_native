import React, { useState, useEffect } from 'react';
import { PlusIcon } from 'lucide-react';
import { Table } from '../components/ui/Table';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { Part } from '../types';
import { fetchWithAuth } from '../services/api';
import { toast } from 'react-hot-toast';

export function PartsPage() {
  const [parts, setParts] = useState<Part[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPart, setSelectedPart] = useState<Part | null>(null);
  const [formData, setFormData] = useState<Partial<Part>>({
    code: '',
    name: '',
    description: '',
    quantity: 0,
    location: '',
  });

  useEffect(() => {
    fetchParts();
  }, []);

  useEffect(() => {
    if (selectedPart) {
      setFormData(selectedPart);
    } else {
      setFormData({
        code: '',
        name: '',
        description: '',
        quantity: 0,
        location: '',
      });
    }
  }, [selectedPart]);

  const fetchParts = async () => {
    try {
      const data = await fetchWithAuth('/parts');
      setParts(data);
    } catch (error) {
      toast.error('Failed to fetch parts');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const method = selectedPart ? 'PUT' : 'POST';
      const endpoint = selectedPart ? `/parts/${selectedPart.code}` : '/parts';

      await fetchWithAuth(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      toast.success(`Part ${selectedPart ? 'updated' : 'created'} successfully`);
      setIsModalOpen(false);
      fetchParts();
    } catch (error) {
      toast.error(`Failed to ${selectedPart ? 'update' : 'create'} part`);
    }
  };

  const handleDelete = async (part: Part) => {
    if (window.confirm('Are you sure you want to delete this part?')) {
      try {
        await fetchWithAuth(`/parts/${part.code}`, {
          method: 'DELETE',
        });
        toast.success('Part deleted successfully');
        fetchParts();
      } catch (error) {
        toast.error('Failed to delete part');
      }
    }
  };

  const columns = [
    { header: 'Code', accessor: 'code' as keyof Part },
    { header: 'Name', accessor: 'name' as keyof Part },
    { header: 'Description', accessor: 'description' as keyof Part },
    { header: 'Quantity', accessor: 'quantity' as keyof Part },
    { header: 'Location', accessor: 'location' as keyof Part },
    {
      header: 'Actions',
      accessor: 'code' as keyof Part,
      render: (_, part) => (
        <Button variant="danger" size="sm" onClick={() => handleDelete(part)}>
          Delete
        </Button>
      ),
    },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Parts Inventory</h1>
        <Button
          onClick={() => {
            setSelectedPart(null);
            setIsModalOpen(true);
          }}
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Add Part
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
        </div>
      ) : (
        <Table
          data={parts}
          columns={columns}
          onRowClick={(part) => {
            setSelectedPart(part);
            setIsModalOpen(true);
          }}
        />
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedPart ? 'Edit Part' : 'Add Part'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Code</label>
            <input
              type="text"
              value={formData.code}
              onChange={(e) => setFormData({ ...formData, code: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              rows={3}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Quantity</label>
            <input
              type="number"
              value={formData.quantity}
              onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
              min="0"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Location</label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>
          <div className="flex justify-end space-x-3 mt-6">
            <Button variant="secondary" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">
              {selectedPart ? 'Update' : 'Create'} Part
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}