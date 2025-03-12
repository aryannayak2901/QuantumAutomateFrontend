import API from '../api';

class AICallingService {
    // Initialize call flow
    async initializeCallFlow(flowConfig) {
        try {
            const response = await API.post('ai-calling/initialize/', flowConfig);
            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    // Make outbound call
    async makeCall(phoneNumber, scriptId) {
        try {
            const response = await API.post('ai-calling/make-call/', {
                phone_number: phoneNumber,
                script_id: scriptId
            });
            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    // Get call scripts
    async getCallScripts() {
        try {
            const response = await API.get('ai-calling/scripts/');
            return response.data;
        } catch (error) {
            console.warn('Call scripts API endpoint not available, using mock data');
            // Return mock data when API endpoint is not available
            return [
                {
                    id: 'script-1',
                    name: 'Default Sales Script',
                    description: 'A general script for sales calls',
                    content: 'Hello, my name is [Agent Name] calling from [Company Name]. We provide services that can help your business grow. Would you be interested in learning more about our offerings?'
                },
                {
                    id: 'script-2',
                    name: 'Appointment Scheduling',
                    description: 'Script for scheduling appointments',
                    content: 'Hello, this is [Agent Name] from [Company Name]. I am calling to schedule an appointment to discuss our new services. Would you be available sometime this week?'
                },
                {
                    id: 'script-3',
                    name: 'Customer Follow-up',
                    description: 'Script for following up with existing customers',
                    content: 'Hello, this is [Agent Name] from [Company Name]. I wanted to follow up on our previous conversation and see if you have any questions about our services.'
                }
            ];
        }
    }

    // Save call script
    async saveCallScript(scriptData) {
        try {
            const response = await API.post('ai-calling/scripts/', scriptData);
            return response.data;
        } catch (error) {
            if (error.response && error.response.status === 404) {
                console.warn('Save script endpoint not available, returning mock response');
                // Return a mock success response for development
                return {
                    id: `mock-script-${Date.now()}`,
                    ...scriptData,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                };
            }
            throw this.handleError(error);
        }
    }

    // Update call script
    async updateCallScript(scriptId, scriptData) {
        try {
            const response = await API.put(`ai-calling/scripts/${scriptId}/`, scriptData);
            return response.data;
        } catch (error) {
            if (error.response && error.response.status === 404) {
                console.warn('Update script endpoint not available, returning mock response');
                // Return a mock success response for development
                return {
                    id: scriptId,
                    ...scriptData,
                    updated_at: new Date().toISOString()
                };
            }
            throw this.handleError(error);
        }
    }

    // Get call analytics
    async getCallAnalytics(dateRange) {
        try {
            const response = await API.get('ai-calling/analytics/', {
                params: {
                    start_date: dateRange.startDate,
                    end_date: dateRange.endDate
                }
            });
            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    // Schedule call
    async scheduleCall(scheduleData) {
        try {
            const response = await API.post('api/calls/schedule/', scheduleData);
            return response.data;
        } catch (error) {
            if (error.response && error.response.status === 404) {
                console.warn('Schedule call endpoint not available, returning mock response');
                // Return a mock success response for development
                return {
                    id: `mock-${Date.now()}`,
                    status: 'scheduled',
                    scheduled_time: scheduleData.scheduled_time,
                    message: 'Call scheduled successfully (mock)'
                };
            }
            throw this.handleError(error);
        }
    }

    // Get scheduled calls
    async getScheduledCalls() {
        try {
            const response = await API.get('api/calls/schedule/');
            return response.data;
        } catch (error) {
            if (error.response && error.response.status === 404) {
                console.warn('Get scheduled calls endpoint not available, returning mock data');
                // Return mock data for development
                return [
                    {
                        id: 'mock-1',
                        phone_number: '+15551234567',
                        contact_name: 'John Smith',
                        script_id: 'script-1',
                        script_name: 'Real Estate Script',
                        scheduled_time: new Date().toISOString(),
                        status: 'scheduled',
                        notes: 'Interested in 3-bedroom properties'
                    },
                    {
                        id: 'mock-2',
                        phone_number: '+15559876543',
                        contact_name: 'Jane Doe',
                        script_id: 'script-2',
                        script_name: 'Sales Follow-up',
                        scheduled_time: new Date(Date.now() + 86400000).toISOString(),
                        status: 'scheduled',
                        notes: 'Follow up on product demo'
                    }
                ];
            }
            throw this.handleError(error);
        }
    }

    // Update scheduled call
    async updateScheduledCall(callId, scheduleData) {
        try {
            const response = await API.put(`api/calls/schedule/${callId}/`, scheduleData);
            return response.data;
        } catch (error) {
            if (error.response && error.response.status === 404) {
                console.warn('Update scheduled call endpoint not available, returning mock response');
                // Return a mock success response for development
                return {
                    id: callId,
                    status: scheduleData.status || 'scheduled',
                    scheduled_time: scheduleData.scheduled_time,
                    message: 'Call schedule updated successfully (mock)'
                };
            }
            throw this.handleError(error);
        }
    }

    // Delete scheduled call
    async deleteScheduledCall(callId) {
        try {
            const response = await API.delete(`api/calls/schedule/${callId}/`);
            return response.data;
        } catch (error) {
            if (error.response && error.response.status === 404) {
                console.warn('Delete scheduled call endpoint not available, returning mock response');
                // Return a mock success response for development
                return {
                    message: 'Call schedule deleted successfully (mock)'
                };
            }
            throw this.handleError(error);
        }
    }

    // Bulk schedule calls
    async bulkScheduleCalls(callsData) {
        try {
            const response = await API.post('api/calls/schedule/bulk/', { calls: callsData });
            return response.data;
        } catch (error) {
            if (error.response && error.response.status === 404) {
                console.warn('Bulk schedule calls endpoint not available, returning mock response');
                // Return a mock success response for development
                return {
                    message: `Successfully scheduled ${callsData.length} calls (mock)`,
                    scheduled_calls: callsData.length
                };
            }
            throw this.handleError(error);
        }
    }

    // Get call recordings
    async getCallRecordings(callId) {
        try {
            const response = await API.get(`ai-calling/recordings/${callId}/`);
            return response.data;
        } catch (error) {
            if (error.response && error.response.status === 404) {
                console.warn('Call recordings endpoint not available, returning mock data');
                // Return mock data for development
                return [
                    {
                        id: 'mock-recording-1',
                        call_id: callId,
                        url: 'https://example.com/mock-recording.mp3',
                        duration: 180,
                        created_at: new Date().toISOString()
                    }
                ];
            }
            throw this.handleError(error);
        }
    }

    // Get call logs
    async getCallLogs() {
        try {
            const response = await API.get('api/calls/');
            return response.data;
        } catch (error) {
            if (error.response && error.response.status === 404) {
                console.warn('Call logs endpoint not available, returning mock data');
                // Return mock data for development
                return {
                    results: [
                        {
                            id: 'mock-call-1',
                            phone_number: '+15551234567',
                            direction: 'outbound',
                            status: 'completed',
                            duration: 180,
                            created_at: new Date(Date.now() - 86400000).toISOString(),
                            contact_name: 'John Smith',
                            script_name: 'Real Estate Script'
                        },
                        {
                            id: 'mock-call-2',
                            phone_number: '+15559876543',
                            direction: 'outbound',
                            status: 'in-progress',
                            duration: 0,
                            created_at: new Date().toISOString(),
                            contact_name: 'Jane Doe',
                            script_name: 'Sales Follow-up'
                        }
                    ],
                    total_count: 2,
                    page: 1,
                    page_size: 20
                };
            }
            throw this.handleError(error);
        }
    }

    // Get call details
    async getCallDetails(callId) {
        try {
            const response = await API.get(`api/calls/${callId}/`);
            return response.data;
        } catch (error) {
            if (error.response && error.response.status === 404) {
                console.warn('Call details endpoint not available, returning mock data');
                // Return mock data for development
                return {
                    id: callId,
                    phone_number: '+15551234567',
                    direction: 'outbound',
                    status: 'completed',
                    duration: 180,
                    created_at: new Date().toISOString(),
                    contact_name: 'John Smith',
                    script_name: 'Real Estate Script',
                    transcript: 'Hello, this is an AI assistant calling from ABC Realty...',
                    recording_url: 'https://example.com/mock-recording.mp3',
                    insights: {
                        lead_interest_level: 7,
                        sentiment_score: 0.65,
                        key_topics: ['property pricing', 'viewing appointment', 'mortgage options']
                    }
                };
            }
            throw this.handleError(error);
        }
    }

    // Get call transcript
    async getCallTranscript(callId) {
        try {
            const response = await API.get(`calling/logs/${callId}/transcript/`);
            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    // Request transcription
    async requestTranscription(callId) {
        try {
            const response = await API.post(`calling/logs/${callId}/request-transcription/`);
            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    // Get call insights
    async getCallInsights(callId) {
        try {
            const response = await API.get(`calling/logs/${callId}/insights/`);
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
    // Get user phone number
    async getUserPhoneNumber() {
        try {
            const response = await API.get('api/phone-number/');
            return response.data;
        } catch (error) {
            if (error.response && error.response.status === 404) {
                console.warn('Phone number endpoint not available, returning mock data');
                // Return mock data for development
                return {
                    has_number: false
                };
            }
            throw this.handleError(error);
        }
    }

    // Request new phone number
    async requestPhoneNumber(countryCode = 'US') {
        try {
            const response = await API.post('api/phone-number/', { country_code: countryCode });
            return response.data;
        } catch (error) {
            if (error.response && error.response.status === 404) {
                console.warn('Request phone number endpoint not available, returning mock response');
                // Return a mock success response for development
                return {
                    has_number: true,
                    phone_number: '+1234567890',
                    friendly_name: 'QuantumAutomate Business',
                    purchase_date: new Date().toISOString(),
                    monthly_rental: 5.99
                };
            }
            throw this.handleError(error);
        }
    }

    // Get call stats
    async getCallStats(days = 30) {
        try {
            const response = await API.get('api/calls/stats/', {
                params: { days }
            });
            return response.data;
        } catch (error) {
            if (error.response && error.response.status === 404) {
                console.warn('Call stats endpoint not available, returning mock data');
                // Return mock data for development
                return {
                    total_calls: 45,
                    outbound_calls: 30,
                    inbound_calls: 15,
                    completed_calls: 38,
                    failed_calls: 7,
                    avg_duration: 184.5,
                    avg_interest_level: 6.8,
                    avg_sentiment_score: 0.65,
                    time_period: `${days} days`
                };
            }
            throw this.handleError(error);
        }
    }
}

export default new AICallingService(); 