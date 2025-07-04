import { toast } from "react-toastify";
class TaskService {
  constructor() {
    this.apperClient = null;
  }

  async initializeClient() {
    try {
      // Check if ApperSDK is available
      if (!window.ApperSDK) {
        throw new Error('ApperSDK is not loaded yet');
      }
      
      const { ApperClient } = window.ApperSDK;
      this.apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
    } catch (error) {
      console.error('Failed to initialize ApperClient:', error);
      this.apperClient = null;
    }
  }

  async ensureClient() {
    if (!this.apperClient) {
      // Check if SDK is available before attempting initialization
      if (!window.ApperSDK) {
        console.error('ApperSDK is not available. Make sure the SDK script is loaded.');
        return null;
      }
      await this.initializeClient();
    }
    return this.apperClient;
  }
async getAll() {
    try {
      // Pre-flight checks for better diagnostics
      if (!window.ApperSDK) {
        console.error('ApperSDK not loaded - script tag may be missing or failed to load');
        toast.error('Application not properly initialized. Please refresh the page.');
        return [];
      }

      const client = await this.ensureClient();
      if (!client) {
        console.error('ApperClient initialization failed - check environment variables and SDK status');
        toast.error('Database connection not available. Please check your connection and refresh.');
        return [];
      }

      // Validate environment variables are available
      if (!import.meta.env.VITE_APPER_PROJECT_ID || !import.meta.env.VITE_APPER_PUBLIC_KEY) {
        console.error('Missing required environment variables: VITE_APPER_PROJECT_ID or VITE_APPER_PUBLIC_KEY');
        toast.error('Application configuration error. Please contact support.');
        return [];
      }

      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "title" } },
          { field: { Name: "completed" } },
          { field: { Name: "priority" } },
          { field: { Name: "due_date" } },
          { field: { Name: "order" } },
          { field: { Name: "points" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } },
          { field: { Name: "CreatedOn" } },
          { field: { Name: "created_at" } }
        ],
        orderBy: [
          {
            fieldName: "order",
            sorttype: "ASC"
          }
        ],
        pagingInfo: {
          limit: 100,
          offset: 0
        }
      };

      console.log('Fetching tasks from database...');
      
      // Add timeout wrapper for the API call
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Request timeout after 30 seconds')), 30000)
      );
      
      const fetchPromise = client.fetchRecords('task', params);
      const response = await Promise.race([fetchPromise, timeoutPromise]);
      
      if (!response.success) {
        console.error('API request failed:', response.message);
        toast.error(response.message || 'Failed to load tasks from database');
        return [];
      }

      console.log(`Successfully fetched ${response.data?.length || 0} tasks`);

      // Handle empty or non-existent data
      if (!response.data || response.data.length === 0) {
        console.log('No tasks found in database');
        return [];
      }

      return response.data;
    } catch (error) {
      // Enhanced error logging with more context
      console.error('Error fetching tasks:', {
        message: error.message,
        name: error.name,
        sdkAvailable: !!window.ApperSDK,
        envVarsPresent: {
          projectId: !!import.meta.env.VITE_APPER_PROJECT_ID,
          publicKey: !!import.meta.env.VITE_APPER_PUBLIC_KEY
        }
      });
      
      // Provide more specific error messages based on error type
      if (error.message.includes('timeout')) {
        toast.error('Request timed out. Please check your connection and try again.');
      } else if (error.message.includes('network') || error.message.includes('fetch')) {
        toast.error('Network error. Please check your internet connection.');
      } else {
        toast.error('Failed to load tasks. Please try again.');
      }
      
      return [];
    }
  }
async getById(id) {
    try {
      const client = await this.ensureClient();
      if (!client) throw new Error('ApperClient not initialized');

      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "title" } },
          { field: { Name: "completed" } },
          { field: { Name: "priority" } },
          { field: { Name: "due_date" } },
          { field: { Name: "order" } },
          { field: { Name: "points" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } },
          { field: { Name: "CreatedOn" } },
          { field: { Name: "created_at" } }
        ]
      };

      const response = await client.getRecordById('task', id, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      return response.data;
    } catch (error) {
      console.error(`Error fetching task with ID ${id}:`, error);
      const { toast } = await import('react-toastify');
      toast.error('Failed to load task');
      return null;
    }
  }

async create(taskData) {
    try {
      const client = await this.ensureClient();
      if (!client) throw new Error('ApperClient not initialized');

      // Only include Updateable fields for creation
      const filteredData = {
        Name: taskData.Name || taskData.title || 'Untitled Task',
        title: taskData.title || taskData.Name || 'Untitled Task',
        completed: taskData.completed || false,
        priority: taskData.priority || 'medium',
        due_date: taskData.due_date || null,
        order: taskData.order || 0,
        points: taskData.points || 1,
        Tags: taskData.Tags || '',
        Owner: taskData.Owner || null,
        created_at: new Date().toISOString()
      };

      const params = {
        records: [filteredData]
      };

const response = await client.createRecord('task', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error(response.message);
      }
      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successfulRecords.length > 0) {
          toast.success('Task created successfully');
          return successfulRecords[0].data;
        }
      }

throw new Error('Failed to create task');
    } catch (error) {
      console.error('Error creating task:', error);
      toast.error('Failed to create task');
      throw error;
    }
  }

