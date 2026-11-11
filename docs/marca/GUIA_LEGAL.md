# Guía legal para proyectos creativos

Guía de consulta rápida para proyectos creativos y de software en Argentina. Son notas de orientación, no asesoramiento legal: ante una decisión importante, consultá con un profesional.

Última revisión: 2026-10-07. Versión editable en el doc: https://claude.ai/code/artifact/fb47ff30-ac1f-44ac-bd70-fad2a60df29f

---

## Mapa rápido

Tres figuras distintas que se suelen confundir. Casi todo lo que hago lo cubren las dos primeras.

| Figura | Qué protege | Cómo nace | Dónde se tramita | Ley |
| --- | --- | --- | --- | --- |
| **Marca** | El nombre, el logo, el signo que identifica (por ejemplo, el nombre de la marca personal) | Solo con el registro | INPI | Ley 22.362 |
| **Derecho de autor** | La obra: código, textos, videos, música, diseños, piezas de mapping | Automáticamente al crearla. El registro es voluntario y sirve como prueba. | DNDA | Ley 11.723 (el software se incluye por la Ley 25.036) |
| **Patente** | Una invención técnica nueva, con actividad inventiva y aplicación industrial | Solo con el registro | INPI | Ley 24.481 (el software en sí no es patentable) |

**La regla corta:** el nombre se registra (INPI), la obra ya es mía pero conviene poder probarlo (DNDA o, como mínimo, fechas verificables), y las patentes casi nunca aplican.

---

## Checklist antes de lanzar

Para copiar en cada proyecto nuevo.

**Nombre**

- [ ] Buscar el nombre en el INPI, en las clases que voy a usar.
- [ ] Buscar en WIPO Global Brand Database y TMview si pienso operar afuera.
- [ ] Chequear handles (Instagram, YouTube, TikTok, X) y dominios (.com, .com.ar o .ar).
- [ ] Googlear el nombre más el rubro para ver homónimos.
- [ ] Si va en serio, presentar la solicitud de marca antes de invertir en identidad visual.

**Código**

- [ ] Elegir una licencia y agregar el archivo `LICENSE` al repo (o decidir que es privado).
- [ ] Revisar las licencias de las dependencias si el proyecto se vende o se distribuye.
- [ ] No subir secretos ni datos de clientes al repo.

**Clientes y colaboraciones**

- [ ] Contrato o, como mínimo, un email aceptado que diga quién es dueño de qué.
- [ ] Dejar escrito si puedo mostrar el trabajo en mi portfolio.

**Contenido**

- [ ] Tengo derechos (o licencia) sobre la música, las imágenes y las tipografías que uso.
- [ ] Tengo consentimiento de las personas que aparecen.
- [ ] Si el proyecto junta datos personales: política de privacidad y cumplimiento de la Ley 25.326.

---

## Marcas y nombres

Solo el registro en el INPI da el derecho exclusivo sobre un nombre en Argentina. La concesión dura 10 años y es renovable, y el trámite es online.

**Las clases que me importan** (Clasificación de Niza):

| Clase | Cubre |
| --- | --- |
| 41 | Entretenimiento, actividades culturales, eventos, educación, publicación de contenido |
| 42 | Diseño y desarrollo de software, servicios de diseño |
| 35 | Publicidad, marketing |
| 9 | Software descargable, apps |
| 25 | Ropa (por si algún día hay merch) |

**Cómo funciona en la práctica:**

1. Búsqueda previa en el INPI. Existen búsquedas aranceladas que analizan antecedentes fonéticos, no solo el nombre exacto.
2. Solicitud por clase. Cada clase se paga aparte.
3. Examen y plazo de oposiciones: terceros pueden oponerse.
4. Concesión por 10 años, renovable.

**A tener en cuenta:**

- **La marca es territorial y se registra por clase.** Un homónimo en otro país o en otro rubro no necesariamente bloquea.
- **Una grafía distinta no esquiva un conflicto.** El INPI compara por similitud fonética y visual, así que "bardoo" o "bardo!" se consideran prácticamente iguales a "bardo". Los signos de puntuación tampoco se pueden usar en los handles.
- **Los handles y dominios no son marcas.** Tener el @ no da derechos sobre el nombre, y tener la marca no garantiza el @.
- **Costos:** desde mayo de 2026, el INPI cobra en UMAPI, una unidad que se actualiza mensualmente. Consultar el valor vigente antes de presupuestar.

---

## Código y software

El código es una obra protegida por derecho de autor desde que lo escribo. No se patenta: la Ley de Patentes excluye a los programas de computación en sí mismos.

**Registro en la DNDA (opcional, pero recomendable):** no es obligatorio, pero da fecha cierta y facilita la prueba en una disputa. Se hace por la plataforma TAD, y para software ya publicado la obra tiene que estar publicada antes de iniciar el trámite. También existe la vía de obra inédita.

**Prueba de autoría sin registro:** el historial de commits con fechas, los repos con fecha de creación y los emails sirven como indicios, aunque son más débiles que un registro.

**Licencias para repos públicos:**

