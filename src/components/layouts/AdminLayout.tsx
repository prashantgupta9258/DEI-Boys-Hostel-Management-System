import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { 
  LayoutDashboard, 
  Users, 
  Building, 
  CreditCard, 
  Settings, 
  LogOut,
  FileSpreadsheet,
  Image as ImageIcon,
  Bell,
  Activity,
  Home,
  Menu,
  X,
  Mail
} from 'lucide-react';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const { adminProfile, signOut } = useAuth();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (!adminProfile) return <>{children}</>;

  const navigation = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Students', href: '/admin/students', icon: Users },
    { name: 'Rooms', href: '/admin/rooms', icon: Building },
    { name: 'Fee Structure', href: '/admin/fee-structure', icon: FileSpreadsheet },
    { name: 'Payment Requests', href: '/admin/payment-requests', icon: CreditCard },
    { name: 'Approved Payments', href: '/admin/approved-payments', icon: CreditCard },
    { name: 'Receipts', href: '/admin/receipts', icon: FileSpreadsheet },
    { name: 'Reports', href: '/admin/reports', icon: FileSpreadsheet },
    { name: 'Gallery', href: '/admin/gallery', icon: ImageIcon },
    { name: 'Contact Messages', href: '/admin/messages', icon: Mail },
    { name: 'Settings', href: '/admin/settings', icon: Settings },
    { name: 'Admins', href: '/admin/admins', icon: Users },
  ];

  return (
    <div className="fixed inset-0 flex bg-hostel-bg">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-gray-900/80 lg:hidden backdrop-blur-sm transition-opacity"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar - Desktop & Mobile */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-gray-200/50 transform transition-transform duration-300 lg:static lg:translate-x-0 flex flex-col ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center justify-between px-6 h-20 border-b border-gray-200/50 lg:hidden">
          <span className="font-bold text-xl tracking-tight text-hostel-accent">DEI ADMIN</span>
          <button onClick={() => setSidebarOpen(false)} className="text-gray-500 hover:text-gray-700">
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <div className="flex-1 flex flex-col pt-4 lg:pt-8 pb-4 overflow-y-auto">
          <nav className="flex-1 px-4 space-y-1.5">
            {navigation.map((item) => {
              const isActive = location.pathname.startsWith(item.href);
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`group flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all ${
                    isActive
                      ? 'bg-hostel-accent text-white shadow-sm'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-hostel-accent'
                  }`}
                >
                  <item.icon
                    className={`mr-4 flex-shrink-0 h-5 w-5 ${
                      isActive ? 'text-white' : 'text-gray-400 group-hover:text-hostel-accent'
                    }`}
                    aria-hidden="true"
                  />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>
        <div className="p-4 border-t border-gray-200/50">
          <button
            onClick={signOut}
            className="group flex w-full items-center px-4 py-3 text-sm font-medium rounded-xl text-red-600 hover:bg-red-50 transition-all"
          >
            <LogOut className="mr-4 flex-shrink-0 h-5 w-5 text-red-500 group-hover:text-red-600" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Topbar */}
        <header className="bg-white border-b border-gray-200/50 h-20 flex items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 flex-1">
             <button 
               className="lg:hidden text-gray-600 hover:text-hostel-accent transition-colors"
               onClick={() => setSidebarOpen(true)}
             >
               <Menu className="w-6 h-6" />
             </button>
             <h1 className="text-xl font-bold text-hostel-text truncate hidden sm:block">
                {navigation.find(n => location.pathname.startsWith(n.href))?.name || 'Admin Panel'}
             </h1>
          </div>
          <div className="flex items-center gap-6">
            <Link to="/" className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-hostel-accent transition-colors">
              <Home className="w-5 h-5" />
              <span className="hidden sm:inline">Home Page</span>
            </Link>
            <div className="flex items-center gap-3 pl-6 border-l border-gray-200/50">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium text-hostel-text">{adminProfile.name}</p>
                <p className="text-xs text-gray-500 capitalize">{adminProfile.role ? adminProfile.role.replace('_', ' ') : 'admin'}</p>
              </div>
              <div className="h-10 w-10 rounded-full bg-hostel-accent text-white flex items-center justify-center font-bold text-lg shrink-0">
                {adminProfile.name ? adminProfile.name.charAt(0) : 'A'}
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8 pb-24 lg:pb-8">
          <div className="sm:hidden mb-4">
             <h1 className="text-2xl font-bold text-hostel-text truncate">
                {navigation.find(n => location.pathname.startsWith(n.href))?.name || 'Admin Panel'}
             </h1>
          </div>
          {children}
        </div>
      </main>
    </div>
  );
}
