export const EMAIL = 'l20n.archive@gmail.com';

// Copia el mail. Si el navegador no deja, devuelve false y queda el mailto.
export async function copyEmail() {
  try {
    await navigator.clipboard.writeText(EMAIL);
    return true;
  } catch {
    return false;
  }
}
