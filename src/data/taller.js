// Contenido inicial del carrusel de nombres descartados (/taller).
// Una línea por slide: "nombre | motivo". Las que empiezan con # no salen.
// Los motivos son los de las notas internas: borrador para reescribir.
export const NAMES_DRAFT = `Ensayo | Demasiado neutro
Divertimento | Demasiado neutro
Idiota | Demasiado extremo
bardo | Ya lo usa un canal de streaming grande
mambo | Ya existe como negocio
rayado | No terminó de convencer
bobo | La asociación con Messi
pila | Demasiado amigable
bicho | Demasiado inocente
manso | Sonaba arrogante
pirca | Gastadísimo en San Juan
taro | Raíz, tarot y una farmacéutica
rautaro | Imposible de pronunciar
marcon | Es un apellido, no un alias
tau | Ya hay una marca argentina
whitetrash | Ya es mi nombre en Twitch
lauter | [motivo]
# Antena | Demasiado neutro
# pica | Demasiado inocente
# deriva | Demasiado inocente
# talau | Imposible de pronunciar
# l21n | La cuenta no daba
# l14z | Dejaba afuera a Marcon`;

export const COVER_DRAFT = '[portada]';

// Instagram acepta hasta 20 imágenes por carrusel.
export const MAX_SLIDES = 20;

export function parseNames(text) {
  return text
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith('#'))
    .map((line) => {
      const [name, ...rest] = line.split('|');
      return { name: name.trim(), reason: rest.join('|').trim() };
    });
}
