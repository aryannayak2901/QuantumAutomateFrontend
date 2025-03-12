import API from '../api';

class InstagramService {
    // Fetch Instagram account details
    async getConnectedAccounts() {
        try {
            const response = await API.get('instagram/accounts/');
            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    // Connect new Instagram account
    async connectAccount(accessToken) {
        try {
            const response = await API.post('instagram/connect/', { access_token: accessToken });
            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    // Fetch comments for monitoring
    async getComments(accountId, postId) {
        try {
            const response = await API.get(`instagram/comments/${accountId}/${postId}/`);
            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    // Send automated DM
    async sendAutomatedDM(userId, message) {
        try {
            const response = await API.post('instagram/send-dm/', {
                user_id: userId,
                message: message
            });
            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    // Get lead analytics
    async getLeadAnalytics(accountId, dateRange) {
        try {
            const response = await API.get('instagram/analytics/', {
                params: {
                    account_id: accountId,
                    start_date: dateRange.startDate,
                    end_date: dateRange.endDate
                }
            });
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

export default new InstagramService(); 