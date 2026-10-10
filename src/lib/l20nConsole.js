// Firma L20N en consola. Se llama una vez desde main para que aparezca en
// cualquier ruta (no solo donde se monta <L20NSignature>); la marca global
// evita repetirla si otro módulo también la anuncia.
const SIGNATURE_URL = 'https://l20n.vercel.app';

export function announceL20N() {
  const w = window;
  if (w.__l20n) return;
  w.__l20n = true;
  console.log(
    '%cL20N%c\n¿Mirando el código? Bien ahí.\n%s',
    'font: 900 32px "Roboto Flex", system-ui, sans-serif',
    'font: 13px ui-monospace, monospace',
    SIGNATURE_URL,
  );
}
