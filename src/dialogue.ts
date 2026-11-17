export interface Reply {
  id: string;
  text: string;
  targetId: string | null;
}

export interface DialogueNode {
  id: string;
  speaker: string;
  text: string;
  replies: Reply[];
}

export interface Dialogue {
  version: 1;
  title: string;
  startId: string | null;
  nodes: DialogueNode[];
}

export function updateNode(dialogue: Dialogue, id: string, update: (node: DialogueNode) => DialogueNode): Dialogue {
  return { ...dialogue, nodes: dialogue.nodes.map(node => node.id === id ? update(node) : node) };
}

export function connectReply(dialogue: Dialogue, sourceId: string, replyId: string, targetId: string | null): Dialogue {
  if (targetId !== null && !dialogue.nodes.some(node => node.id === targetId)) return dialogue;
  return updateNode(dialogue, sourceId, node => ({
    ...node,
    replies: node.replies.map(reply => reply.id === replyId ? { ...reply, targetId } : reply),
  }));
}

export function removeNode(dialogue: Dialogue, id: string): Dialogue {
  return {
    ...dialogue,
    startId: dialogue.startId === id ? null : dialogue.startId,
    nodes: dialogue.nodes.filter(node => node.id !== id).map(node => ({
      ...node,
      replies: node.replies.map(reply => reply.targetId === id ? { ...reply, targetId: null } : reply),
    })),
  };
}

export const sample: Dialogue = {
  version: 1,
  title: 'La tienda de Bruma',
  startId: 'entrada',
  nodes: [
    {
      id: 'entrada', speaker: 'Mara',
      text: 'Llegaste justo antes de que cierre. ¿Buscas algo para el viaje?',
      replies: [
        { id: 'comprar', text: 'Necesito una poción.', targetId: 'mostrador' },
        { id: 'preguntar', text: '¿Qué sabes del bosque?', targetId: 'rumor' },
      ],
    },
    {
      id: 'mostrador', speaker: 'Mara',
      text: 'Me queda una de brezo. Diez monedas y es tuya.',
      replies: [{ id: 'pagar', text: 'Trato hecho.', targetId: 'pocion' }],
    },
    {
      id: 'rumor', speaker: 'Mara',
      text: 'Sigue las luciérnagas. Si dejan de brillar, da media vuelta.',
      replies: [{ id: 'agradecer', text: 'Lo tendré en cuenta.', targetId: 'mapa' }],
    },
    {
      id: 'pocion', speaker: 'Mara',
      text: 'Guárdala cerca. En la niebla, un sorbo vale más que una espada.',
      replies: [],
    },
    {
      id: 'mapa', speaker: 'Mara',
      text: 'Toma este mapa. El sendero viejo sigue abierto al amanecer.',
      replies: [],
    },
  ],
};
