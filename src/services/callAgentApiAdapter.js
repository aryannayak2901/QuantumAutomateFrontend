/**
 * Call Agent API Adapter Service
 * 
 * This service acts as a middleware adapter between our existing AI Calling Service
 * and the Ant Design-based CallAgent component, which expects different API endpoints.
 */

import AICallingService from './aiCallingService';

class CallAgentApiAdapter {
  /**
   * Maps the campaign parameter and fetches calls
   */
  async fetchCalls(campaignId = null) {
    try {
      // We'll use the existing getCallLogs method but add filtering if needed
      const response = await AICallingService.getCallLogs();
      let calls = response.calls || [];
      
      // Apply campaign filter if provided
      if (campaignId) {
        calls = calls.filter(call => call.campaign_id === campaignId);
      }
      
      // Transform the data format if needed to match what CallAgent expects
      return calls.map(call => ({
        id: call.id,
        call_sid: call.call_sid,
        phone_number: call.lead_phone,
        status: call.status,
        direction: call.direction,
        duration: call.duration,
        recording_url: call.recording_url,
        call_start_time: call.call_start_time,
        call_end_time: call.call_end_time,
        created_at: call.created_at,
        has_transcription: call.has_transcription,
        has_insights: call.has_insights,
        notes: call.notes
      }));
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
