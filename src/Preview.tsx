import { useRef, useState } from 'react';
import { ArrowRight, Flag, MessageSquare, Play, RotateCcw, X } from 'lucide-react';
import type { Dialogue } from './dialogue';

export function Preview({ dialogue }: { dialogue: Dialogue }) {
  const modal = useRef<HTMLDialogElement>(null);
  const line = useRef<HTMLParagraphElement>(null);
  const [step, setStep] = useState({ id: dialogue.startId, number: 1 });
  const current = dialogue.nodes.find(node => node.id === step.id);

  function restart() {
    setStep({ id: dialogue.startId, number: 1 });
  }

  return (
    <>
      <button onClick={() => {
        restart();
        modal.current?.showModal();
      }} disabled={!dialogue.startId} title={!dialogue.startId ? 'Marca un nodo como inicio' : undefined}>
        <Play size={16} /> Probar diálogo
      </button>
      <dialog ref={modal} className="preview" aria-labelledby="preview-title">
        <header className="section-bar">
          <span id="preview-title"><Play size={16} /> Simulador</span>
          <form method="dialog"><button className="icon-button" aria-label="Cerrar simulador" autoFocus><X size={16} /></button></form>
        </header>
        {current && (
          <div className="preview-content">
            <div className="preview-meta">
              <strong><MessageSquare size={16} /> {current.speaker || 'Sin personaje'}</strong>
              <span>Paso {step.number}</span>
            </div>
            <p className="preview-line" ref={line} tabIndex={-1} aria-live="polite">{current.text || 'Sin diálogo'}</p>
            <div className="preview-choices">
              {current.replies.map(reply => (
                <button key={reply.id} disabled={!reply.targetId} onClick={() => {
                  setStep(previous => ({ id: reply.targetId, number: previous.number + 1 }));
                  line.current?.focus();
                }}>
                  {reply.text || 'Sin texto'}{reply.targetId ? <ArrowRight size={17} /> : <small>Sin conectar</small>}
                </button>
              ))}
              {current.replies.length === 0 && <p className="ending"><Flag size={15} /> Fin del diálogo</p>}
            </div>
          </div>
        )}
        <footer className="preview-footer">
          <button onClick={() => { restart(); line.current?.focus(); }}><RotateCcw size={15} /> Reiniciar</button>
        </footer>
      </dialog>
    </>
  );
}
