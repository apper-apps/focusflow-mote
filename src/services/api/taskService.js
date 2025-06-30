import tasksData from '@/services/mockData/tasks.json';

class TaskService {
  constructor() {
    this.tasks = [...tasksData];
  }

  async getAll() {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    return [...this.tasks];
  }

  async getById(id) {
    await new Promise(resolve => setTimeout(resolve, 200));
    const task = this.tasks.find(task => task.Id === id);
    if (!task) {
      throw new Error('Task not found');
    }
    return { ...task };
  }

  async create(taskData) {
    await new Promise(resolve => setTimeout(resolve, 250));
    
    const newTask = {
      Id: Math.max(...this.tasks.map(t => t.Id), 0) + 1,
      ...taskData,
      completed: false,
      createdAt: new Date().toISOString()
    };
    
    this.tasks.push(newTask);
    return { ...newTask };
  }

  async update(id, updates) {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const taskIndex = this.tasks.findIndex(task => task.Id === id);
    if (taskIndex === -1) {
      throw new Error('Task not found');
    }
    
    this.tasks[taskIndex] = {
      ...this.tasks[taskIndex],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    
    return { ...this.tasks[taskIndex] };
  }

  async delete(id) {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const taskIndex = this.tasks.findIndex(task => task.Id === id);
    if (taskIndex === -1) {
      throw new Error('Task not found');
    }
    
    this.tasks.splice(taskIndex, 1);
    return true;
  }

  async getByPriority(priority) {
    await new Promise(resolve => setTimeout(resolve, 200));
    return this.tasks.filter(task => task.priority === priority);
  }

  async getCompleted() {
    await new Promise(resolve => setTimeout(resolve, 200));
    return this.tasks.filter(task => task.completed);
  }

  async getPending() {
    await new Promise(resolve => setTimeout(resolve, 200));
    return this.tasks.filter(task => !task.completed);
  }

  async getTodayTasks() {
    await new Promise(resolve => setTimeout(resolve, 200));
    const today = new Date().toISOString().split('T')[0];
    return this.tasks.filter(task => 
      task.dueDate && task.dueDate.startsWith(today)
    );
  }

  async reorderTasks(taskIds) {
    await new Promise(resolve => setTimeout(resolve, 250));
    
    taskIds.forEach((id, index) => {
      const task = this.tasks.find(t => t.Id === id);
      if (task) {
        task.order = index;
      }
    });
    
    return true;
  }
}

export default new TaskService();