import { useLayoutEffect } from 'react';
import {
  Background, Controls, Handle, MarkerType, Position, ReactFlow, useUpdateNodeInternals,
  type Connection, type Node, type NodeChange, type NodeProps, type XYPosition,
} from '@xyflow/react';
import { Flag, GitFork, MessageSquare } from 'lucide-react';
import type { Dialogue, DialogueNode } from './dialogue';

type Card = Node<{ node: DialogueNode; start: boolean }, 'dialogue'>;

function DialogueCard({ id, data }: NodeProps<Card>) {
  const { node, start } = data;
  const updateInternals = useUpdateNodeInternals();
  useLayoutEffect(() => { updateInternals(id); }, [id, node, updateInternals]);

  return (
    <article className="node-card">
      <Handle type="target" position={Position.Left} data-port="entrada" />
      <header>
        <span className="node-icon"><MessageSquare size={15} /></span>
        <strong>{node.speaker || 'Sin personaje'}</strong>
        {start && <span className="badge start">Inicio</span>}
        {!start && node.replies.length === 0 && <span className="badge"><Flag size={11} /> Final</span>}
      </header>
      <p>{node.text || 'Sin diálogo'}</p>
      {node.replies.map(reply => (
        <div className="node-reply" key={reply.id}>
          <span>{reply.text || 'Sin texto'}</span>
          <Handle
            type="source" position={Position.Right} id={reply.id}
            className={reply.targetId ? 'linked' : 'unlinked'}
          />
        </div>
      ))}
    </article>
  );
}

const nodeTypes = { dialogue: DialogueCard };

interface CanvasProps {
  dialogue: Dialogue;
  selectedId: string | null;
  positions: Record<string, XYPosition>;
  onChange: (changes: NodeChange<Card>[]) => void;
  onConnect: (connection: Connection) => void;
  onSelect: (id: string | null) => void;
}

export function Canvas({ dialogue, selectedId, positions, onChange, onConnect, onSelect }: CanvasProps) {
  const nodes: Card[] = dialogue.nodes.map(node => ({
    id: node.id, type: 'dialogue', position: positions[node.id] ?? { x: 0, y: 0 },
    selected: node.id === selectedId, data: { node, start: node.id === dialogue.startId },
    ariaLabel: node.speaker + ': ' + node.text,
  }));
  const edges = dialogue.nodes.flatMap(node => node.replies.flatMap(reply => reply.targetId ? [{
    id: reply.id, source: node.id, sourceHandle: reply.id, target: reply.targetId,
    selectable: false,
    markerEnd: { type: MarkerType.ArrowClosed, color: '#ad8b50', width: 15, height: 15 },
  }] : []));

  return (
    <section className="canvas-panel" aria-labelledby="canvas-title">
      <header className="section-bar">
        <span id="canvas-title"><GitFork size={16} /> Árbol de diálogo</span>
        <span className="counts">{nodes.length} {nodes.length === 1 ? 'nodo' : 'nodos'} <span>·</span> {edges.length} conexiones</span>
      </header>
      <div className="canvas">
        <ReactFlow
          nodes={nodes} edges={edges} nodeTypes={nodeTypes} onNodesChange={onChange}
          onConnect={onConnect} onNodeClick={(_, node) => onSelect(node.id)}
          onPaneClick={() => onSelect(null)} deleteKeyCode={null} edgesReconnectable={false}
          defaultEdgeOptions={{ style: { stroke: '#ad8b50', strokeWidth: 1.6 } }}
          fitView fitViewOptions={{ padding: 0.16, maxZoom: 1 }}
          ariaLabelConfig={{
            'controls.ariaLabel': 'Controles del lienzo',
            'controls.zoomIn.ariaLabel': 'Acercar',
            'controls.zoomOut.ariaLabel': 'Alejar',
            'controls.fitView.ariaLabel': 'Encuadrar árbol',
            'node.a11yDescription.default': 'Pulsa Intro para seleccionar y las flechas para mover el nodo.',
            'node.a11yDescription.keyboardDisabled': 'Pulsa Intro para seleccionar el nodo.',
          }}
          proOptions={{ hideAttribution: true }}
        >
          <Background color="#45453e" gap={23} size={1.5} />
          <Controls showInteractive={false} orientation="horizontal" />
        </ReactFlow>
      </div>
      <footer className="canvas-footer"><span className="port-key" /> Arrastra desde un puerto de respuesta hasta otro nodo.</footer>
    </section>
  );
}
