import { toast } from 'react-toastify';

class TaskService {
constructor() {
    this.apperClient = null;
    this.isInitializing = false;
    this.initializeClient();
  }

  async initializeClient(retryCount = 0, maxRetries = 5) {
    if (this.apperClient || this.isInitializing) return;
    
    this.isInitializing = true;
    
    try {
      if (window.ApperSDK) {
        const { ApperClient } = window.ApperSDK;
        this.apperClient = new ApperClient({
          apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
          apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
        });
        this.isInitializing = false;
        return;
      }
      
      // If SDK not available and we haven't exceeded retries, wait and try again
      if (retryCount < maxRetries) {
        const delay = Math.pow(2, retryCount) * 100; // Exponential backoff
        setTimeout(() => {
          this.isInitializing = false;
          this.initializeClient(retryCount + 1, maxRetries);
        }, delay);
      } else {
        this.isInitializing = false;
        console.error('ApperSDK not available after maximum retries');
      }
    } catch (error) {
      this.isInitializing = false;
      console.error('Error initializing ApperClient:', error);
    }
  }

async getAll() {
    try {
      if (!this.apperClient) {
        await this.initializeClient();
        if (!this.apperClient) {
          throw new Error('ApperClient not initialized. Please ensure ApperSDK is loaded.');
        }
      }
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } },
          { field: { Name: "title" } },
          { field: { Name: "completed" } },
          { field: { Name: "priority" } },
          { field: { Name: "due_date" } },
          { field: { Name: "order" } },
          { field: { Name: "points" } },
          { field: { Name: "created_at" } }
        ],
        orderBy: [
          { fieldName: "order", sorttype: "ASC" }
        ]
      };

      const response = await this.apperClient.fetchRecords('task', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error('Error fetching tasks:', error);
      toast.error('Failed to load tasks');
      return [];
    }
  }

async getById(id) {
    try {
      if (!this.apperClient) {
        await this.initializeClient();
        if (!this.apperClient) {
          throw new Error('ApperClient not initialized. Please ensure ApperSDK is loaded.');
        }
      }
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } },
          { field: { Name: "title" } },
          { field: { Name: "completed" } },
          { field: { Name: "priority" } },
          { field: { Name: "due_date" } },
          { field: { Name: "order" } },
          { field: { Name: "points" } },
          { field: { Name: "created_at" } }
        ]
      };

      const response = await this.apperClient.getRecordById('task', parseInt(id), params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      return response.data;
    } catch (error) {
      console.error(`Error fetching task with ID ${id}:`, error);
      toast.error('Failed to load task');
      return null;
    }
  }

  async create(taskData) {
try {
      if (!this.apperClient) {
        await this.initializeClient();
        if (!this.apperClient) {
          throw new Error('ApperClient not initialized. Please ensure ApperSDK is loaded.');
        }
      }
      
      const params = {
        records: [{
          Name: taskData.Name || taskData.title || '',
          Tags: taskData.Tags || '',
          title: taskData.title || '',
          completed: false,
          priority: taskData.priority || 'medium',
          due_date: taskData.due_date || taskData.dueDate || null,
          order: taskData.order || 0,
          points: taskData.points || 5,
          created_at: new Date().toISOString()
        }]
      };

      const response = await this.apperClient.createRecord('task', params);
      
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
      if (!this.apperClient) {
        await this.initializeClient();
        if (!this.apperClient) {
          throw new Error('ApperClient not initialized. Please ensure ApperSDK is loaded.');
        }
      }
      const updateData = {
        Id: parseInt(id)
      };

      // Only include updateable fields
      if (updates.Name !== undefined) updateData.Name = updates.Name;
      if (updates.Tags !== undefined) updateData.Tags = updates.Tags;
      if (updates.title !== undefined) updateData.title = updates.title;
      if (updates.completed !== undefined) updateData.completed = updates.completed;
      if (updates.priority !== undefined) updateData.priority = updates.priority;
      if (updates.due_date !== undefined) updateData.due_date = updates.due_date;
      if (updates.order !== undefined) updateData.order = updates.order;
      if (updates.points !== undefined) updateData.points = updates.points;

      const params = {
        records: [updateData]
      };

      const response = await this.apperClient.updateRecord('task', params);
      
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
      console.error('Error updating task:', error);
      toast.error('Failed to update task');
      throw error;
    }
  }

  async delete(id) {
try {
      if (!this.apperClient) {
        await this.initializeClient();
        if (!this.apperClient) {
          throw new Error('ApperClient not initialized. Please ensure ApperSDK is loaded.');
        }
      }
      
      const params = {
        RecordIds: [parseInt(id)]
      };

      const response = await this.apperClient.deleteRecord('task', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return false;
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
      console.error('Error deleting task:', error);
      toast.error('Failed to delete task');
      return false;
    }
  }

async getByPriority(priority) {
    try {
      if (!this.apperClient) {
        await this.initializeClient();
        if (!this.apperClient) {
          throw new Error('ApperClient not initialized. Please ensure ApperSDK is loaded.');
        }
      }
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } },
          { field: { Name: "title" } },
          { field: { Name: "completed" } },
          { field: { Name: "priority" } },
          { field: { Name: "due_date" } },
          { field: { Name: "order" } },
          { field: { Name: "points" } },
          { field: { Name: "created_at" } }
        ],
        where: [
          {
            FieldName: "priority",
            Operator: "EqualTo",
            Values: [priority]
          }
        ],
        orderBy: [
          { fieldName: "order", sorttype: "ASC" }
        ]
      };

      const response = await this.apperClient.fetchRecords('task', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error('Error fetching tasks by priority:', error);
      toast.error('Failed to load tasks');
      return [];
    }
  }

