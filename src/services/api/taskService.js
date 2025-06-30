import { toast } from "react-toastify";
class TaskService {
  constructor() {
    this.apperClient = null;
    this.initializeClient();
  }

  async initializeClient() {
    try {
      const { ApperClient } = window.ApperSDK;
      this.apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
    } catch (error) {
      console.error('Failed to initialize ApperClient:', error);
    }
  }

  async ensureClient() {
    if (!this.apperClient) {
      await this.initializeClient();
    }
    return this.apperClient;
  }

async getAll() {
    try {
      const client = await this.ensureClient();
      if (!client) {
        console.error('ApperClient not initialized');
        const { toast } = await import('react-toastify');
        toast.error('Failed to initialize database connection');
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

      const response = await client.fetchRecords('task', params);
      
      // Validate response exists before checking success
      if (!response) {
        console.error('No response received from server');
        const { toast } = await import('react-toastify');
        toast.error('Failed to connect to server');
        return [];
      }
      
      if (!response.success) {
        console.error(response.message || 'Unknown error occurred');
        const { toast } = await import('react-toastify');
        toast.error(response.message || 'Failed to load tasks');
        return [];
      }

      // Handle empty or non-existent data
      if (!response.data || response.data.length === 0) {
        return [];
      }

      return response.data;
    } catch (error) {
      console.error('Error fetching tasks:', error);
      const { toast } = await import('react-toastify');
      toast.error('Failed to load tasks');
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
        const { toast } = await import('react-toastify');
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
    } catch (error) {
      console.error(`Error updating task with ID ${id}:`, error);
      toast.error('Failed to update task');
      throw error;
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
      const { toast } = await import('react-toastify');
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
        const { toast } = await import('react-toastify');
        toast.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error('Error fetching today\'s tasks:', error);
      const { toast } = await import('react-toastify');
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
        const { toast } = await import('react-toastify');
        toast.error(response.message);
        return false;
      }

      if (response.results) {
        const failedUpdates = response.results.filter(result => !result.success);
        
        if (failedUpdates.length > 0) {
          console.error(`Failed to reorder ${failedUpdates.length} tasks:${JSON.stringify(failedUpdates)}`);
          const { toast } = await import('react-toastify');
          toast.error('Some tasks could not be reordered');
          return false;
        }
        
        const { toast } = await import('react-toastify');
        toast.success('Tasks reordered successfully');
        return true;
      }

      return false;
    } catch (error) {
      console.error('Error reordering tasks:', error);
      const { toast } = await import('react-toastify');
      toast.error('Failed to reorder tasks');
      return false;
}
  }
}

// Export singleton instance
const taskService = new TaskService();
export default taskService;