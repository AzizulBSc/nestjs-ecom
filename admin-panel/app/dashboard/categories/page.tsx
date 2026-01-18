'use client';

import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchCategories, createCategory, updateCategory, deleteCategory } from '@/store/slices/categoriesSlice';
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

export default function CategoriesPage() {
  const dispatch = useAppDispatch();
  const { categories, loading } = useAppSelector((state) => state.categories);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any>(null);
  const [formData, setFormData] = useState({ name: '', description: '', isActive: true });

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingCategory) {
        await dispatch(updateCategory({ id: editingCategory.id, data: formData })).unwrap();
        toast.success('Category updated!');
      } else {
        await dispatch(createCategory(formData)).unwrap();
        toast.success('Category created!');
      }
      resetForm();
    } catch (error) {
      toast.error('Operation failed');
    }
  };

  const handleEdit = (category: any) => {
    setEditingCategory(category);
    setFormData({ name: category.name, description: category.description || '', isActive: category.isActive });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm('Delete this category?')) {
      try {
        await dispatch(deleteCategory(id)).unwrap();
        toast.success('Category deleted!');
      } catch (error) {
        toast.error('Failed to delete');
      }
    }
  };

  const resetForm = () => {
    setFormData({ name: '', description: '', isActive: true });
    setEditingCategory(null);
    setIsModalOpen(false);
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Categories</h1>
        <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
          <PlusIcon className="h-5 w-5" />Add Category
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((category) => (
          <div key={category.id} className="rounded-lg bg-white p-6 shadow">
            <h3 className="text-lg font-semibold">{category.name}</h3>
            <p className="mt-2 text-sm text-gray-600">{category.description}</p>
            <div className="mt-4 flex items-center justify-between">
              <span className={`rounded-full px-2 py-1 text-xs font-semibold ${category.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                {category.isActive ? 'Active' : 'Inactive'}
              </span>
              <div className="flex gap-2">
                <button onClick={() => handleEdit(category)} className="text-blue-600 hover:text-blue-900">
                  <PencilIcon className="h-5 w-5" />
                </button>
                <button onClick={() => handleDelete(category.id)} className="text-red-600 hover:text-red-900">
                  <TrashIcon className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-md rounded-lg bg-white p-6">
            <h2 className="mb-4 text-xl font-bold">{editingCategory ? 'Edit Category' : 'Add Category'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <input type="text" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2" rows={3} />
              </div>
              <div className="flex items-center">
                <input type="checkbox" checked={formData.isActive} onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })} className="h-4 w-4 rounded border-gray-300" />
                <label className="ml-2 text-sm text-gray-700">Active</label>
              </div>
              <div className="flex justify-end gap-2">
                <button type="button" onClick={resetForm} className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">Cancel</button>
                <button type="submit" className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">{editingCategory ? 'Update' : 'Create'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
