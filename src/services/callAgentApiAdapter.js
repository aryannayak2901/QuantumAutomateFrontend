/**
 * Call Agent API Adapter Service
 * 
 * This service acts as a middleware adapter between our existing AI Calling Service
 * and the Ant Design-based CallAgent component, which expects different API endpoints.
 */

// import AICallingService from './aiCallingService';

class CallAgentApiAdapter {
  /**
   * Maps the campaign parameter and fetches call sessions
   */
  async fetchCalls(campaignId = null) {
    try {
      // Get call sessions from the backend
      const calls = await AICallingService.getCallSessions();
      
      // Apply campaign filter if provided
      let filteredCalls = calls;
      if (campaignId) {
        filteredCalls = calls.filter(call => call.call_data?.campaign_id === campaignId);
      }
      
      // Transform the data format to match what CallAgent expects
      return filteredCalls.map(call => ({
        id: call.id,
        call_sid: call.call_sid,
        lead_id: call.lead_id,
        script_id: call.script?.id,
        script_name: call.script?.name,
        status: call.status,
        duration: call.duration,
        recording_url: call.recording_url,
        started_at: call.started_at,
        ended_at: call.ended_at,
        appointment_scheduled: call.appointment_scheduled,
        appointment_datetime: call.appointment_datetime,
        call_data: call.call_data,
        transcript: call.transcript,
        created_at: call.started_at
      }))
    } catch (error) {
      console.error('Error in fetchCalls adapter:', error);
      throw error;
    }
  }

  /**
   * Fetches and formats scripts
   */
  async fetchScripts() {
    try {
      const scripts = await AICallingService.getCallScripts();
      
      // Transform the data to match what CallAgent expects
      return scripts.map(script => ({
        id: script.id,
        name: script.name,
        description: script.description || '',
        content: script.content,
        created_at: script.created_at,
        updated_at: script.updated_at
      }));
    } catch (error) {
      console.error('Error in fetchScripts adapter:', error);
      throw error;
    }
  }

  /**
   * Saves a script through the AI Calling Service
   */
  async saveScript(scriptData) {
    try {
      return await AICallingService.saveCallScript(scriptData);
    } catch (error) {
      console.error('Error in saveScript adapter:', error);
      throw error;
    }
  }

  /**
   * Initiates a call through the AI Calling Service
   */
  async makeCall(phoneNumber, scriptId, options = {}) {
    try {
      return await AICallingService.makeCall(phoneNumber, scriptId);
    } catch (error) {
      console.error('Error in makeCall adapter:', error);
      throw error;
    }
  }

  /**
   * Fetches campaigns if supported
   */
  async fetchCampaigns() {
    // This is a placeholder for future implementation
    // Current AICallingService doesn't have this endpoint
    return [];
  }

  /**
   * Fetches leads if supported
   */
  async fetchLeads() {
    // This is a placeholder for future implementation
    // Current AICallingService doesn't have this endpoint
    return [];
  }

  /**
   * Gets call analytics with date filtering
   */
  async getCallAnalytics(dateRange) {
    try {
      return await AICallingService.getCallAnalytics(dateRange);
    } catch (error) {
      console.error('Error in getCallAnalytics adapter:', error);
      throw error;
    }
  }
}

export default new CallAgentApiAdapter();
