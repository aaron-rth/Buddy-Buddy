/** Hash-Routing: funktioniert auf GitHub Pages ohne 404 beim Neuladen, Zurück-Taste geht. */
export type Screen = 'start' | 'theme' | 'players' | 'rules' | 'deal' | 'ready';

const HASH: Record<Screen, string> = {
  start: '',
  theme: '#/welt',
  players: '#/spieler',
  rules: '#/regeln',
  deal: '#/verteilen',
  ready: '#/los',
};

function parse(hash: string): Screen {
  const hit = (Object.keys(HASH) as Screen[]).find((k) => HASH[k] && HASH[k] === hash);
  return hit ?? 'start';
}

export const route = $state({ screen: parse(location.hash) });

window.addEventListener('hashchange', () => {
  route.screen = parse(location.hash);
});

export function go(screen: Screen, replace = false): void {
  const url = location.pathname + location.search + HASH[screen];
  if (replace) history.replaceState(null, '', url);
  else history.pushState(null, '', url);
  route.screen = screen;
  window.scrollTo({ top: 0 });
}
