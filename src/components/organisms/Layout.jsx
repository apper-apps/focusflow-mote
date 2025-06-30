import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Sidebar from "@/components/organisms/Sidebar";

const Layout = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isMinimalMode, setIsMinimalMode] = useState(false);

  const toggleMinimalMode = () => {
    setIsMinimalMode(!isMinimalMode);
  };

  return (
    <div className={`flex h-screen bg-background ${isMinimalMode ? 'minimal-mode' : ''}`}>
      {/* Sidebar */}
      {!isMinimalMode && (
        <Sidebar 
          isCollapsed={sidebarCollapsed}
          onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className={`
          bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between
          ${isMinimalMode ? 'bg-transparent border-none' : 'shadow-sm'}
        `}>
          <div className="flex items-center space-x-4">
            {isMinimalMode && (
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
                  <ApperIcon name="Brain" className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="font-display font-bold text-lg text-gray-900">FocusFlow</h1>
                </div>
              </div>
            )}
          </div>

<div className="flex items-center space-x-3">
            {/* Minimal Mode Toggle */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleMinimalMode}
              className={`
                p-2 rounded-lg transition-all duration-200 flex items-center space-x-2
                ${isMinimalMode 
                  ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-medium' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }
              `}
            >
              <ApperIcon 
                name={isMinimalMode ? "Eye" : "EyeOff"} 
                className="w-4 h-4" 
              />
              {!isMinimalMode && <span className="text-sm font-medium">Focus Mode</span>}
            </motion.button>
            {/* Current Time */}
            <div className="text-sm text-gray-500 font-mono">
              {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
          </div>
</header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-auto">
          <div className={`
            max-w-7xl mx-auto p-6
            ${isMinimalMode ? 'max-w-4xl' : ''}
          `}>
            <Outlet context={{ isMinimalMode }} />
</div>
        </main>
      </div>
    </div>
  );
};

export default Layout;