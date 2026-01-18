'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  HomeIcon,
  UsersIcon,
  ShoppingBagIcon,
  TagIcon,
  ShoppingCartIcon,
  ArrowLeftOnRectangleIcon,
} from '@heroicons/react/24/outline';
import { useAppDispatch } from '@/store/hooks';
import { logout } from '@/store/slices/authSlice';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
  { name: 'Users', href: '/dashboard/users', icon: UsersIcon },
  { name: 'Categories', href: '/dashboard/categories', icon: TagIcon },
  { name: 'Products', href: '/dashboard/products', icon: ShoppingBagIcon },
  { name: 'Orders', href: '/dashboard/orders', icon: ShoppingCartIcon },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useAppDispatch();

  const handleLogout = async () => {
    await dispatch(logout());
    router.push('/login');
  };

  return (
    <div className="flex h-screen w-64 flex-col bg-gray-900">
      <div className="flex h-16 items-center justify-center border-b border-gray-800">
        <h1 className="text-xl font-bold text-white">Admin Panel</h1>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-4">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`group flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors ${isActive
                  ? 'bg-gray-800 text-white'
                  : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                }`}
            >
              <item.icon className="mr-3 h-5 w-5" />
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-gray-800 p-4">
        <button
          onClick={handleLogout}
          className="group flex w-full items-center rounded-md px-3 py-2 text-sm font-medium text-gray-400 hover:bg-gray-800 hover:text-white"
        >
          <ArrowLeftOnRectangleIcon className="mr-3 h-5 w-5" />
          Logout
        </button>
      </div>
    </div>
  );
}
