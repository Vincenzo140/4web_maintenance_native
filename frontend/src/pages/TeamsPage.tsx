import React, { useState, useEffect } from 'react';
import { PlusIcon } from 'lucide-react';
import { Table } from '../components/ui/Table';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { Team } from '../types';
import { fetchWithAuth } from '../services/api';
import { toast } from 'react-hot-toast';

export function TeamsPage() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [formData, setFormData] = useState<Partial<Team>>({
    name: '',
    members: [],
    specialites: [],
  });

  useEffect(() => {
    fetchTeams();
  }, []);

  useEffect(() => {
    if (selectedTeam) {
      setFormData({
        name: selectedTeam.name,
        members: Array.isArray(selectedTeam.members) ? selectedTeam.members : [],
        specialites: Array.isArray(selectedTeam.specialites) ? selectedTeam.specialites : [],
      });
    } else {
      setFormData({
        name: '',
        members: [],
        specialites: [],
      });
    }
  }, [selectedTeam]);

  const fetchTeams = async () => {
    try {
      const data = await fetchWithAuth('/teams');
      setTeams(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching teams:', error);
      toast.error('Failed to fetch teams');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const method = selectedTeam ? 'PUT' : 'POST';
      const endpoint = selectedTeam ? `/teams/${selectedTeam.name}` : '/teams';

      const payload = {
        name: formData.name,
        members: formData.members,
        specialites: formData.specialites,
      };

      await fetchWithAuth(endpoint, {
        method,
        body: JSON.stringify(payload),
      });

      toast.success(`Team ${selectedTeam ? 'updated' : 'created'} successfully`);
      setIsModalOpen(false);
      fetchTeams();
    } catch (error) {
      console.error('Error submitting team:', error);
      toast.error(`Failed to ${selectedTeam ? 'update' : 'create'} team`);
    }
  };

  const handleDelete = async (team: Team) => {
    if (window.confirm('Are you sure you want to delete this team?')) {
      try {
        await fetchWithAuth(`/teams/${team.name}`, {
          method: 'DELETE',
        });
        toast.success('Team deleted successfully');
        fetchTeams();
      } catch (error) {
        console.error('Error deleting team:', error);
        toast.error('Failed to delete team');
      }
    }
  };

  const columns = [
    { header: 'Name', accessor: 'name' as keyof Team },
    {
      header: 'Members',
      accessor: 'members' as keyof Team,
      render: (members: string[]) => 
        Array.isArray(members) ? members.join(', ') : '',
    },
    {
      header: 'Specialties',
      accessor: 'specialites' as keyof Team,
      render: (specialites: string[]) => 
        Array.isArray(specialites) ? specialites.join(', ') : '',
    },
    {
      header: 'Actions',
      accessor: 'name' as keyof Team,
      render: (_, team) => (
        <Button 
          variant="danger" 
          size="sm" 
          onClick={(e) => {
            e.stopPropagation();
            handleDelete(team);
          }}
        >
          Delete
        </Button>
      ),
    },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Teams</h1>
        <Button
          onClick={() => {
            setSelectedTeam(null);
            setIsModalOpen(true);
          }}
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Add Team
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
        </div>
      ) : (
        <Table
          data={teams}
          columns={columns}
          onRowClick={(team) => {
            setSelectedTeam(team);
            setIsModalOpen(true);
          }}
        />
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedTeam ? 'Edit Team' : 'Add Team'}
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
            <label className="block text-sm font-medium text-gray-700">Members</label>
            <textarea
              value={Array.isArray(formData.members) ? formData.members.join('\n') : ''}
              onChange={(e) => setFormData({ 
                ...formData, 
                members: e.target.value.split('\n').map(m => m.trim()).filter(Boolean)
              })}
              placeholder="Enter one member per line"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              rows={4}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Specialties</label>
            <textarea
              value={Array.isArray(formData.specialites) ? formData.specialites.join('\n') : ''}
              onChange={(e) => setFormData({ 
                ...formData, 
                specialites: e.target.value.split('\n').map(s => s.trim()).filter(Boolean)
              })}
              placeholder="Enter one specialty per line"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              rows={4}
              required
            />
          </div>
          <div className="flex justify-end space-x-3 mt-6">
            <Button variant="secondary" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">
              {selectedTeam ? 'Update' : 'Create'} Team
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}