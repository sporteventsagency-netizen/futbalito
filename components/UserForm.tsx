
import React, { useState, useEffect } from 'react';
import type { User, Role } from '../types.ts';
import Button from './ui/Button.tsx';

interface UserFormProps {
  user?: User | null;
  roles: Role[];
  onSave: (data: { email: string, roleId: string }) => void;
  onClose: () => void;
}

const UserForm: React.FC<UserFormProps> = ({ user, roles, onSave, onClose }) => {
  const [email, setEmail] = useState('');
  const [roleId, setRoleId] = useState<string>('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      setEmail(user.email);
      setRoleId(user.roleId);
    } else {
      setEmail('');
      setRoleId(roles.length > 0 ? roles[roles.length-1].id : '');
    }
    setError('');
  }, [user, roles]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !/^\S+@\S+\.\S+$/.test(email)) {
      setError('Please enter a valid email address.');
      return;
    }
    onSave({ email, roleId });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="p-6 space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
          <input 
            type="email" 
            id="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            disabled={!!user} // Disable email editing for existing users
          />
        </div>
        <div>
          <label htmlFor="role" className="block text-sm font-medium text-gray-700">Role</label>
          <select 
            id="role" 
            value={roleId} 
            onChange={(e) => setRoleId(e.target.value)} 
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          >
            {roles.map(role => (
              <option key={role.id} value={role.id}>{role.name}</option>
            ))}
          </select>
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
      </div>
      <div className="bg-gray-50 px-6 py-4 flex flex-row-reverse space-x-2 space-x-reverse">
        <Button type="submit">Save</Button>
        <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
      </div>
    </form>
  );
};

export default UserForm;
