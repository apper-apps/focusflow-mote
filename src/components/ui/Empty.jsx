import React from 'react';
import ApperIcon from '@/components/ApperIcon';

const Empty = ({ 
  title = "Nothing here yet", 
  description = "Get started by adding your first item",
  actionText = "Get Started",
  onAction,
  icon = "Plus"
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center">
      <div className="w-20 h-20 bg-gradient-to-br from-primary-100 to-primary-200 rounded-full flex items-center justify-center mb-6">
        <ApperIcon name={icon} className="w-10 h-10 text-primary-500" />
      </div>
      
      <h3 className="text-xl font-display font-semibold text-gray-900 mb-3">
        {title}
      </h3>
      
      <p className="text-gray-600 mb-8 max-w-md">
        {description}
      </p>
      
      {onAction && (
        <button
          onClick={onAction}
          className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-lg font-medium hover:from-primary-600 hover:to-primary-700 transition-all duration-200 hover:scale-105 shadow-medium"
        >
          <ApperIcon name={icon} className="w-5 h-5 mr-2" />
          {actionText}
        </button>
      )}
    </div>
  );
};

export default Empty;