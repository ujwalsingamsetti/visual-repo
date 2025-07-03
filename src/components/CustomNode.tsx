
import React from 'react';
import { Handle, Position } from '@xyflow/react';
import { Database } from 'lucide-react';

interface CustomNodeProps {
  data: {
    label: string;
  };
  selected?: boolean;
}

export const CustomNode: React.FC<CustomNodeProps> = ({ data, selected }) => {
  return (
    <div
      className={`px-4 py-3 rounded-lg border-2 bg-white shadow-lg transition-all duration-200 min-w-[120px] ${
        selected 
          ? 'border-violet-500 shadow-violet-200 shadow-lg scale-105' 
          : 'border-slate-300 hover:border-violet-400 hover:shadow-md'
      }`}
    >
      <Handle
        type="target"
        position={Position.Left}
        className="w-3 h-3 border-2 border-violet-500 bg-white hover:bg-violet-100 transition-colors"
      />
      
      <div className="flex items-center gap-2">
        <Database className="w-4 h-4 text-violet-600" />
        <span className="text-sm font-medium text-slate-700 truncate">
          {data.label}
        </span>
      </div>
      
      <Handle
        type="source"
        position={Position.Right}
        className="w-3 h-3 border-2 border-violet-500 bg-white hover:bg-violet-100 transition-colors"
      />
    </div>
  );
};
