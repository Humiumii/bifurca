import { useState } from 'react';
import { CircleAlert, CircleCheck, Download, GitFork, Plus } from 'lucide-react';
import type { Connection, XYPosition } from '@xyflow/react';
import { Canvas } from './Canvas';
import { Inspector } from './Inspector';
import { Preview } from './Preview';
import { downloadDialogue } from './exportDialogue';
import { connectReply, removeNode, sample, updateNode, type DialogueNode } from './dialogue';

const samplePositions = {
  entrada: { x: 0, y: 124 },
  mostrador: { x: 330, y: 0 },
  rumor: { x: 330, y: 248 },
  pocion: { x: 660, y: 0 },
  mapa: { x: 660, y: 248 },
};

export function App() {
  const [dialogue, setDialogue] = useState(sample);
  const [positions, setPositions] = useState<Record<string, XYPosition>>(samplePositions);
  const [selectedId, setSelectedId] = useState<string | null>(sample.startId);
  const selected = dialogue.nodes.find(node => node.id === selectedId);
  const disconnected = dialogue.nodes.reduce((count, node) => count + node.replies.filter(reply => !reply.targetId).length, 0);
  const warnings = [
    !dialogue.startId && 'Falta un nodo inicial',
    disconnected > 0 && (disconnected === 1 ? '1 respuesta sin conectar' : disconnected + ' respuestas sin conectar'),
  ].filter(Boolean);

  function addNode() {
    const node = { id: crypto.randomUUID(), speaker: 'Nuevo personaje', text: '', replies: [] };
    const anchor = selected ? positions[selected.id] : undefined;
    const x = anchor?.x ?? 0;
    let y = anchor ? anchor.y + 220 : 0;
    while (Object.values(positions).some(point => Math.abs(point.x - x) < 258 && Math.abs(point.y - y) < 200)) y += 220;
    setPositions(previous => ({ ...previous, [node.id]: { x, y } }));
    setDialogue(previous => ({ ...previous, nodes: [...previous.nodes, node] }));
    setSelectedId(node.id);
  }

  function editSelected(update: (node: DialogueNode) => DialogueNode) {
    if (selected) setDialogue(previous => updateNode(previous, selected.id, update));
  }

  function connect({ source, sourceHandle, target }: Connection) {
    if (sourceHandle) setDialogue(previous => connectReply(previous, source, sourceHandle, target));
  }

  function deleteSelected() {
    if (!selected) return;
    setDialogue(previous => removeNode(previous, selected.id));
    setPositions(previous => {
      const next = { ...previous };
      delete next[selected.id];
      return next;
    });
    setSelectedId(null);
  }

  return (
    <div className="app">
      <header className="topbar">
        <div className="brand"><span className="brand-icon"><GitFork size={19} /></span> Bifurca</div>
        <span className="product-label">Editor de diálogos</span>
      </header>
      <main>
        <header className="project-header">
          <div><p className="eyebrow">DIÁLOGO DE EJEMPLO</p><h1>{dialogue.title}</h1></div>
          <div className="project-actions">
            <button onClick={() => downloadDialogue(dialogue)}><Download size={16} /> Exportar JSON</button>
            <Preview dialogue={dialogue} />
            <button className="primary" onClick={addNode}><Plus size={17} /> Nuevo nodo</button>
          </div>
        </header>
        <div className="workspace">
          <Canvas dialogue={dialogue} selectedId={selectedId} positions={positions} onConnect={connect} onSelect={setSelectedId}
            onChange={changes => {
              const moved = changes.flatMap(change => change.type === 'position' && change.position
                ? [[change.id, change.position] as const] : []);
              if (moved.length) setPositions(previous => ({ ...previous, ...Object.fromEntries(moved) }));
              const selection = changes.find(change => change.type === 'select' && change.selected);
              if (selection?.type === 'select') setSelectedId(selection.id);
            }} />
          <Inspector dialogue={dialogue} node={selected} onEdit={editSelected}
            onConnect={(replyId, targetId) => {
              if (selected) setDialogue(previous => connectReply(previous, selected.id, replyId, targetId));
            }}
            onSetStart={() => {
              if (selected) setDialogue(previous => ({ ...previous, startId: selected.id }));
            }}
            onDelete={deleteSelected} />
        </div>
        <footer className="project-status" role="status">
          {warnings.length ? <><CircleAlert size={15} /> {warnings.join(' · ')}</>
            : <><CircleCheck size={15} /> Diálogo listo para probar</>}
        </footer>
      </main>
    </div>
  );
}
