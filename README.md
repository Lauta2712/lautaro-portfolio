# L20N · archivo

Portfolio en [l20n.vercel.app](https://l20n.vercel.app). React + Vite.

```sh
pnpm install
pnpm dev       # desarrollo
pnpm build     # build a dist/
```

## Documentos

### Marca
- [`MARCA_PERSONAL.md`](docs/marca/MARCA_PERSONAL.md): concepto, nombre, identidad visual. Copia del doc vivo.
- [`GUIA_LEGAL.md`](docs/marca/GUIA_LEGAL.md): marcas, código, clientes y contenido en Argentina.
- [`PENDIENTES.md`](docs/marca/PENDIENTES.md): lo que falta investigar.

### Negocio
- [`HOJA_DE_RUTA.md`](docs/negocio/HOJA_DE_RUTA.md): qué vendo, cómo consigo clientes, laboratorio y semana tipo.
- [`CLIENTES.md`](docs/negocio/CLIENTES.md): plan para conseguir clientes, nichos, canales, rutina y checklist.
- [`L20N_Prospectos.xlsx`](docs/negocio/L20N_Prospectos.xlsx): prospectos.
- [`CONTACTOS_PULSO.txt`](docs/negocio/CONTACTOS_PULSO.txt): clientes posibles en San Juan para Pulso, con mensajes.
- [`CONTACTOS_L20N.txt`](docs/negocio/CONTACTOS_L20N.txt): clientes freelance, trabajo, agencias y red por área (Brühl, Köln, Bonn y remoto), con mensajes.

### Redes
- [`CUENTAS_INSTAGRAM.md`](docs/redes/CUENTAS_INSTAGRAM.md): a quién seguir desde @l20n.archive.
- [`CONTACTOS_LINKEDIN.md`](docs/redes/CONTACTOS_LINKEDIN.md): gente para escribirle.
- [`POSTS_LINKEDIN.md`](docs/redes/POSTS_LINKEDIN.md): borradores de posts.
- [`BUSQUEDAS_LINKEDIN.txt`](docs/redes/BUSQUEDAS_LINKEDIN.txt): búsquedas guardadas.

### Referencias
- [`REFERENCIAS.md`](docs/referencias/REFERENCIAS.md): documentación, lecturas, estudios, personas.
- [`HERO_INSPO.md`](docs/referencias/HERO_INSPO.md): referencias para el hero.

## Instagram
- [`instagram/portadas/`](instagram/portadas/): portadas de posts.
- [`instagram/carruseles/`](instagram/carruseles/): carruseles (`data.js`) e historias destacadas (`historias.js`). Render: `uv run --with playwright python render.py [nombre]`.
- [`instagram/reels/`](instagram/reels/): reels tipográficos (`reels.js`) a MP4. Render: `uv run --with playwright --with imageio-ffmpeg python render.py [nombre]`.
