'use client';

import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchUsers, createUser, updateUser, deleteUser } from '@/store/slices/usersSlice';
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

export default function UsersPage() {
  const dispatch = useAppDispatch();
  const { users, loading, pagination } = useAppSelector((state) => state.users);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    phone: '',
    roleId: 3,
    isActive: true,
  });

  useEffect(() => {
    dispatch(fetchUsers({ page: currentPage, limit: 10, search: searchTerm }));
  }, [dispatch, currentPage, searchTerm]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingUser) {
        await dispatch(updateUser({ id: editingUser.id, data: formData })).unwrap();
        toast.success('User updated successfully!');
      } else {
        await dispatch(createUser(formData)).unwrap();
        toast.success('User created successfully!');
      }
      resetForm();
    } catch (error) {
      toast.error('Operation failed');
    }
  };

  const handleEdit = (user: any) => {
    setEditingUser(user);
    setFormData({
      email: user.email,
      password: '',
      firstName: user.firstName,
      lastName: user.lastName,
      phone: user.phone || '',
      roleId: user.role.id,
      isActive: user.isActive,
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this user?')) {
      try {
        await dispatch(deleteUser(id)).unwrap();
        toast.success('User deleted successfully!');
      } catch (error) {
        toast.error('Failed to delete user');
      }
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const resetForm = () => {
    setFormData({
      email: '',
      password: '',
      firstName: '',
      lastName: '',
      phone: '',
      roleId: 3,
      isActive: true,
    });
    setEditingUser(null);
    setIsModalOpen(false);
  };

  if (loading && users.length === 0) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Users Management</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          <PlusIcon className="h-5 w-5" />
          Add User
        </button>
      </div>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by name or email..."
          value={searchTerm}
          onChange={handleSearch}
          className="w-full max-w-md rounded-lg border border-gray-300 px-4 py-2"
        />
      </div>

      <div className="overflow-hidden rounded-lg bg-white shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Role
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {users.map((user) => (
              <tr key={user.id}>
                <td className="whitespace-nowrap px-6 py-4">
                  <div className="text-sm font-medium text-gray-900">
                    {user.firstName} {user.lastName}
                  </div>
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                  {user.email}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                  <span className="rounded-full bg-blue-100 px-2 py-1 text-xs font-semibold text-blue-800">
                    {user.role.name}
                  </span>
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm">
                  <span className={`rounded-full px-2 py-1 text-xs font-semibold ${user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                    {user.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm font-medium">
                  <button
                    onClick={() => handleEdit(user)}
                    className="mr-3 text-blue-600 hover:text-blue-900"
                  >
                    <PencilIcon className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(user.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    <TrashIcon className="h-5 w-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="mt-4 flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Showing {((currentPage - 1) * pagination.limit) + 1} to{' '}
            {Math.min(currentPage * pagination.limit, pagination.total)} of{' '}
            {pagination.total} results
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Previous
            </button>
            {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`rounded-lg px-4 py-2 text-sm font-medium ${currentPage === page
                    ? 'bg-blue-600 text-white'
                    : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === pagination.totalPages}
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-md rounded-lg bg-white p-6">
            <h2 className="mb-4 text-xl font-bold">
              {editingUser ? 'Edit User' : 'Add User'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Password {editingUser && '(leave blank to keep current)'}
                </label>
                <input
                  type="password"
                  required={!editingUser}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">First Name</label>
                  <input
                    type="text"
                    required
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Last Name</label>
                  <input
                    type="text"
                    required
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Phone</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Role</label>
                <select
                  value={formData.roleId}
                  onChange={(e) => setFormData({ ...formData, roleId: Number(e.target.value) })}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                >
                  <option value={1}>Admin</option>
                  <option value={2}>Manager</option>
                  <option value={3}>User</option>
                </select>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="h-4 w-4 rounded border-gray-300"
                />
                <label className="ml-2 text-sm text-gray-700">Active</label>
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={resetForm}
                  className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                >
                  {editingUser ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