async getCompleted() {
    try {
      if (!this.apperClient) {
        await this.initializeClient();
        if (!this.apperClient) {
          throw new Error('ApperClient not initialized. Please ensure ApperSDK is loaded.');
        }
      }
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } },
          { field: { Name: "title" } },
          { field: { Name: "completed" } },
          { field: { Name: "priority" } },
          { field: { Name: "due_date" } },
          { field: { Name: "order" } },
          { field: { Name: "points" } },
          { field: { Name: "created_at" } }
        ],
        where: [
          {
            FieldName: "completed",
            Operator: "EqualTo",
            Values: [true]
          }
        ],
        orderBy: [
          { fieldName: "order", sorttype: "ASC" }
        ]
      };

      const response = await this.apperClient.fetchRecords('task', params);
      
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
      if (!this.apperClient) {
        await this.initializeClient();
        if (!this.apperClient) {
          throw new Error('ApperClient not initialized. Please ensure ApperSDK is loaded.');
        }
      }
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } },
          { field: { Name: "title" } },
          { field: { Name: "completed" } },
          { field: { Name: "priority" } },
          { field: { Name: "due_date" } },
          { field: { Name: "order" } },
          { field: { Name: "points" } },
          { field: { Name: "created_at" } }
        ],
        where: [
          {
            FieldName: "completed",
            Operator: "EqualTo",
            Values: [false]
          }
        ],
        orderBy: [
          { fieldName: "order", sorttype: "ASC" }
        ]
      };

      const response = await this.apperClient.fetchRecords('task', params);
      
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
      if (!this.apperClient) {
        await this.initializeClient();
        if (!this.apperClient) {
          throw new Error('ApperClient not initialized. Please ensure ApperSDK is loaded.');
        }
      }
      
      const today = new Date().toISOString().split('T')[0];
      
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } },
          { field: { Name: "title" } },
          { field: { Name: "completed" } },
          { field: { Name: "priority" } },
          { field: { Name: "due_date" } },
          { field: { Name: "order" } },
          { field: { Name: "points" } },
          { field: { Name: "created_at" } }
        ],
        where: [
          {
            FieldName: "due_date",
            Operator: "EqualTo",
            Values: [today]
          }
        ],
        orderBy: [
          { fieldName: "order", sorttype: "ASC" }
        ]
      };

      const response = await this.apperClient.fetchRecords('task', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error('Error fetching today tasks:', error);
      toast.error('Failed to load today tasks');
      return [];
    }
  }

async reorderTasks(taskIds) {
    try {
      if (!this.apperClient) {
        await this.initializeClient();
        if (!this.apperClient) {
          throw new Error('ApperClient not initialized. Please ensure ApperSDK is loaded.');
        }
      }
      const records = taskIds.map((id, index) => ({
        Id: parseInt(id),
        order: index
      }));

      const params = {
        records: records
      };

      const response = await this.apperClient.updateRecord('task', params);
      
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

export default new TaskService();