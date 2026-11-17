import { Flag, Plus, SlidersHorizontal, Trash2, X } from 'lucide-react';
import type { Dialogue, DialogueNode, Reply } from './dialogue';

interface InspectorProps {
  dialogue: Dialogue;
  node: DialogueNode | undefined;
  onEdit: (update: (node: DialogueNode) => DialogueNode) => void;
  onConnect: (replyId: string, targetId: string | null) => void;
  onSetStart: () => void;
  onDelete: () => void;
}

export function Inspector({ dialogue, node, onEdit, onConnect, onSetStart, onDelete }: InspectorProps) {
  function editReplies(update: (replies: Reply[]) => Reply[]) {
    onEdit(current => ({ ...current, replies: update(current.replies) }));
  }

  return (
    <aside className="inspector" aria-labelledby="inspector-title">
      <header className="section-bar">
        <span id="inspector-title"><SlidersHorizontal size={16} /> Inspector</span>
        {node?.id === dialogue.startId && <span className="badge start">Nodo inicial</span>}
      </header>
      {node ? (
        <div className="inspector-content" key={node.id}>
          <div className="fields">
            <label>Personaje<input value={node.speaker} onChange={event => {
              const speaker = event.target.value;
              onEdit(current => ({ ...current, speaker }));
            }} /></label>
            <label>Diálogo<textarea rows={4} value={node.text} onChange={event => {
              const text = event.target.value;
              onEdit(current => ({ ...current, text }));
            }} /></label>
          </div>
          <section className="reply-section">
            <div className="reply-heading">
              <h2>Respuestas <span>{node.replies.length}</span></h2>
              <button className="subtle" onClick={() => {
                const reply = { id: crypto.randomUUID(), text: '', targetId: null };
                editReplies(replies => [...replies, reply]);
              }}><Plus size={15} /> Añadir</button>
            </div>
            {node.replies.length === 0 && <p className="muted">Este nodo termina el diálogo.</p>}
            {node.replies.map((reply, index) => (
              <div className="reply-field" key={reply.id}>
                <div className="reply-heading">
                  <label htmlFor={'text-' + reply.id}>Respuesta {index + 1}</label>
                  <button className="icon-button" title={'Eliminar respuesta ' + (index + 1)}
                    aria-label={'Eliminar respuesta ' + (index + 1)}
                    onClick={() => editReplies(replies => replies.filter(item => item.id !== reply.id))}>
                    <X size={15} />
                  </button>
                </div>
                <input id={'text-' + reply.id} placeholder="Texto de la respuesta" value={reply.text}
                  onChange={event => {
                    const text = event.target.value;
                    editReplies(replies => replies.map(item => item.id === reply.id ? { ...item, text } : item));
                  }} />
                <label className="target-label">Destino
                  <select aria-label={'Destino de respuesta ' + (index + 1)} value={reply.targetId ?? ''}
                    onChange={event => onConnect(reply.id, event.target.value || null)}>
                    <option value="">Sin conectar</option>
                    {dialogue.nodes.map((target, order) => (
                      <option key={target.id} value={target.id}>
                        {order + 1}. {target.speaker || 'Sin personaje'} · {target.text.slice(0, 36) || 'Sin diálogo'}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
            ))}
          </section>
          <footer className="inspector-actions">
            <button disabled={node.id === dialogue.startId} onClick={onSetStart}><Flag size={15} /> Marcar como inicio</button>
            <button className="danger icon-button" title="Eliminar nodo" aria-label="Eliminar nodo" onClick={onDelete}><Trash2 size={16} /></button>
          </footer>
        </div>
      ) : <p className="empty">Selecciona un nodo del lienzo para editar su contenido.</p>}
    </aside>
  );
}
