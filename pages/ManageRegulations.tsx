
import React, { useState, useMemo } from 'react';
import { useCompetitions } from '../context/CompetitionContext.tsx';
import Button from '../components/ui/Button.tsx';
import Card from '../components/ui/Card.tsx';
import Modal from '../components/ui/Modal.tsx';
import RegulationForm from '../components/RegulationForm.tsx';
import { ChevronLeftIcon } from '../components/icons/Icons.tsx';
import type { Regulation } from '../types.ts';

interface ManageRegulationsProps {
  competitionId: string;
  onBack: () => void;
}

const regulationTemplates: Regulation[] = [
    { id: 'statute', title: 'Statute', content: '', lastUpdatedAt: '' },
    { id: 'game', title: 'Game Regulations', content: '', lastUpdatedAt: '' },
    { id: 'organization', title: 'Organizational Regulations', content: '', lastUpdatedAt: '' },
    { id: 'disciplinary', title: 'Disciplinary Regulations', content: '', lastUpdatedAt: '' },
];

const ManageRegulations: React.FC<ManageRegulationsProps> = ({ competitionId, onBack }) => {
  const { getCompetitionById, updateCompetitionRegulation } = useCompetitions();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRegulation, setEditingRegulation] = useState<Regulation | null>(null);

  const competition = getCompetitionById(competitionId);

  const regulations = useMemo(() => {
    const existingRegulations = competition?.publicConfig?.regulations || [];
    return regulationTemplates.map(template => {
        const existing = existingRegulations.find(r => r.id === template.id);
        return existing || template;
    });
  }, [competition]);
  
  const openEditModal = (regulation: Regulation) => {
    setEditingRegulation(regulation);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingRegulation(null);
  };

  const handleSave = (content: string) => {
    if (editingRegulation) {
        updateCompetitionRegulation(competitionId, {
            ...editingRegulation,
            content,
            lastUpdatedAt: new Date().toISOString(),
        });
    }
    closeModal();
  };

  return (
    <div>
      <div className="mb-6">
        <button onClick={onBack} className="flex items-center text-sm text-gray-500 hover:text-gray-700 mb-2">
          <ChevronLeftIcon className="h-4 w-4 mr-1" /> Back to Publish
        </button>
        <h1 className="text-3xl font-bold text-gray-800">Manage Regulations: {competition?.name}</h1>
        <p className="mt-2 text-gray-600">Edit the official documents for your competition.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {regulations.map(reg => (
            <Card key={reg.id}>
                <div className="flex justify-between items-start">
                    <div>
                        <h2 className="text-xl font-bold text-gray-800">{reg.title}</h2>
                        {reg.lastUpdatedAt && (
                             <p className="text-xs text-gray-400 mt-1">Last updated: {new Date(reg.lastUpdatedAt).toLocaleDateString()}</p>
                        )}
                    </div>
                    <Button onClick={() => openEditModal(reg)} variant="secondary">Edit</Button>
                </div>
                <div className="mt-4 p-4 bg-gray-50 rounded-md max-h-48 overflow-y-auto">
                    <p className="text-sm text-gray-600 whitespace-pre-wrap">{reg.content || 'No content added yet.'}</p>
                </div>
            </Card>
        ))}
      </div>

      <Modal isOpen={isModalOpen} onClose={closeModal} title={`Edit ${editingRegulation?.title}`}>
        {editingRegulation && (
            <RegulationForm
                regulation={editingRegulation}
                onSave={handleSave}
                onClose={closeModal}
            />
        )}
      </Modal>
    </div>
  );
};

export default ManageRegulations;
