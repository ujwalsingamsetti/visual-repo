
import React, { useState, useCallback, useEffect, useMemo } from 'react';
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Edge,
  Node,
  useReactFlow,
  MarkerType,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { PipelineControls } from '../components/PipelineControls';
import { ValidationStatus } from '../components/ValidationStatus';
import { AddNodeModal } from '../components/AddNodeModal';
import { CustomNode } from '../components/CustomNode';
import { validateDAG } from '../utils/dagValidation';
import { applyAutoLayout } from '../utils/autoLayout';

const nodeTypes = {
  customNode: CustomNode,
};

const initialNodes: Node[] = [];
const initialEdges: Edge[] = [];

const PipelineEditor = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [isAddNodeModalOpen, setIsAddNodeModalOpen] = useState(false);
  const [validationStatus, setValidationStatus] = useState({ isValid: false, message: '' });
  const reactFlowInstance = useReactFlow();

  // Validate DAG whenever nodes or edges change
  useEffect(() => {
    const status = validateDAG(nodes, edges);
    setValidationStatus(status);
  }, [nodes, edges]);

  // Handle connection between nodes
  const onConnect = useCallback(
    (params: Connection) => {
      // Prevent self-connections
      if (params.source === params.target) {
        return;
      }
      
      const newEdge: Edge = {
        id: `edge-${params.source}-${params.target}-${Date.now()}`,
        source: params.source!,
        target: params.target!,
        sourceHandle: params.sourceHandle,
        targetHandle: params.targetHandle,
        type: 'smoothstep',
        animated: true,
        style: { stroke: '#8b5cf6', strokeWidth: 2 },
        markerEnd: { type: MarkerType.ArrowClosed, color: '#8b5cf6' },
      };
      
      setEdges((eds) => addEdge(newEdge, eds));
    },
    [setEdges]
  );

  // Add new node
  const addNode = useCallback((nodeName: string) => {
    const newNode: Node = {
      id: `node-${Date.now()}`,
      type: 'customNode',
      position: {
        x: Math.random() * 400 + 100,
        y: Math.random() * 400 + 100,
      },
      data: { label: nodeName },
    };
    setNodes((nds) => [...nds, newNode]);
    setIsAddNodeModalOpen(false);
  }, [setNodes]);

  // Handle keyboard events for deletion
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Delete' || event.key === 'Backspace') {
        const selectedNodes = nodes.filter((node) => node.selected);
        const selectedEdges = edges.filter((edge) => edge.selected);

        if (selectedNodes.length > 0) {
          const selectedNodeIds = selectedNodes.map((node) => node.id);
          
          // Remove selected nodes
          setNodes((nds) => nds.filter((node) => !selectedNodeIds.includes(node.id)));
          
          // Remove edges connected to deleted nodes
          setEdges((eds) => 
            eds.filter(
              (edge) => 
                !selectedNodeIds.includes(edge.source) && 
                !selectedNodeIds.includes(edge.target)
            )
          );
        } else if (selectedEdges.length > 0) {
          const selectedEdgeIds = selectedEdges.map((edge) => edge.id);
          setEdges((eds) => eds.filter((edge) => !selectedEdgeIds.includes(edge.id)));
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [nodes, edges, setNodes, setEdges]);

  // Auto layout function
  const handleAutoLayout = useCallback(() => {
    const { nodes: layoutedNodes, edges: layoutedEdges } = applyAutoLayout(nodes, edges);
    setNodes(layoutedNodes);
    setEdges(layoutedEdges);
    
    // Fit view after layout
    setTimeout(() => {
      reactFlowInstance.fitView({ padding: 0.1, duration: 800 });
    }, 100);
  }, [nodes, edges, setNodes, setEdges, reactFlowInstance]);

  return (
    <div className="w-full h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="absolute top-4 left-4 z-10">
        <h1 className="text-2xl font-bold text-slate-800 mb-4">Pipeline Editor</h1>
        <PipelineControls
          onAddNode={() => setIsAddNodeModalOpen(true)}
          onAutoLayout={handleAutoLayout}
          nodeCount={nodes.length}
          edgeCount={edges.length}
        />
      </div>

      <div className="absolute top-4 right-4 z-10">
        <ValidationStatus status={validationStatus} />
      </div>

      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        fitView
        className="bg-transparent"
        defaultEdgeOptions={{
          type: 'smoothstep',
          animated: true,
          style: { stroke: '#8b5cf6', strokeWidth: 2 },
          markerEnd: { type: MarkerType.ArrowClosed, color: '#8b5cf6' },
        }}
      >
        <Controls className="bg-white shadow-lg rounded-lg border border-slate-200" />
        <MiniMap 
          className="bg-white shadow-lg rounded-lg border border-slate-200"
          nodeStrokeWidth={3}
          nodeColor="#8b5cf6"
          maskColor="rgba(0, 0, 0, 0.1)"
        />
        <Background color="#e2e8f0" size={1} />
      </ReactFlow>

      <AddNodeModal
        isOpen={isAddNodeModalOpen}
        onClose={() => setIsAddNodeModalOpen(false)}
        onAddNode={addNode}
      />
    </div>
  );
};

const Index = () => {
  return (
    <ReactFlow>
      <PipelineEditor />
    </ReactFlow>
  );
};

export default Index;
