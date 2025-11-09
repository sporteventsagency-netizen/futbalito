
import React, { useState, useEffect } from 'react';
import type { Role, Permission } from '../types.ts';
import Button from './ui/Button.tsx';

// FIX: The inner objects are partial records, not full `Record<Permission, string>`.
// Using `Partial` makes the type correct and provides type safety for permission keys.
const permissionGroups: Record<string, Partial<Record<Permission, string>>> = {
    'Competition Management': {
        'competitions:create': 'Create Competitions',
        'competitions:edit': 'Edit Competitions',
        'competitions:delete': 'Delete Competitions',
        'teams:create': 'Create Teams',
        'teams:edit': 'Edit Teams',
        'teams:delete': 'Delete Teams',
        'players:manage': 'Manage Players',
        'arenas:manage': 'Manage Arenas',
        'referees:manage': 'Manage Referees',
        'observers:manage': 'Manage Observers',
        'matches:manage_live': 'Manage Live Matches',
    },
    'Publishing': {
        'publish:manage_articles': 'Manage Articles',
        'publish:manage_media': 'Manage Media',
        'publish:manage_sponsors': 'Manage Sponsors',
        'publish:manage_regulations': 'Manage Regulations',
        'publish:customize_sites': 'Customize Public Sites',
    },
    'Administration': {
        'settings:manage_organization': 'Manage Organization Settings',
        'settings:manage_counties': 'Manage Counties',
        'users:invite': 'Invite & Manage Users',
        'users:manage_roles': 'Manage Roles & Permissions',
        'organizers:manage': 'Manage Organizers',
        'transfers:manage': 'Manage Transfers',
    },
};

interface RoleFormProps {
  role?: Role | null;
  onSave: (data: Omit<Role, 'id'>) => void;
  onClose: () => void;
}

const RoleForm: React.FC<RoleFormProps> = ({ role, onSave, onClose }) => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [permissions, setPermissions] = useState<Permission[]>([]);
    const [error, setError] = useState('');

    useEffect(() => {
        if (role) {
            setName(role.name);
            setDescription(role.description);
            setPermissions(role.permissions);
        } else {
            setName('');
            setDescription('');
            setPermissions([]);
        }
        setError('');
    }, [role]);
    
    const handlePermissionChange = (permission: Permission, isChecked: boolean) => {
        if (isChecked) {
            setPermissions(prev => [...prev, permission]);
        } else {
            setPermissions(prev => prev.filter(p => p !== permission));
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) {
            setError('Role name is required.');
            return;
        }
        onSave({ name, description, permissions });
    };

    const isDefaultRole = role && ['role-admin', 'role-content-editor', 'role-match-manager'].includes(role.id);

    return (
        <form onSubmit={handleSubmit}>
            <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">Role Name</label>
                    <input type="text" id="name" value={name} onChange={e => setName(e.target.value)} disabled={isDefaultRole} className="mt-1 block w-full border border-gray-300 rounded-md p-2 disabled:bg-gray-100" />
                </div>
                 <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                    <input type="text" id="description" value={description} onChange={e => setDescription(e.target.value)} className="mt-1 block w-full border border-gray-300 rounded-md p-2" />
                </div>
                
                <div className="space-y-4 pt-2">
                    {Object.entries(permissionGroups).map(([groupName, groupPermissions]) => (
                        <div key={groupName}>
                            <h4 className="text-md font-semibold text-gray-800 border-b pb-2 mb-2">{groupName}</h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2">
                                {Object.entries(groupPermissions).map(([permission, label]) => (
                                    <label key={permission} className="flex items-center">
                                        <input 
                                            type="checkbox" 
                                            checked={permissions.includes(permission as Permission)}
                                            onChange={e => handlePermissionChange(permission as Permission, e.target.checked)}
                                            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                        />
                                        <span className="ml-2 text-sm text-gray-700">{label}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                {error && <p className="text-sm text-red-600">{error}</p>}
            </div>
            <div className="bg-gray-50 px-6 py-4 flex flex-row-reverse space-x-2 space-x-reverse">
                <Button type="submit">Save Role</Button>
                <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            </div>
        </form>
    );
};

export default RoleForm;
