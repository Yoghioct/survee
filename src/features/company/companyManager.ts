import axios from 'axios';

export interface Company {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCompanyData {
  name: string;
}

export interface UpdateCompanyData {
  name: string;
}

export class CompanyManager {
  private static readonly API_BASE = '/api/company';

  static async getAllCompanies(): Promise<Company[]> {
    try {
      const response = await axios.get(this.API_BASE);
      return response.data;
    } catch (error) {
      console.error('Error fetching companies:', error);
      throw error;
    }
  }

  static async getCompanyById(id: string): Promise<Company> {
    try {
      const response = await axios.get(`${this.API_BASE}/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching company:', error);
      throw error;
    }
  }

  static async createCompany(data: CreateCompanyData): Promise<Company> {
    try {
      const response = await axios.post(this.API_BASE, data);
      return response.data;
    } catch (error) {
      console.error('Error creating company:', error);
      throw error;
    }
  }

  static async updateCompany(id: string, data: UpdateCompanyData): Promise<Company> {
    try {
      const response = await axios.put(`${this.API_BASE}/${id}`, data);
      return response.data;
    } catch (error) {
      console.error('Error updating company:', error);
      throw error;
    }
  }

  static async deleteCompany(id: string): Promise<void> {
    try {
      await axios.delete(`${this.API_BASE}/${id}`);
    } catch (error) {
      console.error('Error deleting company:', error);
      throw error;
    }
  }
} 