import API from '../api';

class CRMService {
    // Lead Management
    async getLeads(filters = {}) {
        try {
            const response = await API.get('crm/leads/', { params: filters });
            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    async createLead(leadData) {
        try {
            const response = await API.post('crm/leads/', leadData);
            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    async updateLead(leadId, leadData) {
        try {
            const response = await API.put(`crm/leads/${leadId}/`, leadData);
            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    // Campaign Management
    async getCampaigns() {
        try {
            const response = await API.get('crm/campaigns/');
            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    async createCampaign(campaignData) {
        try {
            const response = await API.post('crm/campaigns/', campaignData);
            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    async getCampaignAnalytics(campaignId) {
        try {
            const response = await API.get(`crm/campaigns/${campaignId}/analytics/`);
            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    // Team Management
    async getTeamMembers() {
        try {
            const response = await API.get('crm/team/');
            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    async inviteTeamMember(email, role) {
        try {
            const response = await API.post('crm/team/invite/', { email, role });
            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    // Task Management
    async getTasks(filters = {}) {
        try {
            const response = await API.get('crm/tasks/', { params: filters });
            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    async createTask(taskData) {
        try {
            const response = await API.post('crm/tasks/', taskData);
            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    // Error handling
    handleError(error) {
        return {
            message: error.response?.data?.message || 'An error occurred',
            status: error.response?.status || 500
        };
    }
}

export default new CRMService(); 