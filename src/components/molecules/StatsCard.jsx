import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Card from '@/components/atoms/Card';

const StatsCard = ({ 
  title, 
  value, 
  icon, 
  trend, 
  trendValue,
  color = 'primary',
  gradient = false 
}) => {
  const colorClasses = {
    primary: 'text-primary-600 bg-primary-100',
    secondary: 'text-secondary-600 bg-secondary-100',
    success: 'text-green-600 bg-green-100',
    warning: 'text-yellow-600 bg-yellow-100',
    error: 'text-red-600 bg-red-100',
    accent: 'text-accent-600 bg-accent-100',
  };

  const gradientClasses = {
    primary: 'from-primary-500 to-primary-600',
    secondary: 'from-secondary-500 to-secondary-600',
    success: 'from-green-500 to-green-600',
    warning: 'from-yellow-500 to-yellow-600',
    error: 'from-red-500 to-red-600',
    accent: 'from-accent-500 to-accent-600',
  };

  return (
    <Card className="relative overflow-hidden">
      {gradient && (
        <div className={`absolute inset-0 bg-gradient-to-br ${gradientClasses[color]} opacity-5`} />
      )}
      
      <div className="relative">
        <div className="flex items-center justify-between mb-3">
          <div className={`w-10 h-10 rounded-lg ${colorClasses[color]} flex items-center justify-center`}>
            <ApperIcon name={icon} className="w-5 h-5" />
          </div>
          
          {trend && (
            <div className={`flex items-center space-x-1 text-sm ${
              trend === 'up' ? 'text-green-600' : trend === 'down' ? 'text-red-600' : 'text-gray-600'
            }`}>
              <ApperIcon 
                name={trend === 'up' ? 'TrendingUp' : trend === 'down' ? 'TrendingDown' : 'Minus'} 
                className="w-4 h-4" 
              />
              {trendValue && <span>{trendValue}</span>}
            </div>
          )}
        </div>
        
        <div className="space-y-1">
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className={`text-2xl font-bold font-display ${
              gradient ? `bg-gradient-to-r ${gradientClasses[color]} bg-clip-text text-transparent` : 'text-gray-900'
            }`}
          >
            {value}
          </motion.div>
          
          <p className="text-sm text-gray-600">{title}</p>
        </div>
      </div>
    </Card>
  );
};

export default StatsCard;