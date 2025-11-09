

import React, { useState, useEffect, useMemo } from 'react';
// FIX: Added .ts extension to module import.
import type { OrganizationSettings, User, Role, Page, County } from '../types.ts';
import Card from '../components/ui/Card.tsx';
// FIX: Added .tsx extension to module import to resolve module resolution error.
import Button from '../components/ui/Button.tsx';
import Tabs from '../components/ui/Tabs.tsx';
import Modal from '../components/ui/Modal.tsx';
import UserForm from '../components/UserForm.tsx';
import RoleForm from '../components/RoleForm.tsx';
import CountyForm from '../components/CountyForm.tsx';
// FIX: Added .tsx extension to module import.
import { PlusIcon, CreditCardIcon, DocumentTextIcon, ArrowTopRightOnSquareIcon } from '../components/icons/Icons.tsx';
// FIX: Added .tsx extension to module import.
import { useCompetitions } from '../context/CompetitionContext.tsx';
// FIX: Added .ts extension to module import.
import usePermissions from '../hooks/usePermissions.ts';

interface SettingsProps {
    setPage: (page: Page) => void;
}

const Settings: React.FC<SettingsProps> = ({ setPage }) => {
    const { 
        organizationSettings, updateOrganizationSettings, 
        users, inviteUser, updateUser, deleteUser,
        roles, addRole, updateRole, deleteRole,
        invoices, auditLog,
        counties, addCounty, updateCounty, deleteCounty
    } = useCompetitions();
    const { hasPermission } = usePermissions();

    const [settings, setSettings] = useState<OrganizationSettings>(organizationSettings);
    const [logoFile, setLogoFile] = useState<File | null>(null);
    
    // Audit Log State
    const [userFilter, setUserFilter] = useState('');
    const [actionFilter, setActionFilter] = useState('');

    const availableTabs = [
        { name: 'Organization', visible: hasPermission('settings:manage_organization') },
        { name: 'Users', visible: hasPermission('users:invite') },
        { name: 'Roles & Permissions', visible: hasPermission('users:manage_roles') },
        { name: 'Counties', visible: hasPermission('settings:manage_counties') },
        { name: 'Billing & Subscription', visible: hasPermission('settings:manage_organization') },
        { name: 'Audit Log', visible: hasPermission('users:manage_roles') },
    ].filter(tab => tab.visible);
    
    const [activeTab, setActiveTab] = useState(availableTabs[0]?.name || '');

    const [isUserModalOpen, setIsUserModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<User | null>(null);

    const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
    const [editingRole, setEditingRole] = useState<Role | null>(null);

    const [isCountyModalOpen, setIsCountyModalOpen] = useState(false);
    const [editingCounty, setEditingCounty] = useState<County | null>(null);

    useEffect(() => {
        setSettings(organizationSettings);
    }, [organizationSettings]);
    
    useEffect(() => {
        // If the current active tab becomes invisible due to permission change,
        // switch to the first available tab.
        if (!availableTabs.some(t => t.name === activeTab)) {
            setActiveTab(availableTabs[0]?.name || '');
        }
    }, [activeTab, availableTabs]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setSettings(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setLogoFile(file);
            const previewUrl = URL.createObjectURL(file);
            setSettings(prev => ({ ...prev, logoUrl: previewUrl }));
        }
    };
    
    const handleSave = () => {
        updateOrganizationSettings(settings, logoFile);
        setLogoFile(null); // Reset file after save
        alert('Settings saved successfully!');
    };

    const timezones = [
        "UTC", "GMT", "Europe/London", "Europe/Bucharest", "America/New_York", "America/Chicago", "America/Denver", "America/Los_Angeles", "Asia/Tokyo"
    ];

    // User Modal Handlers
    const openInviteModal = () => { setEditingUser(null); setIsUserModalOpen(true); };
    const openEditUserModal = (user: User) => { setEditingUser(user); setIsUserModalOpen(true); };
    const closeUserModal = () => { setIsUserModalOpen(false); setEditingUser(null); };
    const handleSaveUser = (data: { email: string, roleId: string }) => {
        if (editingUser) { updateUser({ ...editingUser, ...data }); } else { inviteUser(data.email, data.roleId); }
        closeUserModal();
    };
    const handleDeleteUser = (userId: string) => { if (window.confirm('Are you sure you want to remove this user?')) { deleteUser(userId); } };
    
    // Role Modal Handlers
    const openCreateRoleModal = () => { setEditingRole(null); setIsRoleModalOpen(true); };
    const openEditRoleModal = (role: Role) => { setEditingRole(role); setIsRoleModalOpen(true); };
    const closeRoleModal = () => { setIsRoleModalOpen(false); setEditingRole(null); };
    const handleSaveRole = (data: Omit<Role, 'id'>) => {
        if (editingRole) { updateRole({ ...editingRole, ...data }); } else { addRole(data); }
        closeRoleModal();
    };
    const handleDeleteRole = (roleId: string) => {
        if (['role-admin', 'role-content-editor', 'role-match-manager'].includes(roleId)) { alert('Default roles cannot be deleted.'); return; }
        if (users.some(u => u.roleId === roleId)) { alert('Cannot delete a role that is currently assigned to users.'); return; }
        if (window.confirm('Are you sure you want to delete this role?')) { deleteRole(roleId); }
    };

    // County Modal Handlers
    const openCreateCountyModal = () => { setEditingCounty(null); setIsCountyModalOpen(true); };
    const openEditCountyModal = (county: County) => { setEditingCounty(county); setIsCountyModalOpen(true); };
    const closeCountyModal = () => { setIsCountyModalOpen(false); setEditingCounty(null); };
    const handleSaveCounty = (data: { name: string }) => {
        if (editingCounty) { updateCounty({ ...editingCounty, ...data }); } else { addCounty(data); }
        closeCountyModal();
    };
    const handleDeleteCounty = (id: string) => { if (window.confirm('Are you sure you want to delete this county?')) { deleteCounty(id); } };
    
    const getRoleName = (roleId: string) => roles.find(r => r.id === roleId)?.name || 'Unknown Role';

    const uniqueLogActions = useMemo(() => [...new Set(auditLog.map(log => log.action))], [auditLog]);

    const filteredLogs = useMemo(() => {
        return auditLog.filter(log => (userFilter ? log.userId === userFilter : true) && (actionFilter ? log.action === actionFilter : true));
    }, [auditLog, userFilter, actionFilter]);

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">Settings</h1>
                    <p className="mt-2 text-gray-600">Manage your organization's information, users, and configurations.</p>
                </div>
                {activeTab === 'Organization' && hasPermission('settings:manage_organization') && <Button onClick={handleSave}>Save Changes</Button>}
                {activeTab === 'Users' && hasPermission('users:invite') && <Button onClick={openInviteModal}><PlusIcon className="h-5 w-5 mr-2" />Invite User</Button>}
                {activeTab === 'Roles & Permissions' && hasPermission('users:manage_roles') && <Button onClick={openCreateRoleModal}><PlusIcon className="h-5 w-5 mr-2" />Create Role</Button>}
                {activeTab === 'Counties' && hasPermission('settings:manage_counties') && <Button onClick={openCreateCountyModal}><PlusIcon className="h-5 w-5 mr-2" />Add County</Button>}
            </div>

            <Tabs tabs={availableTabs.map(t => t.name)} activeTab={activeTab} setActiveTab={setActiveTab} />
            
            <div className="mt-8">
                {activeTab === 'Organization' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                        {/* Organization Info Card */}
                        <Card className="!p-0"><h2 className="text-xl font-semibold text-gray-800 p-6 border-b">Organization Info</h2><div className="p-6 space-y-4"><div><label className="block text-sm font-medium text-gray-700">Logo</label><div className="mt-1 flex items-center space-x-4"><img src={settings.logoUrl} alt="Org Logo" className="h-16 w-16 rounded-full object-cover bg-gray-100" /><input type="file" onChange={handleFileChange} accept="image/*" className="text-sm" /></div></div><div><label htmlFor="name" className="block text-sm font-medium text-gray-700">Organization Name</label><input type="text" id="name" name="name" value={settings.name} onChange={handleInputChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" /></div><div><label htmlFor="email" className="block text-sm font-medium text-gray-700">Contact Email</label><input type="email" id="email" name="email" value={settings.email} onChange={handleInputChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" /></div><div><label htmlFor="phone" className="block text-sm font-medium text-gray-700">Contact Phone</label><input type="tel" id="phone" name="phone" value={settings.phone} onChange={handleInputChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" /></div><div><label htmlFor="address" className="block text-sm font-medium text-gray-700">Address</label><input type="text" id="address" name="address" value={settings.address} onChange={handleInputChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" /></div></div></Card>
                        {/* Global Defaults Card */}
                        <Card className="!p-0"><h2 className="text-xl font-semibold text-gray-800 p-6 border-b">Global Defaults</h2><div className="p-6 space-y-4"><div><label htmlFor="defaultTimezone" className="block text-sm font-medium text-gray-700">Default Timezone</label><select id="defaultTimezone" name="defaultTimezone" value={settings.defaultTimezone} onChange={handleInputChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">{timezones.map(tz => <option key={tz} value={tz}>{tz}</option>)}</select></div><div><label htmlFor="defaultCompetitionFormat" className="block text-sm font-medium text-gray-700">Default Competition Format</label><select id="defaultCompetitionFormat" name="defaultCompetitionFormat" value={settings.defaultCompetitionFormat} onChange={handleInputChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"><option value="league">League</option><option value="cup">Cup</option><option value="mixed">Mixed</option></select></div></div></Card>
                    </div>
                )}
                {activeTab === 'Users' && (
                    <div className="bg-white rounded-lg shadow-md overflow-hidden"><table className="min-w-full"><thead className="bg-gray-50"><tr><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th><th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th></tr></thead><tbody className="divide-y divide-gray-200">{users.map(user => (<tr key={user.id}><td className="px-6 py-4 font-medium">{user.name}</td><td className="px-6 py-4 text-sm text-gray-500">{user.email}</td><td className="px-6 py-4 text-sm text-gray-500">{getRoleName(user.roleId)}</td><td className="px-6 py-4"><span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>{user.status}</span></td><td className="px-6 py-4 text-right text-sm font-medium space-x-4"><button onClick={() => openEditUserModal(user)} className="text-indigo-600 hover:text-indigo-900">Edit</button><button onClick={() => handleDeleteUser(user.id)} className="text-red-600 hover:text-red-900">Delete</button></td></tr>))}</tbody></table></div>
                )}
                 {activeTab === 'Roles & Permissions' && (
                    <div className="bg-white rounded-lg shadow-md overflow-hidden"><table className="min-w-full"><thead className="bg-gray-50"><tr><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Description</th><th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th></tr></thead><tbody className="divide-y divide-gray-200">{roles.map(role => (<tr key={role.id}><td className="px-6 py-4 font-medium">{role.name}</td><td className="px-6 py-4 text-sm text-gray-500">{role.description}</td><td className="px-6 py-4 text-right text-sm font-medium space-x-4"><button onClick={() => openEditRoleModal(role)} className="text-indigo-600 hover:text-indigo-900">Edit</button><button onClick={() => handleDeleteRole(role.id)} className="text-red-600 hover:text-red-900">Delete</button></td></tr>))}</tbody></table></div>
                )}
                {activeTab === 'Counties' && (
                    <div className="bg-white rounded-lg shadow-md overflow-hidden"><table className="min-w-full"><thead className="bg-gray-50"><tr><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">County Name</th><th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th></tr></thead><tbody className="divide-y divide-gray-200">{counties.map(county => (<tr key={county.id}><td className="px-6 py-4 font-medium">{county.name}</td><td className="px-6 py-4 text-right text-sm font-medium space-x-4"><button onClick={() => openEditCountyModal(county)} className="text-indigo-600 hover:text-indigo-900">Edit</button><button onClick={() => handleDeleteCounty(county.id)} className="text-red-600 hover:text-red-900">Delete</button></td></tr>))}</tbody></table></div>
                )}
                {activeTab === 'Billing & Subscription' && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start"><Card><h2 className="text-xl font-semibold text-gray-800 flex items-center mb-4"><CreditCardIcon className="h-6 w-6 mr-3 text-blue-600"/> Current Subscription</h2><div className="bg-blue-50 p-6 rounded-lg"><div className="flex justify-between items-center"><p className="text-lg font-bold text-blue-800">PRO Plan</p><p className="text-2xl font-bold text-blue-900">$49<span className="text-base font-medium">/mo</span></p></div><p className="text-sm text-blue-700 mt-2">Your plan renews on August 1, 2024.</p></div><p className="text-sm text-gray-600 mt-6">The PRO plan gives you access to advanced features like referee management, player transfers, and full data exports.</p><Button onClick={() => setPage('MARKETPLACE')} variant='secondary' className="w-full mt-4">Manage Plan or Upgrade</Button></Card><Card className="!p-0"><h2 className="text-xl font-semibold text-gray-800 p-6 border-b">Invoice History</h2><div className="overflow-x-auto"><table className="min-w-full"><thead className="bg-gray-50"><tr><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Invoice</th><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th><th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase"></th></tr></thead><tbody className="divide-y divide-gray-200">{invoices.map(invoice => (<tr key={invoice.id}><td className="px-6 py-4 font-medium">{invoice.id}</td><td className="px-6 py-4 text-sm text-gray-500">{invoice.date}</td><td className="px-6 py-4 text-sm text-gray-500">{invoice.amount}</td><td className="px-6 py-4"><span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">{invoice.status}</span></td><td className="px-6 py-4 text-right"><a href="#" className="text-blue-600 hover:underline text-sm inline-flex items-center">Download <ArrowTopRightOnSquareIcon className="h-4 w-4 ml-1"/></a></td></tr>))}</tbody></table></div></Card></div>
                )}
                {activeTab === 'Audit Log' && (
                    <Card className="!p-0"><div className="p-6 border-b flex justify-between items-center"><h2 className="text-xl font-semibold text-gray-800 flex items-center"><DocumentTextIcon className="h-6 w-6 mr-3 text-gray-500"/> Activity Log</h2><div className="flex items-center space-x-4"><select value={userFilter} onChange={(e) => setUserFilter(e.target.value)} className="block w-48 border-gray-300 rounded-md shadow-sm p-2 text-sm"><option value="">All Users</option>{users.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}</select><select value={actionFilter} onChange={(e) => setActionFilter(e.target.value)} className="block w-48 border-gray-300 rounded-md shadow-sm p-2 text-sm"><option value="">All Actions</option>{uniqueLogActions.map((action: string) => <option key={action} value={action}>{action}</option>)}</select></div></div><div className="overflow-x-auto max-h-[60vh] overflow-y-auto"><table className="min-w-full"><thead className="bg-gray-50 sticky top-0"><tr><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Action</th><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Details</th><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th></tr></thead><tbody className="divide-y divide-gray-200">{filteredLogs.map(log => (<tr key={log.id}><td className="px-6 py-4 font-medium whitespace-nowrap">{log.userName}</td><td className="px-6 py-4 text-sm"><span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">{log.action}</span></td><td className="px-6 py-4 text-sm text-gray-600">{log.details}</td><td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">{new Date(log.timestamp).toLocaleString()}</td></tr>))}</tbody></table></div></Card>
                )}
            </div>

            <Modal isOpen={isUserModalOpen} onClose={closeUserModal} title={editingUser ? 'Edit User' : 'Invite New User'}><UserForm user={editingUser} roles={roles} onSave={handleSaveUser} onClose={closeUserModal} /></Modal>
            <Modal isOpen={isRoleModalOpen} onClose={closeRoleModal} title={editingRole ? 'Edit Role' : 'Create New Role'}><RoleForm role={editingRole} onSave={handleSaveRole} onClose={closeRoleModal} /></Modal>
            <Modal isOpen={isCountyModalOpen} onClose={closeCountyModal} title={editingCounty ? 'Edit County' : 'Add New County'}><CountyForm county={editingCounty} onSave={handleSaveCounty} onClose={closeCountyModal} /></Modal>
        </div>
    );
};

export default Settings;