| Licencia | Qué permite | Cuándo usarla |
| --- | --- | --- |
| Sin licencia | Nada: todos los derechos reservados, aunque el repo sea público. | Para mostrar sin dejar reutilizar. |
| MIT | Usar, modificar y vender, citando el autor. | Herramientas y librerías que quiero que circulen. |
| GPL v3 | Usar y modificar, pero lo derivado también tiene que ser abierto. | Cuando quiero que nadie lo cierre. |
| AGPL v3 | Como GPL, pero también alcanza a servicios web. | Apps web que no quiero que otros exploten cerradas. |
| CC BY-NC | Reutilizar sin fines comerciales, citando. | Assets, shaders o sketches de arte generativo (no es ideal para código). |

**Dependencias:** si un proyecto usa librerías GPL o AGPL y se distribuye, puede obligar a abrir el código propio. Revisarlo antes de vender un producto.

---

## Clientes y colaboraciones

La pregunta clave en todo trabajo para terceros es de quién es lo que hago. Si no queda por escrito, se discute después.

| Modelo | Qué significa | Bueno para |
| --- | --- | --- |
| **Cesión de derechos** | El cliente pasa a ser titular de los derechos patrimoniales de la obra. | Un sitio o sistema hecho a medida que el cliente necesita controlar. |
| **Licencia de uso** | Yo sigo siendo titular y el cliente puede usarla en las condiciones pactadas. | Piezas de mapping, arte y herramientas que reutilizo entre clientes. |
| **Mixto** | El cliente es dueño de lo específico y yo conservo mis librerías y componentes base. | Casi todo el desarrollo. Es lo más sano. |

**Qué dejar siempre por escrito:**

- Qué se entrega y qué no (por ejemplo, el código fuente, los archivos editables, los proyectos de mapping).
- Quién es titular de qué y desde cuándo (por ejemplo, desde el pago final).
- Si puedo mostrar el trabajo en mi portfolio y en redes.
- Créditos: cómo aparece mi nombre o mi marca.
- Quién consigue y paga las licencias de terceros (música, tipografías, assets, APIs).

**Colaboraciones entre artistas:** acordar antes de empezar cómo se firma la obra, quién puede exhibirla o venderla y cómo se reparte lo que genere. Una obra hecha entre varios es, por defecto, de todos sus coautores.

---

## Contenido, música, imagen e IA

**Música de terceros:** usar una canción en un video o en un mapping implica derechos de varios titulares: autores y compositores (SADAIC), intérpretes (AADI) y productores del fonograma (CAPIF). En eventos públicos, la comunicación de la música se paga a estas entidades. En YouTube e Instagram, Content ID puede silenciar, desmonetizar o bajar el video. Alternativas: música propia, bibliotecas con licencia o acuerdos directos con el artista (ideal en colaboraciones).

**Derecho a la imagen:** para captar o difundir la imagen o la voz de una persona hace falta su consentimiento (Código Civil y Comercial, art. 53). Hay excepciones, como actos públicos o interés científico, cultural o informativo, pero para contenido propio conviene pedirlo siempre, por escrito o grabado.

**Tipografías, imágenes y assets:** cada uno tiene su licencia. Una tipografía "gratis para uso personal" no sirve para un proyecto comercial. Google Fonts usa licencias abiertas (OFL), que sí permiten el uso comercial.

**Mapping en espacios públicos o edificios:** hace falta permiso del dueño del edificio y, en la vía pública, del municipio. Hay que revisar los seguros del evento.

**Datos personales:** si un proyecto junta datos (formularios, newsletters, apps como Brief o un CRM), aplica la Ley 25.326. Necesita una política de privacidad, el consentimiento informado, medidas de seguridad y, según el caso, la inscripción de la base de datos ante la AAIP.

**Contenido generado con IA:** el marco legal todavía no está resuelto. El criterio predominante es que el derecho de autor protege la creación humana, así que lo generado sin intervención creativa propia puede quedar sin protección. También hay que revisar los términos de cada herramienta sobre la propiedad de los resultados y el uso comercial. Conviene documentar el proceso humano, que además es parte del concepto de la marca.

---

## A quién consultar y fuentes

- **Marcas y patentes:** un agente de la propiedad industrial (matriculado ante el INPI) o un abogado especializado.
- **Contratos y derechos de autor:** un abogado de propiedad intelectual. Algunas cámaras del sector, como CESSI para software, ofrecen orientación.

**Fuentes**

- [Registrar un software ya publicado (DNDA, argentina.gob.ar)](https://www.argentina.gob.ar/node/37071)
- [Cómo saber si una marca ya está registrada en el INPI (iProfesional)](https://www.iprofesional.com/legales/450840-como-saber-si-una-marca-ya-esta-registrada-en-el-inpi-guia-practica-para-emprendedores)
- [Registrar una marca en el INPI: costos y pasos 2026 (Develop Argentina)](https://developargentina.com/blog/registrar-marca-inpi-argentina-costos-pasos-2026)
- [WIPO Global Brand Database](https://branddb.wipo.int)
- [TMview](https://www.tmdn.org/tmview)
- Leyes: 22.362 (marcas), 11.723 y 25.036 (propiedad intelectual y software), 24.481 (patentes), 25.326 (datos personales), Código Civil y Comercial art. 53 (imagen). Texto completo en [InfoLEG](https://www.infoleg.gob.ar).
