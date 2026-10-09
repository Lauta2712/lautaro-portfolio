// Firma L20N: cada pieza dibuja las cuatro letras con sus propios datos.
// Los mismos datos siempre dan la misma firma. Siempre hay una letra en
// línea fina (la de dato más bajo); si la obra es ajena, van todas finas.

function hash(str) {
  let h1 = 0xdeadbeef;
  let h2 = 0x41c6ce57;
  for (let i = 0; i < str.length; i++) {
    const c = str.charCodeAt(i);
    h1 = Math.imul(h1 ^ c, 2654435761);
    h2 = Math.imul(h2 ^ c, 1597334677);
  }
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  return h1 >>> 0;
}

function prng(seed) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function dataFromSeed(seed) {
  const rand = prng(hash(String(seed)));
  return Array.from({ length: 8 }, () => rand());
}

// Las firmas chicas usan una línea fina más gruesa para que no desaparezca.
export function signatureLetters(data, { shared = false, thinWeight = 140 } = {}) {
  const first = data.slice(0, 4);
  const thinIndex = first.indexOf(Math.min(...first));
  return [...'L20N'].map((letter, i) => {
    const thin = shared || i === thinIndex;
    const wght = thin ? thinWeight : 500 + data[i] * 500;
    const wdth = 40 + data[(i + 4) % 8] * 111;
    return {
      letter,
      thin,
      style: { fontVariationSettings: `"wght" ${Math.round(wght)}, "wdth" ${Math.round(wdth)}, "opsz" 144` },
    };
  });
}
