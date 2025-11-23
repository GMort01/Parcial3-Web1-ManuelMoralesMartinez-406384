// ...existing code...
import { onMounted, onUnmounted } from 'vue';

type Handler = (e?: KeyboardEvent) => void;
type Map = Record<string, Handler>;

function normalizeCombo(e: KeyboardEvent) {
  const parts: string[] = [];
  if (e.ctrlKey) parts.push('ctrl');
  if (e.metaKey) parts.push('meta');
  if (e.altKey) parts.push('alt');
  if (e.shiftKey) parts.push('shift');
  parts.push(String(e.key).toLowerCase());
  return parts.join('+');
}

export default function useHotkeys(map: Map, options?: { ignoreInputs?: boolean }) {
  const ignoreInputs = options?.ignoreInputs ?? true;

  const handler = (e: KeyboardEvent) => {
    // debug: ver qué recibe el evento
    // (quitar console.log cuando confirmes que funciona)
    console.log('[hotkeys] keydown:', { key: e.key, alt: e.altKey, ctrl: e.ctrlKey, meta: e.metaKey, shift: e.shiftKey });

    if (ignoreInputs) {
      const el = document.activeElement as HTMLElement | null;
      if (el) {
        const tag = el.tagName;
        if (tag === 'INPUT' || tag === 'TEXTAREA' || el.isContentEditable) return;
      }
    }

    const combo = normalizeCombo(e);
    console.log('[hotkeys] combo normalized:', combo);

    if (map[combo]) {
      e.preventDefault();
      console.log('[hotkeys] matched:', combo);
      map[combo](e);
      return;
    }

    const single = e.key.toLowerCase();
    if (map[single]) {
      e.preventDefault();
      console.log('[hotkeys] matched single:', single);
      map[single](e);
    }
  };

  onMounted(() => window.addEventListener('keydown', handler));
  onUnmounted(() => window.removeEventListener('keydown', handler));
}