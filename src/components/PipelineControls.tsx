
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Plus, Layout, Workflow } from 'lucide-react';

interface PipelineControlsProps {
  onAddNode: () => void;
  onAutoLayout: () => void;
  nodeCount: number;
  edgeCount: number;
}

export const PipelineControls: React.FC<PipelineControlsProps> = ({
  onAddNode,
  onAutoLayout,
  nodeCount,
  edgeCount,
}) => {
  return (
    <Card className="p-4 bg-white/95 backdrop-blur-sm border border-slate-200 shadow-lg">
      <div className="space-y-4">
        <div className="flex gap-2">
          <Button
            onClick={onAddNode}
            className="bg-violet-600 hover:bg-violet-700 text-white"
            size="sm"
          >
            <Plus className="w-4 h-4 mr-1" />
            Add Node
          </Button>
          
          <Button
            onClick={onAutoLayout}
            variant="outline"
            size="sm"
            disabled={nodeCount < 2}
            className="border-violet-300 hover:bg-violet-50"
          >
            <Layout className="w-4 h-4 mr-1" />
            Auto Layout
          </Button>
        </div>
        
        <div className="text-xs text-slate-600 space-y-1">
          <div className="flex items-center gap-1">
            <Workflow className="w-3 h-3" />
            <span>{nodeCount} nodes, {edgeCount} edges</span>
          </div>
          <div className="text-slate-500">
            Press Delete to remove selected items
          </div>
        </div>
      </div>
    </Card>
  );
};
