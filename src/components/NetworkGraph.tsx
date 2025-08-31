
import React, { useCallback, useEffect, useState } from 'react';
import {
  ReactFlow,
  addEdge,
  Connection,
  Edge,
  Node,
  useReactFlow,
  OnEdgesChange,
  EdgeChange,
} from '@xyflow/react';

import '@xyflow/react/dist/style.css';
import { CustomNode } from '@/types/network';

interface NetworkGraphProps {
  nodes: CustomNode[];
  edges: Edge[];
  onEdgesChange: (changes: EdgeChange[]) => void;
  onConnect: (connection: Connection | Edge) => void;
  onNodeClick?: (event: React.MouseEvent<Element, MouseEvent>, node: Node) => void;
}

const NetworkGraph: React.FC<NetworkGraphProps> = ({ 
  nodes, 
  edges, 
  onEdgesChange, 
  onConnect,
  onNodeClick,
}) => {
  const { setViewport, fitView } = useReactFlow();
  const [isLoading, setIsLoading] = useState(true);

  console.log('NetworkGraph rendering with nodes:', nodes.length, 'edges:', edges.length);

  const onConnectCallback = useCallback(
    (params: Edge | Connection) => {
      console.log('Connection attempt:', params);
      onConnect(params);
    },
    [onConnect]
  );

  const onNodeClickHandler = (event: React.MouseEvent<Element, MouseEvent>, node: Node) => {
    console.log('Node clicked:', node.id);
    if (onNodeClick) {
      onNodeClick(event, node);
    }
  };

  // Handle initial load and fit view
  useEffect(() => {
    if (nodes.length > 0) {
      console.log('Fitting view for nodes:', nodes.length);
      const timer = setTimeout(() => {
        try {
          fitView({ padding: 0.1, includeHiddenNodes: false });
          setIsLoading(false);
        } catch (error) {
          console.error('Error fitting view:', error);
          setIsLoading(false);
        }
      }, 100);
      
      return () => clearTimeout(timer);
    }
  }, [nodes.length, fitView]);

  if (isLoading && nodes.length === 0) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
          <p className="text-sm text-muted-foreground">Loading network...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full min-h-[300px] relative">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onEdgesChange={onEdgesChange}
        onConnect={onConnectCallback}
        onNodeClick={onNodeClickHandler}
        fitView
        fitViewOptions={{ 
          padding: 0.1, 
          includeHiddenNodes: false,
          minZoom: 0.1,
          maxZoom: 2
        }}
        minZoom={0.1}
        maxZoom={2}
        defaultViewport={{ x: 0, y: 0, zoom: 0.5 }}
        style={{ 
          width: '100%', 
          height: '100%',
          backgroundColor: '#f8f9fa'
        }}
        proOptions={{ hideAttribution: true }}
      />
    </div>
  );
};

export default NetworkGraph;
