import api from '@/lib/api/axios';
import { BackendResponse } from '@/types/api';

export interface Team {
    id: string;
    name: string;
    role: 'OWNER' | 'EDITOR' | 'VIEWER';
    // membersCount: number; // Backend doesn't return this yet, optional enhancement
    projects?: any[];
}

export interface TeamMember {
    id: string;
    email: string;
    name: string | null;
    role: 'OWNER' | 'EDITOR' | 'VIEWER';
}

export const teamsApi = {
    list: async () => {
        const { data } = await api.get<BackendResponse<Team[]>>('/teams');
        // Backend returns wrapped response, so we need data.data
        return data.data;
    },

    create: async (name: string) => {
        const { data } = await api.post<BackendResponse<Team>>('/teams', { name });
        return data.data;
    },

    getMembers: async (teamId: string) => {
        const { data } = await api.get<BackendResponse<TeamMember[]>>(`/teams/${teamId}/members`);
        return data.data;
    },

    inviteMember: async (teamId: string, email: string, role: TeamMember['role'] = 'VIEWER') => {
        const { data } = await api.post<BackendResponse<any>>(`/teams/${teamId}/members`, { email, role });
        return data.data;
    }
};
