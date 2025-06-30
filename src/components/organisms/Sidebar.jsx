import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';

const Sidebar = ({ isCollapsed = false, onToggle }) => {
  const location = useLocation();

  const menuItems = [
    { path: '/tasks', icon: 'CheckSquare', label: 'Tasks', color: 'primary' },
    { path: '/analytics', icon: 'BarChart3', label: 'Analytics', color: 'secondary' },
    { path: '/settings', icon: 'Settings', label: 'Settings', color: 'accent' },
  ];

  const isActiveRoute = (path) => {
    if (path === '/tasks') {
      return location.pathname === '/' || location.pathname === '/tasks';
    }
    return location.pathname === path;
  };

  return (
    <motion.div
      initial={{ width: isCollapsed ? 80 : 256 }}
      animate={{ width: isCollapsed ? 80 : 256 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="bg-white border-r border-gray-200 shadow-soft flex flex-col h-full"
    >
      {/* Header */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="flex items-center space-x-3"
            >
              <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
                <ApperIcon name="Brain" className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="font-display font-bold text-lg text-gray-900">FocusFlow</h1>
                <p className="text-xs text-gray-500">ADHD-Friendly</p>
              </div>
            </motion.div>
          )}
          
          <button
            onClick={onToggle}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200"
          >
            <ApperIcon 
              name={isCollapsed ? "ChevronRight" : "ChevronLeft"} 
              className="w-4 h-4" 
            />
          </button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        {menuItems.map((item) => {
          const isActive = isActiveRoute(item.path);
          
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive: linkActive }) => `
                flex items-center px-3 py-2.5 rounded-lg font-medium transition-all duration-200 group
                ${(isActive || linkActive)
                  ? 'bg-gradient-to-r from-primary-50 to-primary-100 text-primary-700 border border-primary-200' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }
              `}
            >
              <ApperIcon 
                name={item.icon} 
                className={`w-5 h-5 transition-colors duration-200 ${
                  isActive ? 'text-primary-600' : 'text-gray-400 group-hover:text-gray-600'
                }`} 
              />
              
              {!isCollapsed && (
                <motion.span
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                  className="ml-3"
                >
                  {item.label}
                </motion.span>
              )}
              
              {isActive && !isCollapsed && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="ml-auto w-2 h-2 bg-primary-500 rounded-full"
                />
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-100">
        {!isCollapsed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-center"
          >
            <p className="text-xs text-gray-500 mb-2">Stay focused, stay amazing! 🌟</p>
            <div className="flex items-center justify-center space-x-1 text-xs text-gray-400">
              <ApperIcon name="Heart" className="w-3 h-3" />
              <span>Made for ADHD minds</span>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default Sidebar;