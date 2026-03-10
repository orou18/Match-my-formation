"use client";

import { motion } from "framer-motion";

interface SimpleBarChartProps {
  data: Array<{ label: string; value: number; color?: string }>;
  height?: number;
}

export default function SimpleBarChart({ data, height = 200 }: SimpleBarChartProps) {
  const maxValue = Math.max(...data.map(d => d.value));
  
  return (
    <div className="flex items-end justify-between h-full px-2" style={{ height: `${height}px` }}>
      {data.map((item, index) => (
        <motion.div
          key={index}
          initial={{ height: 0, opacity: 0 }}
          animate={{ 
            height: `${(item.value / maxValue) * 100}%`, 
            opacity: 1 
          }}
          transition={{ 
            duration: 0.5, 
            delay: index * 0.1,
            ease: "easeOut"
          }}
          whileHover={{ 
            scale: 1.05,
            transition: { duration: 0.2 }
          }}
          className="flex-1 mx-1 rounded-t-lg relative group cursor-pointer"
        >
          <div 
            className={`w-full h-full rounded-t-lg ${
              item.color || 'bg-gradient-to-t from-blue-500 to-blue-400'
            }`}
          />
          
          {/* Tooltip au hover */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileHover={{ opacity: 1, y: 0 }}
            className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap z-10"
          >
            {item.label}: {item.value.toLocaleString()}
          </motion.div>
          
          {/* Label en bas */}
          <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs text-gray-600 whitespace-nowrap">
            {item.label}
          </div>
        </motion.div>
      ))}
    </div>
  );
}
