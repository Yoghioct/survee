import React, { useState, useEffect } from 'react';
import Button, { ButtonVariant, ButtonSize } from '../../shared/components/Button/Button';
import Input from '../../shared/components/Input/Input';
import StyledDialog from '../../shared/components/StyledDialog/StyledDialog';
import Loader from '../../shared/components/Loader/Loader';
import { CompanyManager, Company } from './companyManager';

export const CompanyList: React.FC = () => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [formData, setFormData] = useState({ name: '' });

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      const companies = await CompanyManager.getAllCompanies();
      setCompanies(companies);
    } catch (error) {
      console.error('Error fetching companies:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    try {
      await CompanyManager.createCompany(formData);
      setShowCreateModal(false);
      setFormData({ name: '' });
      fetchCompanies();
    } catch (error) {
      console.error('Error creating company:', error);
    }
  };

  const handleEdit = async () => {
    if (!selectedCompany) return;

    try {
      await CompanyManager.updateCompany(selectedCompany.id, formData);
      setShowEditModal(false);
      setFormData({ name: '' });
      setSelectedCompany(null);
      fetchCompanies();
    } catch (error) {
      console.error('Error updating company:', error);
    }
  };

  const handleDelete = async () => {
    if (!selectedCompany) return;

    try {
      await CompanyManager.deleteCompany(selectedCompany.id);
      setShowDeleteModal(false);
      setSelectedCompany(null);
      fetchCompanies();
    } catch (error) {
      console.error('Error deleting company:', error);
    }
  };

  const openEditModal = (company: Company) => {
    setSelectedCompany(company);
    setFormData({ name: company.name });
    setShowEditModal(true);
  };

  const openDeleteModal = (company: Company) => {
    setSelectedCompany(company);
    setShowDeleteModal(true);
  };

  if (loading) {
    return <Loader isLoading={true} />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-semibold text-zinc-900">Company Management</h1>
        </div>
        <Button 
          onClick={() => setShowCreateModal(true)}
          variant={ButtonVariant.PRIMARY}
          className="flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Add New Company
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-zinc-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-zinc-200">
            <thead className="bg-zinc-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-zinc-600 uppercase tracking-wider">
                  Company Name
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-zinc-600 uppercase tracking-wider">
                  Created At
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-zinc-600 uppercase tracking-wider">
                  Updated At
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-zinc-600 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-zinc-100">
              {companies.map((company) => (
                <tr key={company.id} className="hover:bg-zinc-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-left">
                    <div className="text-sm font-medium text-zinc-900">{company.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-left">
                    <div className="text-sm text-zinc-600">
                      {new Date(company.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-left">
                    <div className="text-sm text-zinc-600">
                      {new Date(company.updatedAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center gap-2">
                      <Button
                        onClick={() => openEditModal(company)}
                        variant={ButtonVariant.SECONDARY}
                        sizeType={ButtonSize.SMALL}
                        className="flex items-center gap-1"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        Edit
                      </Button>
                      <Button
                        onClick={() => openDeleteModal(company)}
                        variant={ButtonVariant.DANGER}
                        sizeType={ButtonSize.SMALL}
                        className="flex items-center gap-1"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        Delete
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {companies.length === 0 && (
          <div className="text-center py-12">
            <svg className="mx-auto h-12 w-12 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-zinc-900">No companies</h3>
            <p className="mt-1 text-sm text-zinc-500">Get started by creating a new company.</p>
          </div>
        )}
      </div>

      {/* Create Modal */}
      <StyledDialog
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Add New Company"
        content={
          <div className="space-y-6">
            <div className='my-4'>
              <Input
                label="Company Name"
                value={formData.name}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ name: e.target.value })}
                placeholder="Enter company name"
                required
              />
            </div>
            <div className="flex justify-end gap-3 pt-4 border-t border-zinc-200">
              <Button
                variant={ButtonVariant.SECONDARY}
                onClick={() => setShowCreateModal(false)}
              >
                Cancel
              </Button>
              <Button 
                onClick={handleCreate}
                variant={ButtonVariant.PRIMARY}
                disabled={!formData.name.trim()}
              >
                Create Company
              </Button>
            </div>
          </div>
        }
      />

      {/* Edit Modal */}
      <StyledDialog
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        title="Edit Company"
        content={
          <div className="space-y-6">
            <div className='my-4'>
              <Input
                label="Company Name"
                value={formData.name}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ name: e.target.value })}
                placeholder="Enter company name"
                required
              />
            </div>
            <div className="flex justify-end gap-3 pt-4 border-t border-zinc-200">
              <Button
                variant={ButtonVariant.SECONDARY}
                onClick={() => setShowEditModal(false)}
              >
                Cancel
              </Button>
              <Button 
                onClick={handleEdit}
                variant={ButtonVariant.PRIMARY}
                disabled={!formData.name.trim()}
              >
                Update Company
              </Button>
            </div>
          </div>
        }
      />

      {/* Delete Modal */}
      <StyledDialog
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Delete Company"
        content={
          <div className="space-y-6">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 mt-4">
                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
              </div>
              <div className='mt-4'>
                <h3 className="text-lg font-medium text-zinc-900">Delete Company</h3>
                <p className="mt-2 text-sm text-zinc-600">
                  Are you sure you want to delete <span className="font-semibold">"{selectedCompany?.name}"</span>? 
                  This action cannot be undone and will permanently remove the company from the system.
                </p>
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-4 border-t border-zinc-200">
              <Button
                variant={ButtonVariant.SECONDARY}
                onClick={() => setShowDeleteModal(false)}
              >
                Cancel
              </Button>
              <Button 
                variant={ButtonVariant.DANGER} 
                onClick={handleDelete}
              >
                Delete Company
              </Button>
            </div>
          </div>
        }
      />
    </div>
  );
}; 