async update(id, updates) {
    try {
      const client = await this.ensureClient();
      if (!client) throw new Error('ApperClient not initialized');

      // Only include Updateable fields for update
      const filteredUpdates = {};
      const updateableFields = ['Name', 'title', 'completed', 'priority', 'due_date', 'order', 'points', 'Tags', 'Owner', 'created_at'];
      
      Object.keys(updates).forEach(key => {
        if (updateableFields.includes(key)) {
          filteredUpdates[key] = updates[key];
        }
      });

      const params = {
        records: [
          {
            Id: id,
            ...filteredUpdates
          }
        ]
      };

      const response = await client.updateRecord('task', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);
        
        if (failedUpdates.length > 0) {
          console.error(`Failed to update ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`);
          
          failedUpdates.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }
        
if (successfulUpdates.length > 0) {
          toast.success('Task updated successfully');
          return successfulUpdates[0].data;
        }
      }

      throw new Error('Failed to update task');
throw new Error('Failed to update task');
    } catch (error) {
      console.error(`Error updating task with ID ${id}:`, error);
      toast.error('Failed to update task');
    }
  }

  async delete(id) {
    try {
      const client = await this.ensureClient();
      if (!client) throw new Error('ApperClient not initialized');

      const params = {
        RecordIds: [id]
      };

      const response = await client.deleteRecord('task', params);
      
      if (!response.success) {
console.error(response.message);
        toast.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successfulDeletions = response.results.filter(result => result.success);
        const failedDeletions = response.results.filter(result => !result.success);
        
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`);
          
          failedDeletions.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successfulDeletions.length > 0) {
          toast.success('Task deleted successfully');
          return true;
        }
      }

      return false;
    } catch (error) {
      console.error(`Error deleting task with ID ${id}:`, error);
      toast.error('Failed to delete task');
      throw error;
    }
  }

  async getByPriority(priority) {
    try {
      const client = await this.ensureClient();
      if (!client) throw new Error('ApperClient not initialized');

      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "title" } },
          { field: { Name: "completed" } },
          { field: { Name: "priority" } },
          { field: { Name: "due_date" } },
          { field: { Name: "order" } },
          { field: { Name: "points" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } }
        ],
        where: [
          {
            FieldName: "priority",
            Operator: "EqualTo",
            Values: [priority]
          }
        ],
        orderBy: [
          {
            fieldName: "order",
            sorttype: "ASC"
          }
        ]
      };

      const response = await client.fetchRecords('task', params);
      
if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error(`Error fetching tasks by priority ${priority}:`, error);
      toast.error('Failed to load tasks');
      return [];
    }
  }

async getCompleted() {
    try {
      const client = await this.ensureClient();
      if (!client) throw new Error('ApperClient not initialized');

      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "title" } },
          { field: { Name: "completed" } },
          { field: { Name: "priority" } },
          { field: { Name: "due_date" } },
          { field: { Name: "order" } },
          { field: { Name: "points" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } }
        ],
        where: [
          {
            FieldName: "completed",
            Operator: "EqualTo",
            Values: [true]
          }
        ]
      };

      const response = await client.fetchRecords('task', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      return response.data || [];
} catch (error) {
      console.error('Error fetching completed tasks:', error);
      toast.error('Failed to load completed tasks');
      return [];
    }
  }

  async getPending() {
    try {
      const client = await this.ensureClient();
      if (!client) throw new Error('ApperClient not initialized');

      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "title" } },
          { field: { Name: "completed" } },
          { field: { Name: "priority" } },
          { field: { Name: "due_date" } },
          { field: { Name: "order" } },
          { field: { Name: "points" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } }
        ],
        where: [
          {
            FieldName: "completed",
            Operator: "EqualTo",
            Values: [false]
          }
        ]
      };

      const response = await client.fetchRecords('task', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error('Error fetching pending tasks:', error);
      toast.error('Failed to load pending tasks');
      return [];
    }
  }

async getTodayTasks() {
    try {
      const client = await this.ensureClient();
      if (!client) throw new Error('ApperClient not initialized');

      const today = new Date().toISOString().split('T')[0];

      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "title" } },
          { field: { Name: "completed" } },
          { field: { Name: "priority" } },
          { field: { Name: "due_date" } },
          { field: { Name: "order" } },
          { field: { Name: "points" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } }
        ],
        where: [
          {
            FieldName: "due_date",
            Operator: "EqualTo",
            Values: [today]
          }
        ]
      };

      const response = await client.fetchRecords('task', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      return response.data || [];
} catch (error) {
      console.error('Error fetching today\'s tasks:', error);
      toast.error('Failed to load today\'s tasks');
      return [];
    }
  }

async reorderTasks(taskIds) {
    try {
      const client = await this.ensureClient();
      if (!client) throw new Error('ApperClient not initialized');

      const records = taskIds.map((id, index) => ({
        Id: id,
        order: index
      }));

      const params = {
        records: records
      };

      const response = await client.updateRecord('task', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return false;
      }

      if (response.results) {
        const failedUpdates = response.results.filter(result => !result.success);
        
        if (failedUpdates.length > 0) {
          console.error(`Failed to reorder ${failedUpdates.length} tasks:${JSON.stringify(failedUpdates)}`);
          toast.error('Some tasks could not be reordered');
          return false;
        }
        
        toast.success('Tasks reordered successfully');
        return true;
      }

return false;
    } catch (error) {
      console.error('Error reordering tasks:', error);
      toast.error('Failed to reorder tasks');
      return false;
    }
  }
}

// Export singleton instance
const taskService = new TaskService();
export default taskService;