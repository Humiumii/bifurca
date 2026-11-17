import { createRoot } from 'react-dom/client';
import { sample } from './dialogue';

createRoot(document.getElementById('root')!).render(
  <main><h1>{sample.title}</h1><p>{sample.nodes[0].text}</p></main>,
);
