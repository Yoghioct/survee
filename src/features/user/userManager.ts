import axios from 'axios';

export interface Company {
  id: string;
  name: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'ADMIN' | 'USER';
  companyId?: string;
  company?: {
    id: string;
    name: string;
  };
  createdAt: string;
  updatedAt: string;
  image?: string;
}

export interface CreateUserData {
  name: string;
  email: string;
  password: string;
  role?: 'ADMIN' | 'USER';
  companyId?: string;
}

export interface UpdateUserData {
  name: string;
  email: string;
  password?: string;
  role?: 'ADMIN' | 'USER';
  companyId?: string;
}

export class UserManager {
  private static readonly API_BASE = '/api/user';

  static async getAllUsers(): Promise<User[]> {
    try {
      const response = await axios.get(this.API_BASE);
      return response.data;
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  }

  static async getUserById(id: string): Promise<User> {
    try {
      const response = await axios.get(`${this.API_BASE}/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching user:', error);
      throw error;
    }
  }

  static async createUser(data: CreateUserData): Promise<User> {
    try {
      const response = await axios.post(this.API_BASE, data);
      return response.data;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }

  static async updateUser(id: string, data: UpdateUserData): Promise<User> {
    try {
      const response = await axios.put(`${this.API_BASE}/${id}`, data);
      return response.data;
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  }

  static async deleteUser(id: string): Promise<void> {
    try {
      await axios.delete(`${this.API_BASE}/${id}`);
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  }

  static async getAllCompanies(): Promise<Company[]> {
    try {
      const response = await axios.get('/api/company');
      return response.data;
    } catch (error) {
      console.error('Error fetching companies:', error);
      throw error;
    }
  }
} 