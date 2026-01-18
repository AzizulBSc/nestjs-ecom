'use client';

import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchUsers } from '@/store/slices/usersSlice';
import { fetchProducts } from '@/store/slices/productsSlice';
import { fetchCategories } from '@/store/slices/categoriesSlice';
import { fetchOrders } from '@/store/slices/ordersSlice';
import { UsersIcon, ShoppingBagIcon, TagIcon, ShoppingCartIcon } from '@heroicons/react/24/outline';

export default function DashboardPage() {
  const dispatch = useAppDispatch();
  const users = useAppSelector((state) => state.users.users);
  const products = useAppSelector((state) => state.products.products);
  const categories = useAppSelector((state) => state.categories.categories);
  const orders = useAppSelector((state) => state.orders.orders);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
    dispatch(fetchUsers());
    dispatch(fetchProducts());
    dispatch(fetchCategories());
    dispatch(fetchOrders());
  }, [dispatch]);

  const stats = [
    { name: 'Total Users', value: users.length, icon: UsersIcon, color: 'bg-blue-500' },
    { name: 'Total Products', value: products.length, icon: ShoppingBagIcon, color: 'bg-green-500' },
    { name: 'Categories', value: categories.length, icon: TagIcon, color: 'bg-purple-500' },
    { name: 'Total Orders', value: orders.length, icon: ShoppingCartIcon, color: 'bg-orange-500' },
  ];

  const pendingOrders = orders.filter((o) => o.status === 'pending').length;
  const processingOrders = orders.filter((o) => o.status === 'processing').length;
  const totalRevenue = orders.reduce((sum, order) => sum + Number(order.totalAmount), 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome back, {user?.firstName || 'Admin'}!
        </h1>
        <p className="text-gray-600">Here's what's happening with your store today.</p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.name} className="overflow-hidden rounded-lg bg-white shadow">
            <div className="p-6">
              <div className="flex items-center">
                <div className={`rounded-md p-3 ${stat.color}`}>
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                  <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-lg bg-white p-6 shadow">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Status</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Pending</span>
              <span className="font-semibold text-yellow-600">{pendingOrders}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Processing</span>
              <span className="font-semibold text-blue-600">{processingOrders}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Total Orders</span>
              <span className="font-semibold">{orders.length}</span>
            </div>
          </div>
        </div>

        <div className="rounded-lg bg-white p-6 shadow">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue Overview</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Total Revenue</span>
              <span className="text-2xl font-bold text-green-600">
                ${totalRevenue.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Average Order Value</span>
              <span className="font-semibold">
                ${orders.length > 0 ? (totalRevenue / orders.length).toFixed(2) : '0.00'}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-lg bg-white p-6 shadow">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Orders</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Order Number
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {orders.slice(0, 5).map((order) => (
                <tr key={order.id}>
                  <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                    {order.orderNumber}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                    {order.user.firstName} {order.user.lastName}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                    ${order.totalAmount}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm">
                    <span className={`rounded-full px-2 py-1 text-xs font-semibold ${order.status === 'delivered'
                        ? 'bg-green-100 text-green-800'
                        : order.status === 'cancelled'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
