'use client';

import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchOrders, updateOrderStatus } from '@/store/slices/ordersSlice';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

const STATUS_OPTIONS = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  processing: 'bg-blue-100 text-blue-800',
  shipped: 'bg-purple-100 text-purple-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
};

export default function OrdersPage() {
  const dispatch = useAppDispatch();
  const { orders } = useAppSelector((state) => state.orders);
  const [expandedOrder, setExpandedOrder] = useState<number | null>(null);

  useEffect(() => {
    dispatch(fetchOrders());
  }, [dispatch]);

  const handleStatusChange = async (orderId: number, newStatus: string) => {
    try {
      await dispatch(updateOrderStatus({ id: orderId, status: newStatus })).unwrap();
      toast.success('Order status updated!');
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const toggleExpand = (orderId: number) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Orders</h1>
      </div>

      <div className="space-y-4">
        {orders.map((order) => (
          <div key={order.id} className="overflow-hidden rounded-lg bg-white shadow">
            <div className="flex items-center justify-between p-6">
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold">Order #{order.id}</h3>
                    <p className="text-sm text-gray-500">
                      {order.user?.name || 'N/A'} • {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-lg font-bold">${order.total}</p>
                      <p className="text-sm text-gray-500">{order.orderItems?.length || 0} items</p>
                    </div>
                    <div>
                      <select
                        value={order.status}
                        onChange={(e) => handleStatusChange(order.id, e.target.value)}
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${STATUS_COLORS[order.status] || 'bg-gray-100 text-gray-800'}`}
                      >
                        {STATUS_OPTIONS.map((status) => (
                          <option key={status} value={status}>
                            {status.toUpperCase()}
                          </option>
                        ))}
                      </select>
                    </div>
                    <button onClick={() => toggleExpand(order.id)} className="text-gray-400 hover:text-gray-600">
                      {expandedOrder === order.id ? <ChevronUpIcon className="h-5 w-5" /> : <ChevronDownIcon className="h-5 w-5" />}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {expandedOrder === order.id && (
              <div className="border-t border-gray-200 bg-gray-50 px-6 py-4">
                <h4 className="mb-3 font-semibold">Order Items:</h4>
                <div className="space-y-2">
                  {order.orderItems?.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between rounded bg-white p-3">
                      <div>
                        <p className="font-medium">{item.product?.name || 'Product'}</p>
                        <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">${item.price}</p>
                        <p className="text-sm text-gray-500">Total: ${item.price * item.quantity}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
