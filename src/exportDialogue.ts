import type { Dialogue } from './dialogue';

export function downloadDialogue(dialogue: Dialogue) {
  const json = JSON.stringify(dialogue, null, 2) + '\n';
  const url = URL.createObjectURL(new Blob([json], { type: 'application/json;charset=utf-8' }));
  const link = document.createElement('a');
  const slug = dialogue.title.normalize('NFD').replace(/\p{Diacritic}/gu, '')
    .toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  link.download = (slug || 'dialogo') + '.json';
  link.href = url;
  document.body.append(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 30_000);
}
