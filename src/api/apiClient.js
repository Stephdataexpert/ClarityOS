// src/api/apiClient.js
// Minimal local replacement for Base44

// Simulated storage for users and briefs
let userData = {
  briefs_count: 0,
  subscription: 'free', // can be 'pro'
};

let briefs = []; // array to store briefs

export const apiClient = {
  auth: {
    me: async () => {
      // Simulate API delay
      await new Promise(res => setTimeout(res, 200));
      return userData;
    },
    updateMe: async (update) => {
      userData = { ...userData, ...update };
      return userData;
    },
  },

  entities: {
    Brief: {
      list: async (sort = '-created_date', limit = 50) => {
        // Simulate fetching latest briefs
        const sorted = [...briefs].sort((a, b) => new Date(b.created_date) - new Date(a.created_date));
        return sorted.slice(0, limit);
      },
      create: async (briefData) => {
        const newBrief = {
          id: (Math.random() * 1000000).toFixed(0),
          created_date: new Date().toISOString(),
          ...briefData,
        };
        briefs.push(newBrief);
        return newBrief;
      },
    },
  },

  integrations: {
    Core: {
      UploadFile: async ({ file }) => {
        // Simulate file upload and return a fake URL
        await new Promise(res => setTimeout(res, 300));
        return { file_url: URL.createObjectURL(file) };
      },
      ExtractDataFromUploadedFile: async ({ file_url, json_schema }) => {
        // Return a dummy content for uploaded file
        await new Promise(res => setTimeout(res, 300));
        return { status: 'success', output: { content: 'Extracted text from uploaded file.' } };
      },
      InvokeLLM: async ({ prompt, response_json_schema }) => {
        // Simulate LLM generation with dummy data
        await new Promise(res => setTimeout(res, 1000));
        return {
          executive_summary: ['Point 1', 'Point 2', 'Point 3'],
          key_decisions: [
            { decision: 'Decision A', options: ['Yes', 'No'] },
            { decision: 'Decision B', options: ['Option 1', 'Option 2'] }
          ],
          recommended_actions: [
            { action: 'Action 1', owner: 'Alice', priority: 'high' },
            { action: 'Action 2', owner: 'Bob', priority: 'medium' }
          ],
          risks_blindspots: ['Risk 1', 'Blind spot 2'],
          delegation_suggestions: [
            { task: 'Task A', delegate_to: 'Charlie', reason: 'Expert in area' }
          ]
        };
      },
    },
  },
};
