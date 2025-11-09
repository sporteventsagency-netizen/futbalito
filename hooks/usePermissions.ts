
import { useMemo, useCallback } from 'react';
import { useCompetitions } from '../context/CompetitionContext.tsx';
import type { Permission, Role, User } from '../types.ts';

interface UsePermissionsReturn {
    currentUser: User | null;
    currentRole: Role | null;
    hasPermission: (permission: Permission) => boolean;
}

const usePermissions = (): UsePermissionsReturn => {
    const { currentUser, roles } = useCompetitions();

    const currentRole = useMemo(() => {
        if (!currentUser) return null;
        return roles.find(role => role.id === currentUser.roleId) || null;
    }, [currentUser, roles]);

    const hasPermission = useCallback((permission: Permission): boolean => {
        if (!currentRole) return false;
        return currentRole.permissions.includes(permission);
    }, [currentRole]);

    return { currentUser, currentRole, hasPermission };
};

export default usePermissions;
