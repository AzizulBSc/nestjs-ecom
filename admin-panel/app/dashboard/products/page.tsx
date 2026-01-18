'use client';

import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchProducts, createProduct, updateProduct, deleteProduct } from '@/store/slices/productsSlice';
import { fetchCategories } from '@/store/slices/categoriesSlice';
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

export default function ProductsPage() {
  const dispatch = useAppDispatch();
  const { products } = useAppSelector((state) => state.products);
  const { categories } = useAppSelector((state) => state.categories);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    sku: '',
    categoryId: '',
    isActive: true,
  });

  useEffect(() => {
    dispatch(fetchProducts());
    dispatch(fetchCategories());
  }, [dispatch]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = {
        ...formData,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock),
        categoryId: parseInt(formData.categoryId),
      };

      if (editingProduct) {
        await dispatch(updateProduct({ id: editingProduct.id, data })).unwrap();
        toast.success('Product updated!');
      } else {
        await dispatch(createProduct(data)).unwrap();
        toast.success('Product created!');
      }
      resetForm();
    } catch (error) {
      toast.error('Operation failed');
    }
  };

  const handleEdit = (product: any) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description || '',
      price: product.price.toString(),
      stock: product.stock.toString(),
      sku: product.sku || '',
      categoryId: product.categoryId?.toString() || '',
      isActive: product.isActive,
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm('Delete this product?')) {
      try {
        await dispatch(deleteProduct(id)).unwrap();
        toast.success('Product deleted!');
      } catch (error) {
        toast.error('Failed to delete');
      }
    }
  };

  const resetForm = () => {
    setFormData({ name: '', description: '', price: '', stock: '', sku: '', categoryId: '', isActive: true });
    setEditingProduct(null);
    setIsModalOpen(false);
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Products</h1>
        <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
          <PlusIcon className="h-5 w-5" />
          Add Product
        </button>
      </div>

      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Product</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">SKU</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Category</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Price</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Stock</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {products.map((product) => (
              <tr key={product.id}>
                <td className="whitespace-nowrap px-6 py-4">
                  <div className="text-sm font-medium text-gray-900">{product.name}</div>
                  <div className="text-sm text-gray-500">{product.description?.substring(0, 50)}...</div>
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">{product.sku}</td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">{product.category?.name || 'N/A'}</td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">${product.price}</td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">{product.stock}</td>
                <td className="whitespace-nowrap px-6 py-4">
                  <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${product.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {product.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm font-medium">
                  <button onClick={() => handleEdit(product)} className="mr-3 text-blue-600 hover:text-blue-900">
                    <PencilIcon className="h-5 w-5" />
                  </button>
                  <button onClick={() => handleDelete(product.id)} className="text-red-600 hover:text-red-900">
                    <TrashIcon className="h-5 w-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-lg bg-white p-6">
            <h2 className="mb-4 text-xl font-bold">{editingProduct ? 'Edit Product' : 'Add Product'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Name</label>
                  <input type="text" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">SKU</label>
                  <input type="text" required value={formData.sku} onChange={(e) => setFormData({ ...formData, sku: e.target.value })} className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2" rows={3} />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Price</label>
                  <input type="number" step="0.01" required value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Stock</label>
                  <input type="number" required value={formData.stock} onChange={(e) => setFormData({ ...formData, stock: e.target.value })} className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Category</label>
                  <select required value={formData.categoryId} onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })} className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2">
                    <option value="">Select...</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="flex items-center">
                <input type="checkbox" checked={formData.isActive} onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })} className="h-4 w-4 rounded border-gray-300" />
                <label className="ml-2 text-sm text-gray-700">Active</label>
              </div>
              <div className="flex justify-end gap-2">
                <button type="button" onClick={resetForm} className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">Cancel</button>
                <button type="submit" className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">{editingProduct ? 'Update' : 'Create'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
