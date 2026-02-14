import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Home, 
  Calendar, 
  History, 
  User, 
  BarChart3,
  Settings,
  Building2,
  X
} from 'lucide-react';
import { useSelector } from 'react-redux';

const Sidebar = ({ isOpen, onClose }) => {
  const { user } = useSelector((state) => state.auth);

  const citizenLinks = [
    { path: '/dashboard', icon: Home, label: 'Dashboard' },
    { path: '/book', icon: Calendar, label: 'Book Appointment' },
    { path: '/my-bookings', icon: History, label: 'My Bookings' },
    { path: '/profile', icon: User, label: 'Profile' },
  ];

  const adminLinks = [
    { path: '/admin/dashboard', icon: Home, label: 'Dashboard' },
    { path: '/admin/centers', icon: Building2, label: 'Centers' },
    { path: '/admin/analytics', icon: BarChart3, label: 'Analytics' },
    { path: '/admin/settings', icon: Settings, label: 'Settings' },
  ];

  const links = user?.role === 'admin' ? adminLinks : citizenLinks;

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`
          fixed top-0 left-0 h-full bg-white border-r border-neutral-200 z-50
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          md:translate-x-0 md:static md:z-0
          w-64
        `}
      >
        <div className="flex items-center justify-between p-6 border-b border-neutral-200">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-xl">Q</span>
            </div>
            <h2 className="text-lg font-bold text-neutral-800">QueueWise</h2>
          </div>
          <button
            onClick={onClose}
            className="md:hidden p-2 rounded-lg hover:bg-neutral-100"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="p-4">
          <ul className="space-y-2">
            {links.map((link) => (
              <li key={link.path}>
                <NavLink
                  to={link.path}
                  onClick={() => onClose()}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-3 rounded-xl transition-colors duration-200 ${
                      isActive
                        ? 'bg-primary-50 text-primary-600 font-semibold'
                        : 'text-neutral-600 hover:bg-neutral-100'
                    }`
                  }
                >
                  <link.icon size={20} />
                  <span>{link.label}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;